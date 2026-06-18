import React from 'react';
import { Brain, Clock, Target, Zap, CheckCircle } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
  onFullScreen: () => void;
  isFullScreen: boolean;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, onFullScreen, isFullScreen }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-5">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase mb-2">
            PATHAN Psychometric Assessment
          </p>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            Form Perception Test
          </h1>
          <p className="mt-3 text-slate-500 text-base leading-relaxed">
            Inspired by Railway Psychology &amp; Aptitude Standards
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">50 Questions</p>
              <p className="text-xs text-slate-500 mt-0.5">Randomized each session</p>
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Timed Viewing</p>
              <p className="text-xs text-slate-500 mt-0.5">2–4 sec display per question</p>
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Quick Response</p>
              <p className="text-xs text-slate-500 mt-0.5">2 seconds to answer</p>
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Instant Results</p>
              <p className="text-xs text-slate-500 mt-0.5">Detailed performance report</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">
            Instructions
          </h2>
          <ol className="space-y-3">
            {[
              'Five geometric symbols (1–5) will appear on screen.',
              'Four symbols are identical. One differs in orientation, rotation, or shape.',
              'Study the symbols carefully during the display period.',
              'When symbols disappear, click the number of the ODD symbol.',
              'Use keyboard keys 1–5 for faster response.',
              'Unanswered questions advance automatically after 2 seconds.',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 bg-slate-800 text-white rounded-full text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-600 leading-relaxed">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onStart}
            className="flex-1 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold py-4 rounded-xl text-base transition-colors duration-150 tracking-wide"
          >
            Begin Test
          </button>
          <button
            onClick={onFullScreen}
            className="px-5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-600 font-medium py-4 rounded-xl text-sm transition-colors duration-150"
            title={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullScreen ? 'Exit Full' : 'Full Screen'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          PATHAN Form Perception Test &mdash; Psychometric Edition
        </p>
      </div>
    </div>
  );
};

export default IntroScreen;
