import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../hooks/useSound';

interface CountdownScreenProps {
  onComplete: () => void;
}

export default function CountdownScreen({ onComplete }: CountdownScreenProps) {
  const [count, setCount] = useState(3);
  const { playSound } = useSound();

  useEffect(() => {
    playSound('countdown');
    if (count <= 0) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCount((c) => c - 1);
      playSound('countdown');
    }, 1000);
    return () => clearTimeout(t);
  }, [count, onComplete, playSound]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-400 text-lg mb-8 tracking-widest uppercase"
      >
        Test starts in
      </motion.p>
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 1.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-[140px] font-black text-blue-400 leading-none select-none"
            style={{ textShadow: '0 0 60px rgba(96,165,250,0.6)' }}
          >
            {count}
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-[80px] font-black text-green-400 leading-none select-none"
            style={{ textShadow: '0 0 60px rgba(74,222,128,0.7)' }}
          >
            GO!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
