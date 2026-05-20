const fs = require('fs');
const path = require('path');

function loadRegistry(rootDir) {
  const categories = [];
  const byCategory = {};
  const byId = {};

  if (!fs.existsSync(rootDir)) {
    return { categories, byCategory, byId };
  }

  const catDirs = fs
    .readdirSync(rootDir)
    .filter((d) => fs.statSync(path.join(rootDir, d)).isDirectory())
    .sort();

  for (const cat of catDirs) {
    const catPath = path.join(rootDir, cat);
    const files = fs
      .readdirSync(catPath)
      .filter((f) => f.endsWith('.js'))
      .sort();
    const tests = [];
    for (const file of files) {
      const localId = file.replace(/\.js$/, '');
      const filePath = path.join(catPath, file);
      delete require.cache[require.resolve(filePath)];
      const mod = require(filePath);
      if (!mod || typeof mod !== 'object') continue;
      const test = {
        name: mod.name || localId,
        description: mod.description || '',
        render: mod.render,
        head: mod.head,
        scoreWhen: mod.scoreWhen,
        category: cat,
        localId,
        id: `${cat}.${localId}`,
      };
      tests.push(test);
      byId[test.id] = test;
    }
    categories.push({ name: cat, count: tests.length });
    byCategory[cat] = tests;
  }

  return { categories, byCategory, byId };
}

module.exports = { loadRegistry };
