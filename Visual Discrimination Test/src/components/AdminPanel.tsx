import React, { useState } from 'react';
import { Save, RotateCcw, Home, Settings } from 'lucide-react';
import { TestConfig, DEFAULT_CONFIG } from '../types';

interface AdminPanelProps {
  config: TestConfig;
  onUpdateConfig: (config: Partial<TestConfig>) => void;
  onClose: () => void;
}

export function AdminPanel({ config, onUpdateConfig, onClose }: AdminPanelProps) {
  const [localConfig, setLocalConfig] = useState<TestConfig>(config);

  const handleChange = (key: keyof TestConfig, value: number) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onUpdateConfig(localConfig);
    onClose();
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-slate-400">Configure test parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-6">
          {/* Test Duration */}
          <ConfigSection title="Test Duration" description="Overall test timing settings">
            <ConfigInput
              label="Test Duration (minutes)"
              value={localConfig.testDurationMinutes}
              min={5}
              max={60}
              onChange={(v) => handleChange('testDurationMinutes', v)}
            />
            <ConfigInput
              label="Response Window (ms)"
              value={localConfig.responseWindow}
              min={1000}
              max={5000}
              step={100}
              onChange={(v) => handleChange('responseWindow', v)}
            />
          </ConfigSection>

          {/* Circle Settings */}
          <ConfigSection title="Circle Settings" description="Configure color circle display">
            <div className="grid md:grid-cols-2 gap-6">
              <ConfigInput
                label="Minimum Circles"
                value={localConfig.minCircles}
                min={8}
                max={12}
                onChange={(v) => handleChange('minCircles', v)}
              />
              <ConfigInput
                label="Maximum Circles"
                value={localConfig.maxCircles}
                min={10}
                max={15}
                onChange={(v) => handleChange('maxCircles', v)}
              />
            </div>
            <ConfigInput
              label="Number of Trials"
              value={localConfig.numberOfTrials}
              min={20}
              max={200}
              onChange={(v) => handleChange('numberOfTrials', v)}
            />
          </ConfigSection>

          {/* Signal Settings */}
          <ConfigSection title="Signal Settings" description="Configure signal display timing">
            <div className="grid md:grid-cols-2 gap-6">
              <ConfigInput
                label="Signal Display Duration (ms)"
                value={localConfig.signalDisplayDuration}
                min={500}
                max={3000}
                step={100}
                onChange={(v) => handleChange('signalDisplayDuration', v)}
              />
              <ConfigInput
                label="Signal Interval Duration (ms)"
                value={localConfig.signalIntervalDuration}
                min={200}
                max={2000}
                step={100}
                onChange={(v) => handleChange('signalIntervalDuration', v)}
              />
            </div>
          </ConfigSection>

          {/* Scoring Settings */}
          <ConfigSection title="Scoring Settings" description="Configure scoring parameters">
            <ConfigInput
              label="Target Sequence Probability (%)"
              value={Math.round(localConfig.targetSequenceProbability * 100)}
              min={5}
              max={50}
              onChange={(v) => handleChange('targetSequenceProbability', v / 100)}
            />
            <ConfigInput
              label="Pass Percentage (%)"
              value={localConfig.passPercentage}
              min={50}
              max={95}
              onChange={(v) => handleChange('passPercentage', v)}
            />
          </ConfigSection>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>

        {/* Current Config Preview */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Configuration Preview</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <ConfigPreviewItem label="Test Duration" value={`${localConfig.testDurationMinutes} minutes`} />
            <ConfigPreviewItem label="Circle Range" value={`${localConfig.minCircles} - ${localConfig.maxCircles}`} />
            <ConfigPreviewItem label="Total Trials" value={localConfig.numberOfTrials.toString()} />
            <ConfigPreviewItem label="Signal Display" value={`${localConfig.signalDisplayDuration}ms`} />
            <ConfigPreviewItem label="Signal Interval" value={`${localConfig.signalIntervalDuration}ms`} />
            <ConfigPreviewItem label="Target Probability" value={`${Math.round(localConfig.targetSequenceProbability * 100)}%`} />
            <ConfigPreviewItem label="Response Window" value={`${localConfig.responseWindow}ms`} />
            <ConfigPreviewItem label="Pass Threshold" value={`${localConfig.passPercentage}%`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      <p className="text-slate-400 text-sm mb-6">{description}</p>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

function ConfigInput({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-slate-300 font-medium">{label}</label>
        <span className="text-amber-400 font-mono font-bold">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ConfigPreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <p className="text-slate-400 text-xs">{label}</p>
      <p className="text-white font-mono font-semibold">{value}</p>
    </div>
  );
}
