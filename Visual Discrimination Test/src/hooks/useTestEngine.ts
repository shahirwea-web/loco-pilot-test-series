import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Circle,
  Signal,
  TrialResult,
  TestState,
  TestConfig,
  TestMetrics,
  CircleColor,
  SignalColor,
  DEFAULT_CONFIG,
  CIRCLE_COLORS,
  SIGNAL_COLORS,
  TARGET_SEQUENCE,
} from '../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateCircles(config: TestConfig): Circle[] {
  const count = getRandomInt(config.minCircles, config.maxCircles);
  const circles: Circle[] = [];

  // Spread circles across the entire screen (5% to 95% for x and y)
  const minMargin = 5;
  const maxRange = 90; // 95 - 5

  // Generate positions ensuring minimum distance between circles
  const positions: { x: number; y: number }[] = [];
  const minDistance = 8; // Minimum percentage distance between circles

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let x, y;
    let validPosition = false;

    while (!validPosition && attempts < 100) {
      x = minMargin + Math.random() * maxRange;
      y = minMargin + Math.random() * maxRange;

      // Check distance from all existing positions
      validPosition = positions.every(pos => {
        const dx = Math.abs(pos.x - x);
        const dy = Math.abs(pos.y - y);
        return Math.sqrt(dx * dx + dy * dy) >= minDistance;
      });

      if (validPosition) {
        positions.push({ x, y });
      }
      attempts++;
    }

    // If we couldn't find a valid position, place it randomly
    if (attempts >= 100 && positions.length < count) {
      positions.push({
        x: minMargin + Math.random() * maxRange,
        y: minMargin + Math.random() * maxRange,
      });
    }
  }

  const shouldHaveFiveSame = Math.random() < 0.5;
  let colors: CircleColor[];

  if (shouldHaveFiveSame) {
    const targetColor = CIRCLE_COLORS[getRandomInt(0, CIRCLE_COLORS.length - 1)];
    colors = Array(5).fill(targetColor);

    const remainingCount = count - 5;
    const otherColors = CIRCLE_COLORS.filter(c => c !== targetColor);
    for (let i = 0; i < remainingCount; i++) {
      colors.push(otherColors[getRandomInt(0, otherColors.length - 1)]);
    }
  } else {
    const colorCounts: Record<CircleColor, number> = {} as Record<CircleColor, number>;
    CIRCLE_COLORS.forEach(c => colorCounts[c] = 0);

    colors = [];
    for (let i = 0; i < count; i++) {
      let color: CircleColor;
      let attempts = 0;
      do {
        color = CIRCLE_COLORS[getRandomInt(0, CIRCLE_COLORS.length - 1)];
        attempts++;
      } while (colorCounts[color] >= 4 && attempts < 50);
      colors.push(color);
      colorCounts[color]++;
    }
  }

  colors = shuffleArray(colors);

  for (let i = 0; i < count; i++) {
    circles.push({
      id: generateId(),
      color: colors[i],
      x: positions[i].x,
      y: positions[i].y,
    });
  }

  return circles;
}

function hasFiveSameColor(circles: Circle[]): boolean {
  const colorCounts: Record<CircleColor, number> = {} as Record<CircleColor, number>;
  CIRCLE_COLORS.forEach(c => colorCounts[c] = 0);
  circles.forEach(c => colorCounts[c.color]++);
  return Object.values(colorCounts).some(count => count === 5);
}

function generateSignalSequence(config: TestConfig): SignalColor[] {
  const isTarget = Math.random() < config.targetSequenceProbability;

  if (isTarget) {
    return [...TARGET_SEQUENCE];
  }

  const sequence: SignalColor[] = [];
  for (let i = 0; i < 3; i++) {
    const color = SIGNAL_COLORS[getRandomInt(0, SIGNAL_COLORS.length - 1)];
    sequence.push(color);
  }

  // Ensure it's not accidentally the target sequence
  if (sequence[0] === 'yellow' && sequence[1] === 'red' && sequence[2] === 'green') {
    const idx = getRandomInt(0, 2);
    const otherColors = SIGNAL_COLORS.filter(c => c !== sequence[idx]);
    sequence[idx] = otherColors[getRandomInt(0, otherColors.length - 1)];
  }

  return sequence;
}

