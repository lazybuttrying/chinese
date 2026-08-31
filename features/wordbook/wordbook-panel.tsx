import { BookOpen, Shapes } from "lucide-react";

import { wordbookEntries } from "./entries";

export function WordbookPanel() {
  return (
    <section className="wordbook" aria-labelledby="wordbook-title">
      <div className="wordbook-heading">
        <div>
          <p className="eyebrow">HSK 1 STUDY DECK</p>
          <h1 id="wordbook-title">Wordbook<br /><em>& radicals.</em></h1>
        </div>
        <div className="radical-primer">
          <Shapes aria-hidden="true" />
          <div>
            <strong>What is a radical?</strong>
            <p>A radical is the component used to index a Chinese character in a dictionary. It may suggest a broad meaning category, but it is not always the character&apos;s full meaning or complete history.</p>
          </div>
        </div>
      </div>

      <div className="wordbook-count"><BookOpen aria-hidden="true" /><span>{wordbookEntries.length} beginner words</span></div>
      <div className="wordbook-grid">
        {wordbookEntries.map((entry, index) => (
          <article className="word-entry" key={entry.hanzi}>
            <span className="entry-number">{String(index + 1).padStart(2, "0")}</span>
            <div className="entry-word">
              <strong>{entry.hanzi}</strong>
              <span>{entry.pinyin}</span>
              <p>{entry.meaning}</p>
            </div>
            <div className="radical-block">
              <span className="radical-character">{entry.radical}</span>
              <div>
                <p className="radical-name">Radical · {entry.radicalName}</p>
                <p>{entry.radicalDescription}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
