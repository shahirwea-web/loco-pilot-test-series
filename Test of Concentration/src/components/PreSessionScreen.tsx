import React from 'react';
import type { Difficulty } from '../types';
import { ChevronRight } from 'lucide-react';

interface Props {
  sessionNumber: number;
  difficulty: Difficulty;
  onReady: () => void;
}

const PreSessionScreen: React.FC<Props> = ({ sessionNumber, difficulty, onReady }) => {
  const difficultyDesc: Record<Difficulty, string> = {
    easy: 'Clearly separated dots with large spacing. Ideal for warming up.',
    medium: 'Irregular spacing with slightly clustered dot arrangements.',
    hard: 'Dense clusters with similar-looking 3, 4, and 5 dot arrangements.',
  };

  const difficultyColor: Record<Difficulty, { bg: string; border: string; text: string; gradient: string }> = {
    easy: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', gradient: 'from-emerald-400 to-emerald-600' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', gradient: 'from-amber-400 to-amber-600' },
    hard: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', gradient: 'from-red-400 to-red-600' },
  };

  const colors = difficultyColor[difficulty];

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-b from-purple-200 to-transparent rounded-full blur-3xl opacity-20 -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-t from-pink-200 to-transparent rounded-full blur-3xl opacity-20 -mr-48 -mb-48" />

      <div className="max-w-md w-full text-center relative z-10">
        <div className="mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-600">
            Get Ready
          </span>
        </div>
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          Session {sessionNumber}
          <span className="text-gray-400"> / 10</span>
        </h2>

        <div
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 text-sm font-bold capitalize mb-6 shadow-md bg-gradient-to-r ${colors.gradient} text-white`}
        >
          {difficulty} Difficulty
        </div>

        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          {difficultyDesc[difficulty]}
        </p>

        <div className="bg-white rounded-xl p-4 mb-8 text-sm text-gray-600 shadow-md border border-purple-200">
          <span className="font-semibold text-purple-700">Reminder: </span>
          Identify groups containing <strong>EXACTLY 4 dots</strong> and press{' '}
          <kbd className="px-2 py-1 bg-pink-100 border border-pink-300 rounded text-xs font-mono text-pink-700">
            ↑
          </kbd>{' '}
          to mark them. Each session has 280-300 groups across 2 pages.
        </div>

        <button
          onClick={onReady}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
        >
          Start Session {sessionNumber}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PreSessionScreen;
