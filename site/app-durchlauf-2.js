const scoreNode = document.querySelector("#score");
const totalNode = document.querySelector("#total");
const progressLabel = document.querySelector("#progressLabel");
const progressFill = document.querySelector("#progressFill");
const rankLabel = document.querySelector("#rankLabel");
const toast = document.querySelector("#toast");
const futureText = document.querySelector("#futureText");
const futureHelp = document.querySelector("#futureHelp");
const saveStatus = document.querySelector("#saveStatus");

const gradedTasks = Array.from(document.querySelectorAll("[data-task]"));
const writingTaskCount = 1;
const totalTasks = gradedTasks.length + writingTaskCount;
const correctTasks = new Set();
const STORAGE_KEY = "mila-french-dst3-round2-progress-v1";
const HISTORY_KEY = "mila-french-dst3-history-v1";
const SESSION_KEY = "mila-french-dst3-round2-session-v1";
const PDF_RUN_SESSION_ID = "nachtrag-pdf-2026-05-31-1826";
const PDF_RUN_TASK_VALUES = [
  "Peux",
  "veux",
  "finit",
  "Venons",
  "Faites",
  "disent",
  "Prennent",
  "allons",
  "prépare",
  "ont",
  "ira",
  "a rangé",
  "Pouvoir",
  "vouloir",
  "faire",
  "prendre",
  "aller",
  "Être",
  "La maîtresse",
  "Explique",
  "La consigne",
  "Les dragons",
  "Rangent",
  "Les livres",
  "on",
  "ont",
  "son",
  "sont",
  "est",
  "à",
  "passé",
  "présent",
  "futur",
  "Les petits chats noirs",
  "Des grands dragons verts",
  "Une robe bleue",
  "Des jolies fleurs",
  "oi",
  "an",
  "ou",
  "in",
  "Mila présente à sa classe une livre.",
  "la fille trouve une carte dans une vieille bibliothèque.",
  "car elle trouve la histoire drôle et un peu mystérieuse."
];
const PDF_RUN_WRITING = `Demain, je ferai un match de hockey .
Dans quelques jours on verra le pizza.
Bientôt je vais a la piscine.
Je visiterai mes cousins.
Je jouerai avec toi.`;
let saveTimer = 0;
let isRestoring = false;
let audioContext = null;
let sessionId = getSessionId();

totalNode.textContent = String(totalTasks);

document.querySelectorAll("input[type='text']").forEach((input) => {
  input.setAttribute("autocapitalize", "none");
  input.setAttribute("autocorrect", "off");
  input.setAttribute("spellcheck", "false");
});

function normalize(value, options = {}) {
  const stripAccents = options.stripAccents !== false;
  let text = value
    .trim()
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[’']/g, "'")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/^[\s"“”«».,;:!?]+|[\s"“”«».,;:!?]+$/g, "")
    .replace(/\s+/g, " ");

  if (stripAccents) {
    text = text.replace(/[\u0300-\u036f]/g, "");
  }

  return text;
}

function answersFor(task, options = {}) {
  return (task.dataset.answer || "")
    .split("|")
    .map((answer) => normalize(answer, options))
    .filter(Boolean);
}

function getTaskId(task) {
  if (!task.dataset.id) {
    task.dataset.id = `task-${gradedTasks.indexOf(task)}`;
  }
  return task.dataset.id;
}

function createSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) {
      return existing;
    }

    const next = createSessionId();
    localStorage.setItem(SESSION_KEY, next);
    return next;
  } catch (error) {
    return createSessionId();
  }
}

function startNewSession() {
  sessionId = createSessionId();

  try {
    localStorage.setItem(SESSION_KEY, sessionId);
  } catch (error) {
    setSaveStatus("Speichern nicht verfügbar");
  }
}

function setSaveStatus(message) {
  if (saveStatus) {
    saveStatus.textContent = message;
  }
}

