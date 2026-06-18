import React, { useEffect, useState } from 'react';
import { Circle, Signal, TestState, TestConfig } from '../types';
import { Pause, Clock, Target, Zap } from 'lucide-react';

interface TestScreenProps {
  state: TestState;
  config: TestConfig;
  onPause: () => void;
}

const colorMap: Record<string, string> = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  white: 'bg-white',
  cyan: 'bg-cyan-400',
};

const signalColorMap: Record<string, string> = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
};

const signalGlowMap: Record<string, string> = {
  red: 'shadow-red-500/50',
  yellow: 'shadow-yellow-400/50',
  green: 'shadow-green-500/50',
};

export function TestScreen({ state, config, onPause }: TestScreenProps) {
  const [timeLeft, setTimeLeft] = useState(config.responseWindow);

  useEffect(() => {
    if (state.status !== 'running') return;

    setTimeLeft(config.responseWindow);
    const startTime = performance.now();
    const duration = state.currentPhase === 'signal'
      ? config.signalDisplayDuration
      : config.responseWindow;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
    }, 16);

    return () => clearInterval(interval);
  }, [state.currentPhase, state.trialNumber, state.status, config]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / config.responseWindow) * 100;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-700">
              <Clock className="w-5 h-5 text-amber-400" />
              <span className={`font-mono text-xl font-bold ${state.remainingTime < 300 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {formatTime(state.remainingTime)}
              </span>
            </div>

            {/* Trial Counter */}
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-700">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">
                Trial {state.trialNumber}
              </span>
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              state.currentPhase === 'circles'
                ? 'bg-amber-500/20 border-amber-500/50'
                : state.currentPhase === 'signal'
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-purple-500/20 border-purple-500/50'
            } border backdrop-blur-sm`}>
              <Zap className={`w-5 h-5 ${
                state.currentPhase === 'circles'
                  ? 'text-amber-400'
                  : state.currentPhase === 'signal'
                    ? 'text-blue-400'
                    : 'text-purple-400'
              }`} />
              <span className={`font-medium ${
                state.currentPhase === 'circles'
                  ? 'text-amber-300'
                  : state.currentPhase === 'signal'
                    ? 'text-blue-300'
                    : 'text-purple-300'
              }`}>
                {state.currentPhase === 'circles' ? 'Circle Detection'
                  : state.currentPhase === 'signal' ? 'Signal Memory'
                    : 'Memory Check'}
              </span>
            </div>

            {/* Pause Button */}
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              <Pause className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Circles Display - Always visible during all phases */}
      {state.circles.length > 0 && (
        <div className="absolute inset-0">
          {state.circles.map((circle) => (
            <CircleElement key={circle.id} circle={circle} />
          ))}
        </div>
      )}

      {/* Signal Display - Shows alongside circles, same size as circles */}
      {state.currentSignal && state.currentPhase === 'signal' && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${state.currentSignal.x}%`,
            top: `${state.currentSignal.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${signalColorMap[state.currentSignal.color]} shadow-2xl ${signalGlowMap[state.currentSignal.color]}`}
            style={{
              boxShadow: `0 0 40px 15px ${
                state.currentSignal.color === 'red'
                  ? 'rgba(239, 68, 68, 0.5)'
                  : state.currentSignal.color === 'yellow'
                    ? 'rgba(250, 204, 21, 0.5)'
                    : 'rgba(34, 197, 94, 0.5)'
              }`,
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
          </div>
        </div>
      )}

      {/* Memory Check - Minimal indicator only */}
      {state.currentPhase === 'memory-check' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-amber-400 text-2xl font-semibold bg-slate-900/70 px-8 py-4 rounded-xl">
            Press H if sequence was Yellow → Red → Green
          </p>
        </div>
      )}

      {/* Response Timer Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-64 bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-700 p-2">
          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-100 ${
                progress > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                progress > 25 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CircleElement({ circle }: { circle: Circle }) {
  return (
    <div
      className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full ${colorMap[circle.color]} shadow-xl transform -translate-x-1/2 -translate-y-1/2`}
      style={{
        left: `${circle.x}%`,
        top: `${circle.y}%`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
      }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
    </div>
  );
}
