export type CircleColor = 'red' | 'green' | 'yellow' | 'blue' | 'orange' | 'purple' | 'white' | 'cyan';
export type SignalColor = 'red' | 'yellow' | 'green';

export interface Circle {
  id: string;
  color: CircleColor;
  x: number;
  y: number;
}

export interface Signal {
  id: string;
  color: SignalColor;
  x: number;
  y: number;
}

export interface TrialResult {
  trialNumber: number;
  timestamp: number;
  circlePattern: CircleColor[];
  hasFiveSameColor: boolean;
  signalSequence: SignalColor[];
  isTargetSequence: boolean;
  keyPressed: 'L' | 'H' | null;
  isCorrect: boolean | null;
  reactionTime: number | null;
  responseType: 'correct' | 'incorrect' | 'missed';
}

export interface TestState {
  status: 'idle' | 'instructions' | 'running' | 'paused' | 'completed';
  currentPhase: 'circles' | 'signal' | 'memory-check';
  trialNumber: number;
  remainingTime: number;
  circles: Circle[];
  currentSignal: Signal | null;
  signalHistory: SignalColor[];
  trialStartTime: number;
  results: TrialResult[];
}

export interface TestConfig {
  numberOfTrials: number;
  minCircles: number;
  maxCircles: number;
  signalDisplayDuration: number;
  signalIntervalDuration: number;
  targetSequenceProbability: number;
  passPercentage: number;
  responseWindow: number;
  testDurationMinutes: number;
}

export interface TestMetrics {
  totalTrials: number;
  correctLResponses: number;
  incorrectLResponses: number;
  correctHResponses: number;
  incorrectHResponses: number;
  missedLResponses: number;
  missedHResponses: number;
  averageReactionTime: number;
  accuracy: number;
  passed: boolean;
}

export const DEFAULT_CONFIG: TestConfig = {
  numberOfTrials: 100,
  minCircles: 10,
  maxCircles: 12,
  signalDisplayDuration: 2000,
  signalIntervalDuration: 1000,
  targetSequenceProbability: 0.2,
  passPercentage: 70,
  responseWindow: 2000,
  testDurationMinutes: 30,
};

export const CIRCLE_COLORS: CircleColor[] = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'white', 'cyan'];
export const SIGNAL_COLORS: SignalColor[] = ['red', 'yellow', 'green'];
export const TARGET_SEQUENCE: SignalColor[] = ['yellow', 'red', 'green'];
