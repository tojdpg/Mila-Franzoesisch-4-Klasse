const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const docs = path.join(__dirname, "..", "docs");
const quizSource = fs.readFileSync(path.join(docs, "app-5-sens.js"), "utf8").split("const STORAGE_KEY")[0];
const quizContext = {};
vm.runInNewContext(`${quizSource}\nglobalThis.questions = QUIZ.flatMap(m => [m.instruction, ...m.items.map(i => i.prompt)]); globalThis.options = QUIZ.flatMap(m => m.items.flatMap(i => i.options || []));`, quizContext);

function makeElement() {
  return {
    value: "",
    hidden: true,
    dataset: {},
    listeners: {},
    attributes: {},
    addEventListener(name, callback) { this.listeners[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    focus() { this.focused = true; }
  };
}

function loadDictionary() {
  const elements = new Map();
  for (const selector of [".dictionary", "#dictionaryLauncher", "#dictionaryPanel", "#dictionaryClose", "#dictionaryForm", "#dictionaryInput", "#dictionarySubmit", "#dictionaryAnswer"]) {
    elements.set(selector, makeElement());
  }
  const source = fs.readFileSync(path.join(docs, "dictionary.js"), "utf8")
    .replace("  const dictionary = new Map(", "  globalThis.entriesForTest = entries;\n  const dictionary = new Map(");
  const context = {
    document: { querySelector: (selector) => elements.get(selector), addEventListener() {} },
    window: { getSelection: () => null },
    setTimeout,
    clearTimeout,
    AbortController
  };
  vm.runInNewContext(source, context);
  return { context, elements };
}

function normalize(value) {
  return value.normalize("NFKC").trim().toLocaleLowerCase("fr")
    .replace(/[’‘`]/g, "'").replace(/œ/g, "oe").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").replace(/[\s.!?…]+$/g, "")
    .replace(/^[a-h]\s*:\s*(?=quelle partie est indiquee)/, "").trim();
}

test("every quiz instruction and question has a German translation", () => {
  const { context } = loadDictionary();
  const known = new Set(context.entriesForTest.map(([french]) => normalize(french)));
  const missing = quizContext.questions.filter((question) => !known.has(normalize(question)));
  assert.equal(missing.length, 0, `Missing translations: ${missing.join(", ")}`);
});

test("every word-choice option has a German translation", () => {
  const { context } = loadDictionary();
  const known = new Set(context.entriesForTest.map(([french]) => normalize(french)));
  const missing = [...new Set(quizContext.options)].filter((option) => {
    if (/^[1-5]$/.test(option)) return false;
    const word = normalize(option);
    return !known.has(word) && !known.has(word.replace(/^(?:le |la |les |l')/, ""));
  });
  assert.equal(missing.length, 0, `Missing translations: ${missing.join(", ")}`);
});

test("the dictionary answers locally without touching quiz state", async () => {
  const { elements } = loadDictionary();
  const launcher = elements.get("#dictionaryLauncher");
  const panel = elements.get("#dictionaryPanel");
  const input = elements.get("#dictionaryInput");
  const answer = elements.get("#dictionaryAnswer");
  launcher.listeners.click();
  assert.equal(panel.hidden, false);
  input.value = "Quelle partie donne sa couleur à l’œil ?";
  await elements.get("#dictionaryForm").listeners.submit({ preventDefault() {} });
  assert.equal(answer.textContent, "Welcher Teil gibt dem Auge seine Farbe?");
  input.value = "retine";
  elements.get("#dictionaryForm").listeners.submit({ preventDefault() {} });
  assert.equal(answer.textContent, "die Netzhaut");
  elements.get("#dictionaryClose").listeners.click();
  assert.equal(panel.hidden, true);
});