function isTargetSequence(sequence: SignalColor[]): boolean {
  if (sequence.length !== 3) return false;
  return (
    sequence[0] === TARGET_SEQUENCE[0] &&
    sequence[1] === TARGET_SEQUENCE[1] &&
    sequence[2] === TARGET_SEQUENCE[2]
  );
}

function calculateMetrics(results: TrialResult[], _config: TestConfig): TestMetrics {
  const totalTrials = results.length;
  let correctLResponses = 0;
  let incorrectLResponses = 0;
  let correctHResponses = 0;
  let incorrectHResponses = 0;
  let missedLResponses = 0;
  let missedHResponses = 0;
  let totalReactionTime = 0;
  let reactionTimeCount = 0;

  results.forEach(result => {
    // Circle task responses
    if (result.hasFiveSameColor) {
      if (result.keyPressed === 'L' && result.circleResponseCorrect) {
        correctLResponses++;
        if (result.reactionTimeL) {
          totalReactionTime += result.reactionTimeL;
          reactionTimeCount++;
        }
      } else if (result.keyPressed === 'L' && !result.circleResponseCorrect) {
        incorrectLResponses++;
      } else if (result.circleResponseCorrect === false || result.keyPressed === null) {
        missedLResponses++;
      }
    }

    // Signal task responses
    if (result.isTargetSequence) {
      if (result.signalResponseCorrect === true) {
        correctHResponses++;
        if (result.reactionTimeH) {
          totalReactionTime += result.reactionTimeH;
          reactionTimeCount++;
        }
      } else if (result.signalResponseCorrect === false) {
        incorrectHResponses++;
      } else if (result.signalResponseCorrect === null && result.signalSequence?.length === 3) {
        missedHResponses++;
      }
    }
  });

  const correctResponses = correctLResponses + correctHResponses;
  const totalOpportunities = results.filter(r => r.hasFiveSameColor).length +
    results.filter(r => r.isTargetSequence).length;
  const totalErrors = incorrectLResponses + incorrectHResponses + missedLResponses + missedHResponses;

  const accuracy = totalOpportunities > 0
    ? (correctResponses / (correctResponses + totalErrors)) * 100
    : 0;

  const averageReactionTime = reactionTimeCount > 0 ? totalReactionTime / reactionTimeCount : 0;
  const passed = accuracy >= _config.passPercentage;

  return {
    totalTrials,
    correctLResponses,
    incorrectLResponses,
    correctHResponses,
    incorrectHResponses,
    missedLResponses,
    missedHResponses,
    averageReactionTime,
    accuracy,
    passed,
  };
}

// Extend TrialResult to track both responses
interface ExtendedTrialResult extends TrialResult {
  circleResponseCorrect?: boolean | null;
  signalResponseCorrect?: boolean | null;
  reactionTimeL?: number | null;
  reactionTimeH?: number | null;
}

