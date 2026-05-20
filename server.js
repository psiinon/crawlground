const express = require('express');
const path = require('path');
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

app.get('/results', (req, res) => {
  res.render('results', { registry, store });
});

app.get('/results.json', (req, res) => {
  const tests = Object.values(registry.byId).map((t) => ({
    id: t.id,
    category: t.category,
    name: t.name,
    description: t.description,
    scored: store.isScored(t.id),
    firstHit: store.firstHit(t.id),
    hits: store.hits(t.id),
  }));
  const scored = tests.filter((t) => t.scored).length;
  res.json({ summary: { total: tests.length, scored }, tests });
});

app.get('/reset', (req, res) => {
  res.render('reset_confirm');
});
app.post('/reset', (req, res) => {
  store.reset();
  res.redirect('/results');
});

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`Crawlground listening on http://localhost:${PORT}`);
  console.log(`Loaded ${Object.keys(registry.byId).length} tests across ${registry.categories.length} categories.`);
});
