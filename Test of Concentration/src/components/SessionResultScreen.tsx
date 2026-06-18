import React, { useEffect } from 'react';
import type { SessionResult } from '../types';
import { getPerformanceCategory, getCategoryColor } from '../utils/scoring';
import { CheckCircle, XCircle, AlertCircle, Clock, BarChart2 } from 'lucide-react';

interface Props {
  result: SessionResult;
  onContinue: () => void;
  isLast: boolean;
  isAutoProgressing?: boolean;
}

const SessionResultScreen: React.FC<Props> = ({ result, onContinue, isLast, isAutoProgressing }) => {
  const cat = getPerformanceCategory(result.accuracy);
  const catColor = getCategoryColor(cat);

  // Auto-progress after 3 seconds if not the last session
  useEffect(() => {
    if (isAutoProgressing && !isLast) {
      const timer = setTimeout(() => {
        onContinue();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAutoProgressing, isLast, onContinue]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-8 py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-pink-200 to-transparent rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white text-purple-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-sm border border-purple-200">
            <BarChart2 size={14} />
            Session {result.sessionNumber} Results
          </div>
          <p className={`text-lg font-semibold ${catColor}`}>{cat}</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90 drop-shadow-lg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={result.accuracy >= 75 ? '#10b981' : result.accuracy >= 60 ? '#3b82f6' : result.accuracy >= 40 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray={`${(result.accuracy / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-900">
                {result.accuracy.toFixed(0)}%
              </span>
              <span className="text-xs text-gray-400 font-medium">accuracy</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={<CheckCircle size={16} className="text-emerald-500" />}
            label="Correct"
            value={result.correctDetections}
            color="bg-emerald-50"
            border="border-emerald-200"
          />
          <StatCard
            icon={<AlertCircle size={16} className="text-amber-500" />}
            label="Missed"
            value={result.missedTargets}
            color="bg-amber-50"
            border="border-amber-200"
          />
          <StatCard
            icon={<XCircle size={16} className="text-red-500" />}
            label="False Positives"
            value={result.falsePositives}
            color="bg-red-50"
            border="border-red-200"
          />
          <StatCard
            icon={<Clock size={16} className="text-blue-500" />}
            label="Avg Time"
            value={`${(result.avgResponseTime / 1000).toFixed(2)}s`}
            color="bg-blue-50"
            border="border-blue-200"
          />
        </div>

        <div className="text-center text-xs text-gray-600 mb-4 bg-white rounded-lg p-3 border border-purple-200 shadow-sm">
          Scanned: <span className="font-semibold text-purple-700">{result.totalGroupsScanned}</span>
        </div>

        {isAutoProgressing && !isLast && (
          <div className="text-center text-xs text-purple-600 mb-4 font-semibold">
            Next session starting in 3 seconds...
          </div>
        )}

        {!isAutoProgressing || isLast ? (
          <button
            onClick={onContinue}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
          >
            {isLast ? 'View Final Results' : 'Next Session'}
          </button>
        ) : null}
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  border: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, border }) => (
  <div className={`${color} ${border} border rounded-lg p-3 flex items-start gap-2 shadow-sm`}>
    <div className="mt-0.5">{icon}</div>
    <div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-0.5">{label}</div>
    </div>
  </div>
);

export default SessionResultScreen;
