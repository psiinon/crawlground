module.exports = {
  name: 'Link injected on input focus',
  description: 'A link does not exist until an input field receives focus. Crawlers must fire focus events on form fields to discover it.',
  render: ({ scoreUrl }) => `
    <label>Click to focus: <input id="focus-input" type="text" placeholder="focus me" readonly></label>
    <div id="focus-slot"></div>
    <script>
      (function() {
        document.getElementById('focus-input').addEventListener('focus', function() {
          var slot = document.getElementById('focus-slot');
          if (slot.firstChild) return;
          var a = document.createElement('a');
          a.href = ${JSON.stringify(scoreUrl)};
          a.textContent = 'Click me';
          slot.appendChild(a);
        });
      })();
    </script>
  `,
};
