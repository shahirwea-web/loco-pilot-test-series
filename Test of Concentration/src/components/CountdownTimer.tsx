import React, { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  totalSeconds: number;
  onExpire: () => void;
  isPaused?: boolean;
}

const CountdownTimer: React.FC<Props> = ({ totalSeconds, onExpire, isPaused = false }) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const onExpireRef = useRef(onExpire);

  // Keep ref updated with latest callback
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (isPaused) return;
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, isPaused]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const pct = (remaining / totalSeconds) * 100;

  const barColor = pct > 50 ? 'bg-emerald-500' : pct > 25 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = pct > 50 ? 'text-emerald-700' : pct > 25 ? 'text-amber-700' : 'text-red-700';

  return (
    <div className="flex flex-col items-end gap-1 min-w-[120px]">
      <div className={`flex items-center gap-1.5 font-mono text-xl font-bold ${textColor}`}>
        <Clock size={18} />
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
