import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Question, TestPhase } from '../types';
import { SymbolRenderer } from '../SymbolRenderer';

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  phase: TestPhase;
  onAnswer: (index: number | null, responseTime: number) => void;
  phaseTimeRemaining: number;
  phaseTotal: number;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  questionNumber,
  totalQuestions,
  phase,
  onAnswer,
  phaseTimeRemaining,
  phaseTotal,
}) => {
  const answerStartRef = useRef<number>(Date.now());
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setAnswered(false);
    if (phase === 'answer') {
      answerStartRef.current = Date.now();
    }
  }, [question.id, phase]);

  const handleSelect = useCallback(
    (index: number) => {
      if (phase !== 'answer' || answered) return;
      setAnswered(true);
      const responseTime = Date.now() - answerStartRef.current;
      onAnswer(index, responseTime);
    },
    [phase, answered, onAnswer]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 5) {
        handleSelect(key - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSelect]);

  const symbolSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 60 : 80;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-800">
              Question {questionNumber} of {totalQuestions}
            </span>
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalQuestions, 50) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < questionNumber - 1
                      ? 'w-2 bg-slate-800'
                      : i === questionNumber - 1
                      ? 'w-3 bg-blue-500'
                      : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
              phase === 'display'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {phase === 'display' ? 'OBSERVE' : 'SELECT'}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full">

          {/* Phase label */}
          <div className="text-center mb-8">
            {phase === 'display' ? (
              <p className="text-slate-500 text-sm">
                Identify the <span className="font-semibold text-slate-700">odd symbol</span> — remember its position
              </p>
            ) : (
              <p className="text-slate-500 text-sm">
                Which symbol was <span className="font-semibold text-slate-700">different</span>? Select its number.
              </p>
            )}
          </div>

          {/* Symbols row */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-10">
            {question.symbols.map((sym, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div
                  className={`relative border-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    phase === 'display'
                      ? 'border-slate-200 bg-slate-50 shadow-sm'
                      : 'border-slate-100 bg-slate-50 opacity-0 pointer-events-none'
                  }`}
                  style={{ width: symbolSize + 24, height: symbolSize + 24 }}
                >
                  {phase === 'display' && (
                    <SymbolRenderer config={sym} size={symbolSize} />
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-400 tracking-wider">
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Answer buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleSelect(num - 1)}
                disabled={phase !== 'answer' || answered}
                className={`flex items-center justify-center font-bold text-lg rounded-xl border-2 transition-all duration-150 select-none
                  ${phase !== 'answer'
                    ? 'w-14 h-14 border-slate-100 text-slate-200 bg-white cursor-not-allowed'
                    : answered
                    ? 'w-14 h-14 border-slate-200 text-slate-300 bg-white cursor-not-allowed'
                    : 'w-14 h-14 border-slate-300 text-slate-700 bg-white hover:border-slate-800 hover:bg-slate-800 hover:text-white active:scale-95 cursor-pointer shadow-sm hover:shadow-md'
                  }`}
              >
                {num}
              </button>
            ))}
          </div>

          {phase === 'answer' && (
            <p className="text-center text-xs text-slate-400 mt-5">
              Press keys 1–5 on your keyboard to respond quickly
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
