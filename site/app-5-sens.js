const ORGANS = ["l'œil", "la peau", "le nez", "la langue", "l'oreille"];
const VERBS = ["voir", "toucher", "sentir", "goûter", "entendre"];
const EYE_PARTS = [
  "la pupille", "l'iris", "la cornée", "la rétine", "le nerf optique",
  "la sclère", "le cristallin", "la paupière"
];
const SMELL_WORDS = [
  "des particules odorantes", "les narines", "la muqueuse olfactive",
  "le nerf olfactif", "cerveau", "le nerf auditif", "la peau", "la gorge"
];

const QUIZ = [
  {
    id: "sens", title: "Les cinq sens", instruction: "Choisis l'organe et le verbe qui correspondent à chaque sens.",
    items: [
      { id: "vue-organe", prompt: "La vue : quel organe ?", type: "select", options: ORGANS, answer: "l'œil" },
      { id: "vue-verbe", prompt: "La vue : que permet-elle de faire ?", type: "select", options: VERBS, answer: "voir" },
      { id: "toucher-organe", prompt: "Le toucher : quel organe ?", type: "select", options: ORGANS, answer: "la peau" },
      { id: "toucher-verbe", prompt: "Le toucher : quel verbe ?", type: "select", options: VERBS, answer: "toucher" },
      { id: "odorat-organe", prompt: "L'odorat : quel organe ?", type: "select", options: ORGANS, answer: "le nez" },
      { id: "odorat-verbe", prompt: "L'odorat : quel verbe ?", type: "select", options: VERBS, answer: "sentir" },
      { id: "gout-organe", prompt: "Le goût : quel organe ?", type: "select", options: ORGANS, answer: "la langue" },
      { id: "gout-verbe", prompt: "Le goût : quel verbe ?", type: "select", options: VERBS, answer: "goûter" },
      { id: "ouie-organe", prompt: "L'ouïe : quel organe ?", type: "select", options: ORGANS, answer: "l'oreille" },
      { id: "ouie-verbe", prompt: "L'ouïe : quel verbe ?", type: "select", options: VERBS, answer: "entendre" }
    ]
  },
  {
    id: "oeil", title: "Les secrets de l'œil", instruction: "Écris le nom de la partie ou choisis la bonne réponse.",
    items: [
      { id: "iris", prompt: "Quelle partie donne sa couleur à l'œil ?", type: "text", answer: "l'iris" },
      { id: "cristallin", prompt: "Quelle partie permet de voir net à différentes distances ?", type: "text", answer: "le cristallin" },
      { id: "retine", prompt: "Sur quelle partie se forment les images ?", type: "text", answer: "la rétine" },
      { id: "pupille", prompt: "Quelle partie grandit ou rétrécit selon la lumière ?", type: "text", answer: "la pupille" },
      { id: "nerf-optique", prompt: "Qu'est-ce qui transmet les informations au cerveau ?", type: "text", answer: "le nerf optique" },
      { id: "cornee", prompt: "Quelle partie transparente se trouve à l'avant de l'œil ?", type: "select", options: ["la cornée", "la sclère", "la paupière"], answer: "la cornée" },
      { id: "sclere", prompt: "Comment s'appelle la partie blanche de l'œil ?", type: "select", options: ["la sclère", "l'iris", "la rétine"], answer: "la sclère" },
      { id: "paupiere", prompt: "Quelle partie se ferme pour protéger l'œil ?", type: "select", options: ["la paupière", "la pupille", "le cristallin"], answer: "la paupière" }
    ]
  },
  {
    id: "schema-oeil", title: "La carte de l'œil", instruction: "Observe le schéma et nomme les parties A à H.",
    image: true,
    items: [
      { id: "schema-a", prompt: "A : quelle partie est indiquée ?", type: "select", options: EYE_PARTS, answer: "la paupière" },
      { id: "schema-b", prompt: "B : quelle partie est indiquée ?", type: "select", options: EYE_PARTS, answer: "l'iris" },
      { id: "schema-c", prompt: "C : quelle partie est indiquée ?", type: "select", options: EYE_PARTS, answer: "la pupille" },
      { id: "schema-d", prompt: "D : quelle partie est indiquée ?", type: "select", options: EYE_PARTS, answer: "la sclère" },
      { id: "schema-e", prompt: "E : quelle partie est indiquée ?", type: "select", options: EYE_PARTS, answer: "la cornée" },
      { id: "schema-f", prompt: "F : quelle partie est indiquée ?", type: "select", options: EYE_PARTS, answer: "le cristallin" },
      { id: "schema-g", prompt: "G : quelle partie est indiquée ?", type: "select", options: EYE_PARTS, answer: "le nerf optique" },
      { id: "schema-h", prompt: "H : quelle partie est indiquée ?", type: "select", options: EYE_PARTS, answer: "la rétine" }
    ]
  },
  {
    id: "ouie", title: "Le chemin du son", instruction: "Numérote les étapes de 1 à 5 dans le bon ordre.",
    items: [
      { id: "son-cochlee", prompt: "Les vibrations mettent en mouvement le fluide de la cochlée et les cellules ciliées.", type: "select", options: ["1", "2", "3", "4", "5"], answer: "3" },
      { id: "son-canal", prompt: "Le son arrive dans le canal auditif.", type: "select", options: ["1", "2", "3", "4", "5"], answer: "1" },
      { id: "son-cerveau", prompt: "Le nerf auditif envoie les informations au cerveau.", type: "select", options: ["1", "2", "3", "4", "5"], answer: "5" },
      { id: "son-cellules", prompt: "Les cellules ciliées transforment le mouvement en impulsions électriques.", type: "select", options: ["1", "2", "3", "4", "5"], answer: "4" },
      { id: "son-tympan", prompt: "Les ondes sonores font vibrer le tympan et les osselets.", type: "select", options: ["1", "2", "3", "4", "5"], answer: "2" }
    ]
  },
  {
    id: "odorat", title: "Le voyage d'une odeur", instruction: "Complète les phrases. Certains mots ne servent pas.",
    items: [
      { id: "odeur-air", prompt: "Dans l'air, il y a ...", type: "select", options: SMELL_WORDS, answer: "des particules odorantes" },
      { id: "odeur-entree", prompt: "Ces particules entrent par ...", type: "select", options: SMELL_WORDS, answer: "les narines" },
      { id: "odeur-muqueuse", prompt: "Dans la cavité nasale se trouve ...", type: "select", options: SMELL_WORDS, answer: "la muqueuse olfactive" },
      { id: "odeur-nerf", prompt: "Quel nerf envoie les informations au cerveau ?", type: "select", options: SMELL_WORDS, answer: "le nerf olfactif" },
      { id: "odeur-fin", prompt: "Les informations arrivent au ...", type: "select", options: SMELL_WORDS, answer: "cerveau" }
    ]
  },
  {
    id: "gout", title: "Vrai, faux et goût", instruction: "Choisis vrai ou faux, puis corrige les trois phrases fausses.",
    items: [
      { id: "gout-texture", prompt: "Le goût permet de percevoir la texture des aliments.", type: "choice", options: ["Vrai", "Faux"], answer: "Faux" },
      { id: "gout-cavite", prompt: "La langue se trouve dans la cavité nasale.", type: "choice", options: ["Vrai", "Faux"], answer: "Faux" },
      { id: "gout-odorat", prompt: "Quand l'odorat est abîmé, on ressent moins le goût des aliments.", type: "choice", options: ["Vrai", "Faux"], answer: "Vrai" },
      { id: "gout-papilles", prompt: "Sur la langue, il y a des papilles olfactives.", type: "choice", options: ["Vrai", "Faux"], answer: "Faux" },
      { id: "gout-amer", prompt: "Le café et les endives peuvent avoir un goût amer.", type: "choice", options: ["Vrai", "Faux"], answer: "Vrai" },
      { id: "gout-correction-texture", prompt: "Le goût permet de percevoir ...", type: "select", options: ["la saveur des aliments", "la texture des aliments", "le bruit des aliments"], answer: "la saveur des aliments" },
      { id: "gout-correction-cavite", prompt: "La langue se trouve dans ...", type: "select", options: ["la cavité buccale", "la cavité nasale", "l'oreille"], answer: "la cavité buccale" },
      { id: "gout-correction-papilles", prompt: "Sur la langue, il y a des papilles ...", type: "select", options: ["gustatives", "olfactives", "auditives"], answer: "gustatives" }
    ]
  },
  {
    id: "toucher", title: "La peau et le toucher", instruction: "Choisis toutes les bonnes réponses quand c'est demandé.",
    items: [
      { id: "peau-sensations", prompt: "Quelles sensations perçoit-on grâce à la peau ? (4 réponses)", type: "multi", options: ["le froid", "la peur", "la chaleur", "le bruit", "la douleur", "la pression"], answer: ["le froid", "la chaleur", "la douleur", "la pression"] },
      { id: "peau-couches", prompt: "Combien de couches composent la peau ?", type: "select", options: ["2", "3", "4", "5"], answer: "3" },
      { id: "peau-exterieure", prompt: "Comment s'appelle la couche extérieure de la peau ?", type: "select", options: ["l'hypoderme", "le derme", "l'épiderme"], answer: "l'épiderme" },
      { id: "peau-glandes", prompt: "Que permettent les glandes sudoripares ? (2 réponses)", type: "multi", options: ["laisser passer la transpiration", "rafraîchir la peau", "faire bronzer la peau"], answer: ["laisser passer la transpiration", "rafraîchir la peau"] },
      { id: "peau-derme", prompt: "Que trouve-t-on dans le derme ? (2 réponses)", type: "multi", options: ["des récepteurs connectés au cerveau", "des pores", "des glandes sudoripares"], answer: ["des récepteurs connectés au cerveau", "des glandes sudoripares"] }
    ]
  }
];

