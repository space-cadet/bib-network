import type { Paper } from '../types';

const CHUNK_SIZE = 50; // Process 50 entries at a time

export const parseBibTeXChunk = (chunk: string): Paper[] => {
  try {
    const entries = chunk.split('@').filter(entry => entry.trim());
    
    return entries.map(entry => {
      const id = entry.match(/\{([^,]*)/)?.[1] || '';
      const title = entry.match(/title\s*=\s*{([^}]*)}/)?.[1] || '';
      const authors = entry.match(/author\s*=\s*{([^}]*)}/)?.[1]?.split(' and ') || [];
      const yearMatch = entry.match(/year\s*=\s*{?(\d{4})}?/);
      const year = yearMatch ? parseInt(yearMatch[1]) : 0;
      const venue = entry.match(/journal\s*=\s*{([^}]*)}|booktitle\s*=\s*{([^}]*)}/)?.[1] || '';
      
      return {
        id,
        title,
        authors,
        year,
        venue,
        citations: [],
        keywords: []
      };
    });
  } catch (error) {
    console.error('Error parsing BibTeX chunk:', error);
    return [];
  }
};

function* createChunkGenerator(content: string) {
  const entries = content.split('@');
  const totalChunks = Math.ceil(entries.length / CHUNK_SIZE);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const chunk = entries.slice(start, start + CHUNK_SIZE);
    if (chunk.length > 0) {
      yield '@' + chunk.join('@');
    }
  }
}

export const parseBibTeX = async (
  content: string, 
  onChunkParsed: (papers: Paper[]) => void
): Promise<Paper[]> => {
  const chunkGenerator = createChunkGenerator(content);
  let allPapers: Paper[] = [];

  for (const chunk of chunkGenerator) {
    const papers = parseBibTeXChunk(chunk);
    allPapers = [...allPapers, ...papers];
    onChunkParsed(papers);
    // Give the UI a chance to update
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return allPapers;
};