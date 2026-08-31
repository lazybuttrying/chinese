import { Progress } from "@/components/ui/progress";

type QuizIntroProps = { progress: number; round: number; total: number };

export function QuizIntro({ progress, round, total }: QuizIntroProps) {
  return (
    <div className="intro">
      <p className="eyebrow">LEARN BY SEEING</p>
      <h1>One tiny<br /><em>moment</em>,<br />one new word.</h1>
      <p className="intro-copy">Look at the visual hint. Trust your instinct. Then make the Chinese word stick.</p>
      <div className="progress-wrap">
        <div className="progress-label"><span>ROUND {String(round).padStart(2, "0")}</span><span>{total} WORDS</span></div>
        <Progress aria-label={`Question ${round} of ${total}`} className="quiz-progress" value={progress} />
      </div>
    </div>
  );
}
