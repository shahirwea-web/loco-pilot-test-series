import React, { useState } from 'react';
import { SVG_SIZE, getDotRadius, generateGroups } from '../utils/groupGenerator';
import { ChevronRight } from 'lucide-react';

const DEMO_GROUPS = generateGroups(7, 'easy', 99);

interface Props {
  onReady: () => void;
}

const InstructionsScreen: React.FC<Props> = ({ onReady }) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'ready'>('instructions');
  const radius = getDotRadius('easy');

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-8 py-12 overflow-y-auto relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-pink-200 to-transparent rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />

      <div className="max-w-xl w-full relative z-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm border border-purple-200">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-2 px-4 font-semibold rounded-md transition-all ${
              activeTab === 'instructions'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            Instructions
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`flex-1 py-2 px-4 font-semibold rounded-md transition-all ${
              activeTab === 'ready'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            Ready to Begin
          </button>
        </div>

        {/* Instructions Tab */}
        {activeTab === 'instructions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Your Task
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                You will see a sequence of dot groups displayed in a grid. Each group contains
                between <strong>2 and 5 dots</strong>. Your task is to identify and mark all groups
                that contain <strong className="text-purple-700">EXACTLY 4 dots</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ControlCard keys={['→']} action="Move to next group" />
              <ControlCard keys={['←']} action="Move to previous group" />
              <ControlCard keys={['↑']} action="Mark current group (4 dots)" highlight />
              <ControlCard keys={['↓']} action="Unmark current group" />
            </div>

            <div className="border border-purple-300 rounded-2xl p-5 bg-white shadow-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3 text-center">
                Example — which groups have exactly 4 dots?
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                {DEMO_GROUPS.map((group) => {
                  const isTarget = group.count === 4;
                  return (
                    <div key={group.id} className="flex flex-col items-center gap-1">
                      <div
                        className={`rounded-lg border-2 shadow-sm ${
                          isTarget
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-purple-200 bg-white'
                        }`}
                        style={{ width: SVG_SIZE + 8, height: SVG_SIZE + 8 }}
                      >
                        <svg
                          width={SVG_SIZE}
                          height={SVG_SIZE}
                          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                          className="m-1"
                        >
                          {group.dots.map((dot, j) => (
                            <circle
                              key={j}
                              cx={dot.x}
                              cy={dot.y}
                              r={radius}
                              fill={isTarget ? '#ec4899' : '#111827'}
                            />
                          ))}
                        </svg>
                      </div>
                      <span className={`text-xs font-bold ${isTarget ? 'text-pink-600' : 'text-gray-400'}`}>
                        {group.count} dots{isTarget ? ' ✓' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-xs text-gray-500 mt-3">
                Groups with pink border = correct target (4 dots)
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-300 shadow-sm">
              <p className="font-semibold text-amber-900 mb-2 text-sm">Important Rules</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-amber-800">
                <li>Do not switch browser tabs or minimize the window</li>
                <li>Test cannot be paused once started</li>
                <li>Session auto-submits when the timer expires</li>
                <li>10 sessions with increasing difficulty</li>
                <li>Each session has 280-300 groups divided into 2 pages</li>
              </ul>
            </div>
          </div>
        )}

        {/* Ready Tab */}
        {activeTab === 'ready' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 shadow-md border border-purple-300 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg">
                <ChevronRight size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                Ready to Start?
              </h3>
              <p className="text-gray-700 mb-6">
                Make sure you have read all instructions and understand the task. You will have
                40 seconds per session. Stay focused and do your best!
              </p>

              <div className="bg-white rounded-lg p-4 mb-6 border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Quick Recap:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>✓ Identify groups with EXACTLY 4 dots</li>
                  <li>✓ Use arrow keys to mark/navigate</li>
                  <li>✓ 10 sessions × 40 seconds each</li>
                  <li>✓ 280-300 groups per session across 2 pages</li>
                </ul>
              </div>

              <button
                onClick={onReady}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Test Now
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ControlCardProps {
  keys: string[];
  action: string;
  highlight?: boolean;
}

const ControlCard: React.FC<ControlCardProps> = ({ keys, action, highlight }) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm ${
      highlight
        ? 'border-pink-400 bg-gradient-to-r from-pink-100 to-purple-100'
        : 'border-purple-200 bg-white'
    }`}
  >
    <div className="flex gap-1">
      {keys.map(k => (
        <kbd
          key={k}
          className={`px-2 py-1 rounded text-sm font-mono font-bold border ${
            highlight
              ? 'bg-pink-500 text-white border-pink-600'
              : 'bg-purple-100 text-purple-700 border-purple-300'
          }`}
        >
          {k}
        </kbd>
      ))}
    </div>
    <span className={`text-xs font-medium ${highlight ? 'text-pink-700' : 'text-gray-600'}`}>
      {action}
    </span>
  </div>
);

export default InstructionsScreen;