function collectState() {
  return {
    savedAt: new Date().toISOString(),
    fields: Array.from(document.querySelectorAll("input, textarea")).map((field) => field.value),
    tasks: gradedTasks.map((task) => ({
      id: getTaskId(task),
      selected: task.dataset.selected || "",
      isCorrect: task.classList.contains("is-correct"),
      isWrong: task.classList.contains("is-wrong"),
      feedback: task.querySelector(".feedback")?.textContent || ""
    })),
    writingOk: document.body.dataset.writingOk === "true",
    futureTextCorrect: futureText.classList.contains("is-correct"),
    futureTextWrong: futureText.classList.contains("is-wrong"),
    futureHelp: futureHelp.textContent
  };
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 40)));
  } catch (error) {
    setSaveStatus("Verlauf nicht gespeichert");
  }
}

function cleanPrompt(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/Réponse attendue\s*:.*$/i, "")
    .trim();
}

function getPrompt(task) {
  const promptNode = task.querySelector("span, p");
  if (promptNode) {
    return cleanPrompt(promptNode.textContent);
  }

  const sentenceCard = task.closest(".sentence-card");
  if (sentenceCard) {
    const sentence = sentenceCard.querySelector(".sentence")?.textContent || "";
    const clone = task.cloneNode(true);
    clone.querySelectorAll("input, textarea, button, small").forEach((node) => node.remove());
    return cleanPrompt(`${sentence} ${clone.textContent}`);
  }

  const clone = task.cloneNode(true);
  clone.querySelectorAll("input, textarea, button, small").forEach((node) => node.remove());
  return cleanPrompt(clone.textContent);
}

function answerSummary(task) {
  const answer = getValue(task).trim();
  const touched = task.classList.contains("is-correct") ||
    task.classList.contains("is-wrong") ||
    Boolean(answer);

  if (!touched) {
    return null;
  }

  return {
    prompt: getPrompt(task),
    answer
  };
}

function missionSummary(section) {
  const title = section.querySelector("h2")?.textContent.trim() || section.id;
  const tasks = Array.from(section.querySelectorAll("[data-task]"));

  if (section.id === "ecriture") {
    const isCorrect = document.body.dataset.writingOk === "true";
    const isWrong = futureText.classList.contains("is-wrong");
    const touched = Boolean(futureText.value.trim() || isCorrect || isWrong);

    return {
      id: section.id,
      title,
      total: 1,
      correct: isCorrect ? 1 : 0,
      touched: touched ? 1 : 0,
      answers: touched
        ? [{
            prompt: "Production écrite au futur",
            answer: futureText.value.trim()
          }]
        : [],
      mistakes: isWrong
        ? [{
            prompt: "Production écrite au futur",
            answer: futureText.value.trim(),
            expected: "5 à 8 phrases avec du futur"
          }]
        : []
    };
  }

  const mistakes = [];
  const correct = tasks.filter((task) => task.classList.contains("is-correct")).length;
  const touched = tasks.filter((task) => {
    return task.classList.contains("is-correct") ||
      task.classList.contains("is-wrong") ||
      Boolean(getValue(task).trim());
  }).length;

  tasks.forEach((task) => {
    if (!task.classList.contains("is-wrong")) {
      return;
    }

    mistakes.push({
      prompt: getPrompt(task),
      answer: getValue(task).trim(),
      expected: task.dataset.answer?.split("|")[0] || ""
    });
  });

  return {
    id: section.id,
    title,
    total: tasks.length,
    correct,
    touched,
    answers: tasks.map(answerSummary).filter(Boolean),
    mistakes
  };
}

