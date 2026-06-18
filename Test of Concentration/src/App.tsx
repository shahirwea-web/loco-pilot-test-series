import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Difficulty, GroupResponse, DotGroup, SessionResult, TestResult, TestPhase } from './types';
import { computeSessionResult, computeTestResult } from './utils/scoring';
import { saveTestResult } from './services/resultsService';
import WelcomeScreen from './components/WelcomeScreen';
import InstructionsScreen from './components/InstructionsScreen';
import PreSessionScreen from './components/PreSessionScreen';
import TestSession from './components/TestSession';
import SessionResultScreen from './components/SessionResultScreen';
import FinalResultScreen from './components/FinalResultScreen';
import { Maximize2, Minimize2 } from 'lucide-react';

const TOTAL_SESSIONS = 10;
const DIFFICULTIES: Difficulty[] = [
  'easy', 'easy', 'easy', 'medium', 'medium',
  'medium', 'hard', 'hard', 'hard', 'hard'
];

function generateTestId(): string {
  return `pathan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateSessionSeed(testId: string, sessionIndex: number): number {
  let hash = 0;
  const str = `${testId}-${sessionIndex}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) || 12345;
}

const App: React.FC = () => {
  const [phase, setPhase] = useState<TestPhase>('welcome');
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [currentSessionResult, setCurrentSessionResult] = useState<SessionResult | null>(null);
  const [finalResult, setFinalResult] = useState<TestResult | null>(null);
  const [focusViolations, setFocusViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const testIdRef = useRef<string>(generateTestId());
  const testStartRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocusViolation = useCallback(() => {
    setFocusViolations(v => v + 1);
  }, []);

  const handleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleStart = useCallback(() => {
    setPhase('instructions');
  }, []);

  const handleInstructionsReady = useCallback(() => {
    testIdRef.current = generateTestId();
    testStartRef.current = Date.now();
    setSessionIndex(0);
    setSessionResults([]);
    setFocusViolations(0);
    setPhase('pre-session');
  }, []);

  const handlePreSessionReady = useCallback(() => {
    setPhase('testing');
  }, []);

  const handleSessionEnd = useCallback(
    (responses: GroupResponse[], groups: DotGroup[], duration: number) => {
      const idx = sessionIndex;
      const difficulty = DIFFICULTIES[idx];
      const result = computeSessionResult(idx + 1, difficulty, groups, responses, duration);
      setCurrentSessionResult(result);
      setSessionResults(prev => [...prev, result]);
      setPhase('session-result');
    },
    [sessionIndex]
  );

  const handleSessionResultContinue = useCallback(() => {
    const nextIndex = sessionIndex + 1;
    if (nextIndex >= TOTAL_SESSIONS) {
      // Compute final result
      const allResults = [...sessionResults];
      if (currentSessionResult && !allResults.find(r => r.sessionNumber === currentSessionResult.sessionNumber)) {
        allResults.push(currentSessionResult);
      }
      const result = computeTestResult(
        testIdRef.current,
        testStartRef.current,
        allResults,
        focusViolations
      );
      setFinalResult(result);
      setPhase('final-result');
    } else {
      setSessionIndex(nextIndex);
      setPhase('testing');
    }
  }, [sessionIndex, sessionResults, currentSessionResult, focusViolations]);

  const handleRestart = useCallback(() => {
    setPhase('welcome');
    setSessionIndex(0);
    setSessionResults([]);
    setCurrentSessionResult(null);
    setFinalResult(null);
    setFocusViolations(0);
    testIdRef.current = generateTestId();
  }, []);

  const seed = generateSessionSeed(testIdRef.current, sessionIndex);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-white flex flex-col overflow-hidden relative"
    >
      <button
        onClick={handleFullscreen}
        className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      <div className="flex-1 overflow-hidden">
        {phase === 'welcome' && <WelcomeScreen onStart={handleStart} />}

        {phase === 'instructions' && (
          <InstructionsScreen onReady={handleInstructionsReady} />
        )}

        {phase === 'pre-session' && (
          <PreSessionScreen
            sessionNumber={sessionIndex + 1}
            difficulty={DIFFICULTIES[sessionIndex]}
            onReady={handlePreSessionReady}
          />
        )}

        {phase === 'pre-session' && (
          <PreSessionScreen
            sessionNumber={sessionIndex + 1}
            difficulty={DIFFICULTIES[sessionIndex]}
            onReady={handlePreSessionReady}
          />
        )}

        {phase === 'testing' && (
          <TestSession
            key={`session-${sessionIndex}-${seed}`}
            sessionNumber={sessionIndex + 1}
            difficulty={DIFFICULTIES[sessionIndex]}
            sessionSeed={seed}
            onSessionEnd={handleSessionEnd}
            focusViolations={focusViolations}
            onFocusViolation={handleFocusViolation}
          />
        )}

        {phase === 'session-result' && currentSessionResult && (
          <SessionResultScreen
            result={currentSessionResult}
            onContinue={handleSessionResultContinue}
            isLast={sessionIndex + 1 >= TOTAL_SESSIONS}
            isAutoProgressing={sessionIndex + 1 < TOTAL_SESSIONS}
          />
        )}

        {phase === 'final-result' && finalResult && (
          <FinalResultScreen
            result={finalResult}
            onRestart={handleRestart}
            onSave={async (result) => {
              const res = await saveTestResult(result);
              return res.success;
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
