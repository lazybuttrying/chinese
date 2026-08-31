"use client";

import { QuizCard } from "@/features/quiz/quiz-card";
import { QuizHeader } from "@/features/quiz/quiz-header";
import { QuizIntro } from "@/features/quiz/quiz-intro";
import { questions } from "@/features/quiz/questions";
import { useQuiz } from "@/features/quiz/use-quiz";
import { WordbookPanel } from "@/features/wordbook/wordbook-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const quiz = useQuiz(questions);

  return (
    <main className="game-shell">
      <div className="paper-grain" aria-hidden="true" />
      <QuizHeader score={quiz.score} total={questions.length} />
      <Tabs className="study-tabs" defaultValue="game">
        <TabsList aria-label="Choose a study mode" className="study-tabs-list" variant="line">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="wordbook">Wordbook</TabsTrigger>
        </TabsList>
        <TabsContent value="game">
          <section id="quiz" className="game-grid">
            <QuizIntro progress={quiz.progress} round={quiz.roundIndex + 1} total={questions.length} />
            <QuizCard
              getAnswerState={quiz.getAnswerState}
              isAnswered={quiz.isAnswered}
              isCorrect={quiz.isCorrect}
              isLastRound={quiz.isLastRound}
              onAdvance={quiz.advance}
              onSelectAnswer={quiz.selectAnswer}
              question={quiz.question}
              round={quiz.roundIndex + 1}
              total={questions.length}
            />
          </section>
        </TabsContent>
        <TabsContent value="wordbook"><WordbookPanel /></TabsContent>
      </Tabs>
      <footer><span>HSK 1 essentials</span><span>See it. Say it. Keep it.</span><span>Chinese character study</span></footer>
    </main>
  );
}
