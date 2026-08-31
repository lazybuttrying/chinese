import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "./questions";
import type { AnswerState } from "./use-quiz";

type QuizCardProps = {
  getAnswerState: (answer: string) => AnswerState;
  isAnswered: boolean;
  isCorrect: boolean;
  isLastRound: boolean;
  onAdvance: () => void;
  onSelectAnswer: (answer: string) => void;
  question: QuizQuestion;
  round: number;
  total: number;
};

export function QuizCard({ getAnswerState, isAnswered, isCorrect, isLastRound, onAdvance, onSelectAnswer, question, round, total }: QuizCardProps) {
  return (
    <article className="quiz-card" aria-live="polite">
      <div className="card-meta"><span>IMAGE HINT</span><span>{String(round).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></div>
      <div className="hint-frame" role="img" aria-label={`Visual clue for ${question.meaning}`} style={{ backgroundImage: "url(/hsk-hint-panels.png)", backgroundPosition: question.hintPosition }}>
        <div className="hint-label">LOOK → GUESS</div>
      </div>
      <h2>{question.prompt}</h2>
      <div className="answers">
        {question.choices.map((choice, index) => {
          const state = getAnswerState(choice);
          return <button key={choice} className={cn("answer", state !== "idle" && state)} disabled={isAnswered} onClick={() => onSelectAnswer(choice)} type="button"><span>{String.fromCharCode(65 + index)}</span>{choice}</button>;
        })}
      </div>
      {isAnswered && (
        <div className={cn("result", isCorrect ? "yes" : "no")}>
          <div><strong>{isCorrect ? "Exactly." : "Almost."}</strong><span>{question.hanzi} · {question.pinyin} · {question.meaning}</span></div>
          <Button className="next-button" onClick={onAdvance} type="button">
            {isLastRound ? "Play again" : "Next word"}
            {isLastRound ? <RotateCcw aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </Button>
        </div>
      )}
    </article>
  );
}
