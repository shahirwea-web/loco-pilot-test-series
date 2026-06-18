import { motion } from 'framer-motion';
import { Award, RotateCcw, Home, TrendingUp, Target, Timer, BarChart3 } from 'lucide-react';
import { GameResult, getPerformanceRating } from '../game/gameConfig';

interface FinalResultScreenProps {
  result: GameResult;
  onRestart: () => void;
  onHome: () => void;
}

const ratingColors: Record<string, { bg: string; text: string; border: string }> = {
  'Excellent': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Good': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Average': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Needs Improvement': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export function FinalResultScreen({ result, onRestart, onHome }: FinalResultScreenProps) {
  const rating = getPerformanceRating(result.accuracyPercentage);
  const colors = ratingColors[rating] || ratingColors['Needs Improvement'];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
      <div className="min-h-full py-12 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6 shadow-2xl shadow-amber-500/30">
              <Award className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">TEST COMPLETE</h1>
            <p className="text-xl text-slate-400">Speed Perception Assessment Results</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`rounded-3xl p-8 mb-8 border-2 ${colors.bg} ${colors.border}`}
          >
            <div className="text-center mb-8">
              <p className="text-slate-400 text-lg mb-2">Performance Rating</p>
              <h2 className={`text-5xl font-bold ${colors.text}`}>{rating}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 text-center">
                <Target className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-1">Total Score</p>
                <p className="text-3xl font-bold text-white">{result.totalScore}<span className="text-slate-500 text-lg">/{result.maxScore}</span></p>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 text-center">
                <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-white">{result.accuracyPercentage}<span className="text-slate-500 text-lg">%</span></p>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 text-center">
                <Timer className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-1">Avg Error</p>
                <p className="text-3xl font-bold text-white">{result.averageError}<span className="text-slate-500 text-lg">ms</span></p>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-1">Best Round</p>
                <p className="text-3xl font-bold text-white">{result.bestRound?.roundNumber || '-'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/30 rounded-2xl p-8 mb-8 border border-slate-700/50"
          >
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Response Distribution</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { label: 'Perfect', count: result.perfectCount, color: 'bg-emerald-500' },
                { label: 'Excellent', count: result.excellentCount, color: 'bg-blue-500' },
                { label: 'Good', count: result.goodCount, color: 'bg-amber-500' },
                { label: 'Average', count: result.averageCount, color: 'bg-orange-500' },
                { label: 'Poor', count: result.poorCount, color: 'bg-red-500' },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mb-2`}>
                    <span className="text-2xl font-bold text-white">{count}</span>
                  </div>
                  <span className="text-slate-400 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {result.bestRound && result.worstRound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 gap-6 mb-8"
            >
              <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20">
                <h4 className="text-emerald-400 font-semibold mb-4">Best Round</h4>
                <div className="space-y-2 text-slate-300">
                  <p>Round: <span className="text-white font-semibold">{result.bestRound.roundNumber}</span></p>
                  <p>Timing Error: <span className="text-white font-semibold">{result.bestRound.timingError}ms</span></p>
                  <p>Score: <span className="text-emerald-400 font-semibold">+{result.bestRound.roundScore}</span></p>
                </div>
              </div>
              <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
                <h4 className="text-red-400 font-semibold mb-4">Worst Round</h4>
                <div className="space-y-2 text-slate-300">
                  <p>Round: <span className="text-white font-semibold">{result.worstRound.roundNumber}</span></p>
                  <p>Timing Error: <span className="text-white font-semibold">{result.worstRound.timingError}ms</span></p>
                  <p>Score: <span className="text-red-400 font-semibold">+{result.worstRound.roundScore}</span></p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-shadow"
            >
              <RotateCcw className="w-5 h-5" />
              Restart Test
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-700 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-slate-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