function collectHistoryEntry() {
  const sections = Array.from(document.querySelectorAll(".mission-band"));
  const missions = sections.map(missionSummary);
  const writingOk = document.body.dataset.writingOk === "true" ? 1 : 0;
  const score = correctTasks.size + writingOk;
  const percent = Math.round((score / totalTasks) * 100);

  return {
    sessionId,
    title: "Mission de français DST3 blanc 2",
    updatedAt: new Date().toISOString(),
    score,
    total: totalTasks,
    percent,
    missions,
    completedMissions: missions.filter((mission) => mission.total > 0 && mission.correct === mission.total).length,
    workedMissions: missions.filter((mission) => mission.touched > 0).length,
    answers: missions
      .filter((mission) => mission.answers?.length)
      .map((mission) => ({
        title: mission.title,
        items: mission.answers.map((answer) => [answer.prompt, answer.answer])
      })),
    mistakes: missions.flatMap((mission) => {
      return mission.mistakes.map((mistake) => ({
        mission: mission.title,
        ...mistake
      }));
    })
  };
}

function saveHistorySnapshot() {
  const entry = collectHistoryEntry();
  const history = loadHistory();
  const existingIndex = history.findIndex((item) => item.sessionId === sessionId);

  if (existingIndex >= 0) {
    history[existingIndex] = {
      ...history[existingIndex],
      ...entry
    };
  } else {
    history.unshift({
      createdAt: entry.updatedAt,
      ...entry
    });
  }

  history.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  saveHistory(history);
}

function saveState() {
  if (isRestoring) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
    setSaveStatus("Automatisch gespeichert");
  } catch (error) {
    setSaveStatus("Speichern nicht möglich");
  }
}

function queueSave() {
  if (isRestoring) {
    return;
  }

  setSaveStatus("Speichert ...");
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveState, 250);
}

function restoreState() {
  let rawState = "";

  try {
    rawState = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    setSaveStatus("Speichern nicht verfügbar");
    return;
  }

  if (!rawState) {
    saveState();
    return;
  }

  try {
    const state = JSON.parse(rawState);
    const fields = Array.from(document.querySelectorAll("input, textarea"));

    isRestoring = true;
    fields.forEach((field, index) => {
      field.value = state.fields?.[index] || "";
      field.classList.remove("is-correct", "is-wrong");
    });

    correctTasks.clear();
    gradedTasks.forEach((task, index) => {
      const taskState = state.tasks?.[index] || {};
      const feedback = task.querySelector(".feedback");

      task.classList.toggle("is-correct", Boolean(taskState.isCorrect));
      task.classList.toggle("is-wrong", Boolean(taskState.isWrong));

      if (feedback) {
        feedback.textContent = taskState.feedback || "";
      }

      if (taskState.selected) {
        task.dataset.selected = taskState.selected;
      } else {
        delete task.dataset.selected;
      }

      task.querySelectorAll("button").forEach((button) => {
        const value = button.dataset.value || button.textContent;
        button.setAttribute("aria-pressed", value === taskState.selected ? "true" : "false");
      });

      if (taskState.isCorrect) {
        correctTasks.add(getTaskId(task));
      }
    });

    document.body.dataset.writingOk = state.writingOk ? "true" : "false";
    futureText.classList.toggle("is-correct", Boolean(state.futureTextCorrect));
    futureText.classList.toggle("is-wrong", Boolean(state.futureTextWrong));
    futureHelp.textContent = state.futureHelp || "Le dragon compte les phrases et cherche le futur.";
    setSaveStatus("Stand wiederhergestellt");
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    setSaveStatus("Alter Stand konnte nicht geladen werden");
  } finally {
    isRestoring = false;
  }
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function playTone(context, frequency, offset, duration, type, volume) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + offset;
  const end = start + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.02);
}

function playResultSound(ok) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const play = () => {
    if (ok) {
      playTone(context, 523.25, 0, 0.12, "sine", 0.08);
      playTone(context, 659.25, 0.1, 0.13, "sine", 0.075);
      playTone(context, 783.99, 0.21, 0.18, "triangle", 0.07);
      return;
    }

    playTone(context, 164.81, 0, 0.18, "sawtooth", 0.06);
    playTone(context, 123.47, 0.16, 0.2, "square", 0.045);
  };

  if (context.state === "suspended") {
    context.resume().then(play).catch(() => {});
  } else {
    play();
  }
}

