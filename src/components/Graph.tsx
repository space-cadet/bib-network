import React, { useCallback, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { GraphData, GraphNode } from '../types';

interface GraphProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
}

export const Graph: React.FC<GraphProps> = ({ data, onNodeClick }) => {
  const graphRef = useRef<any>(null);

  const handleNodeClick = useCallback((node: any) => {
    onNodeClick(node);
  }, [onNodeClick]);

  useEffect(() => {
    if (graphRef.current) {
      // Reheat the simulation when new data arrives
      graphRef.current.d3ReheatSimulation();
    }
  }, [data]);

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={data}
      nodeLabel="title"
      nodeColor={(node: any) => node.group === 'unknown' ? '#94a3b8' : '#3b82f6'}
      nodeRelSize={6}
      linkWidth={1}
      linkColor="#e2e8f0"
      onNodeClick={handleNodeClick}
      d3VelocityDecay={0.3}
      d3AlphaDecay={0.02} // Slower decay for smoother transitions
      cooldownTime={3000} // Longer cooldown time for larger graphs
      onEngineStop={() => {
        if (graphRef.current) {
          graphRef.current.zoomToFit(400);
        }
      }}
    />
  );
};