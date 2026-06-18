import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Answer, Question, TestPhase } from './types';
import { generateQuestions } from './questionGenerator';
import IntroScreen from './components/IntroScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';

const TOTAL_QUESTIONS = 50;
const GAP_BETWEEN_QUESTIONS = 500;

function useFullScreen() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return { isFullScreen, toggle };
}

function App() {
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);
  const [phaseTotal, setPhaseTotal] = useState(1);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<Answer[]>([]);
  const currentIndexRef = useRef(0);
  const questionsRef = useRef<Question[]>([]);

  const { isFullScreen, toggle: toggleFullScreen } = useFullScreen();

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const runPhase = useCallback(
    (durationMs: number, onEnd: () => void) => {
      setPhaseTimeRemaining(durationMs);
      setPhaseTotal(durationMs);
      const endTime = Date.now() + durationMs;
      timerRef.current = setInterval(() => {
        const remaining = endTime - Date.now();
        setPhaseTimeRemaining(Math.max(0, remaining));
        if (remaining <= 0) {
          clearTimer();
          onEnd();
        }
      }, 50);
    },
    [clearTimer]
  );

  const showNextQuestion = useCallback(() => {
    const nextIdx = currentIndexRef.current + 1;
    if (nextIdx >= TOTAL_QUESTIONS) {
      setPhase('results');
      return;
    }
    setCurrentIndex(nextIdx);
    const q = questionsRef.current[nextIdx];

    // Display phase
    setPhase('display');
    runPhase(q.displayTime, () => {
      // Answer phase
      setPhase('answer');
      runPhase(q.answerTime, () => {
        // Time expired — record as unanswered
        const snap = [...answersRef.current];
        const newAnswers = [
          ...snap,
          { questionId: q.id, selectedIndex: null, correct: false, responseTime: 0 },
        ];
        setAnswers(newAnswers);

        // 1-second gap then next question
        setTimeout(() => showNextQuestion(), GAP_BETWEEN_QUESTIONS);
      });
    });
  }, [runPhase]);

  const handleStart = useCallback(() => {
    const qs = generateQuestions(TOTAL_QUESTIONS);
    setQuestions(qs);
    questionsRef.current = qs;
    setAnswers([]);
    answersRef.current = [];
    setCurrentIndex(0);
    currentIndexRef.current = 0;

    const q = qs[0];
    setPhase('display');
    runPhase(q.displayTime, () => {
      setPhase('answer');
      runPhase(q.answerTime, () => {
        const newAnswers = [
          { questionId: q.id, selectedIndex: null, correct: false, responseTime: 0 },
        ];
        setAnswers(newAnswers);
        setTimeout(() => showNextQuestion(), GAP_BETWEEN_QUESTIONS);
      });
    });
  }, [runPhase, showNextQuestion]);

  const handleAnswer = useCallback(
    (selectedIndex: number | null, responseTime: number) => {
      clearTimer();
      const q = questionsRef.current[currentIndexRef.current];
      const correct = selectedIndex === q.oddIndex;
      const newAnswers = [
        ...answersRef.current,
        { questionId: q.id, selectedIndex, correct, responseTime },
      ];
      setAnswers(newAnswers);

      // 1-second gap then next question
      setTimeout(() => showNextQuestion(), GAP_BETWEEN_QUESTIONS);
    },
    [clearTimer, showNextQuestion]
  );

  const handleRestart = useCallback(() => {
    clearTimer();
    setPhase('intro');
    setQuestions([]);
    setAnswers([]);
    answersRef.current = [];
    setCurrentIndex(0);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  if (phase === 'intro') {
    return (
      <IntroScreen
        onStart={handleStart}
        onFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
      />
    );
  }

  if (phase === 'results') {
    return (
      <ResultsScreen
        answers={answers}
        totalQuestions={TOTAL_QUESTIONS}
        onRestart={handleRestart}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <QuestionScreen
      question={currentQuestion}
      questionNumber={currentIndex + 1}
      totalQuestions={TOTAL_QUESTIONS}
      phase={phase}
      onAnswer={handleAnswer}
      phaseTimeRemaining={phaseTimeRemaining}
      phaseTotal={phaseTotal}
    />
  );
}

export default App;
