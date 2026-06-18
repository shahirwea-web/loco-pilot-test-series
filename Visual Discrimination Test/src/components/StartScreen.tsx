import React, { useState } from 'react';
import { Play, Info, Settings, Train } from 'lucide-react';
import { TestConfig } from '../types';

interface StartScreenProps {
  config: TestConfig;
  onStart: () => void;
  onShowAdmin: () => void;
}

export function StartScreen({ onStart, onShowAdmin }: StartScreenProps) {
  const [showInstructions, setShowInstructions] = useState<'en' | 'hi' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-2xl">
            <Train className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Visual Discrimination Test
          </h1>
          <p className="text-xl text-slate-400">
            CADAT-Style Psychometric Assessment for Locomotive Pilots
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Test Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Color Circle Discrimination</h3>
                  <p className="text-slate-400 text-sm">Identify when exactly 5 circles share the same color. Press L to respond.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Signal Aspect Memory</h3>
                  <p className="text-slate-400 text-sm">Memorize signal sequences. Press H when you see Yellow → Red → Green.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="grid grid-cols-4 gap-3">
                  {['bg-red-500', 'bg-green-500', 'bg-yellow-400', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-white', 'bg-cyan-400'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${color} shadow-lg`} />
                  ))}
                </div>
                <div className="absolute -right-16 top-1/2 -translate-y-1/2 rotate-12">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 shadow-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowInstructions('en')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
          >
            <Info className="w-5 h-5" />
            Instructions (English)
          </button>
          <button
            onClick={() => setShowInstructions('hi')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
          >
            <Info className="w-5 h-5" />
            निर्देश (हिंदी)
          </button>
          <button
            onClick={onShowAdmin}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            Admin Panel
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xl font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Play className="w-7 h-7" />
            Start Test
          </button>
        </div>
      </div>

      {showInstructions && (
        <InstructionsModal
          language={showInstructions}
          onClose={() => setShowInstructions(null)}
        />
      )}
    </div>
  );
}

function InstructionsModal({ language, onClose }: { language: 'en' | 'hi'; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Test Instructions' : 'परीक्षा के निर्देश'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6 text-slate-300 space-y-6">
          {language === 'en' ? (
            <>
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Stage 1: Color Circle Discrimination</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>10-12 colored circles will appear on screen</li>
                  <li>If exactly 5 circles have the same color, press <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono">L</kbd></li>
                  <li>You have 2 seconds to respond</li>
                  <li>New circles appear every 2 seconds</li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Stage 2: Signal Memory Task</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>One signal circle (Red, Yellow, or Green) appears at a time</li>
                  <li>Each signal is shown for 2 seconds, then disappears</li>
                  <li>Three signals will appear in sequence</li>
                  <li>If the sequence is <span className="text-yellow-400">Yellow</span> → <span className="text-red-400">Red</span> → <span className="text-green-400">Green</span>, press <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono">H</kbd></li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Scoring</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Correct responses increase your score</li>
                  <li>Incorrect or missed responses decrease accuracy</li>
                  <li>Reaction time is measured in milliseconds</li>
                  <li>Test duration: 30 minutes</li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Controls</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl">
                    <kbd className="px-3 py-2 bg-slate-600 rounded text-amber-400 font-mono text-lg">L</kbd>
                    <p className="mt-2 text-sm">Five same-color circles detected</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl">
                    <kbd className="px-3 py-2 bg-slate-600 rounded text-amber-400 font-mono text-lg">H</kbd>
                    <p className="mt-2 text-sm">Signal sequence Yellow → Red → Green detected</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl col-span-2">
                    <kbd className="px-3 py-2 bg-slate-600 rounded text-amber-400 font-mono text-lg">Esc</kbd>
                    <p className="mt-2 text-sm">Pause/Resume Test</p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">चरण 1: रंग वृत्त भेदभाव</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>स्क्रीन पर 10-12 रंगीन वृत्त दिखाई देंगे</li>
                  <li>यदि ठीक 5 वृत्तों का रंग समान है, तो दबाएं <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono">L</kbd></li>
                  <li>आपके पास जवाब देने के लिए 2 सेकंड हैं</li>
                  <li>हर 2 सेकंड में नए वृत्त दिखाई देंगे</li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">चरण 2: सिग्नल मेमोरी टास्क</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>एक समय में एक सिग्नल वृत्त (लाल, पीला, या हरा) दिखाई देगा</li>
                  <li>प्रत्येक सिग्नल 2 सेकंड के लिए दिखाया जाता है</li>
                  <li>क्रम में तीन सिग्नल दिखाई देंगे</li>
                  <li>यदि क्रम <span className="text-yellow-400">पीला</span> → <span className="text-red-400">लाल</span> → <span className="text-green-400">हरा</span> है, तो दबाएं <kbd className="px-2 py-1 bg-slate-700 rounded text-amber-400 font-mono">H</kbd></li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">स्कोरिंग</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>सही जवाब आपका स्कोर बढ़ाते हैं</li>
                  <li>गलत या छूटे हुए जवाब सटीकता कम करते हैं</li>
                  <li>प्रतिक्रिया समय मिलीसेकंड में मापा जाता है</li>
                  <li>परीक्षा अवधि: 30 मिनट</li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">नियंत्रण</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl">
                    <kbd className="px-3 py-2 bg-slate-600 rounded text-amber-400 font-mono text-lg">L</kbd>
                    <p className="mt-2 text-sm">पांच समान-रंग वृत्त मिले</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl">
                    <kbd className="px-3 py-2 bg-slate-600 rounded text-amber-400 font-mono text-lg">H</kbd>
                    <p className="mt-2 text-sm">सिग्नल क्रम पीला → लाल → हरा मिला</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl col-span-2">
                    <kbd className="px-3 py-2 bg-slate-600 rounded text-amber-400 font-mono text-lg">Esc</kbd>
                    <p className="mt-2 text-sm">परीक्षा रोकें/फिर से शुरू करें</p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            {language === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
}
