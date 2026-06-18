import type { SessionResult, TestResult } from '../types';

export function computeSessionResult(
  sessionNumber: number,
  difficulty: import('../types').Difficulty,
  groups: import('../types').DotGroup[],
  responses: import('../types').GroupResponse[],
  duration: number
): SessionResult {
  const responseMap = new Map(responses.map(r => [r.groupId, r]));

  let correct = 0;
  let missed = 0;
  let falsePositives = 0;
  let totalResponseTime = 0;
  let responsedCount = 0;

  for (const group of groups) {
    const resp = responseMap.get(group.id);
    const marked = resp?.marked ?? false;

    if (group.isTarget && marked) {
      correct++;
    } else if (group.isTarget && !marked) {
      missed++;
    } else if (!group.isTarget && marked) {
      falsePositives++;
    }

    if (resp && resp.responseTime > 0) {
      totalResponseTime += resp.responseTime;
      responsedCount++;
    }
  }

  const denominator = correct + falsePositives;
  const accuracy = denominator > 0 ? (correct / denominator) * 100 : 0;
  const avgResponseTime = responsedCount > 0 ? totalResponseTime / responsedCount : 0;

  return {
    sessionNumber,
    difficulty,
    groups,
    responses,
    correctDetections: correct,
    missedTargets: missed,
    falsePositives,
    accuracy,
    avgResponseTime,
    totalGroupsScanned: groups.length,
    duration,
  };
}

export function computeTestResult(
  testId: string,
  startTime: number,
  sessions: SessionResult[],
  focusViolations: number
): TestResult {
  const totalCorrect = sessions.reduce((s, r) => s + r.correctDetections, 0);
  const totalMissed = sessions.reduce((s, r) => s + r.missedTargets, 0);
  const totalFalsePositives = sessions.reduce((s, r) => s + r.falsePositives, 0);
  const totalGroupsViewed = sessions.reduce((s, r) => s + r.totalGroupsScanned, 0);

  const denominator = totalCorrect + totalFalsePositives;
  const overallAccuracy = denominator > 0 ? (totalCorrect / denominator) * 100 : 0;

  const allAvgs = sessions.filter(s => s.avgResponseTime > 0).map(s => s.avgResponseTime);
  const overallAvgResponseTime = allAvgs.length > 0
    ? allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length
    : 0;

  const performanceCategory = getPerformanceCategory(overallAccuracy);

  return {
    testId,
    startTime,
    endTime: Date.now(),
    sessions,
    totalCorrect,
    totalMissed,
    totalFalsePositives,
    overallAccuracy,
    overallAvgResponseTime,
    totalGroupsViewed,
    performanceCategory,
    focusViolations,
  };
}

export function getPerformanceCategory(accuracy: number): string {
  if (accuracy >= 90) return 'Excellent Concentration';
  if (accuracy >= 75) return 'Very Good';
  if (accuracy >= 60) return 'Good';
  if (accuracy >= 40) return 'Average';
  return 'Needs Improvement';
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Excellent Concentration': return 'text-emerald-600';
    case 'Very Good': return 'text-blue-600';
    case 'Good': return 'text-cyan-600';
    case 'Average': return 'text-amber-600';
    default: return 'text-red-600';
  }
}
