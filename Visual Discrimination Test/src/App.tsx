import React, { useState, useCallback, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { TestScreen } from './components/TestScreen';
import { EndScreen } from './components/EndScreen';
import { PauseScreen } from './components/PauseScreen';
import { AdminPanel } from './components/AdminPanel';
import { useTestEngine } from './hooks/useTestEngine';

type AppScreen = 'start' | 'test' | 'end' | 'admin';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('start');
  const {
    state,
    config,
    metrics,
    startTest,
    pauseTest,
    endTest,
    updateConfig,
  } = useTestEngine();

  // Auto-transition to end screen when test completes
  useEffect(() => {
    if (state.status === 'completed' && currentScreen === 'test') {
      setCurrentScreen('end');
    }
  }, [state.status, currentScreen]);

  const handleStartTest = useCallback(() => {
    startTest();
    setCurrentScreen('test');
  }, [startTest]);

  const handleEndTest = useCallback(() => {
    endTest();
    setCurrentScreen('end');
  }, [endTest]);

  const handleGoHome = useCallback(() => {
    setCurrentScreen('start');
  }, []);

  const handleShowAdmin = useCallback(() => {
    setCurrentScreen('admin');
  }, []);

  const handleRestartTest = useCallback(() => {
    startTest();
    setCurrentScreen('test');
  }, [startTest]);

  return (
    <div className="min-h-screen">
      {currentScreen === 'start' && (
        <StartScreen
          config={config}
          onStart={handleStartTest}
          onShowAdmin={handleShowAdmin}
        />
      )}

      {currentScreen === 'test' && (
        <>
          <TestScreen
            state={state}
            config={config}
            onPause={pauseTest}
          />
          {state.status === 'paused' && (
            <PauseScreen
              onResume={pauseTest}
              onEnd={handleEndTest}
            />
          )}
        </>
      )}

      {currentScreen === 'end' && (
        <EndScreen
          metrics={metrics}
          results={state.results}
          config={config}
          onRestart={handleRestartTest}
          onHome={handleGoHome}
        />
      )}

      {currentScreen === 'admin' && (
        <AdminPanel
          config={config}
          onUpdateConfig={updateConfig}
          onClose={handleGoHome}
        />
      )}
    </div>
  );
}

export default App;
