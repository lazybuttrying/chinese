type QuizHeaderProps = { score: number; total: number };

export function QuizHeader({ score, total }: QuizHeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#quiz" aria-label="Hanji home"><span aria-hidden="true">汉</span> HANJI</a>
      <div className="level-chip">HSK 1 · STARTER</div>
      <div className="score" aria-label={`${score} of ${total} correct`}><b>{score}</b><span> / {total} correct</span></div>
    </header>
  );
}