const STORAGE_KEY = "mila-les-5-sens-progress-v1";
const HISTORY_KEY = "mila-french-dst3-history-v1";
const allItems = QUIZ.flatMap((mission) => mission.items);
const itemById = new Map(allItems.map((item) => [item.id, item]));
const questionById = new Map();
const scoreNode = document.querySelector("#score");
const progressNode = document.querySelector("#progressLabel");
const progressFill = document.querySelector("#progressFill");
const saveStatus = document.querySelector("#saveStatus");
const toast = document.querySelector("#toast");
let audioContext = null;

function newState() {
  return {
    version: 1,
    sessionId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    answers: {}
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.version === 1 && saved.sessionId && saved.answers && typeof saved.answers === "object") {
      return saved;
    }
  } catch (error) {
    saveStatus.textContent = "Speichern nicht verfügbar";
  }
  return newState();
}

let state = loadState();

function normalize(value) {
  return String(value).trim().toLocaleLowerCase("fr")
    .replace(/[’]/g, "'")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/^(l'|le |la |les )/, "")
    .replace(/[.!?]+$/, "")
    .replace(/\s+/g, " ");
}

function responseFor(id) {
  return state.answers[id] || { value: "", checked: false, correct: false };
}

function hasValue(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(String(value || "").trim());
}

function expectedText(item) {
  return Array.isArray(item.answer) ? item.answer.join(", ") : item.answer;
}

function createQuestion(item) {
  const card = document.createElement("article");
  card.className = "sense-question";
  card.dataset.id = item.id;

  const title = document.createElement("h3");
  title.textContent = item.prompt;
  title.id = `question-${item.id}`;
  card.append(title);

  const saved = responseFor(item.id);
  if (item.type === "select") {
    const select = document.createElement("select");
    select.setAttribute("aria-labelledby", title.id);
    select.append(new Option("Choisis ...", ""));
    item.options.forEach((option) => select.append(new Option(option, option)));
    select.value = saved.value || "";
    select.addEventListener("change", () => updateResponse(item.id, select.value));
    card.append(select);
  } else if (item.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.autocapitalize = "none";
    input.spellcheck = false;
    input.setAttribute("aria-labelledby", title.id);
    input.value = saved.value || "";
    input.addEventListener("input", () => updateResponse(item.id, input.value));
    card.append(input);
  } else {
    const options = document.createElement("div");
    options.className = "sense-options";
    options.setAttribute("role", item.type === "choice" ? "radiogroup" : "group");
    options.setAttribute("aria-labelledby", title.id);
    item.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.dataset.value = option;
      const selected = item.type === "multi"
        ? Array.isArray(saved.value) && saved.value.includes(option)
        : saved.value === option;
      if (item.type === "choice") {
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", String(selected));
      } else {
        button.setAttribute("aria-pressed", String(selected));
      }
      button.addEventListener("click", () => {
        if (item.type === "multi") {
          const current = new Set(responseFor(item.id).value || []);
          if (current.has(option)) current.delete(option);
          else current.add(option);
          updateResponse(item.id, [...current]);
        } else {
          updateResponse(item.id, option);
        }
        options.querySelectorAll("button").forEach((other) => {
          const value = other.dataset.value;
          const response = responseFor(item.id).value;
          const active = Array.isArray(response) ? response.includes(value) : response === value;
          other.setAttribute(item.type === "choice" ? "aria-checked" : "aria-pressed", String(active));
        });
      });
      options.append(button);
    });
    card.append(options);
  }

  const feedback = document.createElement("p");
  feedback.className = "sense-feedback";
  feedback.setAttribute("aria-live", "polite");
  card.append(feedback);
  questionById.set(item.id, card);
  showFeedback(item.id);
  return card;
}

