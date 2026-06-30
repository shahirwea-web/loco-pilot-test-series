import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain as Train, Brain, Eye, Zap, Target, FileText, Lock, ChevronRight, Shield } from 'lucide-react';
import SubscriptionModal from './components/SubscriptionModal';

interface TestCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  iconBg: string;
  stats: { label: string; value: string }[];
}

const tests: TestCard[] = [
  {
    id: 'reaction',
    title: 'Complex Reaction Test',
    description: 'Measures your ability to identify and respond to multiple signal types under controlled conditions.',
    icon: Zap,
    color: 'text-blue-400',
    borderColor: 'border-blue-700/40',
    iconBg: 'bg-blue-600/15',
    stats: [
      { label: 'Rounds', value: '15' },
      { label: 'Delay', value: '2–5s' },
      { label: 'Precision', value: 'ms' },
    ],
  },
  {
    id: 'speed',
    title: 'Speed Perception Test',
    description: 'Evaluate your ability to judge and track the speed of moving objects accurately.',
    icon: Target,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-700/40',
    iconBg: 'bg-cyan-600/15',
    stats: [
      { label: 'Trials', value: '20' },
      { label: 'Levels', value: '5' },
      { label: 'Score', value: '%' },
    ],
  },
  {
    id: 'concentration',
    title: 'Test of Concentration',
    description: 'Assess sustained attention and focus across multiple sessions of cognitive challenge.',
    icon: Brain,
    color: 'text-purple-400',
    borderColor: 'border-purple-700/40',
    iconBg: 'bg-purple-600/15',
    stats: [
      { label: 'Sessions', value: '3' },
      { label: 'Duration', value: '5min' },
      { label: 'Accuracy', value: '%' },
    ],
  },
  {
    id: 'visual',
    title: 'Visual Discrimination Test',
    description: 'Test your ability to detect subtle differences between similar visual patterns and symbols.',
    icon: Eye,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-700/40',
    iconBg: 'bg-emerald-600/15',
    stats: [
      { label: 'Questions', value: '40' },
      { label: 'Time', value: '10min' },
      { label: 'Patterns', value: '8' },
    ],
  },
  {
    id: 'form',
    title: 'Form Perception Test',
    description: 'Measure your capacity to recognize and differentiate geometric forms under time pressure.',
    icon: FileText,
    color: 'text-orange-400',
    borderColor: 'border-orange-700/40',
    iconBg: 'bg-orange-600/15',
    stats: [
      { label: 'Items', value: '30' },
      { label: 'Time', value: '8min' },
      { label: 'Forms', value: '12' },
    ],
  },
];

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-x-hidden">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-900/25 border border-blue-700/35 rounded-full">
            <Train size={15} className="text-blue-400" />
            <span className="text-blue-300 text-sm font-semibold tracking-widest uppercase">
              Railway Recruitment Board
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            Loco Pilot Psychometric
            <br />
            <span className="text-blue-400">Test Series</span>
          </h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed">
            All 5 official psychometric assessments for Loco Pilot & Assistant Loco Pilot recruitment — practice the way you'll be tested.
          </p>
        </motion.div>

        {/* Subscription CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8 p-4 bg-blue-950/50 border border-blue-700/40 rounded-2xl flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Unlock Full Access</p>
              <p className="text-gray-400 text-xs">Practice all 5 tests — starting at ₹499 for 3 months</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          >
            Activate Subscription
            <ChevronRight size={16} />
          </button>
        </motion.div>

        {/* Test cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test, index) => {
            const Icon = test.icon;
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.07 }}
                onClick={() => setShowModal(true)}
                className={`group relative p-5 bg-gray-900/70 border ${test.borderColor} rounded-2xl cursor-pointer hover:bg-gray-900 transition-all duration-250 hover:shadow-lg hover:-translate-y-0.5`}
              >
                {/* Lock badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gray-800/80 border border-gray-700/60 rounded-full">
                  <Lock size={10} className="text-gray-400" />
                  <span className="text-gray-400 text-xs font-medium">Locked</span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${test.iconBg} border border-current/10 flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={test.color} />
                  </div>
                  <div className="flex-1 pr-16">
                    <h3 className="text-white font-bold text-base leading-tight mb-1">{test.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{test.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-800/60">
                  {test.stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center flex-1">
                      <span className="text-white font-bold text-sm">{stat.value}</span>
                      <span className="text-gray-500 text-xs">{stat.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 ml-auto text-gray-500 group-hover:text-gray-300 transition-colors">
                    <span className="text-xs font-medium">Subscribe</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-600 text-xs mt-10"
        >
          Tests aligned with official RRB ALP / Loco Pilot psychometric assessment patterns.
        </motion.p>
      </div>

      {showModal && <SubscriptionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
