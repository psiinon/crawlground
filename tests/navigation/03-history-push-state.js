module.exports = {
  name: 'history.pushState() SPA navigation',
  description: 'Clicking "Go to page" calls history.pushState() and swaps the visible content, like a real SPA router. The score link only appears in the rendered second view — crawlers must detect the state change and find the injected link.',
  render: ({ scoreUrl }) => `
    <div id="app">
      <p>This is the home view.</p>
      <button id="nav-btn" type="button">Go to page</button>
    </div>
    <script>
      (function() {
        var scoreUrl = ${JSON.stringify(scoreUrl)};
        document.getElementById('nav-btn').addEventListener('click', function() {
          history.pushState({ page: 'detail' }, '', '/spa/detail');
          document.getElementById('app').innerHTML =
            '<p>This is the detail view.</p><a href="' + scoreUrl + '">Click me</a>';
        });
      })();
    </script>
  `,
};