function renderQuiz() {
  const nav = document.querySelector("#missionNav");
  const target = document.querySelector("#missions");
  QUIZ.forEach((mission, index) => {
    const link = document.createElement("a");
    link.href = `#${mission.id}`;
    link.textContent = mission.title;
    nav.append(link);

    const section = document.createElement("section");
    section.className = "senses-mission";
    section.id = mission.id;
    section.setAttribute("aria-labelledby", `${mission.id}-title`);
    const heading = document.createElement("div");
    heading.className = "senses-heading";
    const number = document.createElement("p");
    number.className = "eyebrow";
    number.textContent = `Mission ${index + 1}`;
    const title = document.createElement("h2");
    title.id = `${mission.id}-title`;
    title.textContent = mission.title;
    const instruction = document.createElement("p");
    instruction.textContent = mission.instruction;
    heading.append(number, title, instruction);
    section.append(heading);
    if (mission.image) {
      const figure = document.createElement("figure");
      figure.className = "eye-diagram";
      const canvas = document.createElement("div");
      canvas.className = "eye-diagram-canvas";
      const image = document.createElement("img");
      image.src = "assets/eye-diagram.png";
      image.alt = "Schéma d'un œil de face et en coupe avec huit repères.";
      image.width = 1550;
      image.height = 1014;
      canvas.append(image);
      const markers = [
        ["A", 59.5, 14.4], ["B", 52.3, 28.2], ["C", 44.5, 43.7],
        ["D", 26.1, 63.4], ["E", 43.7, 62.5], ["F", 71.1, 24.3],
        ["G", 86.1, 18.3], ["H", 47.1, 80.2]
      ];
      markers.forEach(([letter, x, y]) => {
        const marker = document.createElement("span");
        marker.className = "eye-marker";
        marker.textContent = letter;
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        marker.setAttribute("aria-hidden", "true");
        canvas.append(marker);
      });
      figure.append(canvas);
      section.append(figure);
    }
    const grid = document.createElement("div");
    grid.className = "senses-grid";
    mission.items.forEach((item) => grid.append(createQuestion(item)));
    const check = document.createElement("button");
    check.type = "button";
    check.className = "check-button senses-check";
    check.textContent = "Vérifier";
    check.addEventListener("click", () => checkMission(mission));
    section.append(grid, check);
    target.append(section);
  });
  document.querySelector("#total").textContent = String(allItems.length);
  updateScore();
}

