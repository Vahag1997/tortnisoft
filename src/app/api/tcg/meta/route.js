import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = path.join(process.cwd(), 'data', 'global-tcg');
const SET_METADATA_PATH = path.join(DATA_DIR, 'set-metadata.json');

// Define known language names based on TCGdex
const LANG_MAP = {
  'en': 'English', 'fr': 'Français', 'es': 'Español', 'it': 'Italiano',
  'pt': 'Português', 'de': 'Deutsch', 'ja': '日本語 (Japanese)', 'zh-tw': '繁體中文 (Traditional Chinese)',
  'id': 'Bahasa Indonesia', 'th': 'ภาษาไทย (Thai)', 'ru': 'Русский (Russian)', 'zh-cn': '简体中文 (Simplified Chinese)',
  'ko': '한국어 (Korean)', 'nl': 'Nederlands', 'pl': 'Polski'
};

export async function GET() {
  try {
    const meta = {
      languages: [],
      setsByLang: {},
      exactCardCounts: {},
      setDetailsByLang: {},
    };

    // Ensure the main dir exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Load exact counts if available
    try {
      const countsData = await fs.readFile(path.join(DATA_DIR, 'counts.json'), 'utf-8');
      meta.exactCardCounts = JSON.parse(countsData);
    } catch (e) {
      // counts.json might not exist yet if script just started
      meta.exactCardCounts = {};
    }

    const customSetMetadata = await (async () => {
      try {
        const raw = await fs.readFile(SET_METADATA_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch {
        return {};
      }
    })();

    const langDirs = await fs.readdir(DATA_DIR, { withFileTypes: true });

    for (const dirent of langDirs) {
      if (dirent.isDirectory()) {
        const lang = dirent.name;
        // Don't add 'tcgp-cards' old dir just in case
        if (lang === 'tcgp-cards') continue;

        meta.languages.push({
          code: lang,
          name: LANG_MAP[lang] || lang.toUpperCase()
        });

        const langPath = path.join(DATA_DIR, lang);
        const setFiles = await fs.readdir(langPath);

        const sets = [];
        for (const file of setFiles) {
          if (file.endsWith('.json') && file !== 'counts.json') {
            const setId = path.basename(file, '.json');
            sets.push(setId);
          }
        }

        const metadataForLang = customSetMetadata?.[lang] && typeof customSetMetadata[lang] === 'object'
          ? customSetMetadata[lang]
          : {};
        const mergedSetIds = [...new Set([...sets, ...Object.keys(metadataForLang)])].sort();

        meta.setsByLang[lang] = mergedSetIds;
        meta.setDetailsByLang[lang] = Object.fromEntries(
          mergedSetIds.map(setId => {
            const details = metadataForLang[setId] && typeof metadataForLang[setId] === 'object'
              ? metadataForLang[setId]
              : {};
            return [setId, {
              id: setId,
              name: details.name || setId,
              releaseDate: details.releaseDate || null,
              status: details.status || 'released',
              source: details.source || null,
            }];
          })
        );
      }
    }

    return NextResponse.json(meta);
  } catch (error) {
    console.error("Error reading TCG meta:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
