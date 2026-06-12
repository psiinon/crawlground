const express = require('express');
const path = require('path');
const yaml = require('js-yaml');
const { loadRegistry } = require('./lib/registry');
const { store } = require('./lib/store');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const registry = loadRegistry(path.join(__dirname, 'tests'));

app.get('/', (req, res) => {
  res.render('index', { categories: registry.categories, store });
});

app.get('/category/:cat', (req, res) => {
  const tests = registry.byCategory[req.params.cat];
  if (!tests) return res.status(404).send('Unknown category');
  res.render('category', { category: req.params.cat, tests, store });
});

app.get('/test/:cat/:id', (req, res) => {
  const test = registry.byId[`${req.params.cat}.${req.params.id}`];
  if (!test) return res.status(404).send('Unknown test');
  const ctx = { scoreUrl: `/score/${test.category}/${test.localId}`, req };
  const rendered = typeof test.render === 'function' ? test.render(ctx) : test.render;
  let content = '';
  let head = '';
  if (typeof rendered === 'string') {
    content = rendered;
  } else if (rendered && typeof rendered === 'object') {
    content = rendered.html || '';
    head = rendered.head || '';
  }
  if (!head && test.head) {
    head = typeof test.head === 'function' ? test.head(ctx) : test.head;
  }
  res.render('test', { test, content, head });
});

function handleScore(req, res) {
  const test = registry.byId[`${req.params.cat}.${req.params.id}`];
  if (!test) return res.status(404).send('Unknown test');
  if (typeof test.scoreWhen === 'function' && !test.scoreWhen(req)) {
    return res.render('scored', { test, scored: false, reason: 'scoreWhen returned false' });
  }
  store.markScored(test.id);
  res.render('scored', { test, scored: true, reason: null });
}
app.get('/score/:cat/:id', handleScore);
app.post('/score/:cat/:id', handleScore);

// Set the active tool name for multi-tool sessions.
// Not linked from anywhere in the UI — call this before each crawler run.
// POST /set-tool  body: { name: "ZAP Spider" }  (JSON or form-encoded)
// Also accepts ?name=... as a query parameter.
app.post('/set-tool', (req, res) => {
  const name = ((req.body && req.body.name) || req.query.name || '').trim();
  if (!name) return res.status(400).json({ error: 'name is required' });
  store.setCurrentTool(name);
  res.json({ ok: true, tool: store.currentTool });
});

app.get('/results', (req, res) => {
  res.render('results', { registry, store });
});

function buildReport(registry, store) {
  const toolEntries = store.allTools();
  const tests = Object.values(registry.byId).map((t) => {
    const tools = {};
    for (const { name, scores } of toolEntries) {
      const e = scores[t.id];
      tools[name] = { scored: !!e, firstHit: e ? e.firstHit : null, hits: e ? e.hits : 0 };
    }
    return { id: t.id, category: t.category, name: t.name, description: t.description, tools };
  });
  const total = tests.length;
  const tools = toolEntries.map(({ name }) => {
    const scored = tests.filter((t) => t.tools[name].scored).length;
    return { name, scored, scoredPercent: total ? Math.round((scored / total) * 100) : 0 };
  });
  const scored = tests.filter((t) => toolEntries.some(({ name }) => t.tools[name].scored)).length;
  return { summary: { total, scored, tools }, tests };
}

app.get('/results.json', (req, res) => {
  res.json(buildReport(registry, store));
});

app.get('/results.yaml', (req, res) => {
  res.type('text/yaml').send(yaml.dump(buildReport(registry, store)));
});

// Normalise a tool name to a camelCase YAML key, e.g. "AJAX Spider" → "ajaxSpider"
function toolNameToKey(name) {
  return name
    .trim()
    .split(/[\s\-_]+/)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}

function buildWebsiteReport(registry, store, req) {
  // Only include tools that have actually scored at least one test
  const toolEntries = store.allTools().filter(({ scores }) => Object.keys(scores).length > 0);
  const allTests = Object.values(registry.byId);
  const total = allTests.length;
  const target = (req.headers['host'] || process.env.CRAWLGROUND_TARGET || 'localhost:3456');
  const section = process.env.CRAWLGROUND_SECTION || 'Crawlground';

  const details = allTests.map((t) => {
    const entry = { path: `/score/${t.category}/${t.localId}`, scheme: 'http' };
    for (const { name, scores } of toolEntries) {
      entry[toolNameToKey(name)] = scores[t.id] ? 'Pass' : 'FAIL';
    }
    return entry;
  });

  const passes = allTests.filter((t) => toolEntries.some(({ scores }) => scores[t.id])).length;
  const fails = total - passes;
  const score = total ? `${Math.round((passes / total) * 100)}%` : '0%';

  const report = { section, target, details, tests: total, passes };
  for (const { name, scores } of toolEntries) {
    report[toolNameToKey(name) + 'Passes'] = allTests.filter((t) => scores[t.id]).length;
  }
  report.fails = fails;
  report.score = score;
  return report;
}

app.get('/website-results.yaml', (req, res) => {
  res.type('text/yaml').send(yaml.dump(buildWebsiteReport(registry, store, req)));
});

app.get('/reset', (req, res) => {
  res.render('reset_confirm');
});
app.post('/reset', (req, res) => {
  if ((req.body && req.body.confirm) !== 'RESET') return res.redirect('/reset');
  store.reset();
  res.redirect('/results');
});

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`Crawlground listening on http://localhost:${PORT}`);
  console.log(`Loaded ${Object.keys(registry.byId).length} tests across ${registry.categories.length} categories.`);
});
