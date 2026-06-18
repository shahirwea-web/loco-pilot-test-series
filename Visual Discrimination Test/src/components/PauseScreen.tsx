import React from 'react';
import { Play, Home, AlertTriangle } from 'lucide-react';

interface PauseScreenProps {
  onResume: () => void;
  onEnd: () => void;
}

export function PauseScreen({ onResume, onEnd }: PauseScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-full mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Test Paused</h2>
        <p className="text-slate-400 mb-8">
          Press Resume to continue or End Test to finish.
        </p>
        <div className="space-y-4">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all"
          >
            <Play className="w-5 h-5" />
            Resume Test
          </button>
          <button
            onClick={onEnd}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            End Test
          </button>
        </div>
        <p className="text-slate-500 text-sm mt-6">
          Press <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono">Esc</kbd> to resume
        </p>
      </div>
    </div>
  );
}
