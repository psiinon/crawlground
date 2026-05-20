module.exports = {
  name: 'Link injected on mouseover',
  description: 'A link that does not exist in the DOM until the user hovers over a target zone. Crawlers must simulate hover to discover it.',
  render: ({ scoreUrl }) => `
    <div id="hover-zone"
         style="display:inline-block;padding:24px 32px;border:1px dashed #888;background:#fff8e1">
      Hover here
    </div>
    <div id="slot"></div>
    <script>
      (function() {
        var zone = document.getElementById('hover-zone');
        var slot = document.getElementById('slot');
        var injected = false;
        zone.addEventListener('mouseover', function() {
          if (injected) return;
          injected = true;
          var a = document.createElement('a');
          a.href = ${JSON.stringify(scoreUrl)};
          a.textContent = 'Now click me';
          slot.appendChild(a);
        });
      })();
    </script>
  `,
};
