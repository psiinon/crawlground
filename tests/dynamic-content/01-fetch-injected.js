module.exports = {
  name: 'Link appears after async delay',
  description: 'Container is empty on initial load; a link is inserted ~250ms later via setTimeout. Crawlers must wait for JS to settle before scraping the DOM.',
  render: ({ scoreUrl }) => `
    <div id="async-slot">Loading…</div>
    <script>
      (function() {
        setTimeout(function() {
          var slot = document.getElementById('async-slot');
          slot.innerHTML = '';
          var a = document.createElement('a');
          a.href = ${JSON.stringify(scoreUrl)};
          a.textContent = 'Click me';
          slot.appendChild(a);
        }, 250);
      })();
    </script>
  `,
};
