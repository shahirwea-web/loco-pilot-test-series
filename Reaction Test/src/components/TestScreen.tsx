import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RailwaySignal, { SignalColor } from './RailwaySignal';
import { useSound } from '../hooks/useSound';

export interface RoundResult {
  round: number;
  color: SignalColor;
  reactionTime: number | null;
  correct: boolean;
  missed: boolean;
  tooEarly: boolean;
}

interface TestScreenProps {
  onComplete: (results: RoundResult[]) => void;
}

const TOTAL_ROUNDS = 15;
const HOLD_DURATION = 5000;
const SIGNAL_DISPLAY_MS = 1800;
const PENALTY_WRONG = 500;
const PENALTY_MISSED = 800;
const COLORS: Array<'red' | 'yellow' | 'green'> = ['red', 'yellow', 'green'];
const KEY_MAP: Record<string, 'red' | 'yellow' | 'green'> = {
  r: 'red',
  y: 'yellow',
  g: 'green',
};

type Phase =
  | 'waiting_hold'   // user must hold L
  | 'holding'        // counting down 5s hold
  | 'armed'          // waiting random delay before signal
  | 'signal_on'      // signal visible
  | 'signal_off'     // brief pause after signal gone (missed)
  | 'feedback';      // show result briefly

export default function TestScreen({ onComplete }: TestScreenProps) {
  const { playSound } = useSound();

  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>('waiting_hold');
  const [activeColor, setActiveColor] = useState<SignalColor>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'missed' | 'too_early' | null>(null);
  const [lastReaction, setLastReaction] = useState<number | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const phaseRef = useRef<Phase>('waiting_hold');
  const signalColorRef = useRef<SignalColor>(null);
  const signalStartRef = useRef<number>(0);
  const holdStartRef = useRef<number>(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const armedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundRef = useRef(1);
  const resultsRef = useRef<RoundResult[]>([]);

  const setPhaseSync = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const clearAllTimers = () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    if (armedTimerRef.current) clearTimeout(armedTimerRef.current);
    if (signalTimerRef.current) clearTimeout(signalTimerRef.current);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
  };

  const advanceRound = useCallback((newResults: RoundResult[]) => {
    const nextRound = roundRef.current + 1;
    if (nextRound > TOTAL_ROUNDS) {
      onComplete(newResults);
      return;
    }
    roundRef.current = nextRound;
    setRound(nextRound);
    setActiveColor(null);
    signalColorRef.current = null;
    setFeedback(null);
    setLastReaction(null);
    setHoldProgress(0);
    setPhaseSync('waiting_hold');
  }, [onComplete]);

  const showFeedback = useCallback(
    (type: 'correct' | 'wrong' | 'missed' | 'too_early', reaction: number | null, result: RoundResult) => {
      setFeedback(type);
      setLastReaction(reaction);
      setActiveColor(null);
      signalColorRef.current = null;
      setPhaseSync('feedback');

      const newResults = [...resultsRef.current, result];
      resultsRef.current = newResults;
      setResults(newResults);

      feedbackTimerRef.current = setTimeout(() => {
        advanceRound(newResults);
      }, 1200);
    },
    [advanceRound]
  );

  const triggerSignal = useCallback(() => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setActiveColor(color);
    signalColorRef.current = color;
    signalStartRef.current = performance.now();
    setPhaseSync('signal_on');
    playSound('signal');

    // Signal disappears after SIGNAL_DISPLAY_MS → count as missed
    signalTimerRef.current = setTimeout(() => {
      if (phaseRef.current !== 'signal_on') return;
      setActiveColor(null);
      signalColorRef.current = null;
      setPhaseSync('signal_off');
      playSound('missed');
      const result: RoundResult = {
        round: roundRef.current,
        color,
        reactionTime: null,
        correct: false,
        missed: true,
        tooEarly: false,
      };
      showFeedback('missed', null, result);
    }, SIGNAL_DISPLAY_MS);
  }, [playSound, showFeedback]);

  const startArmedWait = useCallback(() => {
    setPhaseSync('armed');
    setActiveColor(null);
    const delay = 2000 + Math.random() * 3000;
    armedTimerRef.current = setTimeout(triggerSignal, delay);
  }, [triggerSignal]);

  // L key hold logic
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();

      if (key === 'l') {
        if (phaseRef.current !== 'waiting_hold') return;
        holdStartRef.current = performance.now();
        setPhaseSync('holding');
        setHoldProgress(0);

        holdTimerRef.current = setInterval(() => {
          const elapsed = performance.now() - holdStartRef.current;
          const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
          setHoldProgress(pct);
          if (elapsed >= HOLD_DURATION) {
            clearInterval(holdTimerRef.current!);
            holdTimerRef.current = null;
            startArmedWait();
          }
        }, 50);
        return;
      }

      // Response keys
      const pressedColor = KEY_MAP[key];
      if (!pressedColor) return;

      setPressedKey(key.toUpperCase());
      setTimeout(() => setPressedKey(null), 300);

      if (phaseRef.current === 'armed') {
        // Pressed before signal appeared
        playSound('wrong');
        const result: RoundResult = {
          round: roundRef.current,
          color: null,
          reactionTime: null,
          correct: false,
          missed: false,
          tooEarly: true,
        };
        if (armedTimerRef.current) {
          clearTimeout(armedTimerRef.current);
          armedTimerRef.current = null;
        }
        showFeedback('too_early', null, result);
        return;
      }

      if (phaseRef.current === 'signal_on') {
        const rt = Math.round(performance.now() - signalStartRef.current);
        const correct = pressedColor === signalColorRef.current;
        if (signalTimerRef.current) {
          clearTimeout(signalTimerRef.current);
          signalTimerRef.current = null;
        }
        if (correct) {
          playSound('correct');
        } else {
          playSound('wrong');
        }
        const result: RoundResult = {
          round: roundRef.current,
          color: signalColorRef.current,
          reactionTime: correct ? rt : rt + PENALTY_WRONG,
          correct,
          missed: false,
          tooEarly: false,
        };
        showFeedback(correct ? 'correct' : 'wrong', correct ? rt : rt + PENALTY_WRONG, result);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'l') return;
      if (phaseRef.current === 'holding') {
        // Released early — cancel hold
        if (holdTimerRef.current) {
          clearInterval(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        setHoldProgress(0);
        setPhaseSync('waiting_hold');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [playSound, showFeedback, startArmedWait]);

  // Cleanup on unmount
  useEffect(() => () => clearAllTimers(), []);

  const feedbackConfig = {
    correct: { text: 'CORRECT!', color: 'text-green-400', glow: 'rgba(34,197,94,0.5)' },
    wrong: { text: `WRONG! +${PENALTY_WRONG}ms`, color: 'text-red-400', glow: 'rgba(239,68,68,0.5)' },
    missed: { text: `MISSED! +${PENALTY_MISSED}ms`, color: 'text-orange-400', glow: 'rgba(249,115,22,0.5)' },
    too_early: { text: 'TOO EARLY!', color: 'text-yellow-400', glow: 'rgba(234,179,8,0.5)' },
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/60 bg-gray-900/50">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">Round</span>
          <span className="text-white text-2xl font-black">{round}</span>
          <span className="text-gray-600 text-lg">/ {TOTAL_ROUNDS}</span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-6 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${((round - 1) / TOTAL_ROUNDS) * 100}%` }}
            animate={{ width: `${((round - 1) / TOTAL_ROUNDS) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Mini stats */}
        <div className="flex gap-4 text-sm">
          <span className="text-green-400 font-bold">
            {results.filter((r) => r.correct).length}
            <span className="text-gray-500 font-normal ml-1">correct</span>
          </span>
          <span className="text-red-400 font-bold">
            {results.filter((r) => !r.correct && !r.missed && !r.tooEarly).length}
            <span className="text-gray-500 font-normal ml-1">wrong</span>
          </span>
          <span className="text-orange-400 font-bold">
            {results.filter((r) => r.missed).length}
            <span className="text-gray-500 font-normal ml-1">missed</span>
          </span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-4 relative">

        {/* Feedback overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              key={feedback}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`absolute top-6 left-1/2 -translate-x-1/2 z-20 px-8 py-3 rounded-xl border font-black text-xl tracking-wider ${feedbackConfig[feedback].color}`}
              style={{
                background: 'rgba(0,0,0,0.8)',
                borderColor: feedbackConfig[feedback].glow.replace('0.5', '0.4'),
                boxShadow: `0 0 30px ${feedbackConfig[feedback].glow}`,
              }}
            >
              {feedbackConfig[feedback].text}
              {lastReaction !== null && (
                <span className="ml-4 text-base font-normal text-gray-300">
                  {lastReaction} ms
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signal area */}
        <div className="relative flex items-end justify-center" style={{ minHeight: 320 }}>
          <AnimatePresence>
            {(phase === 'signal_on' || phase === 'signal_off' || phase === 'feedback' || phase === 'armed' || phase === 'holding' || phase === 'waiting_hold') && (
              <motion.div
                key="signal"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <RailwaySignal activeColor={activeColor} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status / instruction area */}
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <AnimatePresence mode="wait">
            {phase === 'waiting_hold' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-gray-300 text-lg font-medium mb-2">Hold the</p>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-800 border-2 border-gray-600 text-white text-3xl font-black shadow-lg">
                  L
                </div>
                <p className="text-gray-400 text-sm mt-2">key for 5 seconds to arm the signal</p>
              </motion.div>
            )}

            {phase === 'holding' && (
              <motion.div
                key="holding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 w-full"
              >
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-xl border-2 text-3xl font-black shadow-lg"
                  style={{
                    background: `rgba(59,130,246,${holdProgress / 100 * 0.4})`,
                    borderColor: `rgba(59,130,246,${holdProgress / 100})`,
                    color: `rgba(255,255,255,${0.5 + holdProgress / 100 * 0.5})`,
                    boxShadow: `0 0 ${holdProgress / 5}px rgba(59,130,246,0.5)`,
                  }}
                >
                  L
                </div>
                <p className="text-blue-300 text-sm">Keep holding... {Math.ceil(5 - (holdProgress / 100) * 5)}s</p>
                {/* Hold progress bar */}
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${holdProgress}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                      boxShadow: '0 0 8px rgba(59,130,246,0.6)',
                    }}
                  />
                </div>
              </motion.div>
            )}

            {phase === 'armed' && (
              <motion.div
                key="armed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.p
                  className="text-yellow-300 text-base font-semibold mb-1"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Signal system armed...
                </motion.p>
                <p className="text-gray-500 text-sm">Watch the signal — stay ready!</p>
              </motion.div>
            )}

            {phase === 'signal_on' && (
              <motion.div
                key="signal_on"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-white text-xl font-black tracking-widest" style={{ textShadow: '0 0 20px white' }}>
                  RESPOND NOW!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Key indicators */}
        <div className="flex gap-5">
          {(['R', 'Y', 'G'] as const).map((k) => {
            const colorMap = { R: { active: '#ef4444', label: 'Red', border: '#7f1d1d' }, Y: { active: '#eab308', label: 'Yellow', border: '#713f12' }, G: { active: '#22c55e', label: 'Green', border: '#14532d' } };
            const cfg = colorMap[k];
            const isPressed = pressedKey === k;
            return (
              <motion.div
                key={k}
                animate={isPressed ? { scale: 0.88, y: 3 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all duration-100"
                  style={{
                    background: isPressed ? cfg.active + '33' : 'rgba(17,24,39,0.8)',
                    borderColor: isPressed ? cfg.active : '#374151',
                    color: isPressed ? cfg.active : '#9ca3af',
                    boxShadow: isPressed ? `0 0 20px ${cfg.active}66` : 'none',
                  }}
                >
                  {k}
                </div>
                <span className="text-gray-500 text-xs">{cfg.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