export function useTestEngine() {
  const [config, setConfig] = useState<TestConfig>(() => {
    const saved = localStorage.getItem('psychometric-test-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [state, setState] = useState<TestState>({
    status: 'idle',
    currentPhase: 'circles',
    trialNumber: 0,
    remainingTime: config.testDurationMinutes * 60,
    circles: [],
    currentSignal: null,
    signalHistory: [],
    trialStartTime: 0,
    results: [],
  });

  const countdownTimerRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);
  const trialDataRef = useRef<{
    circles: Circle[];
    signalSequence: SignalColor[];
    signalIndex: number;
    signalHistory: SignalColor[];
    circleResponded: boolean;
    signalResponded: boolean;
    startTime: number;
    circleResponseCorrect: boolean | null;
    reactionTimeL: number | null;
  }>({
    circles: [],
    signalSequence: [],
    signalIndex: 0,
    signalHistory: [],
    circleResponded: false,
    signalResponded: false,
    startTime: 0,
    circleResponseCorrect: null,
    reactionTimeL: null,
  });

  const clearTimers = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  // Start a new trial
  const startNewTrial = useCallback(() => {
    const circles = generateCircles(config);
    const signalSequence = generateSignalSequence(config);

    trialDataRef.current = {
      circles,
      signalSequence,
      signalIndex: 0,
      signalHistory: [],
      circleResponded: false,
      signalResponded: false,
      startTime: performance.now(),
      circleResponseCorrect: null,
      reactionTimeL: null,
    };

    setState(prev => ({
      ...prev,
      currentPhase: 'circles',
      circles,
      currentSignal: null,
      signalHistory: [],
      trialStartTime: performance.now(),
      trialNumber: prev.trialNumber + 1,
    }));

    // After 2 seconds, move to signal phase (regardless of response)
    phaseTimerRef.current = window.setTimeout(() => {
      startSignalPhase();
    }, config.responseWindow);
  }, [config]);

  // Start signal phase - automatically proceed after 2 seconds
  const startSignalPhase = useCallback(() => {
    // If user didn't respond to circles and there were 5 same color, it's a missed response
    if (!trialDataRef.current.circleResponded && hasFiveSameColor(trialDataRef.current.circles)) {
      trialDataRef.current.circleResponseCorrect = false;
    }

    showNextSignal();
  }, []);

  // Show next signal
  const showNextSignal = useCallback(() => {
    const { signalSequence, signalIndex, signalHistory } = trialDataRef.current;

    if (signalIndex >= 3) {
      // All signals shown, go to memory check
      startMemoryCheckPhase();
      return;
    }

    const color = signalSequence[signalIndex];
    trialDataRef.current.signalHistory = [...signalHistory, color];

    const signal: Signal = {
      id: generateId(),
      color,
      x: getRandomInt(25, 75),
      y: getRandomInt(25, 75),
    };

    setState(prev => ({
      ...prev,
      currentPhase: 'signal',
      currentSignal: signal,
      signalHistory: [...trialDataRef.current.signalHistory],
    }));

    trialDataRef.current.signalIndex++;

    // Hide signal after display duration
    phaseTimerRef.current = window.setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentSignal: null,
      }));

      // Gap before next signal
      phaseTimerRef.current = window.setTimeout(() => {
        showNextSignal();
      }, config.signalIntervalDuration);
    }, config.signalDisplayDuration);
  }, [config]);

  // Start memory check phase
  const startMemoryCheckPhase = useCallback(() => {
    trialDataRef.current.startTime = performance.now();

    setState(prev => ({
      ...prev,
      currentPhase: 'memory-check',
      currentSignal: null,
      signalHistory: [...trialDataRef.current.signalHistory],
      trialStartTime: performance.now(),
    }));

    // After response window, end trial
    phaseTimerRef.current = window.setTimeout(() => {
      endTrial();
    }, config.responseWindow);
  }, [config]);

  // End trial and record result
  const endTrial = useCallback(() => {
    const data = trialDataRef.current;
    const isFiveSame = hasFiveSameColor(data.circles);
    const isTarget = isTargetSequence(data.signalHistory);

    // Determine H response correctness
    let signalResponseCorrect: boolean | null = null;
    if (data.signalResponded) {
      signalResponseCorrect = isTarget; // H was pressed, correct if target
    }

    const result: ExtendedTrialResult = {
      trialNumber: state.trialNumber,
      timestamp: Date.now(),
      circlePattern: data.circles.map(c => c.color),
      hasFiveSameColor: isFiveSame,
      signalSequence: data.signalSequence,
      isTargetSequence: isTarget,
      keyPressed: data.circleResponded ? 'L' : data.signalResponded ? 'H' : null,
      isCorrect: data.circleResponseCorrect ?? signalResponseCorrect,
      responseType: (data.circleResponseCorrect === true || signalResponseCorrect === true) ? 'correct' :
        (data.circleResponded || data.signalResponded) ? 'incorrect' : 'missed',
      circleResponseCorrect: data.circleResponseCorrect,
      signalResponseCorrect,
      reactionTimeL: data.reactionTimeL,
      reactionTimeH: data.signalResponded ? performance.now() - data.startTime : null,
    };

    setState(prev => ({
      ...prev,
      results: [...prev.results, result as TrialResult],
    }));

    // Small delay before next trial
    setTimeout(() => {
      startNewTrial();
    }, 300);
  }, [state.trialNumber, startNewTrial]);

  // Handle key press
  const handleKeyPress = useCallback((key: 'L' | 'H') => {
    const data = trialDataRef.current;

    // L key during circle phase - record response but DON'T advance to next phase
    // The test automatically advances after 2 seconds regardless
    if (key === 'L' && state.currentPhase === 'circles' && !data.circleResponded) {
      const now = performance.now();
      const reactionTime = now - data.startTime;
      const isFiveSame = hasFiveSameColor(data.circles);

      data.circleResponded = true;
      data.circleResponseCorrect = isFiveSame;
      data.reactionTimeL = reactionTime;
      // Don't change phase timer - let it proceed automatically after 2 seconds
    }

    // Allow L key during signal phase too (in case user didn't respond in time)
    if (key === 'L' && state.currentPhase === 'signal' && !data.circleResponded) {
      const now = performance.now();
      const reactionTime = now - data.startTime;
      const isFiveSame = hasFiveSameColor(data.circles);

      data.circleResponded = true;
      data.circleResponseCorrect = isFiveSame;
      data.reactionTimeL = reactionTime;
    }

    if (key === 'H' && state.currentPhase === 'memory-check' && !data.signalResponded) {
      data.signalResponded = true;

      // End trial immediately
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }
      endTrial();
    }
  }, [state.currentPhase, endTrial]);

  // Start the test
  const startTest = useCallback(() => {
    clearTimers();

    trialDataRef.current = {
      circles: [],
      signalSequence: [],
      signalIndex: 0,
      signalHistory: [],
      circleResponded: false,
      signalResponded: false,
      startTime: 0,
      circleResponseCorrect: null,
      reactionTimeL: null,
    };

    setState({
      status: 'running',
      currentPhase: 'circles',
      trialNumber: 0,
      remainingTime: config.testDurationMinutes * 60,
      circles: [],
      currentSignal: null,
      signalHistory: [],
      trialStartTime: 0,
      results: [],
    });

    // Start countdown timer
    countdownTimerRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.remainingTime <= 1) {
          clearTimers();
          return {
            ...prev,
            remainingTime: 0,
            status: 'completed',
          };
        }
        return {
          ...prev,
          remainingTime: prev.remainingTime - 1,
        };
      });
    }, 1000);

    // Start first trial
    setTimeout(() => {
      startNewTrial();
    }, 500);
  }, [config, clearTimers, startNewTrial]);

  // Pause/resume test
  const pauseTest = useCallback(() => {
    setState(prev => {
      if (prev.status === 'running') {
        clearTimers();
        return { ...prev, status: 'paused' };
      } else if (prev.status === 'paused') {
        // Resume countdown
        countdownTimerRef.current = window.setInterval(() => {
          setState(p => {
            if (p.remainingTime <= 1) {
              clearTimers();
              return { ...p, remainingTime: 0, status: 'completed' };
            }
            return { ...p, remainingTime: p.remainingTime - 1 };
          });
        }, 1000);
        return { ...prev, status: 'running' };
      }
      return prev;
    });
  }, [clearTimers]);

  // End test
  const endTest = useCallback(() => {
    clearTimers();
    setState(prev => ({
      ...prev,
      status: 'completed',
    }));
  }, [clearTimers]);

  // Update config
  const updateConfig = useCallback((newConfig: Partial<TestConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('psychometric-test-config', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        pauseTest();
        return;
      }

      if (state.status !== 'running') return;

      const key = event.key.toUpperCase();
      if (key === 'L' || key === 'H') {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, handleKeyPress, pauseTest]);

  // Cleanup
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const metrics = calculateMetrics(state.results, config);

  return {
    state,
    config,
    metrics,
    startTest,
    pauseTest,
    endTest,
    updateConfig,
    hasFiveSameColor: trialDataRef.current.circles.length > 0
      ? hasFiveSameColor(trialDataRef.current.circles)
      : false,
    isTargetSequence: trialDataRef.current.signalHistory.length === 3
      ? isTargetSequence(trialDataRef.current.signalHistory)
      : false,
  };
}

export { hasFiveSameColor, isTargetSequence };
