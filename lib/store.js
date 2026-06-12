const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'scores.json');

function loadInitial() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    // Migrate old flat-format (no tools key) to multi-tool format
    if (!parsed.tools) {
      return { currentTool: 'default', tools: { default: parsed } };
    }
    return parsed;
  } catch (e) {
    return { currentTool: 'default', tools: { default: {} } };
  }
}

const state = loadInitial();
let flushTimer = null;

function flushNow() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushNow();
  }, 200);
}

function currentToolScores() {
  return state.tools[state.currentTool] || {};
}

const store = {
  get currentTool() {
    return state.currentTool;
  },
  setCurrentTool(name) {
    state.currentTool = name;
    state.tools[name] = {};
    flushNow();
  },
  markScored(testId) {
    if (!state.tools[state.currentTool]) state.tools[state.currentTool] = {};
    const scores = state.tools[state.currentTool];
    if (!scores[testId]) {
      scores[testId] = { firstHit: new Date().toISOString(), hits: 1 };
    } else {
      scores[testId].hits = (scores[testId].hits || 0) + 1;
    }
    scheduleFlush();
  },
  isScored(testId) {
    return !!currentToolScores()[testId];
  },
  firstHit(testId) {
    const e = currentToolScores()[testId];
    return e ? e.firstHit : null;
  },
  hits(testId) {
    const e = currentToolScores()[testId];
    return e ? e.hits : 0;
  },
  allTools() {
    return Object.entries(state.tools).map(([name, scores]) => ({ name, scores }));
  },
  reset() {
    state.currentTool = 'default';
    for (const k of Object.keys(state.tools)) delete state.tools[k];
    state.tools.default = {};
    flushNow();
  },
};

module.exports = { store };