function showFeedback(id) {
  const card = questionById.get(id);
  if (!card) return;
  const answer = responseFor(id);
  card.classList.toggle("is-correct", Boolean(answer.checked && answer.correct));
  card.classList.toggle("is-wrong", Boolean(answer.checked && !answer.correct && hasValue(answer.value)));
  card.querySelector(".sense-feedback").textContent = !answer.checked ? ""
    : answer.correct ? "Bravo, c'est juste !"
      : !hasValue(answer.value) ? "Choisis ou écris une réponse, puis vérifie encore."
      : `À revoir. Réponse : ${expectedText(itemById.get(id))}`;
}

function updateResponse(id, value) {
  state.answers[id] = { value, checked: false, correct: false };
  showFeedback(id);
  updateScore();
  save();
}

function isCorrect(item, value) {
  if (item.type === "multi") {
    return Array.isArray(value) &&
      value.map(normalize).sort().join("|") === item.answer.map(normalize).sort().join("|");
  }
  return normalize(value || "") === normalize(item.answer);
}

function checkMission(mission) {
  if (!mission.items.some((item) => hasValue(responseFor(item.id).value))) {
    showToast("Choisis ou écris d'abord une réponse.");
    return;
  }
  let correct = 0;
  mission.items.forEach((item) => {
    const value = responseFor(item.id).value;
    const ok = isCorrect(item, value);
    state.answers[item.id] = { value, checked: true, correct: ok };
    if (ok) correct += 1;
    showFeedback(item.id);
  });
  updateScore();
  save();
  playResultSound(correct === mission.items.length);
  showToast(correct === mission.items.length
    ? "Mission réussie !"
    : `${correct}/${mission.items.length} bonnes réponses. Tu peux corriger et vérifier encore.`);
}

