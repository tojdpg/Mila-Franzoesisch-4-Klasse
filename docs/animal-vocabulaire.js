const QUESTIONS = [
  {
    id: "classification",
    prompt: "Wie heißt das Ordnen von Tieren nach gemeinsamen Merkmalen?",
    image: "classification.webp",
    alt: "Vogel, Katze und Fisch als verschiedene Tiergruppen",
    fields: [{ id: "classification", label: "Mot en français", answer: "la classification animale" }]
  },
  {
    id: "animal",
    prompt: "Schreibe beide Formen auf Französisch.",
    image: "animal-singulier.webp",
    alt: "Ein Kaninchen",
    fields: [
      { id: "animal-singulier", label: "ein Tier · singulier", answer: "un animal" },
      { id: "animal-pluriel", label: "die Tiere · pluriel", answer: "des animaux" }
    ]
  },
  {
    id: "antenne",
    prompt: "Wie heißt ein Fühler, zum Beispiel am Kopf eines Schmetterlings?",
    image: "antenne.webp",
    alt: "Nahaufnahme eines Schmetterlings mit zwei Fühlern",
    fields: [{ id: "antenne", label: "Mot en français", answer: "une antenne" }]
  },
  {
    id: "membre",
    prompt: "Wie heißt ein Körperglied, zum Beispiel ein Bein, ein Flügel oder eine Flosse?",
    image: "membre.webp",
    alt: "Die Beine eines Hundes",
    fields: [{ id: "membre", label: "Mot en français", answer: "un membre" }]
  },
  {
    id: "poils",
    prompt: "Wie nennt man die Haare, die viele Tiere auf ihrem Körper haben?",
    image: "poils.webp",
    alt: "Nahaufnahme von dichtem Tierfell",
    fields: [{ id: "poils", label: "Mot en français", answer: "les poils" }]
  },
  {
    id: "plumes",
    prompt: "Wie heißen die Federn eines Vogels?",
    image: "plumes.webp",
    alt: "Eine Feder neben einem kleinen Vogel",
    fields: [{ id: "plumes", label: "Mot en français", answer: "les plumes" }]
  },
  {
    id: "mamelle",
    prompt: "Wie heißt eine Zitze, an der ein Säugetierbaby Milch trinkt?",
    image: "mamelle.webp",
    alt: "Eine Katzenmutter säugt ihre Jungen",
    fields: [{ id: "mamelle", label: "Mot en français", answer: "une mamelle" }]
  },
  {
    id: "squelette-interne",
    prompt: "Wie heißt ein Skelett im Körper, das von Haut bedeckt ist und einen Schädel sowie eine Wirbelsäule hat?",
    image: "squelette-interne.webp",
    alt: "Ein Hirsch mit sichtbar gemachtem Innenskelett",
    fields: [{ id: "squelette-interne", label: "Mot en français", answer: "squelette interne" }]
  },
  {
    id: "oiseau",
    prompt: "Schreibe beide Formen auf Französisch.",
    image: "oiseau.webp",
    alt: "Ein kleiner Vogel auf einem Zweig",
    fields: [
      { id: "oiseau-singulier", label: "ein Vogel · singulier", answer: "un oiseau" },
      { id: "oiseau-pluriel", label: "die Vögel · pluriel", answer: "des oiseaux" }
    ]
  },
  {
    id: "tortue",
    prompt: "Wie heißt dieses Wirbeltier mit vier Gliedmaßen und einem Panzer?",
    image: "tortue.webp",
    alt: "Eine Schildkröte mit gut sichtbarem Panzer",
    fields: [{ id: "tortue", label: "Mot en français", answer: "une tortue" }]
  },
  {
    id: "carapace",
    prompt: "Wie heißt der harte Panzer, der den Körper einer Schildkröte schützt?",
    image: "carapace.webp",
    alt: "Nahaufnahme des gemusterten Schildkrötenpanzers",
    fields: [{ id: "carapace", label: "Mot en français", answer: "une carapace" }]
  }
];

const STORAGE_KEY = "mila-animal-vocabulary-progress-v1";
const HISTORY_KEY = "mila-french-dst3-history-v1";
const FIELDS = QUESTIONS.flatMap((question) => question.fields);
const scoreNode = document.querySelector("#score");
const totalNode = document.querySelector("#total");
const saveStatus = document.querySelector("#saveStatus");
const questionList = document.querySelector("#questionList");
const progressNode = document.querySelector("#progressLabel");
const progressFill = document.querySelector("#progressFill");
const progressTrack = document.querySelector("[role='progressbar']");
const answeredLabel = document.querySelector("#answeredLabel");
const testMessage = document.querySelector("#testMessage");

function newState() {
  return {
    version: 1,
    sessionId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    answers: {},
    checked: false
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.version === 1 && saved.sessionId && saved.answers && typeof saved.answers === "object") return saved;
  } catch {
    saveStatus.textContent = "Speichern nicht verfügbar";
  }
  return newState();
}

let state = loadState();

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function normalize(value) {
  return String(value || "").trim().toLocaleLowerCase("fr").replace(/[.!?]+$/, "").replace(/\s+/g, " ");
}

function fieldIsCorrect(field) {
  return normalize(state.answers[field.id]) === normalize(field.answer);
}

