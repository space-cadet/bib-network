import type { Paper, GraphData, GraphNode, GraphLink } from '../types';

const calculateSimilarity = (text1: string, text2: string): number => {
  const words1 = new Set(text1.toLowerCase().split(/\W+/));
  const words2 = new Set(text2.toLowerCase().split(/\W+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

export class GraphBuilder {
  private nodes: Map<string, GraphNode>;
  private links: Map<string, GraphLink>;

  constructor() {
    this.nodes = new Map();
    this.links = new Map();
  }

  addPapers(papers: Paper[]) {
    // Add new nodes
    papers.forEach(paper => {
      if (!this.nodes.has(paper.id)) {
        this.nodes.set(paper.id, {
          id: paper.id,
          title: paper.title,
          group: paper.venue || 'unknown',
          val: 1
        });
      }
    });

    // Calculate similarities with existing nodes
    papers.forEach(paper1 => {
      this.nodes.forEach(node => {
        if (paper1.id !== node.id) {
          const similarity = calculateSimilarity(paper1.title, node.title);
          
          if (similarity > 0.2) {
            const linkId = [paper1.id, node.id].sort().join('-');
            if (!this.links.has(linkId)) {
              this.links.set(linkId, {
                source: paper1.id,
                target: node.id,
                type: 'semantic',
                strength: similarity
              });
            }
          }
        }
      });
    });
  }

  getGraphData(): GraphData {
    return {
      nodes: Array.from(this.nodes.values()),
      links: Array.from(this.links.values())
    };
  }
}

export const buildGraphData = (papers: Paper[]): GraphData => {
  const builder = new GraphBuilder();
  builder.addPapers(papers);
  return builder.getGraphData();
};