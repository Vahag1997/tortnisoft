"use client";

import { useEffect, useState } from "react";
import {
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import ServiceCard from "./components/ServiceCard";
import TestJustTCG from "./components/TestJustTCG";

const CARD_ID = "swsh3-136"; // ✅ same ID fetched in DE & FR

function toWebp(url) {
  if (!url) return "";
  const lower = url.toLowerCase();
  if (lower.endsWith(".webp") || lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return url;
  }
  return `${url}.webp`; // TCGdex assets: .webp recommended
}

export default function Home() {
// ===== PokeData (TEMP client testing) =====
const PD_TOKEN = "<YOUR_JWT>";                    // <-- paste your JWT
const PD_BASE  = "https://www.pokedata.io/v0/search";
const PD_HEADERS = {
  Accept: "application/json",
  Authorization: `Bearer ${PD_TOKEN}`,
};

// UI state
const [pdJaCount, setPdJaCount] = useState(null);
const [countingPdJa, setCountingPdJa] = useState(false);

// utils
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function fetchPD(url) {
  const r = await fetch(url, { headers: PD_HEADERS, cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}
function pickItems(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.results)) return json.results;
  if (Array.isArray(json?.data))    return json.data;
  if (Array.isArray(json?.items))   return json.items;
  return [];
}
function get(obj, path) {
  return path.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), obj);
}
function isJaVal(v) {
  if (!v) return false;
  const s = String(v).toLowerCase().trim();
  return (
    s === "japanese" || s === "ja" || s === "ja-jp" || s === "jp" ||
    s.includes("日本語")
  );
}
function isEnVal(v) {
  if (!v) return false;
  const s = String(v).toLowerCase().trim();
  return s === "english" || s === "en" || s === "en-us";
}

// scan a few items to find which field looks like language
function detectLanguageField(items) {
  const candidates = [
    "language", "lang", "locale",
    "printed_language", "market_language",
    "card.language", "details.language",
    "attributes.language", "meta.language",
  ];
  for (const p of candidates) {
    const vals = items.map(it => get(it, p)).filter(Boolean);
    if (!vals.length) continue;
    const yes = vals.some(isJaVal) || vals.some(isEnVal);
    if (yes) return p;
  }
  // last-resort: brute scan to find any key with Japanese/Englishy values
  const seenPaths = new Map();
  const walk = (node, path = "") => {
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      const p = path ? `${path}.${k}` : k;
      if (typeof v === "string") {
        if (isJaVal(v) || isEnVal(v)) {
          seenPaths.set(p, (seenPaths.get(p) ?? 0) + 1);
        }
      } else if (v && typeof v === "object") {
        walk(v, p);
      }
    }
  };
  items.slice(0, 30).forEach(it => walk(it));
  let best = null, hits = 0;
  for (const [p, h] of seenPaths.entries()) if (h > hits) { best = p; hits = h; }
  return best; // may be null; we can still fallback later
}

// DEBUG: log 1 sample page so you can see shape in DevTools
async function pdDebugOnePage() {
  const url = `${PD_BASE}?asset_type=CARD&per_page=5&page=1&query=a`;
  const json = await fetchPD(url);
  const items = pickItems(json);
  console.log("[PokeData] Sample items (first 5):", items);
  const langPath = detectLanguageField(items);
  console.log("[PokeData] Detected language field:", langPath);
  return langPath;
}

// MAIN: Count Japanese cards by sharded search + client-side filter
async function countPokeDataJapaneseCards() {
  setCountingPdJa(true);
  try {
    const PER_PAGE = 250;
    const shards = [..."0123456789", ..."abcdefghijklmnopqrstuvwxyz"];
    const seen = new Set();

    // detect language field from a small sample first
    let langPath = await pdDebugOnePage();

    for (const shard of shards) {
      let page = 1;
      for (;;) {
        const url =
          `${PD_BASE}?asset_type=CARD&query=${encodeURIComponent(shard)}&` +
          `per_page=${PER_PAGE}&page=${page}`;
        let json;
        try {
          json = await fetchPD(url);
        } catch (e) {
          console.warn("[PokeData] shard", shard, "page", page, "->", e.message);
          break;
        }
        const items = pickItems(json);
        if (!items.length) break;

        // (re)detect if needed
        if (!langPath) {
          langPath = detectLanguageField(items);
          if (langPath) console.log("[PokeData] Detected language field:", langPath);
        }

        for (const it of items) {
          const v = langPath ? get(it, langPath) : null;
          // Count Japanese only
          const looksJa = v ? isJaVal(v) : /日本語|（日）|\(JAPANESE\)/i.test(JSON.stringify(it));
          if (looksJa) {
            // choose a stable id key (try multiple)
            const id = it.id ?? it.card_id ?? it.asset_id ?? it.uid ?? `${it.set_id || it.set || "?"}-${it.local_id || it.number || "?"}`;
            if (id) seen.add(id);
          }
        }

        if (items.length < PER_PAGE) break; // last page for this shard
        page += 1;
        if (page > 500) break; // safety
        await sleep(120);
      }
    }

    setPdJaCount(seen.size);
    console.log("[PokeData] JAPANESE unique cards:", seen.size, "(field:", langPath, ")");
  } catch (e) {
    console.error("[PokeData] JP count failed:", e);
    setPdJaCount(null);
  } finally {
    setCountingPdJa(false);
  }
}


  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">AI CLOUD SOLUTIONS</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          We build cutting-edge apps, tools, and experiences.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Contact Us
        </a>
      </section>

      {/* What We Do */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ServiceCard
            title="Mobile App Development"
            description="We build fast, stunning mobile apps for iOS and Android — responsive, scalable, and user-friendly."
            Icon={DevicePhoneMobileIcon}
          />
          <ServiceCard
            title="Custom Software"
            description="From internal tools to public-facing platforms, we craft solutions tailored to your business needs."
            Icon={WrenchScrewdriverIcon}
          />
        </div>
      </section>

{/* <section className="max-w-6xl mx-auto mt-8">
  <h2 className="text-xl font-semibold mb-2">PokeData — Count Japanese Cards</h2>
  <button
    onClick={countPokeDataJapaneseCards}
    disabled={countingPdJa}
    className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60"
  >
    {countingPdJa ? "Counting…" : "Count JP (PokeData, auth)"}
  </button>
  {pdJaCount !== null && (
    <p className="mt-3">
      Total Japanese cards (PokeData, deduped):{" "}
      <span className="font-mono">{pdJaCount}</span>
    </p>
  )}
</section> */}

<TestJustTCG/>



    </main>
  );
}
