(() => {
  const STORAGE_KEY = "mila-mathe-mission-1-v1";
  document.querySelectorAll('input.answer[data-task]').forEach((input) => {
    if (input.closest(".question")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "cell-answer";
    wrapper.dataset.task = "";
    input.removeAttribute("data-task");
    input.replaceWith(wrapper);
    wrapper.append(input);
  });
  const tasks = [...document.querySelectorAll("[data-task]")];
  const missions = [...document.querySelectorAll(".mission")];
  const score = document.querySelector("#score");
  const total = document.querySelector("#total");
  const saveStatus = document.querySelector("#saveStatus");
  const progressLabel = document.querySelector("#progressLabel");
  const progressFill = document.querySelector("#progressFill");
  const rankLabel = document.querySelector("#rankLabel");
  const numberFormat = new Intl.NumberFormat("de-DE");
  let saveTimer;

  tasks.forEach((task, index) => { task.dataset.taskId = `task-${index + 1}`; });

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .toLocaleLowerCase("de")
      .replace(/[’‘`]/g, "'")
      .replace(/[×*]/g, "x")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[.,](?=\d{3}(?:\D|$))/g, "")
      .replace(/,/g, ".")
      .replace(/\s/g, "");
  }

  function numberList(value) {
    return String(value ?? "").match(/\d+/g)?.map(Number) ?? [];
  }

  function taskBox(task) {
    return task.closest(".question") || task;
  }

  function taskInput(task) {
    if (task.matches("input.answer")) return task;
    return task.querySelector("input.answer");
  }

  function feedbackFor(task) {
    const box = taskBox(task);
    let feedback = box.querySelector(":scope > .feedback");
    if (!feedback) {
      feedback = document.createElement("small");
      feedback.className = "feedback";
      feedback.setAttribute("aria-live", "polite");
      if (box.matches("input")) box.insertAdjacentElement("afterend", feedback);
      else box.append(feedback);
    }
    return feedback;
  }

  function taskValue(task) {
    if (task.hasAttribute("data-strip-answer")) {
      return [...task.querySelectorAll(".paint-cell")].map((cell) => cell.dataset.color || "");
    }
    const checkboxes = [...task.querySelectorAll('input[type="checkbox"]')];
    if (checkboxes.length) return checkboxes.filter((item) => item.checked).map((item) => item.dataset.value);
    const input = taskInput(task);
    if (input) return input.value;
    return task.querySelector('.choice[aria-pressed="true"]')?.dataset.value || "";
  }

  function restoreTask(task, saved) {
    if (task.hasAttribute("data-strip-answer") && Array.isArray(saved)) {
      task.querySelectorAll(".paint-cell").forEach((cell, index) => setCellColor(cell, saved[index] || ""));
      return;
    }
    const checkboxes = [...task.querySelectorAll('input[type="checkbox"]')];
    if (checkboxes.length && Array.isArray(saved)) {
      checkboxes.forEach((item) => { item.checked = saved.includes(item.dataset.value); });
      return;
    }
    const input = taskInput(task);
    if (input && typeof saved === "string") {
      input.value = saved;
      return;
    }
    if (typeof saved === "string" && saved) {
      task.querySelectorAll(".choice").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.value === saved));
      });
    }
  }

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function collectState() {
    const answers = {};
    const results = {};
    tasks.forEach((task) => {
      answers[task.dataset.taskId] = taskValue(task);
      if (task.dataset.result) results[task.dataset.taskId] = task.dataset.result;
    });
    return { answers, results, savedAt: new Date().toISOString() };
  }

  function saveNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
      saveStatus.textContent = "Auf diesem Gerät gespeichert";
    } catch {
      saveStatus.textContent = "Speichern nicht verfügbar";
    }
  }

  function saveSoon() {
    saveStatus.textContent = "Speichert …";
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveNow, 180);
  }

  function refreshChart(chart) {
    const max = Number(chart.dataset.max) || 10;
    const inputs = [...chart.querySelectorAll(".chart-input")];
    const plot = chart.querySelector(".bar-plot");
    plot.replaceChildren();
    inputs.forEach((input) => {
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      const fill = document.createElement("i");
      const label = document.createElement("span");
      const amount = Number(input.value);
      fill.style.height = Number.isFinite(amount) ? `${Math.max(0, Math.min(100, amount / max * 100))}%` : "0%";
      label.textContent = input.dataset.chartKey;
      bar.setAttribute("aria-label", `${input.dataset.chartKey}: ${input.value || 0}`);
      bar.append(fill, label);
      plot.append(bar);
    });
  }

  function setCellColor(cell, color) {
    cell.dataset.color = color;
    cell.setAttribute("aria-label", color ? `Feld: ${color}` : "Leeres Feld");
  }

  function buildPaintStrips() {
    document.querySelectorAll("[data-paint-strip]").forEach((strip) => {
      const count = strip.dataset.paintStrip === "vote" ? 16 : 20;
      for (let i = 0; i < count; i += 1) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "paint-cell";
        cell.dataset.index = String(i);
        cell.setAttribute("aria-label", `Feld ${i + 1}, leer`);
        strip.append(cell);
      }
    });
  }

  function renderNumberlines() {
    const svgNS = "http://www.w3.org/2000/svg";
    document.querySelectorAll("[data-numberline]").forEach((host) => {
      const svg = document.createElementNS(svgNS, "svg");
      const min = Number(host.dataset.min);
      const max = Number(host.dataset.max);
      const step = Number(host.dataset.step);
      const majorEvery = Number(host.dataset.labelEvery) || 1;
      const width = 760;
      const height = 105;
      const left = 30;
      const right = 730;
      const axisY = 74;
      const ticks = Math.round((max - min) / step);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", `Zahlengerade von ${min} bis ${numberFormat.format(max)}`);
      const axis = document.createElementNS(svgNS, "line");
      axis.setAttribute("x1", left); axis.setAttribute("x2", right); axis.setAttribute("y1", axisY); axis.setAttribute("y2", axisY);
      axis.setAttribute("stroke", "#53696b"); axis.setAttribute("stroke-width", "2");
      svg.append(axis);
      for (let i = 0; i <= ticks; i += 1) {
        const x = left + (right - left) * i / ticks;
        const major = i % majorEvery === 0;
        const tick = document.createElementNS(svgNS, "line");
        tick.setAttribute("x1", x); tick.setAttribute("x2", x); tick.setAttribute("y1", axisY - (major ? 8 : 4)); tick.setAttribute("y2", axisY + (major ? 8 : 4));
        tick.setAttribute("stroke", major ? "#53696b" : "#a9bab7"); tick.setAttribute("stroke-width", major ? "1.4" : "1");
        svg.append(tick);
        if (major) {
          const label = document.createElementNS(svgNS, "text");
          label.setAttribute("x", x); label.setAttribute("y", axisY + 23); label.setAttribute("text-anchor", "middle");
          label.setAttribute("font-size", ticks > 30 ? "11" : "13"); label.setAttribute("fill", "#465a5d");
          label.textContent = numberFormat.format(min + i * step);
          svg.append(label);
        }
      }
      host.dataset.points.split("|").forEach((point) => {
        const [name, rawValue] = point.split(":");
        const value = Number(rawValue);
        const x = left + (right - left) * (value - min) / (max - min);
        const arrow = document.createElementNS(svgNS, "line");
        arrow.setAttribute("x1", x); arrow.setAttribute("x2", x); arrow.setAttribute("y1", 24); arrow.setAttribute("y2", axisY - 9);
        arrow.setAttribute("stroke", "#df695d"); arrow.setAttribute("stroke-width", "2");
        const head = document.createElementNS(svgNS, "path");
        head.setAttribute("d", `M ${x - 5} ${axisY - 10} L ${x + 5} ${axisY - 10} L ${x} ${axisY - 2} Z`);
        head.setAttribute("fill", "#df695d");
        const letter = document.createElementNS(svgNS, "text");
        letter.setAttribute("x", x); letter.setAttribute("y", "18"); letter.setAttribute("text-anchor", "middle"); letter.setAttribute("font-size", "14"); letter.setAttribute("font-weight", "800"); letter.setAttribute("fill", "#a94740"); letter.textContent = name;
        svg.append(arrow, head, letter);
      });
      host.replaceChildren(svg);
    });
  }

  function renderWeights() {
    const weights = [2500, 2700, 2900, 3100, 3300, 3500, 3700, 3900, 4100, 4300, 4500, 4700, 4900];
    const counts = [1, 2, 4, 7, 10, 11, 8, 6, 5, 4, 3, 2, 1];
    const chart = document.querySelector("[data-weight-chart]");
    weights.forEach((weight, index) => {
      const row = document.createElement("div"); row.className = "weight-row";
      const label = document.createElement("span"); label.textContent = `${numberFormat.format(weight)} g`;
      const bar = document.createElement("i"); bar.style.width = `${counts[index] / 12 * 100}%`;
      const count = document.createElement("b"); count.textContent = String(counts[index]);
      row.append(label, bar, count); chart.append(row);
    });
  }

  function paintResult(task) {
    const expected = task.dataset.stripAnswer.split(";").map(Number);
    const stripType = task.querySelector("[data-paint-strip]")?.dataset.paintStrip;
    const keys = stripType === "vote"
      ? ["mina", "ali", "bea", "leo", "other"]
      : ["blue", "yellow", "orange", "white", "black", "red", "silver"];
    const counts = keys.map((key) => task.querySelectorAll(`.paint-cell[data-color="${key}"]`).length);
    return counts.every((count, index) => count === expected[index]);
  }

  function checkTask(task) {
    if (task.hasAttribute("data-strip-answer")) return paintResult(task);
    if (task.hasAttribute("data-multi-answer")) {
      const expected = task.dataset.multiAnswer.split(";").map(normalize).sort();
      const actual = [...task.querySelectorAll('input[type="checkbox"]:checked')].map((item) => normalize(item.dataset.value)).sort();
      return expected.length === actual.length && expected.every((value, index) => value === actual[index]);
    }
    const input = taskInput(task);
    if (input) {
      const actual = input.value.trim();
      const expected = input.dataset.answer ?? task.dataset.answer ?? "";
      if (!actual) return false;
      if (input.hasAttribute("data-list")) {
        const actualList = numberList(actual);
        const expectedList = numberList(expected);
        return actualList.length === expectedList.length && actualList.every((value, index) => value === expectedList[index]);
      }
      return normalize(actual) === normalize(expected);
    }
    const selected = task.querySelector('.choice[aria-pressed="true"]')?.dataset.value;
    if (!selected) return false;
    return normalize(selected) === normalize(task.dataset.answer);
  }

  function updateTaskFeedback(task, checked) {
    const box = taskBox(task);
    box.classList.remove("is-correct", "is-wrong");
    box.dataset.result = checked ? "correct" : "wrong";
    box.classList.add(checked ? "is-correct" : "is-wrong");
    feedbackFor(task).textContent = checked ? "Richtig!" : "Noch nicht. Schau dir die Regel an und probiere es noch einmal.";
  }

  function updateProgress() {
    const right = tasks.filter((task) => task.dataset.result === "correct").length;
    score.textContent = String(right);
    total.textContent = String(tasks.length);
    let finished = 0;
    missions.forEach((mission) => {
      const missionTasks = [...mission.querySelectorAll("[data-task]")];
      const done = missionTasks.length > 0 && missionTasks.every((task) => task.dataset.result === "correct");
      const badge = mission.querySelector("[data-mission-score]");
      badge.textContent = `${missionTasks.filter((task) => task.dataset.result === "correct").length}/${missionTasks.length}`;
      badge.classList.toggle("is-done", done);
      if (done) finished += 1;
    });
    progressLabel.textContent = `${finished} von ${missions.length}`;
    progressFill.style.width = `${finished / missions.length * 100}%`;
    rankLabel.textContent = finished === missions.length
      ? "Geschafft! Der Zahlen-Drache feiert mit dir."
      : finished >= 6
        ? "Stark! Schon mehr als die Hälfte der Missionen geschafft."
        : finished > 0
          ? "Guter Start. Ein Schritt nach dem anderen."
          : "Der Zahlen-Drache wartet auf deinen ersten Zug.";
  }

  function restore() {
    const saved = readState();
    tasks.forEach((task) => {
      const id = task.dataset.taskId;
      if (saved.answers && Object.hasOwn(saved.answers, id)) restoreTask(task, saved.answers[id]);
      const result = saved.results?.[id];
      if (result === "correct" || result === "wrong") updateTaskFeedback(task, result === "correct");
    });
    document.querySelectorAll("[data-bar-chart]").forEach(refreshChart);
    updateStackedChart();
    updateProgress();
    saveStatus.textContent = saved.savedAt ? "Stand wiederhergestellt" : "Auf diesem Gerät gespeichert";
  }

  function updateStackedChart() {
    const counts = [...document.querySelectorAll("#haeufigkeiten .frequency-table input")].map((input) => Math.max(0, Number(input.value) || 0));
    const chart = document.querySelector('[data-stacked-chart="commute"]');
    chart.replaceChildren();
    let cellsAdded = 0;
    for (let group = 0; group < 7; group += 1) {
      for (let n = 0; n < counts[group] && cellsAdded < 24; n += 1) {
        const cell = document.createElement("i"); cell.dataset.group = String(group); cell.title = `${n + 1} · Zeitgruppe ${group + 1}`; chart.append(cell);
        cellsAdded += 1;
      }
    }
    while (chart.childElementCount < 24) chart.append(document.createElement("i"));
  }

  function clearTaskResult(task) {
    const box = taskBox(task);
    delete task.dataset.result;
    delete box.dataset.result;
    box.classList.remove("is-correct", "is-wrong");
    const feedback = box.querySelector(":scope > .feedback");
    if (feedback) feedback.textContent = "";
    updateProgress();
  }

  document.addEventListener("input", (event) => {
    const task = event.target.closest("[data-task]");
    if (task) clearTaskResult(task);
    if (event.target.matches(".chart-input")) refreshChart(event.target.closest("[data-bar-chart]"));
    if (event.target.closest("#haeufigkeiten .frequency-table")) updateStackedChart();
    saveSoon();
  });
  document.addEventListener("change", (event) => {
    const task = event.target.closest("[data-task]");
    if (task) clearTaskResult(task);
    if (event.target.matches(".chart-input")) refreshChart(event.target.closest("[data-bar-chart]"));
    if (event.target.closest("#haeufigkeiten .frequency-table")) updateStackedChart();
    saveSoon();
  });
  document.addEventListener("click", (event) => {
    const check = event.target.closest("[data-check]");
    if (check) {
      const mission = check.closest(".mission");
      mission.querySelectorAll("[data-task]").forEach((task) => updateTaskFeedback(task, checkTask(task)));
      updateProgress();
      saveNow();
      const firstWrong = mission.querySelector("[data-task].is-wrong");
      if (firstWrong) firstWrong.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const choice = event.target.closest(".choice");
    if (choice) {
      const box = choice.closest("[data-task]");
      box.querySelectorAll(".choice").forEach((button) => button.setAttribute("aria-pressed", String(button === choice)));
      clearTaskResult(box);
      saveSoon();
      return;
    }

    const colorButton = event.target.closest("[data-paint-color], [data-paint-clear]");
    if (colorButton) {
      const box = colorButton.closest("[data-strip-answer]");
      box.dataset.selectedColor = colorButton.dataset.paintColor || "";
      box.querySelectorAll("[data-paint-color], [data-paint-clear]").forEach((button) => button.setAttribute("aria-pressed", String(button === colorButton)));
      saveSoon();
      return;
    }

    const cell = event.target.closest(".paint-cell");
    if (cell) {
      const box = cell.closest("[data-strip-answer]");
      if (!box.dataset.selectedColor) return;
      setCellColor(cell, box.dataset.selectedColor);
      clearTaskResult(box);
      saveSoon();
    }
  });

  missions.forEach((mission) => {
    mission.addEventListener("toggle", () => {
      if (mission.open) history.replaceState(null, "", `#${mission.id}`);
    });
  });
  document.querySelectorAll(".mission-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      const section = document.querySelector(link.getAttribute("href"));
      section.open = true;
    });
  });

  document.querySelector("#resetBtn").addEventListener("click", () => {
    if (!window.confirm("Möchtest du alle Mathe-Antworten und den Fortschritt auf diesem Gerät löschen?")) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });

  const coachPanel = document.querySelector("#coachPanel");
  const coachLauncher = document.querySelector("#coachLauncher");
  const coachMessages = document.querySelector("#coachMessages");
  const coachInput = document.querySelector("#coachInput");
  const coachForm = document.querySelector("#coachForm");

  function addMessage(text, who) {
    const bubble = document.createElement("p");
    bubble.className = `coach-bubble ${who}`;
    bubble.textContent = text;
    coachMessages.append(bubble);
    coachMessages.scrollTop = coachMessages.scrollHeight;
  }

  function coachReply(question) {
    const q = question.toLocaleLowerCase("de").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
    if (/hallo|hi\b|guten tag|danke/.test(q)) return "Hallo Mila! Schön, dass du fragst. Welche Mathe-Idee soll ich dir erklären?";
    if (/rund|zehner|hunderter|tausender|aufrunden|abrunden/.test(q)) return "Such zuerst die Stelle, auf die du runden sollst. Schau dann auf die Ziffer direkt rechts daneben: 0–4 bedeutet abrunden, 5–9 aufrunden. Danach werden alle Stellen rechts davon zu Nullen. Beispiel: 6 742 auf Hunderter wird 6 700.";
    if (/zahlengerade|pfeil|strich|schrittweite/.test(q)) return "Finde zwei beschriftete Striche und zähle die Zwischenräume. Teile den Zahlenunterschied durch die Anzahl der Abstände. Dann zählst du vom bekannten Wert bis zum Pfeil weiter.";
    if (/kleiner|groesser|groesser|vergleich|zeichen|<|>/.test(q)) return "Vergleiche die Ziffern von links nach rechts. Die erste Stelle, an der sie verschieden sind, entscheidet. Das Zeichen zeigt mit der offenen Seite zur größeren Zahl.";
    if (/vorgaenger|nachfolger|nachbar/.test(q)) return "Der Vorgänger ist genau 1 kleiner. Der Nachfolger ist genau 1 größer. Bei 200 sind das zum Beispiel 199 und 201.";
    if (/spannweite|minimum|maximum|rangliste|sortier|reihenfolge/.test(q)) return "Ordne zuerst alle Werte der Größe nach. Das Minimum ist der kleinste Wert, das Maximum der größte. Die Spannweite rechnest du: Maximum minus Minimum. Doppelte Werte bleiben in der Rangliste stehen.";
    if (/haeufig|strichliste|streifen|umfrage|zaehl|zaehl/.test(q)) return "Geh die Werte einzeln durch und ordne jeden genau einer Gruppe zu. Zähle pro Gruppe Striche; fünf Striche fasst man oft als Fünferpäckchen zusammen. Am Ende müssen alle Häufigkeiten zusammen die Gesamtzahl ergeben.";
    if (/diagramm|saeule|balken|achse|kreis|daten|tabelle/.test(q)) return "Lies erst die Achsen und ihre Skala. Bei einem Säulen- oder Balkendiagramm ist die Höhe die Häufigkeit. Für die Gesamtzahl addierst du alle Häufigkeiten; bei einem Kreis entspricht der Anteil mal Gesamtzahl der Anzahl.";
    if (/baum|kombin|moeglich|muster|schloss|code|ziffer|permut/.test(q)) return "Bei mehreren unabhängigen Entscheidungen multiplizierst du die Möglichkeiten. Beispiel: 2 Vorspeisen, 2 Hauptgerichte und 2 Nachspeisen ergeben 2 × 2 × 2 Wege. Ohne Wiederholung wird die Auswahl pro Schritt kleiner.";
    return "Ich helfe bei Zahlengeraden, Vergleichen, Runden, Ranglisten, Häufigkeiten, Diagrammen und Kombinatorik. Beschreib mir kurz, an welcher Stelle du festhängst, oder tippe auf einen Beispiel-Frageknopf.";
  }

  coachLauncher.addEventListener("click", () => {
    coachPanel.hidden = !coachPanel.hidden;
    coachLauncher.setAttribute("aria-expanded", String(!coachPanel.hidden));
  });
  document.querySelector("#coachClose").addEventListener("click", () => {
    coachPanel.hidden = true;
    coachLauncher.setAttribute("aria-expanded", "false");
    coachLauncher.focus();
  });
  coachForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = coachInput.value.trim();
    if (!question) return;
    addMessage(question, "user");
    addMessage(coachReply(question), "bot");
    coachInput.value = "";
  });
  document.querySelectorAll(".coach-prompts button").forEach((button) => {
    button.addEventListener("click", () => {
      addMessage(button.textContent, "user");
      addMessage(coachReply(button.textContent), "bot");
    });
  });

  buildPaintStrips();
  renderNumberlines();
  renderWeights();
  restore();
})();
