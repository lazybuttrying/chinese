"use client";

import { useCallback, useMemo, useState } from "react";
import type { QuizQuestion } from "./questions";

export type AnswerState = "idle" | "correct" | "wrong";

export function useQuiz(questions: QuizQuestion[]) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const question = questions[roundIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.hanzi;
  const isLastRound = roundIndex === questions.length - 1;
  const progress = useMemo(() => ((roundIndex + 1) / questions.length) * 100, [questions.length, roundIndex]);

  const selectAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (answer === question.hanzi) setScore((current) => current + 1);
  }, [question.hanzi, selectedAnswer]);

  const advance = useCallback(() => {
    setSelectedAnswer(null);
    if (isLastRound) {
      setRoundIndex(0);
      setScore(0);
      return;
    }
    setRoundIndex((current) => current + 1);
  }, [isLastRound]);

  const getAnswerState = useCallback((answer: string): AnswerState => {
    if (!isAnswered) return "idle";
    if (answer === question.hanzi) return "correct";
    return answer === selectedAnswer ? "wrong" : "idle";
  }, [isAnswered, question.hanzi, selectedAnswer]);

  return { advance, getAnswerState, isAnswered, isCorrect, isLastRound, progress, question, roundIndex, score, selectAnswer };
}
