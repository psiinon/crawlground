module.exports = {
  name: 'Anchor with href set in JS',
  description: 'An anchor element whose href is assigned by JavaScript after page load. Static HTML scrapers will not see the URL.',
  render: ({ scoreUrl }) => `
    <a id="js-link" href="#">Click me</a>
    <script>
      (function() {
        document.getElementById('js-link').href = ${JSON.stringify(scoreUrl)};
      })();
    </script>
  `,
};
