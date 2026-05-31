const HISTORY_KEY = "mila-french-dst3-history-v1";
const historyList = document.querySelector("#historyList");
const summaryGrid = document.querySelector("#summaryGrid");

const LEGACY_HISTORY = [
  {
    sessionId: "nachtrag-pdf-2026-05-31-1826",
    title: "Mission de français DST3",
    createdAt: "2026-05-31T18:26:34+02:00",
    updatedAt: "2026-05-31T18:26:34+02:00",
    score: 45,
    total: 45,
    percent: 100,
    completedMissions: 10,
    workedMissions: 10,
    note: "Nachgetragen aus Milas PDF-Durchgang vom 31.05.2026, 18:26 Uhr.",
    missions: [
      { id: "conjugaison", title: "Conjugaison au présent", total: 8, correct: 8, touched: 8 },
      { id: "verbes", title: "Chasse aux verbes conjugués", total: 4, correct: 4, touched: 4 },
      { id: "infinitif", title: "Machine à infinitifs", total: 6, correct: 6, touched: 6 },
      { id: "phrase", title: "Sujet, verbe, complément", total: 6, correct: 6, touched: 6 },
      { id: "homophones", title: "Les homophones piégés", total: 6, correct: 6, touched: 6 },
      { id: "temps", title: "Passé, présent ou futur", total: 3, correct: 3, touched: 3 },
      { id: "accords", title: "Accords dans le groupe nominal", total: 4, correct: 4, touched: 4 },
      { id: "sons", title: "Les sons secrets", total: 4, correct: 4, touched: 4 },
      { id: "lecture", title: "Lecture : Quoi de neuf ?", total: 3, correct: 3, touched: 3 },
      { id: "ecriture", title: "Production écrite au futur", total: 1, correct: 1, touched: 1 }
    ],
    answers: [
      {
        title: "Mission 1 : Conjugaison",
        items: [
          ["Je (pouvoir)", "Peux"],
          ["Tu (vouloir)", "veux"],
          ["Le pirate (finir)", "finit"],
          ["Nous (venir) à l'école demain", "Venons"],
          ["Vous (faire)", "Faites"],
          ["Les dragons (dire)", "disent"],
          ["Les enfants (prendre)", "Prennent"],
          ["Nous (aller)", "allons"]
        ]
      },
      {
        title: "Mission 2 : Verbes conjugués",
        items: [
          ["La petite sorcière prépare une soupe aux étoiles.", "prépare"],
          ["Les enfants ont des cahiers dans leurs sacs.", "ont"],
          ["Demain, le pirate ira au musée.", "ira"],
          ["Hier, Mila a rangé son livre de lecture.", "a rangé"]
        ]
      },
      {
        title: "Mission 3 : Infinitifs",
        items: [
          ["Le dragon peut lire la carte.", "Pouvoir"],
          ["Mila veut présenter un livre.", "vouloir"],
          ["Nous faisons un exercice.", "faire"],
          ["Tu prends ton cahier.", "prendre"],
          ["Les élèves vont en classe.", "aller"],
          ["La réponse est juste.", "Être"]
        ]
      },
      {
        title: "Mission 4 : Sujet, verbe, complément",
        items: [
          ["La maîtresse explique la consigne. Sujet", "La maîtresse"],
          ["La maîtresse explique la consigne. Verbe", "Explique"],
          ["La maîtresse explique la consigne. Complément", "La consigne"],
          ["Les dragons rangent les livres. Sujet", "Les dragons"],
          ["Les dragons rangent les livres. Verbe", "Rangent"],
          ["Les dragons rangent les livres. Complément", "Les livres"]
        ]
      },
      {
        title: "Mission 5 : Homophones",
        items: [
          ["____ lit un texte en classe.", "on"],
          ["Les élèves ____ fini leurs fiches.", "ont"],
          ["Mila prend ____ cahier violet.", "son"],
          ["Les pirates ____ sur le bateau.", "sont"],
          ["Le livre ____ intéressant.", "est"],
          ["Nous allons ____ l'école.", "à"]
        ]
      },
      {
        title: "Mission 6 : Temps",
        items: [
          ["Hier, Mila a présenté un livre.", "passé"],
          ["Maintenant, nous corrigeons nos erreurs.", "présent"],
          ["Demain, les enfants iront au théâtre.", "futur"]
        ]
      },
      {
        title: "Mission 7 : Accords",
        items: [
          ["le petit chat noir", "Les petits chats noirs"],
          ["un grand dragon vert", "Des grands dragons verts"],
          ["une robe (bleu)", "Une robe bleue"],
          ["des fleurs (joli)", "Des jolies fleurs"]
        ]
      },
      {
        title: "Mission 8 : Sons",
        items: [
          ["armoire", "oi"],
          ["vacances", "an"],
          ["souris", "ou"],
          ["jardin", "in"]
        ]
      },
      {
        title: "Mission 9 : Lecture",
        items: [
          ["Qu'est-ce que Mila présente à sa classe ?", "Mila présente à sa classe une livre."],
          ["Que trouve la fille dans l'histoire ?", "la fille trouve une carte dans une vieille bibliothèque."],
          ["Pourquoi Mila aime-t-elle cette histoire ?", "car elle trouve la histoire drôle et un peu mystérieuse."]
        ]
      },
      {
        title: "Mission 10 : Futur",
        items: [
          ["Mes prochaines vacances", "Demain, je ferai un match de hockey .\nDans quelques jours on verra le pizza.\nBientôt je vais a la piscine.\nJe visiterai mes cousins.\nJe jouerai avec toi."]
        ]
      }
    ],
    mistakes: []
  }
];

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
    // The overview should still render if storage is blocked.
  }
}

