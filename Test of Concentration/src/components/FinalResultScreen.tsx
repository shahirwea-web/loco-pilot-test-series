import React, { useEffect, useState } from 'react';
import type { TestResult } from '../types';
import { getPerformanceCategory, getCategoryColor } from '../utils/scoring';
import { Download, RefreshCw, Trophy, Target, AlertCircle, XCircle, Clock, Eye, Check, AlertTriangle } from 'lucide-react';

interface Props {
  result: TestResult;
  onRestart: () => void;
  onSave: (result: TestResult) => Promise<boolean>;
}

const FinalResultScreen: React.FC<Props> = ({ result, onRestart, onSave }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string>('');

  const catColor = getCategoryColor(result.performanceCategory);

  useEffect(() => {
    const save = async () => {
      setSaveStatus('saving');
      try {
        const success = await onSave(result);
        if (success) {
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
          setSaveError('Failed to save results');
        }
      } catch (error) {
        setSaveStatus('error');
        setSaveError(error instanceof Error ? error.message : 'Unknown error');
      }
    };
    save();
  }, [result, onSave]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathan-concentration-test-${result.testId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalTargets = result.totalCorrect + result.totalMissed;

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-y-auto relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-pink-200 to-transparent rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-purple-200 to-transparent rounded-full blur-3xl opacity-20 -ml-48 -mb-48" />

      <div className="max-w-2xl mx-auto px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg">
            <Trophy size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Test Complete
          </h1>
          <p className="text-gray-600 text-sm">
            Psychometric Test of Concentration by PATHAN
          </p>
        </div>

        {/* Save status */}
        {saveStatus === 'saving' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="animate-spin">
              <Clock size={18} className="text-blue-600" />
            </div>
            <span className="text-sm text-blue-700 font-medium">Saving your results...</span>
          </div>
        )}
        {saveStatus === 'saved' && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 shadow-sm">
            <Check size={18} className="text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">Results saved successfully</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3 shadow-sm">
            <AlertTriangle size={18} className="text-amber-600" />
            <span className="text-sm text-amber-700 font-medium">{saveError}</span>
          </div>
        )}

        {/* Overall accuracy */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-6 text-center shadow-lg border border-purple-300">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
            {result.overallAccuracy.toFixed(1)}
            <span className="text-3xl font-bold text-gray-500">%</span>
          </div>
          <div className={`text-xl font-bold ${catColor} mb-1`}>
            {result.performanceCategory}
          </div>
          <div className="text-sm text-gray-600">Overall Accuracy</div>
        </div>

        {/* Performance scale */}
        <PerformanceScale accuracy={result.overallAccuracy} />

        {/* Main stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
          <BigStat
            icon={<Eye size={20} className="text-purple-600" />}
            label="Total Groups Viewed"
            value={result.totalGroupsViewed}
            sub={`across ${result.sessions.length} sessions`}
            bg="bg-purple-50"
            border="border-purple-200"
          />
          <BigStat
            icon={<Target size={20} className="text-emerald-600" />}
            label="Correct Detections"
            value={result.totalCorrect}
            sub={`of ${totalTargets} targets`}
            bg="bg-emerald-50"
            border="border-emerald-200"
          />
          <BigStat
            icon={<AlertCircle size={20} className="text-amber-600" />}
            label="Missed Targets"
            value={result.totalMissed}
            sub="targets not marked"
            bg="bg-amber-50"
            border="border-amber-200"
          />
          <BigStat
            icon={<XCircle size={20} className="text-red-600" />}
            label="False Positives"
            value={result.totalFalsePositives}
            sub="incorrect marks"
            bg="bg-red-50"
            border="border-red-200"
          />
          <BigStat
            icon={<Clock size={20} className="text-blue-600" />}
            label="Avg Response Time"
            value={`${(result.overallAvgResponseTime / 1000).toFixed(2)}s`}
            sub="per group"
            bg="bg-blue-50"
            border="border-blue-200"
          />
          <BigStat
            icon={<AlertCircle size={20} className="text-orange-600" />}
            label="Focus Violations"
            value={result.focusViolations}
            sub="window blur events"
            bg="bg-orange-50"
            border="border-orange-200"
          />
        </div>

        {/* Session breakdown */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-purple-700 mb-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-purple-200 inline-block">
            Session Breakdown
          </h3>
          <div className="space-y-2 mt-3">
            {result.sessions.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-purple-200"
              >
                <span className="text-xs font-semibold text-purple-600 w-20">
                  Session {s.sessionNumber}
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-12 text-right">
                  {s.accuracy.toFixed(0)}%
                </span>
                <span className="text-xs text-gray-500 capitalize w-16">{s.difficulty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring formula */}
        <div className="bg-white rounded-xl p-4 mb-8 text-xs text-gray-600 shadow-sm border border-purple-200">
          <p className="font-semibold text-purple-700 mb-1">Scoring Formula</p>
          <p>Accuracy = Correct Marks / (Correct Marks + False Positives) × 100</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-purple-300 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all shadow-sm"
          >
            <Download size={16} />
            Export JSON
          </button>
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
          >
            <RefreshCw size={16} />
            Retake Test
          </button>
        </div>
      </div>
    </div>
  );
};

interface BigStatProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  bg: string;
  border: string;
}

const BigStat: React.FC<BigStatProps> = ({ icon, label, value, sub, bg, border }) => (
  <div className={`${bg} ${border} border rounded-xl p-4 shadow-sm`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </div>
    <div className="text-2xl font-black text-gray-900">{value}</div>
    <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
  </div>
);

const CATEGORIES = [
  { label: '90-100%', desc: 'Excellent', min: 90 },
  { label: '75-89%', desc: 'Very Good', min: 75 },
  { label: '60-74%', desc: 'Good', min: 60 },
  { label: '40-59%', desc: 'Average', min: 40 },
  { label: '<40%', desc: 'Needs Improvement', min: 0 },
];

const PerformanceScale: React.FC<{ accuracy: number }> = ({ accuracy }) => {
  const colors = ['#10b981', '#3b82f6', '#06b6d4', '#f59e0b', '#ef4444'];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-purple-700 mb-2">
        Performance Scale
      </p>
      <div className="flex rounded-lg overflow-hidden border-2 border-purple-300 shadow-sm">
        {CATEGORIES.map((cat, i) => {
          const isActive = accuracy >= cat.min && (i === 0 || accuracy < CATEGORIES[i - 1].min);
          return (
            <div
              key={cat.label}
              className="flex-1 py-3 text-center transition-all"
              style={{
                backgroundColor: isActive ? colors[i] : '#f3f4f6',
              }}
            >
              <div
                className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}
              >
                {cat.desc}
              </div>
              <div
                className={`text-xs ${isActive ? 'text-white opacity-90' : 'text-gray-400'}`}
              >
                {cat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinalResultScreen;
