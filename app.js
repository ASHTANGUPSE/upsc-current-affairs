// UPSC Current Affairs prototype.
// Loads data/digest-sample.json and renders the digest, quiz and progress views.
// All text is inserted with textContent (never innerHTML) so data cannot inject markup.

const STORAGE_KEY = "upsc-ca-progress-v1";
let data = null;
let progress = loadProgress();

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { answers: {} };
  } catch (e) {
    return { answers: {} };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    // Storage may be unavailable (private mode); progress then lasts only for this page view.
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ---------- Tabs ----------
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "progress") renderProgress();
  });
});

// ---------- Digest ----------
function renderDigest() {
  const paper = document.getElementById("paper-filter").value;
  const container = document.getElementById("items");
  container.replaceChildren();

  const items = data.items.filter((item) => paper === "all" || item.paper === paper);
  if (items.length === 0) {
    container.append(el("p", "muted", "No items for this paper today."));
    return;
  }

  items.forEach((item) => {
    const card = el("article", "card");
    card.append(el("h2", null, item.title));

    const tags = el("div", "tags");
    tags.append(el("span", "tag", item.paper), el("span", "tag", item.topic));
    card.append(tags);

    card.append(el("p", null, item.summary));

    if (item.keyFacts && item.keyFacts.length) {
      card.append(el("strong", null, "Key facts"));
      const ul = el("ul");
      item.keyFacts.forEach((f) => ul.append(el("li", null, f)));
      card.append(ul);
    }

    const source = el("p", "muted");
    source.append("Source: ");
    const link = el("a", null, item.source.name);
    link.href = item.source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    source.append(link);
    card.append(source);

    container.append(card);
  });
}

document.getElementById("paper-filter").addEventListener("change", renderDigest);

// ---------- Quiz ----------
function renderQuiz() {
  const container = document.getElementById("questions");
  container.replaceChildren();

  data.questions.forEach((q) => {
    const card = el("article", "card");
    card.dataset.qid = q.id;
    card.append(el("span", "tag", q.type === "mcq" ? "Prelims MCQ" : "Mains"));
    card.append(el("h2", null, q.question));

    if (q.type === "mcq") {
      const options = el("div", "options");
      const explain = el("div", "explain");
      explain.hidden = true;

      q.options.forEach((text, index) => {
        const btn = el("button", "option", text);
        btn.addEventListener("click", () => answerMcq(q, index, card));
        options.append(btn);
      });
      card.append(options, explain);

      // Re-apply a previous answer after a reload.
      const prev = progress.answers[q.id];
      if (prev) answerMcq(q, prev.choice, card, true);
    } else {
      card.append(el("p", "muted", `Word limit: ${q.wordLimit}. Write your answer offline, then compare with the key points.`));
      const btn = el("button", "secondary", "Show key points");
      const points = el("ul");
      points.hidden = true;
      q.keyPoints.forEach((p) => points.append(el("li", null, p)));
      btn.addEventListener("click", () => {
        points.hidden = !points.hidden;
        btn.textContent = points.hidden ? "Show key points" : "Hide key points";
      });
      card.append(btn, points);
    }

    container.append(card);
  });
}

function answerMcq(q, choice, card, restoring = false) {
  const buttons = card.querySelectorAll(".option");
  const explain = card.querySelector(".explain");
  if (!restoring && progress.answers[q.id]) return; // one attempt per question

  buttons.forEach((b) => (b.disabled = true));
  buttons[q.answer].classList.add("correct");
  if (choice !== q.answer) buttons[choice].classList.add("wrong");

  explain.replaceChildren();
  const correct = choice === q.answer;
  explain.append(
    el("p", correct ? "verdict ok" : "verdict bad", correct ? "Correct" : `Incorrect. The answer is option ${q.answer + 1}.`),
    el("p", null, q.explanation)
  );
  explain.hidden = false;

  if (!restoring) {
    progress.answers[q.id] = { choice, correct, topic: q.topic, question: q.question };
    saveProgress();
  }
}

// ---------- Progress ----------
function renderProgress() {
  const stats = document.getElementById("stats");
  const revisit = document.getElementById("revisit");
  stats.replaceChildren();
  revisit.replaceChildren();

  const mcqs = data.questions.filter((q) => q.type === "mcq");
  const attempted = mcqs.filter((q) => progress.answers[q.id]);
  const correct = attempted.filter((q) => progress.answers[q.id].correct);
  const accuracy = attempted.length ? Math.round((correct.length / attempted.length) * 100) : 0;

  [
    ["Attempted", `${attempted.length} / ${mcqs.length}`],
    ["Correct", String(correct.length)],
    ["Accuracy", attempted.length ? `${accuracy}%` : "–"],
  ].forEach(([label, value]) => {
    const box = el("div", "stat");
    box.append(el("div", "muted", label), el("div", "num", value));
    stats.append(box);
  });

  const wrong = attempted.filter((q) => !progress.answers[q.id].correct);
  if (wrong.length === 0) {
    revisit.append(el("li", "muted", "Nothing to revisit yet."));
  }
  wrong.forEach((q) => revisit.append(el("li", null, `${q.topic}: ${q.question}`)));
}

document.getElementById("reset-progress").addEventListener("click", () => {
  if (!confirm("Clear all quiz progress on this device?")) return;
  progress = { answers: {} };
  saveProgress();
  renderQuiz();
  renderProgress();
});

// ---------- Startup ----------
fetch("data/digest-sample.json")
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((json) => {
    data = json;
    if (data.banner) {
      const banner = document.getElementById("banner");
      banner.textContent = data.banner;
      banner.hidden = false;
    }
    document.getElementById("digest-date").textContent = `Digest for ${data.date}`;
    renderDigest();
    renderQuiz();
  })
  .catch((err) => {
    document.getElementById("items").append(
      el("p", "muted", `Could not load data (${err.message}). Serve this folder over HTTP; see README.md.`)
    );
  });
