import React from 'react';
import { Download, RotateCcw, Home, CheckCircle, XCircle, Clock, Target, Award, AlertTriangle, TrendingUp } from 'lucide-react';
import { TestMetrics, TrialResult, TestConfig } from '../types';

interface EndScreenProps {
  metrics: TestMetrics;
  results: TrialResult[];
  config: TestConfig;
  onRestart: () => void;
  onHome: () => void;
}

export function EndScreen({ metrics, results, config, onRestart, onHome }: EndScreenProps) {
  const downloadPDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Psychometric Test Results</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { margin: 0; color: #1a202c; }
          .header p { color: #666; margin: 5px 0 0 0; }
          .status { text-align: center; margin: 30px 0; padding: 20px; border-radius: 8px; }
          .status.passed { background: #d4edda; border: 2px solid #28a745; }
          .status.failed { background: #f8d7da; border: 2px solid #dc3545; }
          .status h2 { margin: 0; }
          .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
          .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; }
          .metric-card h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
          .metric-card .value { font-size: 32px; font-weight: bold; color: #1a202c; }
          .metric-card .unit { font-size: 14px; color: #666; }
          .details { margin-top: 40px; }
          .details h3 { border-bottom: 2px solid #333; padding-bottom: 10px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Visual Discrimination Test Results</h1>
          <p>CADAT-Style Psychometric Assessment for Locomotive Pilots</p>
          <p>Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
        </div>

        <div class="status ${metrics.passed ? 'passed' : 'failed'}">
          <h2>${metrics.passed ? 'PASSED' : 'NOT PASSED'}</h2>
          <p>Required: ${config.passPercentage}% | Achieved: ${metrics.accuracy.toFixed(1)}%</p>
        </div>

        <div class="metrics">
          <div class="metric-card">
            <h3>Total Trials</h3>
            <div class="value">${metrics.totalTrials}</div>
          </div>
          <div class="metric-card">
            <h3>Accuracy</h3>
            <div class="value">${metrics.accuracy.toFixed(1)}<span class="unit">%</span></div>
          </div>
          <div class="metric-card">
            <h3>Average Reaction Time</h3>
            <div class="value">${metrics.averageReactionTime.toFixed(0)}<span class="unit">ms</span></div>
          </div>
          <div class="metric-card">
            <h3>Correct Responses</h3>
            <div class="value">${metrics.correctLResponses + metrics.correctHResponses}</div>
          </div>
        </div>

        <div class="details">
          <h3>Detailed Breakdown</h3>
          <div class="detail-row">
            <span>Correct L Responses (5 same color)</span>
            <span>${metrics.correctLResponses}</span>
          </div>
          <div class="detail-row">
            <span>Incorrect L Responses</span>
            <span>${metrics.incorrectLResponses}</span>
          </div>
          <div class="detail-row">
            <span>Missed L Responses</span>
            <span>${metrics.missedLResponses}</span>
          </div>
          <div class="detail-row">
            <span>Correct H Responses (Signal sequence)</span>
            <span>${metrics.correctHResponses}</span>
          </div>
          <div class="detail-row">
            <span>Incorrect H Responses</span>
            <span>${metrics.incorrectHResponses}</span>
          </div>
          <div class="detail-row">
            <span>Missed H Responses</span>
            <span>${metrics.missedHResponses}</span>
          </div>
        </div>

        <div class="footer">
          <p>This test was conducted using the CADAT-style Visual Discrimination Test</p>
          <p>Test Configuration: ${config.numberOfTrials} trials | ${config.testDurationMinutes} minutes | Pass: ${config.passPercentage}%</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const downloadCSV = () => {
    const headers = ['Trial', 'Timestamp', 'Has 5 Same Color', 'Is Target Sequence', 'Key Pressed', 'Correct', 'Reaction Time (ms)', 'Response Type'];
    const rows = results.map(r => [
      r.trialNumber,
      new Date(r.timestamp).toISOString(),
      r.hasFiveSameColor ? 'Yes' : 'No',
      r.isTargetSequence ? 'Yes' : 'No',
      r.keyPressed || 'None',
      r.isCorrect === null ? 'N/A' : r.isCorrect ? 'Yes' : 'No',
      r.reactionTime ? r.reactionTime.toFixed(0) : 'N/A',
      r.responseType,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psychometric-test-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Test Completed</h1>
          <p className="text-xl text-slate-400">
            Your results are ready
          </p>
        </div>

        {/* Status Card */}
        <div className={`mb-8 p-8 rounded-2xl border-2 ${
          metrics.passed
            ? 'bg-green-500/10 border-green-500'
            : 'bg-red-500/10 border-red-500'
        }`}>
          <div className="flex items-center justify-center gap-4">
            {metrics.passed ? (
              <CheckCircle className="w-12 h-12 text-green-400" />
            ) : (
              <XCircle className="w-12 h-12 text-red-400" />
            )}
            <div className="text-center">
              <h2 className={`text-4xl font-bold ${metrics.passed ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.passed ? 'PASSED' : 'NOT PASSED'}
              </h2>
              <p className="text-slate-400 mt-2">
                Required: {config.passPercentage}% | Achieved: {metrics.accuracy.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<Target className="w-6 h-6" />}
            label="Total Trials"
            value={metrics.totalTrials.toString()}
            color="blue"
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Accuracy"
            value={`${metrics.accuracy.toFixed(1)}%`}
            color={metrics.accuracy >= config.passPercentage ? 'green' : 'red'}
          />
          <MetricCard
            icon={<Clock className="w-6 h-6" />}
            label="Avg Reaction Time"
            value={`${metrics.averageReactionTime.toFixed(0)}ms`}
            color="amber"
          />
          <MetricCard
            icon={<Award className="w-6 h-6" />}
            label="Correct"
            value={(metrics.correctLResponses + metrics.correctHResponses).toString()}
            color="green"
          />
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Detailed Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Circle Task */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-amber-400">Circle Detection (L Key)</h4>
              <div className="space-y-2">
                <DetailRow label="Correct Responses" value={metrics.correctLResponses} type="success" />
                <DetailRow label="Incorrect Responses" value={metrics.incorrectLResponses} type="error" />
                <DetailRow label="Missed Responses" value={metrics.missedLResponses} type="warning" />
              </div>
            </div>

            {/* Signal Task */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-blue-400">Signal Memory (H Key)</h4>
              <div className="space-y-2">
                <DetailRow label="Correct Responses" value={metrics.correctHResponses} type="success" />
                <DetailRow label="Incorrect Responses" value={metrics.incorrectHResponses} type="error" />
                <DetailRow label="Missed Responses" value={metrics.missedHResponses} type="warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Test
          </button>
          <button
            onClick={onHome}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: 'blue' | 'green' | 'red' | 'amber' }) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    red: 'text-red-400 bg-red-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, type }: { label: string; value: number; type: 'success' | 'error' | 'warning' }) {
  const typeClasses = {
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <div className="flex items-center justify-between bg-slate-700/50 rounded-lg px-4 py-3">
      <span className="text-slate-300">{label}</span>
      <span className={`font-bold px-3 py-1 rounded-lg ${typeClasses[type]}`}>
        {value}
      </span>
    </div>
  );
}
