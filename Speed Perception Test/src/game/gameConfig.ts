export type SpeedLevel = 'very-slow' | 'slow' | 'medium' | 'fast' | 'very-fast';
export type TunnelLength = 'short' | 'medium' | 'long' | 'extra-long';
export type TravelDirection = 'left-to-right' | 'right-to-left';
export type PerformanceLabel = 'Perfect' | 'Excellent' | 'Good' | 'Average' | 'Poor';

export interface RoundConfig {
  speedLevel: SpeedLevel;
  tunnelLength: TunnelLength;
  direction: TravelDirection;
  speed: number;
  tunnelWidth: number;
}

export interface RoundResult {
  roundNumber: number;
  speedLevel: SpeedLevel;
  tunnelLength: TunnelLength;
  direction: TravelDirection;
  actualExitTime: number;
  userStopTime: number;
  timingError: number;
  roundScore: number;
  performanceLabel: PerformanceLabel;
}

export interface GameResult {
  totalScore: number;
  maxScore: number;
  accuracyPercentage: number;
  averageError: number;
  bestRound: RoundResult | null;
  worstRound: RoundResult | null;
  perfectCount: number;
  excellentCount: number;
  goodCount: number;
  averageCount: number;
  poorCount: number;
}

export const SPEED_CONFIG: Record<SpeedLevel, number> = {
  'very-slow': 150,
  'slow': 210,
  'medium': 290,
  'fast': 370,
  'very-fast': 460,
};

export const TUNNEL_CONFIG: Record<TunnelLength, number> = {
  'short': 100,
  'medium': 160,
  'long': 220,
  'extra-long': 280,
};

export const SCORE_CONFIG = {
  perfect: { maxError: 150, points: 100 },
  excellent: { maxError: 300, points: 80 },
  good: { maxError: 500, points: 60 },
  average: { maxError: 800, points: 40 },
  poor: { maxError: 1200, points: 20 },
};

export const TOTAL_ROUNDS = 20;
export const LOCOMOTIVE_WIDTH = 90;
export const LOCOMOTIVE_HEIGHT = 44;
export const TUNNEL_HEIGHT = 160;
export const SIDE_MARGIN = 20;

export function getRandomSpeedLevel(): SpeedLevel {
  const levels: SpeedLevel[] = ['very-slow', 'slow', 'medium', 'fast', 'very-fast'];
  return levels[Math.floor(Math.random() * levels.length)];
}

export function getRandomTunnelLength(): TunnelLength {
  const lengths: TunnelLength[] = ['short', 'medium', 'long', 'extra-long'];
  return lengths[Math.floor(Math.random() * lengths.length)];
}

export function getRandomDirection(): TravelDirection {
  return Math.random() < 0.5 ? 'left-to-right' : 'right-to-left';
}

export function generateRoundConfig(): RoundConfig {
  const speedLevel = getRandomSpeedLevel();
  const tunnelLength = getRandomTunnelLength();
  const direction = getRandomDirection();
  return {
    speedLevel,
    tunnelLength,
    direction,
    speed: SPEED_CONFIG[speedLevel],
    tunnelWidth: TUNNEL_CONFIG[tunnelLength],
  };
}

export function calculateScore(timingError: number): { points: number; label: PerformanceLabel } {
  if (timingError <= SCORE_CONFIG.perfect.maxError) {
    return { points: SCORE_CONFIG.perfect.points, label: 'Perfect' };
  } else if (timingError <= SCORE_CONFIG.excellent.maxError) {
    return { points: SCORE_CONFIG.excellent.points, label: 'Excellent' };
  } else if (timingError <= SCORE_CONFIG.good.maxError) {
    return { points: SCORE_CONFIG.good.points, label: 'Good' };
  } else if (timingError <= SCORE_CONFIG.average.maxError) {
    return { points: SCORE_CONFIG.average.points, label: 'Average' };
  } else if (timingError <= SCORE_CONFIG.poor.maxError) {
    return { points: SCORE_CONFIG.poor.points, label: 'Poor' };
  }
  return { points: 0, label: 'Poor' };
}

export function getPerformanceRating(percentage: number): string {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 75) return 'Good';
  if (percentage >= 60) return 'Average';
  return 'Needs Improvement';
}

export function generateAllRounds(): RoundConfig[] {
  return Array.from({ length: TOTAL_ROUNDS }, () => generateRoundConfig());
}