function updateScore() {
  const score = allItems.filter((item) => responseFor(item.id).correct).length;
  const percent = Math.round(score / allItems.length * 100);
  scoreNode.textContent = String(score);
  progressNode.textContent = `${percent} %`;
  progressFill.style.width = `${percent}%`;
}

function historyEntry() {
  const missions = QUIZ.map((mission) => {
    const answers = mission.items.filter((item) => hasValue(responseFor(item.id).value))
      .map((item) => [item.prompt, Array.isArray(responseFor(item.id).value)
        ? responseFor(item.id).value.join(", ") : responseFor(item.id).value]);
    const mistakes = mission.items.filter((item) => {
      const response = responseFor(item.id);
      return response.checked && !response.correct && hasValue(response.value);
    })
      .map((item) => ({ mission: mission.title, prompt: item.prompt,
        answer: Array.isArray(responseFor(item.id).value) ? responseFor(item.id).value.join(", ") : responseFor(item.id).value,
        expected: expectedText(item) }));
    return {
      id: mission.id, title: mission.title, total: mission.items.length,
      correct: mission.items.filter((item) => responseFor(item.id).correct).length,
      touched: mission.items.filter((item) => hasValue(responseFor(item.id).value)).length,
      answers, mistakes
    };
  });
  const score = missions.reduce((sum, mission) => sum + mission.correct, 0);
  return {
    sessionId: state.sessionId,
    title: "Les 5 sens - Révisions DST n°1",
    createdAt: state.createdAt,
    updatedAt: new Date().toISOString(),
    score,
    total: allItems.length,
    percent: Math.round(score / allItems.length * 100),
    completedMissions: missions.filter((mission) => mission.correct === mission.total).length,
    workedMissions: missions.filter((mission) => mission.touched > 0).length,
    missions: missions.map(({ answers, mistakes, ...summary }) => summary),
    answers: missions.filter((mission) => mission.answers.length)
      .map((mission) => ({ title: mission.title, items: mission.answers })),
    mistakes: missions.flatMap((mission) => mission.mistakes)
  };
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const entry = historyEntry();
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const previous = Array.isArray(history) ? history : [];
    if (entry.workedMissions > 0 || previous.some((run) => run.sessionId === state.sessionId)) {
      const otherRuns = previous.filter((run) => run.sessionId !== state.sessionId);
      localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...otherRuns].slice(0, 40)));
    }
    saveStatus.textContent = "Automatisch gespeichert";
  } catch (error) {
    saveStatus.textContent = "Speichern nicht verfügbar";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function playResultSound(ok) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioContext) audioContext = new AudioContextClass();
  const play = () => {
    const notes = ok ? [523.25, 659.25, 783.99] : [164.81, 123.47];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + index * 0.11;
      oscillator.type = ok ? "sine" : "sawtooth";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.06, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.17);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.18);
    });
  };
  if (audioContext.state === "suspended") audioContext.resume().then(play).catch(() => {});
  else play();
}

document.querySelector("#resetBtn").addEventListener("click", () => {
  if (!window.confirm("Neuen Durchgang starten? Der bisherige Durchgang bleibt in der Übersicht gespeichert.")) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    saveStatus.textContent = "Speichern nicht verfügbar";
  }
  window.location.reload();
});

renderQuiz();
if (Object.keys(state.answers).length) saveStatus.textContent = "Stand wiederhergestellt";
else save();
