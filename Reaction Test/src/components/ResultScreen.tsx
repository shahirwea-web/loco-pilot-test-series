import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, Zap, RotateCcw, TrendingUp } from 'lucide-react';
import { RoundResult } from './TestScreen';

interface ResultScreenProps {
  results: RoundResult[];
  onRestart: () => void;
}

const PENALTY_MISSED = 800;

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col gap-2 p-5 bg-gray-900/60 border border-gray-700/50 rounded-2xl"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className={color} />
        <span className="text-gray-400 text-xs uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-3xl font-black ${color}`}>{value}</span>
        {unit && <span className="text-gray-500 text-sm pb-1">{unit}</span>}
      </div>
    </motion.div>
  );
}

export default function ResultScreen({ results, onRestart }: ResultScreenProps) {
  const hasPlayed = useRef(false);

  const correct = results.filter((r) => r.correct);
  const wrong = results.filter((r) => !r.correct && !r.missed && !r.tooEarly);
  const missed = results.filter((r) => r.missed);
  const tooEarly = results.filter((r) => r.tooEarly);

  const reactionTimes = correct.map((r) => r.reactionTime!).filter(Boolean);
  const avgReaction = reactionTimes.length
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;
  const bestReaction = reactionTimes.length ? Math.min(...reactionTimes) : 0;

  const totalPenalty = wrong.length * 500 + missed.length * PENALTY_MISSED;
  const accuracy = Math.round((correct.length / results.length) * 100);

  const baseScore = correct.length * 100;
  const penaltyScore = (wrong.length + missed.length + tooEarly.length) * 20;
  const reactionBonus = reactionTimes.length ? Math.max(0, Math.round((800 - avgReaction) / 10)) : 0;
  const finalScore = Math.max(0, baseScore - penaltyScore + reactionBonus);
  const maxPossible = 100 * 15 + 80;
  const scorePercent = Math.min(100, Math.round((finalScore / maxPossible) * 100));

  const grade =
    scorePercent >= 90 ? { label: 'Excellent', color: 'text-green-400' } :
    scorePercent >= 75 ? { label: 'Good', color: 'text-blue-400' } :
    scorePercent >= 60 ? { label: 'Average', color: 'text-yellow-400' } :
    { label: 'Needs Practice', color: 'text-red-400' };

  // Play completion sound once
  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [523, 659, 784, 1046].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.35);
        o.start(ctx.currentTime + i * 0.15);
        o.stop(ctx.currentTime + i * 0.15 + 0.35);
      });
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-8"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-yellow-500/10 border-2 border-yellow-500/40 flex items-center justify-center mb-4"
          style={{ boxShadow: '0 0 40px rgba(234,179,8,0.3)' }}>
          <Trophy size={36} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-1">Test Complete</h1>
        <p className="text-gray-400">Complex Reaction Test — 15 Rounds</p>
      </motion.div>

      {/* Score circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center mb-8 p-8 bg-gray-900/60 border border-gray-700/50 rounded-3xl"
        style={{ minWidth: 260 }}
      >
        <span className="text-gray-400 text-xs uppercase tracking-widest mb-2">Final Score</span>
        <span
          className="text-7xl font-black"
          style={{ color: scorePercent >= 75 ? '#22c55e' : scorePercent >= 60 ? '#eab308' : '#ef4444',
            textShadow: `0 0 40px currentColor` }}
        >
          {scorePercent}%
        </span>
        <span className={`text-xl font-bold mt-1 ${grade.color}`}>{grade.label}</span>
        <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${scorePercent}%` }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            style={{
              background: scorePercent >= 75 ? 'linear-gradient(90deg,#16a34a,#22c55e)' :
                scorePercent >= 60 ? 'linear-gradient(90deg,#ca8a04,#eab308)' :
                'linear-gradient(90deg,#b91c1c,#ef4444)',
            }}
          />
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl mb-8">
        <StatCard icon={Target} label="Correct" value={correct.length} unit={`/ ${results.length}`} color="text-green-400" delay={0.3} />
        <StatCard icon={Zap} label="Wrong" value={wrong.length} color="text-red-400" delay={0.35} />
        <StatCard icon={TrendingUp} label="Missed" value={missed.length} color="text-orange-400" delay={0.4} />
        <StatCard icon={Clock} label="Avg Reaction" value={avgReaction} unit="ms" color="text-blue-400" delay={0.45} />
        <StatCard icon={Zap} label="Best Reaction" value={bestReaction} unit="ms" color="text-cyan-400" delay={0.5} />
        <StatCard icon={Target} label="Accuracy" value={`${accuracy}%`} color="text-yellow-400" delay={0.55} />
      </div>

      {/* Penalty note */}
      {totalPenalty > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 text-sm mb-6"
        >
          Total penalty time: <span className="text-orange-400 font-semibold">+{totalPenalty}ms</span>
        </motion.p>
      )}

      {/* Round breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="w-full max-w-xl mb-8 p-4 bg-gray-900/40 border border-gray-700/40 rounded-2xl"
      >
        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Round by Round</h3>
        <div className="flex flex-wrap gap-2">
          {results.map((r, i) => {
            const bg = r.correct ? 'bg-green-500/20 border-green-500/40 text-green-300' :
              r.missed ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' :
              r.tooEarly ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' :
              'bg-red-500/20 border-red-500/40 text-red-300';
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${bg}`}
                title={
                  r.correct ? `Round ${r.round}: Correct (${r.reactionTime}ms)` :
                  r.missed ? `Round ${r.round}: Missed` :
                  r.tooEarly ? `Round ${r.round}: Too Early` :
                  `Round ${r.round}: Wrong`
                }
              >
                {r.round}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/40 inline-block" /> Correct</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/40 inline-block" /> Wrong</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500/40 inline-block" /> Missed</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/40 inline-block" /> Too Early</span>
        </div>
      </motion.div>

      {/* Restart */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={onRestart}
        className="flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-black rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition-all duration-200 tracking-wider uppercase"
      >
        <RotateCcw size={20} />
        Restart Test
      </motion.button>
    </div>
  );
}
