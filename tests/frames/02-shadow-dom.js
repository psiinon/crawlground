module.exports = {
  name: 'Link inside open Shadow DOM',
  description: 'The score link is appended to a shadow root via attachShadow({mode:"open"}). It does not exist in the main document tree — crawlers must traverse shadow roots to discover it.',
  render: ({ scoreUrl }) => `
    <div id="shadow-host"></div>
    <script>
      (function() {
        var shadow = document.getElementById('shadow-host').attachShadow({ mode: 'open' });
        var a = document.createElement('a');
        a.href = ${JSON.stringify(scoreUrl)};
        a.textContent = 'Click me';
        shadow.appendChild(a);
      })();
    </script>
  `,
};
