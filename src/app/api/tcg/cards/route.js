import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = path.join(process.cwd(), 'data', 'global-tcg');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang');
  const setId = searchParams.get('setId');

  if (!lang || !setId) {
    return NextResponse.json({ error: 'Missing lang or setId' }, { status: 400 });
  }

  try {
    // Prevent directory traversal attacks
    const safeLang = path.basename(lang);
    const safeSetId = path.basename(setId);

    const filePath = path.join(DATA_DIR, safeLang, `${safeSetId}.json`);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: `Set ${safeSetId} not found for language ${safeLang}` }, { status: 404 });
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const cards = JSON.parse(fileContent);

    return NextResponse.json({ cards });
  } catch (error) {
    console.error(`Error reading cards for ${lang}/${setId}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
