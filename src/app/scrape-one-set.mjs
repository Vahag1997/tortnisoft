import { chromium } from "playwright";

/** CHANGE ONLY THIS if you want a different set */
const SET_URL =
  "https://www.tcgcollector.com/sets/11663/mega-premium-trainer-box?releaseDateOrder=newToOld&displayAs=images";

const BASE = "https://www.tcgcollector.com";

/** small helper */
const norm = (s) => (s || "").replace(/\s+/g, " ").trim();

/** Extracts useful fields from a single card page */
async function extractCard(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("h1", { timeout: 20000 }).catch(() => {});

  const idMatch = url.match(/\/cards\/(\d+)\//);
  const id = idMatch ? idMatch[1] : null;

  const name =
    (await page.$eval("h1", (el) => el.textContent.trim()).catch(() => null)) ||
    null;

  // grab the largest <img> (main card artwork on the left is usually the biggest)
  let image = null;
  try {
    const imgs = await page.$$eval("img", (els) =>
      els.map((el) => ({
        src: el.src || el.getAttribute("src"),
        w: el.naturalWidth || 0,
        h: el.naturalHeight || 0,
      }))
    );
    const best = imgs
      .filter((i) => i.src)
      .sort((a, b) => b.w * b.h - a.w * a.h)[0];
    image = best?.src || null;
  } catch (_) {}

  // read dt/dd fact table
  const facts =
    (await page
      .$$eval("dt", (dts) =>
        dts.map((dt) => {
          const key = dt.textContent.trim();
          const dd = dt.nextElementSibling;
          const text = dd ? dd.textContent.trim() : "";
          const link = dd ? dd.querySelector("a")?.href || null : null;
          return { key, text, link };
        })
      )
      .catch(() => [])) || [];

  const byKey = Object.fromEntries(facts.map((f) => [f.key, f]));

  // try to capture ability/attacks text blocks if present
  const ability =
    (await page
      .$eval('[class*="Ability"], .ability', (el) => el.textContent)
      .catch(() => null)) || null;

  const attacks =
    (await page
      .$$eval(".attack, [class*='Attack']", (els) =>
        els.map((el) => el.textContent)
      )
      .catch(() => [])) || [];

  return {
    id,
    url,
    name,
    image,
    number: byKey["Card number"]?.text || null,
    rarity: byKey["Rarity"]?.text || null,
    expansion: byKey["Expansion"]?.text || null,
    expansionLink: byKey["Expansion"]?.link || null,
    illustrators: byKey["Illustrators"]?.text || null,
    regulation: byKey["Regulation mark"]?.text || byKey["Regulation"]?.text || null,
    cardFormat: byKey["Card format"]?.text || null,
    weakness: byKey["Weakness"]?.text || null,
    resistance: byKey["Resistance"]?.text || null,
    retreatCost: byKey["Retreat Cost"]?.text || null,
    ability: ability ? norm(ability) : null,
    attacks: attacks.map(norm).filter(Boolean),
  };
}

/** Main: scrape the set page for card links, then visit each card */
async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (compatible; TCGCollectorScraper/0.1; +https://example.com)",
  });

  // 1) open the set page & collect all /cards/<id>/... links
  await page.goto(SET_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page
    .waitForSelector('a[href^="/cards/"]', { timeout: 25000 })
    .catch(() => {});
  const hrefs = await page.$$eval('a[href^="/cards/"]', (as) => {
    const seen = new Set();
    const out = [];
    for (const a of as) {
      const href = a.getAttribute("href");
      if (!href) continue;
      if (!/^\/cards\/\d+\//.test(href)) continue; // ensure it's a card detail link
      if (!seen.has(href)) {
        seen.add(href);
        out.push(href);
      }
    }
    return out;
  });

  console.log(`Found ${hrefs.length} card links in set:`);

  // 2) visit each card detail and extract
  const results = [];
  for (const href of hrefs) {
    const url = href.startsWith("http") ? href : BASE + href;
    const data = await extractCard(page, url);
    results.push(data);
    console.log(
      `• ${data.id || "?"} — ${data.name || "?"} — #${data.number || "?"} — ${
        data.rarity || "?"
      }`
    );
    await page.waitForTimeout(250); // polite pause
  }

  console.log("\nFull JSON:");
  console.dir(results, { depth: null });

  await browser.close();
}

main().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
