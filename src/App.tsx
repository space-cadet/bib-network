import React, { useState, useCallback, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import { Graph } from './components/Graph';
import { PaperDetails } from './components/PaperDetails';
import { parseBibTeX } from './utils/parser';
import { GraphBuilder } from './utils/analysis';
import { Network } from 'lucide-react';
import type { Paper, GraphData, GraphNode } from './types';

function App() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const graphBuilderRef = useRef(new GraphBuilder());

  const handleFileUpload = async (content: string) => {
    setLoading(true);
    setProgress(0);
    setPapers([]);
    setGraphData(null);
    graphBuilderRef.current = new GraphBuilder();

    const totalEntries = (content.match(/@/g) || []).length;
    let processedEntries = 0;

    const handleChunkParsed = (chunkPapers: Paper[]) => {
      setPapers(prev => [...prev, ...chunkPapers]);
      graphBuilderRef.current.addPapers(chunkPapers);
      setGraphData(graphBuilderRef.current.getGraphData());
      
      processedEntries += chunkPapers.length;
      setProgress(Math.min(100, Math.round((processedEntries / totalEntries) * 100)));
    };

    try {
      await parseBibTeX(content, handleChunkParsed);
    } catch (error) {
      console.error('Error processing BibTeX:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = useCallback((node: GraphNode) => {
    const paper = papers.find(p => p.id === node.id);
    if (paper) {
      setSelectedPaper(paper);
    }
  }, [papers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!graphData ? (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Network className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h1 className="text-3xl font-bold mb-2">
                BibTeX Network Visualizer
              </h1>
              <p className="text-gray-600">
                Upload your BibTeX file to visualize citation networks and discover
                semantic connections between papers
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      ) : (
        <div className="relative w-full h-screen">
          {loading && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-white rounded-lg shadow-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
              </div>
            </div>
          )}
          <Graph data={graphData} onNodeClick={handleNodeClick} />
          {selectedPaper && (
            <PaperDetails
              paper={selectedPaper}
              onClose={() => setSelectedPaper(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;