function getValue(task) {
  if (task.classList.contains("word-pick") || task.classList.contains("choice-task")) {
    return task.dataset.selected || "";
  }

  const field = task.querySelector("input, textarea");
  return field ? field.value : "";
}

function setFeedback(task, ok, message) {
  const feedback = task.querySelector(".feedback");
  task.classList.toggle("is-correct", ok);
  task.classList.toggle("is-wrong", !ok);

  if (feedback) {
    feedback.textContent = message;
  }

  const id = getTaskId(task);
  if (ok) {
    correctTasks.add(id);
  } else {
    correctTasks.delete(id);
  }
}

function setTaskValue(task, value) {
  if (task.classList.contains("word-pick") || task.classList.contains("choice-task")) {
    task.dataset.selected = value;
    task.querySelectorAll("button").forEach((button) => {
      const buttonValue = button.dataset.value || button.textContent;
      button.setAttribute("aria-pressed", buttonValue === value ? "true" : "false");
    });
    return;
  }

  const field = task.querySelector("input, textarea");
  if (field) {
    field.value = value;
  }
}

function matchesKeywordSet(text, rawKeywords) {
  const normalizedText = normalize(text);
  return rawKeywords
    .split(",")
    .map((group) => group.split("|").map(normalize))
    .every((alternatives) => alternatives.some((word) => normalizedText.includes(word)));
}

function loadPdfRun() {
  sessionId = PDF_RUN_SESSION_ID;

  try {
    localStorage.setItem(SESSION_KEY, sessionId);
  } catch (error) {
    setSaveStatus("Speichern nicht verfügbar");
  }

  correctTasks.clear();
  gradedTasks.forEach((task, index) => {
    const value = PDF_RUN_TASK_VALUES[index] || "";
    const feedback = task.querySelector(".feedback");

    task.classList.remove("is-correct", "is-wrong");
    if (feedback) {
      feedback.textContent = "";
    }
    delete task.dataset.selected;

    setTaskValue(task, value);
    checkTask(task);
  });

  futureText.value = PDF_RUN_WRITING;
  document.body.dataset.writingOk = "true";
  futureText.classList.add("is-correct");
  futureText.classList.remove("is-wrong");
  futureHelp.textContent = "Très bien. Tu peux ajouter parce que ou car pour justifier.";

  updateScore();
  saveState();
  saveHistorySnapshot();
  setSaveStatus("PDF-Durchgang geladen");
  showToast("Milas PDF-Durchgang ist geladen.");
}

function checkTask(task) {
  const isButtonTask = task.classList.contains("word-pick") || task.classList.contains("choice-task");
  const compareOptions = { stripAccents: !isButtonTask };
  const value = normalize(getValue(task), compareOptions);

  if (task.dataset.keywords) {
    const ok = matchesKeywordSet(getValue(task), task.dataset.keywords);
    setFeedback(
      task,
      ok,
      ok
        ? "Phrase acceptée. Le dragon note une réponse complète."
        : "Ajoute les mots importants et réponds avec une phrase complète."
    );
    return ok;
  }

  const ok = answersFor(task, compareOptions).includes(value);
  const expected = task.dataset.answer?.split("|")[0] || "";
  setFeedback(
    task,
    ok,
    ok ? "Correct." : `Presque. Réponse attendue : ${expected}`
  );
  return ok;
}

