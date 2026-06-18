import { motion } from 'framer-motion';

export type SignalColor = 'red' | 'yellow' | 'green' | null;

interface RailwaySignalProps {
  activeColor: SignalColor;
}

const COLORS = {
  red: { on: '#ef4444', glow: 'rgba(239,68,68,0.8)', off: '#3f1212' },
  yellow: { on: '#eab308', glow: 'rgba(234,179,8,0.8)', off: '#3d2e00' },
  green: { on: '#22c55e', glow: 'rgba(34,197,94,0.8)', off: '#0a2e14' },
};

function Light({
  color,
  active,
}: {
  color: 'red' | 'yellow' | 'green';
  active: boolean;
}) {
  const c = COLORS[color];
  return (
    <div className="relative flex items-center justify-center">
      {active && (
        <motion.div
          className="absolute rounded-full"
          style={{ width: 72, height: 72, background: c.glow }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <motion.div
        className="relative z-10 rounded-full border-4"
        style={{
          width: 52,
          height: 52,
          backgroundColor: active ? c.on : c.off,
          borderColor: active ? c.on : '#1a1a2e',
          boxShadow: active ? `0 0 30px 8px ${c.glow}` : 'none',
        }}
        animate={
          active
            ? { boxShadow: [`0 0 20px 6px ${c.glow}`, `0 0 40px 14px ${c.glow}`, `0 0 20px 6px ${c.glow}`] }
            : { boxShadow: 'none' }
        }
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Lens shine */}
        <div
          className="absolute top-2 left-2 w-4 h-4 rounded-full opacity-40"
          style={{ background: 'white' }}
        />
      </motion.div>
    </div>
  );
}

export default function RailwaySignal({ activeColor }: RailwaySignalProps) {
  return (
    <div className="flex flex-col items-center select-none">
      {/* Signal head housing */}
      <motion.div
        className="relative"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Main housing box */}
        <div
          className="relative rounded-2xl overflow-hidden border-2 border-gray-600"
          style={{
            background: 'linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%)',
            padding: '20px 18px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
            width: 110,
          }}
        >
          {/* Rivets */}
          {[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([rx, ry], i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gray-600 border border-gray-500"
              style={{ top: `calc(50% + ${ry * 8}px)`, left: `calc(50% + ${rx * 7}px)` }}
            />
          ))}

          {/* Signal lights */}
          <div className="flex flex-col gap-4 items-center relative z-10">
            <Light color="red" active={activeColor === 'red'} />
            <Light color="yellow" active={activeColor === 'yellow'} />
            <Light color="green" active={activeColor === 'green'} />
          </div>

          {/* Brand plate */}
          <div className="mt-3 text-center">
            <span
              className="text-gray-600 text-[9px] font-mono tracking-widest"
              style={{ fontFamily: 'monospace' }}
            >
              SIG-RLY-CRT
            </span>
          </div>
        </div>

        {/* Bracket arm */}
        <div
          className="absolute -right-8 top-1/2 -translate-y-1/2 h-4 w-8 rounded-r-sm"
          style={{ background: 'linear-gradient(90deg, #374151, #1f2937)' }}
        />
      </motion.div>

      {/* Post */}
      <div
        className="w-5 rounded-sm"
        style={{
          height: 100,
          background: 'linear-gradient(90deg, #4b5563 0%, #1f2937 40%, #374151 100%)',
        }}
      />

      {/* Base plate */}
      <div
        className="rounded-sm"
        style={{
          width: 60,
          height: 14,
          background: 'linear-gradient(180deg, #374151 0%, #111827 100%)',
        }}
      />

      {/* Ground bolts */}
      <div className="flex gap-8 mt-1">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-gray-700 border border-gray-600"
          />
        ))}
      </div>
    </div>
  );
}
