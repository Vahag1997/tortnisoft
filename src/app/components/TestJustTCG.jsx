"use client";

import { useState } from "react";

export default function TestJustTCG_JPOnly() {
  // 🔑 TEST ONLY — visible in the browser bundle
  const API_KEY = "tcg_9a99958a454e4760913a2123e3ad90ea";
  const BASE = "https://api.justtcg.com/v1";

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [jpCards, setJpCards] = useState([]);

  // --- helpers
  async function jfetch(url) {
    const r = await fetch(url, {
      headers: { "x-api-key": API_KEY, Accept: "application/json" },
      cache: "no-store",
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      // Pass through upstream error details if present
      throw new Error(j?.error || j?.message || `HTTP ${r.status}`);
    }
    return j;
  }

  function lowestNonSealedPrice(card) {
    // language is per-variant; for JP game all variants should be JP.
    const variants = (card.variants || []).filter((v) => {
      const c = (v.condition || "").toLowerCase();
      return c !== "sealed" && c !== "s"; // exclude sealed
    });
    if (!variants.length) return null;
    let best = null;
    for (const v of variants) {
      const p = typeof v.price === "number" ? v.price : null;
      if (p != null && (best == null || p < best)) best = p;
    }
    return best;
  }

  async function loadJapaneseSingles() {
    setLoading(true);
    setErr("");
    setJpCards([]);
    try {
      // 1) Discover JP game id from /games (don’t hardcode)  ← pokemon-japan
      const games = await jfetch(`${BASE}/games`); // returns list with id, name, counts
      const gameList = Array.isArray(games?.data ?? games) ? (games.data ?? games) : [];
      const jpGame =
        gameList.find((g) => (g.id || g.game_id) === "pokemon-japan") ||
        gameList.find((g) => String(g.name || "").toLowerCase().includes("pokemon japan"));
      if (!jpGame) throw new Error("Pokemon Japan game not found in /games.");

      const gameId = jpGame.id || jpGame.game_id;

      // 2) Pull cards for that game; ask for a bigger page to filter down to singles
      // Docs: Cards endpoint acts as search when no IDs are supplied; accepts `game` filter.
      // You can also filter returned variants with `condition`/`printing`. :contentReference[oaicite:3]{index=3}
      const params = new URLSearchParams({
        game: gameId,
        limit: "20",
        offset: "0",
        // keep server-side filtering simple; we'll drop Sealed client-side too
        // you *can* pass multiple conditions like "NM,LP,MP,HP,DMG" (docs allow comma list) :contentReference[oaicite:4]{index=4}
        condition: "NM,LP,MP,HP,DMG",
      });

      const cardsRes = await jfetch(`${BASE}/cards?${params.toString()}`);
      const arr = Array.isArray(cardsRes?.data) ? cardsRes.data : [];

      const singles = [];
      for (const c of arr) {
        const price = lowestNonSealedPrice(c);
        if (price != null) {
          singles.push({
            id: c.id,
            name: c.name,
            set: c.set,
            number: c.number,
            rarity: c.rarity,
            fromPrice: price,
          });
          if (singles.length >= 10) break;
        }
      }

      if (!singles.length) {
        throw new Error("No JP singles found in this page. Try again or increase limit/offset.");
      }

      setJpCards(singles);
      console.log("[JustTCG] JP singles:", singles.length, singles);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold">JustTCG — Japanese Singles (test)</h1>
          <button
            onClick={loadJapaneseSingles}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load JP singles"}
          </button>
        </div>

        {err && <p className="mt-3 text-red-600">Error: {err}</p>}

        {jpCards.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Japanese — Singles (10)</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {jpCards.map((c) => (
                <li key={c.id} className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
                  <div className="text-sm text-gray-500 font-mono truncate">{c.id}</div>
                  <div className="text-lg font-medium">{c.name}</div>
                  <div className="text-sm text-gray-600">
                    {c.set}
                    {c.number ? ` • #${c.number}` : ""} {c.rarity ? ` • ${c.rarity}` : ""}
                  </div>
                  <div className="mt-2 text-sm">
                    From <span className="font-mono">${c.fromPrice.toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