function renderQuestions() {
  questionList.innerHTML = QUESTIONS.map((question, index) => `
    <article class="animal-card" data-question="${question.id}">
      <div class="animal-card-layout">
        <figure class="animal-clue">
          <img src="assets/animaux/${question.image}" alt="${escapeHtml(question.alt)}" loading="lazy" width="180" height="180">
          <figcaption>Indice visuel</figcaption>
        </figure>
        <div>
          <p class="animal-card-number">Question ${index + 1}</p>
          <p class="animal-prompt">${escapeHtml(question.prompt)}</p>
          <div class="animal-answer-fields">
            ${question.fields.map((field) => `
              <label>${escapeHtml(field.label)}
                <input type="text" data-field="${field.id}" value="${escapeHtml(state.answers[field.id] || "")}" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" inputmode="text">
                <small class="animal-feedback" data-feedback="${field.id}" aria-live="polite"></small>
              </label>
            `).join("")}
          </div>
        </div>
      </div>
    </article>
  `).join("");
  questionList.querySelectorAll("[data-field]").forEach((input) => {
    input.addEventListener("input", () => {
      state.answers[input.dataset.field] = input.value;
      updateDisplay();
      save();
      if (state.checked) renderFeedback();
    });
  });
}

function feedbackFor(field) {
  const node = document.querySelector(`[data-feedback="${field.id}"]`);
  const card = node?.closest(".animal-card");
  if (!node || !card) return;
  const value = state.answers[field.id] || "";
  if (!state.checked) {
    node.textContent = "";
    node.removeAttribute("data-state");
    return;
  }
  if (fieldIsCorrect(field)) {
    node.textContent = "Bravo !";
    node.dataset.state = "correct";
  } else if (normalize(value)) {
    node.textContent = `Presque. Réponse : ${field.answer}`;
    node.dataset.state = "incorrect";
  } else {
    node.textContent = "Écris ta réponse.";
    node.dataset.state = "incorrect";
  }
}

function renderFeedback() {
  FIELDS.forEach(feedbackFor);
  QUESTIONS.forEach((question) => {
    const card = document.querySelector(`[data-question="${question.id}"]`);
    const complete = question.fields.every((field) => fieldIsCorrect(field));
    const started = question.fields.some((field) => normalize(state.answers[field.id]));
    card.dataset.result = complete ? "correct" : started || state.checked ? "incorrect" : "";
    if (!card.dataset.result) delete card.dataset.result;
  });
}

function updateDisplay() {
  const correct = FIELDS.filter(fieldIsCorrect).length;
  const answered = FIELDS.filter((field) => normalize(state.answers[field.id])).length;
  const percent = Math.round(answered / FIELDS.length * 100);
  scoreNode.textContent = String(correct);
  totalNode.textContent = String(FIELDS.length);
  answeredLabel.textContent = `${answered} von ${FIELDS.length} Antworten`;
  progressNode.textContent = `${percent} %`;
  progressFill.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(answered));
  if (!answered) testMessage.textContent = "Deine Antworten werden automatisch gespeichert.";
  else testMessage.textContent = state.checked ? "Korrigiere die roten Antworten und prüfe noch einmal." : "Dein Zwischenstand ist gespeichert.";
}

function readHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

function historyEntry() {
  const correct = FIELDS.filter(fieldIsCorrect).length;
  const answered = FIELDS.filter((field) => normalize(state.answers[field.id])).length;
  const answerItems = QUESTIONS.flatMap((question) => question.fields
    .filter((field) => normalize(state.answers[field.id]))
    .map((field) => [`${question.prompt} (${field.label})`, state.answers[field.id]]));
  const mistakes = state.checked ? FIELDS
    .filter((field) => normalize(state.answers[field.id]) && !fieldIsCorrect(field))
    .map((field) => ({
      mission: "La grande enquête des animaux",
      prompt: QUESTIONS.find((question) => question.fields.includes(field))?.prompt || field.label,
      answer: state.answers[field.id],
      expected: field.answer
    })) : [];
  return {
    sessionId: state.sessionId,
    title: "NaWi: La grande enquête des animaux",
    createdAt: state.createdAt,
    updatedAt: new Date().toISOString(),
    score: correct,
    total: FIELDS.length,
    percent: Math.round(correct / FIELDS.length * 100),
    completedMissions: correct === FIELDS.length ? 1 : 0,
    workedMissions: answered ? 1 : 0,
    missions: [{ id: "animaux", title: "NaWi · Classification animale", total: FIELDS.length, correct, touched: answered }],
    answers: answerItems.length ? [{ title: "NaWi · Classification animale", items: answerItems }] : [],
    mistakes
  };
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const entry = historyEntry();
    const history = readHistory();
    const existing = history.some((run) => run.sessionId === state.sessionId);
    const touched = FIELDS.some((field) => normalize(state.answers[field.id]));
    if (touched || existing) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history.filter((run) => run.sessionId !== state.sessionId)].slice(0, 40)));
    }
    saveStatus.textContent = "Automatisch gespeichert";
  } catch {
    saveStatus.textContent = "Speichern nicht verfügbar";
  }
}

document.querySelector("#checkBtn").addEventListener("click", () => {
  state.checked = true;
  updateDisplay();
  renderFeedback();
  save();
  const correct = FIELDS.filter(fieldIsCorrect).length;
  testMessage.textContent = correct === FIELDS.length
    ? "Fantastique, Mila ! Tous les mots sont corrects."
    : `Tu as ${correct} bonne${correct === 1 ? "" : "s"} réponse${correct === 1 ? "" : "s"} sur ${FIELDS.length}. Tu peux corriger et réessayer.`;
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  if (!window.confirm("Neuen Durchgang starten? Dein bisheriger Stand bleibt in der Übersicht gespeichert.")) return;
  state = newState();
  save();
  renderQuestions();
  updateDisplay();
  renderFeedback();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderQuestions();
updateDisplay();
renderFeedback();
if (Object.keys(state.answers).length) saveStatus.textContent = "Stand wiederhergestellt";
