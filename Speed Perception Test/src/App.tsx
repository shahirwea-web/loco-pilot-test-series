import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './components/WelcomeScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { TestScreen } from './components/TestScreen';
import { FinalResultScreen } from './components/FinalResultScreen';
import {
  RoundConfig,
  RoundResult,
  GameResult,
  TOTAL_ROUNDS,
  generateAllRounds,
} from './game/gameConfig';

type Screen = 'welcome' | 'instructions' | 'test' | 'results';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [rounds, setRounds] = useState<RoundConfig[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);

  const handleStartTest = useCallback(() => {
    setScreen('instructions');
  }, []);

  const handleBeginTest = useCallback(() => {
    setRounds(generateAllRounds());
    setCurrentRound(0);
    setScore(0);
    setRoundResults([]);
    setScreen('test');
  }, []);

  const handleRoundComplete = useCallback((result: RoundResult) => {
    setScore(prev => prev + result.roundScore);
    setRoundResults(prev => [...prev, result]);
  }, []);

  const handleAdvanceRound = useCallback(() => {
    setCurrentRound(prev => prev + 1);
  }, []);

  const handleAllRoundsComplete = useCallback(() => {
    setScreen('results');
  }, []);

  const handleRestart = useCallback(() => {
    setRounds(generateAllRounds());
    setCurrentRound(0);
    setScore(0);
    setRoundResults([]);
    setScreen('test');
  }, []);

  const handleHome = useCallback(() => {
    setScreen('welcome');
    setRounds([]);
    setCurrentRound(0);
    setScore(0);
    setRoundResults([]);
  }, []);

  const gameResult = calculateGameResult(roundResults, score);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={handleStartTest} />
        )}
        {screen === 'instructions' && (
          <InstructionsScreen key="instructions" onStart={handleBeginTest} />
        )}
        {screen === 'test' && (
          <TestScreen
            key={`test-${currentRound}`}
            rounds={rounds}
            currentRound={currentRound}
            score={score}
            onRoundComplete={handleRoundComplete}
            onAllRoundsComplete={handleAllRoundsComplete}
            onAdvanceRound={handleAdvanceRound}
          />
        )}
        {screen === 'results' && (
          <FinalResultScreen
            key="results"
            result={gameResult}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function calculateGameResult(results: RoundResult[], totalScore: number): GameResult {
  const maxScore = TOTAL_ROUNDS * 100;
  const accuracyPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const averageError = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.timingError, 0) / results.length)
    : 0;

  let bestRound: RoundResult | null = null;
  let worstRound: RoundResult | null = null;

  if (results.length > 0) {
    bestRound = results.reduce((best, r) => r.timingError < best.timingError ? r : best, results[0]);
    worstRound = results.reduce((worst, r) => r.timingError > worst.timingError ? r : worst, results[0]);
  }

  const perfectCount = results.filter(r => r.performanceLabel === 'Perfect').length;
  const excellentCount = results.filter(r => r.performanceLabel === 'Excellent').length;
  const goodCount = results.filter(r => r.performanceLabel === 'Good').length;
  const averageCount = results.filter(r => r.performanceLabel === 'Average').length;
  const poorCount = results.filter(r => r.performanceLabel === 'Poor').length;

  return {
    totalScore,
    maxScore,
    accuracyPercentage,
    averageError,
    bestRound,
    worstRound,
    perfectCount,
    excellentCount,
    goodCount,
    averageCount,
    poorCount,
  };
}

export default App;
