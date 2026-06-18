import { supabase } from './supabaseClient';
import type { TestResult, SessionResult } from '../types';

export async function saveTestResult(result: TestResult): Promise<{ success: boolean; error?: string }> {
  try {
    // Insert test result
    const { data: testData, error: testError } = await supabase
      .from('test_results')
      .insert({
        test_id: result.testId,
        overall_accuracy: result.overallAccuracy,
        total_correct: result.totalCorrect,
        total_missed: result.totalMissed,
        total_false_positives: result.totalFalsePositives,
        total_groups_viewed: result.totalGroupsViewed,
        overall_avg_response_time: result.overallAvgResponseTime,
        performance_category: result.performanceCategory,
        focus_violations: result.focusViolations,
      })
      .select('id')
      .maybeSingle();

    if (testError) {
      return { success: false, error: testError.message };
    }

    if (!testData) {
      return { success: false, error: 'Failed to insert test result' };
    }

    // Insert session results
    const sessionData = result.sessions.map(session => ({
      test_result_id: testData.id,
      session_number: session.sessionNumber,
      difficulty: session.difficulty,
      accuracy: session.accuracy,
      correct_detections: session.correctDetections,
      missed_targets: session.missedTargets,
      false_positives: session.falsePositives,
      total_groups_scanned: session.totalGroupsScanned,
      avg_response_time: session.avgResponseTime,
      duration: session.duration,
    }));

    const { error: sessionsError } = await supabase
      .from('session_results')
      .insert(sessionData);

    if (sessionsError) {
      return { success: false, error: sessionsError.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function fetchTestResult(testId: string): Promise<TestResult | null> {
  try {
    const { data: testData, error: testError } = await supabase
      .from('test_results')
      .select('*')
      .eq('test_id', testId)
      .maybeSingle();

    if (testError) throw testError;
    if (!testData) return null;

    const { data: sessionData, error: sessionsError } = await supabase
      .from('session_results')
      .select('*')
      .eq('test_result_id', testData.id);

    if (sessionsError) throw sessionsError;

    return {
      testId: testData.test_id,
      startTime: new Date(testData.created_at).getTime(),
      endTime: new Date(testData.created_at).getTime(),
      sessions: (sessionData || []).map(s => ({
        sessionNumber: s.session_number,
        difficulty: s.difficulty,
        groups: [],
        responses: [],
        correctDetections: s.correct_detections,
        missedTargets: s.missed_targets,
        falsePositives: s.false_positives,
        accuracy: s.accuracy,
        avgResponseTime: s.avg_response_time,
        totalGroupsScanned: s.total_groups_scanned,
        duration: s.duration,
      })),
      totalCorrect: testData.total_correct,
      totalMissed: testData.total_missed,
      totalFalsePositives: testData.total_false_positives,
      overallAccuracy: testData.overall_accuracy,
      overallAvgResponseTime: testData.overall_avg_response_time,
      totalGroupsViewed: testData.total_groups_viewed,
      performanceCategory: testData.performance_category,
      focusViolations: testData.focus_violations,
    };
  } catch (error) {
    console.error('Error fetching test result:', error);
    return null;
  }
}

export async function fetchRecentResults(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent results:', error);
    return [];
  }
}

export async function fetchStatistics() {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('overall_accuracy, total_correct, total_missed, total_false_positives, performance_category');

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        totalTests: 0,
        avgAccuracy: 0,
        categoryDistribution: {},
      };
    }

    const totalTests = data.length;
    const avgAccuracy = data.reduce((sum, r) => sum + r.overall_accuracy, 0) / totalTests;

    const categoryDistribution: Record<string, number> = {};
    data.forEach(r => {
      categoryDistribution[r.performance_category] = (categoryDistribution[r.performance_category] || 0) + 1;
    });

    return { totalTests, avgAccuracy, categoryDistribution };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return { totalTests: 0, avgAccuracy: 0, categoryDistribution: {} };
  }
}
