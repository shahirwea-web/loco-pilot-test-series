export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DotPosition {
  x: number;
  y: number;
}

export interface DotGroup {
  id: string;
  dots: DotPosition[];
  count: number;
  isTarget: boolean;
}

export interface GroupResponse {
  groupId: string;
  marked: boolean;
  isTarget: boolean;
  responseTime: number;
  timestamp: number;
}

export interface SessionResult {
  sessionNumber: number;
  difficulty: Difficulty;
  groups: DotGroup[];
  responses: GroupResponse[];
  correctDetections: number;
  missedTargets: number;
  falsePositives: number;
  accuracy: number;
  avgResponseTime: number;
  totalGroupsScanned: number;
  duration: number;
  page?: number;
}

export interface TestResult {
  testId: string;
  startTime: number;
  endTime: number;
  sessions: SessionResult[];
  totalCorrect: number;
  totalMissed: number;
  totalFalsePositives: number;
  overallAccuracy: number;
  overallAvgResponseTime: number;
  totalGroupsViewed: number;
  performanceCategory: string;
  focusViolations: number;
}

export type TestPhase =
  | 'welcome'
  | 'instructions'
  | 'pre-session'
  | 'testing'
  | 'session-result'
  | 'final-result';
