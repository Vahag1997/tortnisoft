import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = path.join(process.cwd(), 'data', 'global-tcg');

// Keep the index in memory for blazing fast responses
const searchCache = {};
const CACHE_TTL = 30000; // 30 seconds TTL so it pulls new parsed cards
let lastCacheTime = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const lang = searchParams.get('lang') || 'en';

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const now = Date.now();
    
    // Invalidate cache if too old or if language is missing
    if (now - lastCacheTime > CACHE_TTL || !searchCache[lang]) {
      const indexPath = path.join(DATA_DIR, `search-index-${lang}.json`);
      try {
        const raw = await fs.readFile(indexPath, 'utf-8');
        searchCache[lang] = JSON.parse(raw);
        lastCacheTime = now;
      } catch (e) {
        // If file doesn't exist yet, return empty
        return NextResponse.json({ results: [], info: "Index building" });
      }
    }

    const query = q.toLowerCase();
    const index = searchCache[lang] || [];
    
    const results = [];
    
    // Fast loop to search
    for (let i = 0; i < index.length; i++) {
      const card = index[i];
      if (card.name.toLowerCase().includes(query) || (card.id && card.id.toLowerCase().includes(query))) {
        results.push(card);
        
        // Limit to 50 results maximum for UI performance
        if (results.length >= 50) {
          break;
        }
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
