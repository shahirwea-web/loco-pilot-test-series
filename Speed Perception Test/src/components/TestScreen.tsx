import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, AlertCircle } from 'lucide-react';
import {
  RoundConfig,
  RoundResult,
  LOCOMOTIVE_WIDTH,
  TOTAL_ROUNDS,
  SIDE_MARGIN,
  TUNNEL_HEIGHT,
  calculateScore,
} from '../game/gameConfig';

interface TestScreenProps {
  rounds: RoundConfig[];
  currentRound: number;
  score: number;
  onRoundComplete: (result: RoundResult) => void;
  onAllRoundsComplete: () => void;
  onAdvanceRound: () => void;
}

type TestPhase = 'waiting' | 'moving' | 'inside-tunnel' | 'round-done';

export function TestScreen({
  rounds,
  currentRound,
  score,
  onRoundComplete,
  onAllRoundsComplete,
  onAdvanceRound,
}: TestScreenProps) {
  const [phase, setPhase] = useState<TestPhase>('waiting');
  const [locomotiveX, setLocomotiveX] = useState(0);
  const [roundScore, setRoundScore] = useState<number | null>(null);

  const phaseRef = useRef<TestPhase>('waiting');
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedExitTimeRef = useRef<number>(0);
  const userStopTimeRef = useRef<number>(0);
  const locomotiveXRef = useRef(0);
  const tunnelStartRef = useRef(0);
  const tunnelEndRef = useRef(0);

  const roundConfig = rounds[currentRound];
  const totalRounds = TOTAL_ROUNDS;
  const progressPercentage = (currentRound / totalRounds) * 100;
  const direction = roundConfig.direction;
  const isLTR = direction === 'left-to-right';

  const screenWidth = window.innerWidth;

  const locoStartX = isLTR
    ? SIDE_MARGIN
    : screenWidth - SIDE_MARGIN - LOCOMOTIVE_WIDTH;

  const tunnelX = isLTR
    ? screenWidth - roundConfig.tunnelWidth - SIDE_MARGIN
    : SIDE_MARGIN;

  const getAccuracy = useCallback(() => {
    const maxTotalScore = totalRounds * 100;
    if (maxTotalScore === 0) return 0;
    return Math.round((score / maxTotalScore) * 100);
  }, [score, totalRounds]);

  const handleStart = useCallback(() => {
    if (phaseRef.current !== 'waiting') return;

    phaseRef.current = 'moving';
    setPhase('moving');
    startTimeRef.current = performance.now();

    const screenW = window.innerWidth;
    const ltr = roundConfig.direction === 'left-to-right';

    const start = ltr ? SIDE_MARGIN : screenW - SIDE_MARGIN - LOCOMOTIVE_WIDTH;
    const tStart = ltr
      ? screenW - roundConfig.tunnelWidth - SIDE_MARGIN
      : SIDE_MARGIN;
    const tEnd = ltr
      ? tStart + roundConfig.tunnelWidth - LOCOMOTIVE_WIDTH
      : SIDE_MARGIN + roundConfig.tunnelWidth - LOCOMOTIVE_WIDTH;

    tunnelStartRef.current = tStart;
    tunnelEndRef.current = tEnd;

    const visibleDistance = Math.abs(tStart - start);
    const tunnelDistance = Math.abs(tEnd - tStart);

    const speedPixelsPerMs = roundConfig.speed / 1000;
    const timeToTunnelEntry = visibleDistance / speedPixelsPerMs;
    const timeToTunnelExit = tunnelDistance / speedPixelsPerMs;

    estimatedExitTimeRef.current = timeToTunnelEntry + timeToTunnelExit;

    locomotiveXRef.current = start;
    setLocomotiveX(start);

    let lastTime = performance.now();
    const speedDir = ltr ? 1 : -1;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const delta = (roundConfig.speed / 1000) * deltaTime * speedDir;
      locomotiveXRef.current += delta;
      setLocomotiveX(locomotiveXRef.current);

      const entered = ltr
        ? locomotiveXRef.current >= tStart
        : locomotiveXRef.current <= tStart + roundConfig.tunnelWidth - LOCOMOTIVE_WIDTH;

      if (entered && phaseRef.current === 'moving') {
        phaseRef.current = 'inside-tunnel';
        setPhase('inside-tunnel');
      }

      const offscreen = ltr
        ? locomotiveXRef.current >= screenW + 50
        : locomotiveXRef.current <= -50 - LOCOMOTIVE_WIDTH;

      if (offscreen) return;

      if (phaseRef.current === 'moving' || phaseRef.current === 'inside-tunnel') {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [roundConfig]);

  const handleStop = useCallback(() => {
    if (phaseRef.current !== 'inside-tunnel' && phaseRef.current !== 'moving') return;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    userStopTimeRef.current = performance.now() - startTimeRef.current;

    const timingError = Math.abs(estimatedExitTimeRef.current - userStopTimeRef.current);
    const { points, label } = calculateScore(timingError);

    phaseRef.current = 'round-done';
    setPhase('round-done');
    setRoundScore(points);

    const result: RoundResult = {
      roundNumber: currentRound + 1,
      speedLevel: roundConfig.speedLevel,
      tunnelLength: roundConfig.tunnelLength,
      direction: roundConfig.direction,
      actualExitTime: Math.round(estimatedExitTimeRef.current),
      userStopTime: Math.round(userStopTimeRef.current),
      timingError: Math.round(timingError),
      roundScore: points,
      performanceLabel: label,
    };

    onRoundComplete(result);
  }, [currentRound, roundConfig, onRoundComplete]);

  useEffect(() => {
    if (phase !== 'round-done') return;

    const delay = currentRound >= totalRounds - 1 ? 1500 : 1200;
    const timeout = setTimeout(() => {
      if (currentRound >= totalRounds - 1) {
        onAllRoundsComplete();
      } else {
        onAdvanceRound();
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [phase, currentRound, totalRounds, onAllRoundsComplete, onAdvanceRound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key.toLowerCase() === 'h') {
        handleStart();
      } else if (e.key.toLowerCase() === 'l') {
        handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStart, handleStop]);

  useEffect(() => {
    locomotiveXRef.current = locoStartX;
    setLocomotiveX(locoStartX);
    phaseRef.current = 'waiting';
    setPhase('waiting');
    setRoundScore(null);
    startTimeRef.current = 0;
    estimatedExitTimeRef.current = 0;
    userStopTimeRef.current = 0;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [currentRound, locoStartX]);

  const isLocomotiveInTunnel = isLTR
    ? locomotiveX >= tunnelX
    : locomotiveX <= tunnelX + roundConfig.tunnelWidth - LOCOMOTIVE_WIDTH;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 overflow-hidden select-none">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-sky-400/50 to-transparent" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <div className="w-16 h-8 bg-yellow-300 rounded-full blur-xl opacity-80" />
      </div>
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-sky-400/30 to-transparent h-40" />
      <div className="absolute inset-x-0 top-[60px] h-[120px] bg-gradient-to-b from-green-500/20 to-green-600/30" />

      <div className="relative z-10 flex flex-col h-full">
        <header className="px-6 py-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Train className="w-6 h-6 text-amber-400" />
                <h1 className="text-lg font-bold text-white tracking-wide">Speed Perception Test</h1>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Round</p>
                  <p className="text-lg font-bold text-white">{currentRound + 1}<span className="text-slate-500 text-sm">/{totalRounds}</span></p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Score</p>
                  <p className="text-lg font-bold text-amber-400">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Accuracy</p>
                  <p className="text-lg font-bold text-emerald-400">{getAccuracy()}%</p>
                </div>
              </div>
            </div>
            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 relative">
          <div className="absolute inset-x-0 bottom-24 h-3 bg-gradient-to-b from-amber-800/60 via-amber-700/80 to-amber-600/90" />
          <div className="absolute inset-x-0 bottom-24 h-3">
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-slate-400/60" />
            <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-slate-400/60" />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-amber-900/40" />
          </div>

          <div className="absolute left-6 bottom-24 w-3 h-16 bg-gradient-to-b from-slate-600 to-slate-800 rounded-t-sm shadow-lg" />
          <div className="absolute right-6 bottom-24 w-3 h-16 bg-gradient-to-b from-slate-600 to-slate-800 rounded-t-sm shadow-lg" />

          <AnimatePresence>
            {!isLocomotiveInTunnel && phase !== 'round-done' && (
              <motion.div
                key={`loco-${currentRound}`}
                className="absolute bottom-[96px]"
                style={{
                  left: locomotiveX,
                  width: LOCOMOTIVE_WIDTH,
                  height: 44,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatedLocomotive isMoving={phase === 'moving'} facingRight={isLTR} />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="absolute bottom-24 rounded-t-2xl overflow-hidden shadow-2xl"
            style={{
              left: tunnelX,
              width: roundConfig.tunnelWidth,
              height: TUNNEL_HEIGHT,
            }}
          >
            <TunnelVisual width={roundConfig.tunnelWidth} />
          </div>

          <AnimatePresence>
            {phase === 'round-done' && roundScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md rounded-xl px-6 py-3 border border-slate-600"
              >
                <p className="text-slate-300 text-base font-medium">
                  Round {currentRound + 1}:
                  <span className={`ml-2 font-bold ${roundScore >= 80 ? 'text-emerald-400' : roundScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                    +{roundScore}
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="bg-slate-900/95 backdrop-blur-sm px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`px-4 py-2 rounded-lg font-mono font-bold text-lg shadow-lg transition-all duration-300 ${
                    phase === 'waiting'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-xs opacity-70 mr-1">START</span> H
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-mono font-bold text-lg shadow-lg transition-all duration-300 ${
                    phase === 'inside-tunnel' || phase === 'moving'
                      ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-xs opacity-70 mr-1">STOP</span> L
                </div>
              </div>

              <div
                className={`px-5 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 ${
                  phase === 'waiting' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  phase === 'moving' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  phase === 'inside-tunnel' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
                  'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {phase === 'waiting' && (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Press H to Start</span>
                  </>
                )}
                {phase === 'moving' && (
                  <>
                    <Train className="w-4 h-4 animate-pulse" />
                    <span>Observe the Speed</span>
                  </>
                )}
                {phase === 'inside-tunnel' && (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Press L to Stop</span>
                  </>
                )}
                {phase === 'round-done' && (
                  <span>Next round starting...</span>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function AnimatedLocomotive({ isMoving, facingRight }: { isMoving: boolean; facingRight: boolean }) {
  return (
    <div
      className="relative w-full h-full"
      style={{ transform: facingRight ? undefined : 'scaleX(-1)' }}
    >
      {isMoving && (
        <div className="absolute -top-6 left-2 flex flex-col items-center">
          <motion.div
            animate={{ y: [-2, -12, -2], opacity: [0.6, 0.2, 0], scale: [0.6, 1, 1.3] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            className="w-4 h-4 bg-gray-400/50 rounded-full blur-[2px]"
          />
          <motion.div
            animate={{ y: [-4, -16, -4], opacity: [0.5, 0.15, 0], scale: [0.5, 0.9, 1.2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
            className="w-3 h-3 bg-gray-400/40 rounded-full blur-[2px]"
          />
          <motion.div
            animate={{ y: [-6, -20, -6], opacity: [0.4, 0.1, 0], scale: [0.4, 0.8, 1.1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
            className="w-3 h-3 bg-gray-300/30 rounded-full blur-[2px]"
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-[52px] h-[18px] bg-gradient-to-r from-slate-800 to-slate-700 rounded-sm shadow-xl">
        <div className="absolute top-[2px] left-1 right-1 h-[3px] bg-slate-600/60 rounded-sm" />
        <motion.div
          animate={isMoving ? { rotate: 360 } : { rotate: 0 }}
          transition={isMoving ? { duration: 0.4, repeat: Infinity, ease: 'linear' } : {}}
          className="absolute bottom-[-4px] left-[4px] w-[10px] h-[10px] bg-slate-900 rounded-full border-[1.5px] border-slate-500 shadow-inner"
          style={{ originX: '50%', originY: '50%' }}
        >
          <div className="absolute top-1/2 left-1/2 w-[1px] h-[40%] bg-slate-600 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-[40%] h-[1px] bg-slate-600 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        <motion.div
          animate={isMoving ? { rotate: 360 } : { rotate: 0 }}
          transition={isMoving ? { duration: 0.4, repeat: Infinity, ease: 'linear' } : {}}
          className="absolute bottom-[-4px] right-[4px] w-[10px] h-[10px] bg-slate-900 rounded-full border-[1.5px] border-slate-500 shadow-inner"
          style={{ originX: '50%', originY: '50%' }}
        >
          <div className="absolute top-1/2 left-1/2 w-[1px] h-[40%] bg-slate-600 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-[40%] h-[1px] bg-slate-600 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </div>

      <div className="absolute bottom-[8px] left-[50px] w-[10px] h-[4px] bg-slate-700 rounded-sm shadow" />

      <div className="absolute bottom-[8px] left-[56px] w-[24px] h-[26px] bg-gradient-to-b from-red-600 to-red-700 shadow-xl rounded-t-sm">
        <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-yellow-400 rounded-full shadow-lg" />
        <div className="absolute top-[8px] left-[2px] w-[1px] h-[14px] bg-slate-900/30 rounded-sm" />
        <div className="absolute top-[8px] right-[2px] w-[1px] h-[14px] bg-slate-900/30 rounded-sm" />
        <motion.div
          animate={isMoving ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={isMoving ? { duration: 0.3, repeat: Infinity } : {}}
          className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-yellow-300/60 rounded-full blur-[2px]"
        />
      </div>

      <div className="absolute top-[-18px] left-[62px] w-[6px] h-[22px] bg-gradient-to-r from-slate-600 to-slate-500 shadow-md rounded-t-sm">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-slate-800 rounded-full shadow" />
      </div>

      <div className="absolute bottom-[6px] left-[60px] w-[1.5px] h-[1.5px] bg-yellow-400 rounded-full" />
      <div className="absolute bottom-[6px] left-[64px] w-[1.5px] h-[1.5px] bg-yellow-400 rounded-full" />
    </div>
  );
}

function TunnelVisual({ width }: { width: number }) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-red-900">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/60 via-transparent to-black/40" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-red-950 to-red-900 shadow-inner">
        <div className="absolute top-[3px] left-4 w-8 h-[3px] bg-stone-800/50 rounded-full" />
        <div className="absolute top-[3px] right-4 w-8 h-[3px] bg-stone-800/50 rounded-full" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-stone-900 to-stone-800">
        <div className="absolute top-1 left-3 right-3 h-2 bg-gradient-to-b from-stone-700/50 to-transparent" />
      </div>

      <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-black/40 to-transparent" />
      <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-black/40 to-transparent" />

      <div className="absolute top-3 left-3 w-3 h-3 bg-gray-900 rounded-full shadow-inner opacity-60" />
      <div className="absolute top-3 right-3 w-3 h-3 bg-gray-900 rounded-full shadow-inner opacity-60" />

      <div className="absolute inset-x-4 top-8 bottom-10 bg-gradient-to-b from-gray-950 via-gray-900 to-black rounded-lg shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 rounded-lg" />
        <div
          className="absolute inset-0 opacity-10 rounded-lg"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="absolute bottom-10 left-5 right-5 h-2 flex justify-between items-end">
        {Array.from({ length: Math.max(2, Math.floor(width / 35)) }).map((_, i) => (
          <div key={i} className="w-[2px] bg-slate-600/50 rounded-sm" style={{ height: 6 + (i % 2) * 3 }} />
        ))}
      </div>

      <div className="absolute top-[45%] left-4 w-2 h-2 border border-stone-700/40 rounded-full" />
      <div className="absolute top-[45%] right-4 w-2 h-2 border border-stone-700/40 rounded-full" />
    </div>
  );
}
