import { motion } from 'framer-motion';
import { Train, Activity, Clock, Target } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Animated background glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-blue-500"
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header badge */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 mb-8 px-4 py-2 bg-blue-900/30 border border-blue-700/40 rounded-full"
      >
        <Train size={16} className="text-blue-400" />
        <span className="text-blue-300 text-sm font-medium tracking-widest uppercase">
          Railway Psychometric Assessment
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl md:text-6xl font-black text-white text-center mb-3 tracking-tight"
      >
        Complex Reaction
        <span className="text-blue-400"> Test</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-400 text-center mb-12 max-w-md text-base"
      >
        Measures your ability to identify and respond to multiple signal types under controlled conditions
      </motion.p>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-3 gap-4 mb-12 w-full max-w-md"
      >
        {[
          { icon: Target, label: '15 Rounds', sub: 'Total trials' },
          { icon: Clock, label: '2–5s', sub: 'Signal delay' },
          { icon: Activity, label: 'ms Precision', sub: 'Reaction time' },
        ].map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 p-4 bg-gray-900/60 border border-gray-700/50 rounded-xl"
          >
            <Icon size={20} className="text-blue-400 mb-1" />
            <span className="text-white text-sm font-bold">{label}</span>
            <span className="text-gray-500 text-xs">{sub}</span>
          </div>
        ))}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md mb-10 p-5 bg-gray-900/60 border border-gray-700/40 rounded-2xl"
      >
        <h3 className="text-gray-300 font-semibold mb-4 text-sm uppercase tracking-widest">
          How to Play
        </h3>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Hold the L key for 5 seconds to arm the signal system' },
            { step: '2', text: 'A railway signal will appear after a random delay (2–5s)' },
            { step: '3', text: 'Press R for Red · Y for Yellow · G for Green' },
            { step: '4', text: 'Wrong or missed signals incur a time penalty' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-300 text-xs font-bold">{step}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* START button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        className="relative px-16 py-5 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-black rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_rgba(59,130,246,0.7)] transition-all duration-200 tracking-wider uppercase"
      >
        <motion.span
          className="absolute inset-0 rounded-2xl bg-blue-400 opacity-0"
          whileHover={{ opacity: 0.1 }}
        />
        START
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-gray-600 text-xs"
      >
        Use headphones for the best experience
      </motion.p>
    </div>
  );
}
