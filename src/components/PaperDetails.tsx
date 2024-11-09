import React from 'react';
import { X } from 'lucide-react';
import type { Paper } from '../types';

interface PaperDetailsProps {
  paper: Paper;
  onClose: () => void;
}

export const PaperDetails: React.FC<PaperDetailsProps> = ({ paper, onClose }) => {
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold">{paper.title}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Authors</h3>
          <p>{paper.authors.join(', ')}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700">Year</h3>
          <p>{paper.year}</p>
        </div>
        
        {paper.venue && (
          <div>
            <h3 className="font-semibold text-gray-700">Venue</h3>
            <p>{paper.venue}</p>
          </div>
        )}
        
        {paper.abstract && (
          <div>
            <h3 className="font-semibold text-gray-700">Abstract</h3>
            <p className="text-sm text-gray-600">{paper.abstract}</p>
          </div>
        )}
        
        {paper.keywords && (
          <div>
            <h3 className="font-semibold text-gray-700">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};