module.exports = {
  name: 'Hash-based SPA routing',
  description: 'A link navigates to #/score; a hashchange listener maps the fragment to the real score URL and performs navigation. Crawlers must click the link, trigger the hashchange event, and follow the resulting navigation.',
  render: ({ scoreUrl }) => `
    <a href="#/score">Click me</a>
    <script>
      (function() {
        window.addEventListener('hashchange', function() {
          if (location.hash === '#/score') {
            window.location.href = ${JSON.stringify(scoreUrl)};
          }
        });
      })();
    </script>
  `,
};
