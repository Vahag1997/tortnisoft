import fs from 'fs/promises';
import path from 'path';

// The directory where we saved our scraped JSON files
const DATA_DIR = path.join(process.cwd(), 'data', 'tcgp-cards');

/**
 * Loads all accessible JSON files from the data directory.
 * @returns {Promise<{
 *   languages: string[],
 *   cardsByLang: Record<string, any[]>,
 *   setsByLang: Record<string, {id: string, name: string}[]>,
 *   stats: {totalLanguages: number, totalCardsPerLang: Record<string, number>}
 * }>}
 */
export async function getTcgPocketData() {
  const result = {
    languages: [],
    cardsByLang: {},
    setsByLang: {},
    stats: {
      totalLanguages: 0,
      totalCardsPerLang: {}
    }
  };

  try {
    // Read the directory contents
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    for (const file of jsonFiles) {
      // Extract language from filename (e.g. 'en.json' -> 'en')
      const lang = path.basename(file, '.json');
      const filePath = path.join(DATA_DIR, file);

      // Read and parse the file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const cards = JSON.parse(fileContent);

      // Only import non-empty card arrays
      if (cards && cards.length > 0) {
        result.languages.push(lang);
        result.cardsByLang[lang] = cards;
        result.stats.totalCardsPerLang[lang] = cards.length;

        // Extract unique sets for this language
        const uniqueSets = new Map();
        cards.forEach(card => {
          if (card.setId && !uniqueSets.has(card.setId)) {
            uniqueSets.set(card.setId, {
              id: card.setId,
              name: card.setName || card.setId
            });
          }
        });
        
        result.setsByLang[lang] = Array.from(uniqueSets.values());
      }
    }

    result.stats.totalLanguages = result.languages.length;

    // Sort languages so 'en' is first if it exists
    result.languages.sort((a, b) => {
      if (a === 'en') return -1;
      if (b === 'en') return 1;
      return a.localeCompare(b);
    });

    return result;
  } catch (error) {
    console.error("Error loading TCG Pocket Data from JSON:", error);
    return result; // Return empty structured data to prevent crashes
  }
}
