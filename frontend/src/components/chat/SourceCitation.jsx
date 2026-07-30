import React from 'react';
import { ExternalLink } from 'lucide-react';

export function SourceCitation({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2 text-xs border-t border-white/5 pt-2 space-y-1">
      <p className="font-semibold text-slate-400">Sources:</p>
      {sources.map((src, i) => (
        <div key={i} className="flex items-center gap-1.5 text-indigo-400 hover:underline cursor-pointer">
          <ExternalLink className="w-3 h-3" />
          <span>{src.title || src.source || `Document ${i + 1}`}</span>
        </div>
      ))}
    </div>
  );
}

export default SourceCitation;
