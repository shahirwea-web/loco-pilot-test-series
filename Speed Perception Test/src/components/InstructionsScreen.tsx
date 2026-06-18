import { motion } from 'framer-motion';
import { BookOpen, Keyboard, ArrowRight, Train, Eye, Timer, Target } from 'lucide-react';

interface InstructionsScreenProps {
  onStart: () => void;
}

export function InstructionsScreen({ onStart }: InstructionsScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
      <div className="min-h-full py-12 px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-3">SPEED PERCEPTION TEST</h1>
            <p className="text-xl text-slate-400">Instructions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-sm">EN</span>
                </div>
                <h2 className="text-2xl font-semibold text-white">English</h2>
              </div>
              <ol className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <span>Press <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono font-bold">H</kbd> to start the locomotive.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <span>Observe the locomotive speed carefully.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <span>The locomotive will move toward a tunnel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <span>After entering the tunnel, it becomes invisible.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">5</span>
                  <span>Estimate its movement while hidden.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">6</span>
                  <span>Press <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono font-bold">L</kbd> when you believe the locomotive has completely entered the tunnel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">7</span>
                  <span>Complete all 20 rounds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-semibold">8</span>
                  <span>Your score depends on timing accuracy.</span>
                </li>
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-orange-400 font-bold text-sm">HI</span>
                </div>
                <h2 className="text-2xl font-semibold text-white">Hindi</h2>
              </div>
              <ol className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <span>इंजन शुरू करने के लिए <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono font-bold">H</kbd> दबाएँ।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <span>इंजन की गति को ध्यानपूर्वक देखें।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <span>इंजन सुरंग की ओर बढ़ेगा।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <span>सुरंग में प्रवेश करने के बाद इंजन दिखाई नहीं देगा।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">5</span>
                  <span>छिपी हुई अवस्था में उसकी गति का अनुमान लगाएँ।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">6</span>
                  <span>जब आपको लगे कि इंजन सुरंग के अंदर पहुँच गया है, तब <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono font-bold">L</kbd> दबाएँ।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">7</span>
                  <span>सभी 20 राउंड पूरे करें।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">8</span>
                  <span>आपका स्कोर अनुमान की सटीकता पर आधारित होगा।</span>
                </li>
              </ol>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 mb-12"
          >
            <div className="flex items-center justify-center gap-6 mb-6">
              <Keyboard className="w-8 h-8 text-amber-400" />
              <h3 className="text-2xl font-semibold text-white">Keyboard Controls</h3>
            </div>
            <div className="flex justify-center gap-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-4 shadow-lg shadow-emerald-500/20">
                  <span className="text-3xl font-bold text-white font-mono">H</span>
                </div>
                <p className="text-slate-300 text-lg font-medium">START LOCO</p>
                <p className="text-slate-500 text-sm">Begin locomotive movement</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl mb-4 shadow-lg shadow-red-500/20">
                  <span className="text-3xl font-bold text-white font-mono">L</span>
                </div>
                <p className="text-slate-300 text-lg font-medium">STOP LOCO</p>
                <p className="text-slate-500 text-sm">Mark tunnel entry</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: Eye, title: 'Observation', desc: 'Watch the speed carefully' },
              { icon: Timer, title: 'Estimation', desc: 'Predict hidden movement' },
              { icon: Target, title: 'Accuracy', desc: 'Stop at the right moment' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-800/30 rounded-xl p-6 text-center border border-slate-700/30">
                <Icon className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-1">{title}</h4>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-shadow"
            >
              <Train className="w-6 h-6" />
              BEGIN TEST
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <p className="mt-4 text-slate-500 text-sm">20 rounds awaiting</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