function updateScore() {
  const writingOk = document.body.dataset.writingOk === "true" ? 1 : 0;
  const score = correctTasks.size + writingOk;
  const percent = Math.round((score / totalTasks) * 100);

  scoreNode.textContent = String(score);
  progressLabel.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  if (percent >= 90) {
    rankLabel.textContent = "Niveau actuel : gardienne de la grammaire";
  } else if (percent >= 65) {
    rankLabel.textContent = "Niveau actuel : chevalière des homophones";
  } else if (percent >= 35) {
    rankLabel.textContent = "Niveau actuel : exploratrice des phrases";
  } else {
    rankLabel.textContent = "Niveau actuel : apprentie des verbes";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function checkSection(selector) {
  const section = document.querySelector(selector);
  const tasks = Array.from(section.querySelectorAll("[data-task]"));
  const correct = tasks.filter(checkTask).length;
  updateScore();
  saveState();
  saveHistorySnapshot();
  playResultSound(correct === tasks.length);

  if (correct === tasks.length) {
    showToast("Mission réussie. Le cahier ne fume plus.");
  } else {
    showToast(`Score de la mission : ${correct}/${tasks.length}. Encore une petite formule de révision.`);
  }
}

function countSentences(text) {
  const byPunctuation = text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (byPunctuation.length > 1) {
    return byPunctuation.length;
  }

  return text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function checkWriting() {
  const text = futureText.value.trim();
  const sentenceCount = countSentences(text);
  const futureWords = [
    "irai",
    "iras",
    "ira",
    "irons",
    "irez",
    "iront",
    "ferai",
    "feras",
    "fera",
    "ferons",
    "jouerai",
    "jouerons",
    "visiterai",
    "visiterons",
    "prendrai",
    "prendrons",
    "serai",
    "sera",
    "aurai",
    "aura",
    "vais",
    "allons",
    "presenterai",
    "presenteras",
    "presentera",
    "presenterons",
    "expliquerai",
    "parlerai",
    "lirai",
    "dirai",
    "recommanderai"
  ];
  const normalizedText = normalize(text);
  const hasFuture = futureWords.some((word) => normalizedText.includes(word));
  const hasReason = normalizedText.includes("parce que") || normalizedText.includes("car");
  const ok = sentenceCount >= 5 && sentenceCount <= 8 && hasFuture;

  document.body.dataset.writingOk = ok ? "true" : "false";
  futureText.classList.toggle("is-correct", ok);
  futureText.classList.toggle("is-wrong", !ok);

  if (ok && hasReason) {
    futureHelp.textContent = "Très bien : 5 à 8 phrases, futur et justification.";
  } else if (ok) {
    futureHelp.textContent = "Très bien. Tu peux ajouter parce que ou car pour justifier.";
  } else {
    futureHelp.textContent = `Le dragon compte ${sentenceCount} phrase(s). Il faut 5 à 8 phrases et du futur.`;
  }

  updateScore();
  saveState();
  saveHistorySnapshot();
  playResultSound(ok);
  showToast(ok ? "Texte validé." : "Texte à améliorer.");
}

document.querySelectorAll("[data-check]").forEach((button) => {
  button.addEventListener("click", () => checkSection(button.dataset.check));
});

document.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", queueSave);
  field.addEventListener("change", queueSave);
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.jump).scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

document.querySelectorAll(".word-row button, .choice-row button").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const task = button.closest("[data-task]");
    task.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-pressed", "false");
    });
    button.setAttribute("aria-pressed", "true");
    task.dataset.selected = button.dataset.value || button.textContent;
    queueSave();
  });
});

document.querySelector("#checkWritingBtn").addEventListener("click", checkWriting);

document.querySelector("#resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input, textarea").forEach((field) => {
    field.value = "";
    field.classList.remove("is-correct", "is-wrong");
  });

  document.querySelectorAll("[data-task]").forEach((task) => {
    task.classList.remove("is-correct", "is-wrong");
    delete task.dataset.selected;
    const feedback = task.querySelector(".feedback");
    if (feedback) {
      feedback.textContent = "";
    }
  });

  document.querySelectorAll(".word-row button, .choice-row button").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
  });

  correctTasks.clear();
  document.body.dataset.writingOk = "false";
  futureHelp.textContent = "Le dragon compte les phrases et cherche le futur.";
  localStorage.removeItem(STORAGE_KEY);
  startNewSession();
  updateScore();
  saveState();
  showToast("Tout est remis à zéro.");
});

restoreState();
updateScore();
if (collectHistoryEntry().workedMissions > 0) {
  saveHistorySnapshot();
}
