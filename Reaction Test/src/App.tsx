import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StartScreen from './components/StartScreen';
import CountdownScreen from './components/CountdownScreen';
import TestScreen, { RoundResult } from './components/TestScreen';
import ResultScreen from './components/ResultScreen';

type Screen = 'start' | 'countdown' | 'test' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [results, setResults] = useState<RoundResult[]>([]);

  const handleStart = () => setScreen('countdown');
  const handleCountdownComplete = () => setScreen('test');
  const handleTestComplete = (r: RoundResult[]) => {
    setResults(r);
    setScreen('result');
  };
  const handleRestart = () => {
    setResults([]);
    setScreen('start');
  };

  return (
    <AnimatePresence mode="wait">
      {screen === 'start' && (
        <motion.div
          key="start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StartScreen onStart={handleStart} />
        </motion.div>
      )}

      {screen === 'countdown' && (
        <motion.div
          key="countdown"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CountdownScreen onComplete={handleCountdownComplete} />
        </motion.div>
      )}

      {screen === 'test' && (
        <motion.div
          key="test"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TestScreen onComplete={handleTestComplete} />
        </motion.div>
      )}

      {screen === 'result' && (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResultScreen results={results} onRestart={handleRestart} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
