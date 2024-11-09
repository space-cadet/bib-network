export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract?: string;
  keywords?: string[];
  venue?: string;
  citations: string[];
}

export interface GraphNode {
  id: string;
  title: string;
  group: string;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'citation' | 'semantic';
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}