const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'scores.json');

function loadInitial() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
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

const store = {
  markScored(testId) {
    if (!state[testId]) {
      state[testId] = { firstHit: new Date().toISOString(), hits: 1 };
    } else {
      state[testId].hits = (state[testId].hits || 0) + 1;
    }
    scheduleFlush();
  },
  isScored(testId) {
    return !!state[testId];
  },
  firstHit(testId) {
    return state[testId] ? state[testId].firstHit : null;
  },
  hits(testId) {
    return state[testId] ? state[testId].hits : 0;
  },
  reset() {
    for (const k of Object.keys(state)) delete state[k];
    flushNow();
  },
};

module.exports = { store };
