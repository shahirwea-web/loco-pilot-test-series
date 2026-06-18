import React from 'react';
import { Answer } from '../types';
import { Download, RotateCcw, Award, Clock, Target, TrendingUp, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

interface ResultsScreenProps {
  answers: Answer[];
  totalQuestions: number;
  onRestart: () => void;
}

function getRating(accuracy: number): { label: string; color: string; bg: string } {
  if (accuracy >= 90) return { label: 'Excellent', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
  if (accuracy >= 75) return { label: 'Very Good', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' };
  if (accuracy >= 60) return { label: 'Good', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' };
  if (accuracy >= 40) return { label: 'Average', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
  return { label: 'Needs Improvement', color: 'text-red-700', bg: 'bg-red-50 border-red-200' };
}

function formatMs(ms: number): string {
  if (ms <= 0 || !isFinite(ms)) return '—';
  return `${(ms / 1000).toFixed(2)}s`;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ answers, totalQuestions, onRestart }) => {
  const correct = answers.filter((a) => a.correct).length;
  const incorrect = answers.filter((a) => !a.correct && a.selectedIndex !== null).length;
  const unanswered = answers.filter((a) => a.selectedIndex === null).length;
  const accuracy = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

  const responseTimes = answers
    .filter((a) => a.selectedIndex !== null && a.responseTime > 0)
    .map((a) => a.responseTime);

  const avgResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((s, v) => s + v, 0) / responseTimes.length
      : 0;
  const fastestResponse = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
  const slowestResponse = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

  const rating = getRating(accuracy);

  const handleExport = () => {
    const data = {
      testName: 'PATHAN Form Perception Test',
      date: new Date().toISOString(),
      summary: {
        totalQuestions,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        unanswered,
        accuracy: parseFloat(accuracy.toFixed(2)),
        averageResponseTimeMs: parseFloat(avgResponseTime.toFixed(0)),
        fastestResponseMs: fastestResponse,
        slowestResponseMs: slowestResponse,
        rating: rating.label,
      },
      answers: answers.map((a) => ({
        questionId: a.questionId,
        selectedOption: a.selectedIndex !== null ? a.selectedIndex + 1 : null,
        correct: a.correct,
        responseTimeMs: a.responseTime,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathan-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start px-4 py-10">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-xl mb-4">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Test Complete</h1>
          <p className="text-slate-500 text-sm mt-1">PATHAN Form Perception Assessment</p>
        </div>

        {/* Score ring + rating */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative flex-shrink-0">
            <svg width="128" height="128" className="-rotate-90">
              <circle cx="64" cy="64" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{accuracy.toFixed(0)}%</span>
              <span className="text-xs text-slate-500">Accuracy</span>
            </div>
          </div>

          <div className={`flex-1 border rounded-xl p-5 ${rating.bg}`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
              Performance Rating
            </p>
            <p className={`text-3xl font-bold ${rating.color} mb-2`}>{rating.label}</p>
            <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-current rounded-full transition-all duration-1000"
                style={{ width: `${accuracy}%`, opacity: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Target className="w-4 h-4 text-slate-600" />}
            label="Total Questions"
            value={totalQuestions}
            bg="bg-slate-50"
          />
          <StatCard
            icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
            label="Correct"
            value={correct}
            bg="bg-emerald-50"
            valueColor="text-emerald-700"
          />
          <StatCard
            icon={<XCircle className="w-4 h-4 text-red-500" />}
            label="Incorrect"
            value={incorrect}
            bg="bg-red-50"
            valueColor="text-red-600"
          />
          <StatCard
            icon={<MinusCircle className="w-4 h-4 text-amber-500" />}
            label="Unanswered"
            value={unanswered}
            bg="bg-amber-50"
            valueColor="text-amber-600"
          />
          <StatCard
            icon={<Clock className="w-4 h-4 text-blue-600" />}
            label="Avg Response"
            value={formatMs(avgResponseTime)}
            bg="bg-blue-50"
            valueColor="text-blue-700"
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4 text-sky-600" />}
            label="Fastest"
            value={formatMs(fastestResponse)}
            bg="bg-sky-50"
            valueColor="text-sky-700"
          />
        </div>

        {/* Response time detail */}
        {responseTimes.length > 0 && (
          <div className="border border-slate-200 rounded-xl p-5 mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Response Time Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-slate-900">{formatMs(fastestResponse)}</p>
                <p className="text-xs text-slate-500 mt-0.5">Fastest</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{formatMs(avgResponseTime)}</p>
                <p className="text-xs text-slate-500 mt-0.5">Average</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{formatMs(slowestResponse)}</p>
                <p className="text-xs text-slate-500 mt-0.5">Slowest</p>
              </div>
            </div>
          </div>
        )}

        {/* Rating scale reference */}
        <div className="border border-slate-200 rounded-xl p-5 mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Performance Scale
          </h3>
          <div className="space-y-2">
            {[
              { range: '90–100%', label: 'Excellent', color: 'bg-emerald-500' },
              { range: '75–89%', label: 'Very Good', color: 'bg-blue-500' },
              { range: '60–74%', label: 'Good', color: 'bg-sky-400' },
              { range: '40–59%', label: 'Average', color: 'bg-amber-400' },
              { range: 'Below 40%', label: 'Needs Improvement', color: 'bg-red-400' },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${r.color}`} />
                <span className="text-xs font-semibold text-slate-700 w-28">{r.range}</span>
                <span className="text-xs text-slate-500">{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl text-base transition-colors duration-150"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Test
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-600 font-medium py-4 rounded-xl text-sm transition-colors duration-150"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg?: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  bg = 'bg-slate-50',
  valueColor = 'text-slate-900',
}) => (
  <div className={`${bg} rounded-xl p-4`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </div>
    <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
  </div>
);

export default ResultsScreen;
