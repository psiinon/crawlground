module.exports = {
  name: 'Link injected when <details> is opened',
  description: 'A <details> element contains no link on load; the toggle event injects one when the disclosure widget is opened. Crawlers must interact with the <details> to reveal the link.',
  render: ({ scoreUrl }) => `
    <details id="det">
      <summary>Click to expand</summary>
      <div id="det-slot"></div>
    </details>
    <script>
      (function() {
        document.getElementById('det').addEventListener('toggle', function(e) {
          if (!e.target.open) return;
          var slot = document.getElementById('det-slot');
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
