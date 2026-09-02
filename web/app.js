"use strict";

const state = {
  content: null,
  roundIndex: 0,
  score: 0,
  selectedAnswer: null,
};

const elements = {};

document.addEventListener("DOMContentLoaded", async () => {
  cacheElements();
  wireTabs();
  elements.nextButton.addEventListener("click", advance);

  try {
    const response = await fetch("/content.json", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Content request failed with ${response.status}`);
    }

    state.content = await response.json();
    validateContent(state.content);
    renderWordbook();
    renderQuestion();
  } catch (error) {
    console.error(error);
    elements.questionPrompt.hidden = true;
    elements.loadError.hidden = false;
  }
});

function cacheElements() {
  const ids = [
    "answers",
    "card-count",
    "game-panel",
    "game-tab",
    "hint-frame",
    "load-error",
    "next-button",
    "next-label",
    "progress-bar",
    "question-prompt",
    "result",
    "result-detail",
    "result-title",
    "round-label",
    "score",
    "score-label",
    "word-total",
    "wordbook-count",
    "wordbook-grid",
    "wordbook-panel",
    "wordbook-tab",
  ];

  for (const id of ids) {
    const key = id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    elements[key] = document.getElementById(id);
  }

  elements.progress = document.querySelector(".quiz-progress");
}

function validateContent(content) {
  if (!content || !Array.isArray(content.questions) || content.questions.length === 0) {
    throw new Error("The question deck is empty.");
  }

  if (!Array.isArray(content.wordbook)) {
    throw new Error("The wordbook is missing.");
  }

  for (const question of content.questions) {
    if (
      typeof question.hanzi !== "string" ||
      typeof question.imageHint !== "string" ||
      !Array.isArray(question.choices) ||
      question.choices.length !== 4 ||
      !question.choices.includes(question.hanzi)
    ) {
      throw new Error(`Invalid question: ${question.id ?? "unknown"}`);
    }
  }
}

function wireTabs() {
  const tabs = [elements.gameTab, elements.wordbookTab];

  for (const tab of tabs) {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();
      const nextTab = tab === elements.gameTab ? elements.wordbookTab : elements.gameTab;
      activateTab(nextTab);
      nextTab.focus();
    });
  }
}

function activateTab(activeTab) {
  const gameIsActive = activeTab === elements.gameTab;
  elements.gameTab.classList.toggle("active", gameIsActive);
  elements.wordbookTab.classList.toggle("active", !gameIsActive);
  elements.gameTab.setAttribute("aria-selected", String(gameIsActive));
  elements.wordbookTab.setAttribute("aria-selected", String(!gameIsActive));
  elements.gameTab.tabIndex = gameIsActive ? 0 : -1;
  elements.wordbookTab.tabIndex = gameIsActive ? -1 : 0;
  elements.gamePanel.hidden = !gameIsActive;
  elements.wordbookPanel.hidden = gameIsActive;
}

function renderQuestion() {
  const questions = state.content.questions;
  const question = questions[state.roundIndex];
  const round = state.roundIndex + 1;
  const total = questions.length;
  const progress = Math.round((round / total) * 100);

  state.selectedAnswer = null;
  elements.score.textContent = String(state.score);
  elements.scoreLabel.textContent = ` / ${total} correct`;
  elements.roundLabel.textContent = `ROUND ${pad(round)}`;
  elements.wordTotal.textContent = `${total} WORDS`;
  elements.cardCount.textContent = `${pad(round)} / ${pad(total)}`;
  elements.progressBar.style.width = `${progress}%`;
  elements.progress.setAttribute("aria-valuenow", String(progress));
  elements.progress.setAttribute("aria-valuetext", `Question ${round} of ${total}`);
  elements.questionPrompt.textContent = question.prompt;
  elements.hintFrame.style.backgroundPosition = question.hintPosition;
  elements.hintFrame.setAttribute("aria-label", question.imageHint);
  elements.result.hidden = true;
  elements.result.className = "result";
  elements.answers.replaceChildren();

  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    const key = document.createElement("span");
    key.className = "answer-key";
    key.textContent = String.fromCharCode(65 + index);
    button.className = "answer";
    button.type = "button";
    button.append(key, document.createTextNode(choice));
    button.addEventListener("click", () => chooseAnswer(choice));
    elements.answers.append(button);
  });
}

function chooseAnswer(answer) {
  if (state.selectedAnswer !== null) {
    return;
  }

  const question = state.content.questions[state.roundIndex];
  const isCorrect = answer === question.hanzi;
  state.selectedAnswer = answer;

  if (isCorrect) {
    state.score += 1;
    elements.score.textContent = String(state.score);
  }

  for (const button of elements.answers.querySelectorAll(".answer")) {
    const choice = button.lastChild.textContent;
    button.disabled = true;

    if (choice === question.hanzi) {
      button.classList.add("correct");
    } else if (choice === answer) {
      button.classList.add("wrong");
    }
  }

  elements.result.classList.add(isCorrect ? "yes" : "no");
  elements.resultTitle.textContent = isCorrect ? "Exactly." : "Almost.";
  elements.resultDetail.textContent =
    `${question.hanzi} · ${question.pinyin} · ${question.meaning}`;

  const isLastRound = state.roundIndex === state.content.questions.length - 1;
  elements.nextLabel.textContent = isLastRound ? "Play again" : "Next word";
  elements.nextButton.lastElementChild.textContent = isLastRound ? "↻" : "→";
  elements.result.hidden = false;
  elements.nextButton.focus();
}

function advance() {
  if (state.selectedAnswer === null) {
    return;
  }

  const isLastRound = state.roundIndex === state.content.questions.length - 1;

  if (isLastRound) {
    state.roundIndex = 0;
    state.score = 0;
  } else {
    state.roundIndex += 1;
  }

  renderQuestion();
  elements.questionPrompt.focus({ preventScroll: true });
}

function renderWordbook() {
  const entries = state.content.wordbook;
  elements.wordbookCount.textContent = `${entries.length} beginner words`;
  elements.wordbookGrid.replaceChildren();

  entries.forEach((entry, index) => {
    const article = document.createElement("article");
    article.className = "word-entry";

    const number = document.createElement("span");
    number.className = "entry-number";
    number.textContent = pad(index + 1);

    const word = document.createElement("div");
    word.className = "entry-word";
    const hanzi = document.createElement("strong");
    hanzi.textContent = entry.hanzi;
    const pinyin = document.createElement("span");
    pinyin.textContent = entry.pinyin;
    const meaning = document.createElement("p");
    meaning.textContent = entry.meaning;
    word.append(hanzi, pinyin, meaning);

    const radical = document.createElement("div");
    radical.className = "radical-block";
    const radicalCharacter = document.createElement("span");
    radicalCharacter.className = "radical-character";
    radicalCharacter.textContent = entry.radical;
    const radicalCopy = document.createElement("div");
    const radicalName = document.createElement("p");
    radicalName.className = "radical-name";
    radicalName.textContent = `Radical · ${entry.radicalName}`;
    const description = document.createElement("p");
    description.textContent = entry.radicalDescription;
    radicalCopy.append(radicalName, description);
    radical.append(radicalCharacter, radicalCopy);

    article.append(number, word, radical);
    elements.wordbookGrid.append(article);
  });
}

function pad(value) {
  return String(value).padStart(2, "0");
}
