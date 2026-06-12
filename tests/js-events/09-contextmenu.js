module.exports = {
  name: 'Right-click (contextmenu) link injection',
  description: 'The score link is injected into the page when the contextmenu event fires on a target zone. Crawlers must simulate a right-click to discover it.',
  render: ({ scoreUrl }) => `
    <div id="ctx-zone"
         style="display:inline-block;padding:24px 32px;border:1px dashed #888;background:#fff8e1">
      Right-click here
    </div>
    <div id="ctx-slot"></div>
    <script>
      (function() {
        var zone = document.getElementById('ctx-zone');
        var slot = document.getElementById('ctx-slot');
        var injected = false;
        zone.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          if (injected) return;
          injected = true;
          var a = document.createElement('a');
          a.href = ${JSON.stringify(scoreUrl)};
          a.textContent = 'Click me';
          slot.appendChild(a);
        });
      })();
    </script>
  `,
};