function mergeHistory(history) {
  const entriesBySession = new Map();

  [...history, ...LEGACY_HISTORY].forEach((entry) => {
    const key = entry.sessionId || `${entry.title}-${entry.updatedAt}`;
    entriesBySession.set(key, entry);
  });

  return Array.from(entriesBySession.values())
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderSummary(history) {
  const latest = history[0];
  const best = history.reduce((max, item) => Math.max(max, item.percent || 0), 0);
  const totalRuns = history.length;
  const completed = history.filter((item) => item.percent >= 90).length;

  summaryGrid.innerHTML = `
    <div class="summary-item"><span>Durchgänge</span><strong>${totalRuns}</strong></div>
    <div class="summary-item"><span>Bester Score</span><strong>${best}%</strong></div>
    <div class="summary-item"><span>Sehr stark</span><strong>${completed}</strong></div>
    <div class="summary-item"><span>Letzter Stand</span><strong>${latest ? `${latest.score}/${latest.total}` : "-"}</strong></div>
  `;
}

function renderHistory(history) {
  if (history.length === 0) {
    historyList.innerHTML = `
      <section class="empty-state">
        <h1>Noch kein gespeicherter Durchgang</h1>
        <p>Wenn Mila eine Mission mit Vérifier prüft, erscheint sie hier.</p>
      </section>
    `;
    return;
  }

  historyList.innerHTML = history.map((entry) => {
    const badgeClass = entry.percent >= 90 ? "good" : "work";
    const badgeText = entry.percent >= 90 ? "Sehr stark" : "Weiter üben";
    const missions = (entry.missions || []).map((mission) => `
      <div class="mission-result">
        <div>
          <strong>${htmlEscape(mission.title)}</strong>
          <span>${mission.correct}/${mission.total} richtig</span>
        </div>
        <span>${mission.touched ? "gemacht" : "offen"}</span>
      </div>
    `).join("");
    const mistakes = (entry.mistakes || []).slice(0, 10).map((mistake) => `
      <li>
        <strong>${htmlEscape(mistake.mission)}:</strong>
        ${htmlEscape(mistake.prompt)}
        ${mistake.answer ? ` · Antwort: ${htmlEscape(mistake.answer)}` : ""}
        ${mistake.expected ? ` · Erwartet: ${htmlEscape(mistake.expected)}` : ""}
      </li>
    `).join("");
    const answers = (entry.answers || []).map((group) => `
      <section class="answer-group">
        <h3>${htmlEscape(group.title)}</h3>
        <dl>
          ${group.items.map(([prompt, answer]) => `
            <div>
              <dt>${htmlEscape(prompt)}</dt>
              <dd>${htmlEscape(answer).replaceAll("\n", "<br>")}</dd>
            </div>
          `).join("")}
        </dl>
      </section>
    `).join("");

    return `
      <article class="history-card">
        <header>
          <div>
            <p class="eyebrow">${formatDate(entry.updatedAt)}</p>
            <h2>${htmlEscape(entry.title)}</h2>
            <p>Score: ${entry.score}/${entry.total} · ${entry.percent}% · Missionen: ${entry.completedMissions}/10 komplett</p>
            ${entry.note ? `<p class="history-note">${htmlEscape(entry.note)}</p>` : ""}
          </div>
          <span class="status-badge ${badgeClass}">${badgeText}</span>
        </header>
        <details class="run-details">
          <summary>
            <span>Bereiche anzeigen</span>
            <small>${entry.workedMissions || 0} Bereiche gemacht</small>
          </summary>
          <div class="mission-result-list">${missions}</div>
          ${answers ? `
            <details class="answer-review">
              <summary>Ausgefüllte Antworten anzeigen</summary>
              ${answers}
            </details>
          ` : ""}
          ${mistakes ? `
            <div class="mistake-list">
              <h3>Noch anschauen</h3>
              <ul>${mistakes}</ul>
            </div>
          ` : ""}
        </details>
      </article>
    `;
  }).join("");
}

const history = mergeHistory(loadHistory());
saveHistory(history);
renderSummary(history);
renderHistory(history);
