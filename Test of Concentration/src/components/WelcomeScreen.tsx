import React from 'react';
import { Brain, ChevronRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-8 py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-purple-200 to-transparent rounded-full blur-3xl opacity-30 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-blue-200 to-transparent rounded-full blur-3xl opacity-30 -ml-48 -mb-48" />

      <div className="max-w-lg w-full text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg">
          <Brain size={30} className="text-white" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-2">
          PATHAN Assessment Series
        </p>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 mb-3">
          Psychometric Test of Concentration
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          A standardized psychometric assessment measuring visual concentration, sustained
          attention, scanning speed, and accuracy. Inspired by Railway Psychology assessments.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10 text-left">
          <InfoCard title="10 Sessions" sub="40 sec each" gradient="from-purple-400 to-purple-600" />
          <InfoCard title="~400 Seconds" sub="total duration" gradient="from-pink-400 to-pink-600" />
          <InfoCard title="280–300" sub="groups per session" gradient="from-blue-400 to-blue-600" />
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Begin Assessment
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ title: string; sub: string; gradient: string }> = ({ title, sub, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl p-4 text-white shadow-md`}>
    <div className="text-xl font-black">{title}</div>
    <div className="text-xs opacity-90 mt-0.5">{sub}</div>
  </div>
);

export default WelcomeScreen;
