module.exports = {
  name: 'Link appears on scroll (IntersectionObserver)',
  description: 'A sentinel element sits below the fold; when it scrolls into the viewport an IntersectionObserver injects the score link. Crawlers must scroll the page to trigger it.',
  render: ({ scoreUrl }) => `
    <p>Scroll down to reveal the link.</p>
    <div style="height:600px;display:flex;align-items:flex-end;color:#999;font-size:13px">
      ↓ keep scrolling
    </div>
    <div id="sentinel" style="height:1px"></div>
    <div id="io-slot"></div>
    <script>
      (function() {
        var sentinel = document.getElementById('sentinel');
        var slot = document.getElementById('io-slot');
        var observer = new IntersectionObserver(function(entries) {
          if (!entries[0].isIntersecting) return;
          observer.disconnect();
          var a = document.createElement('a');
          a.href = ${JSON.stringify(scoreUrl)};
          a.textContent = 'Click me';
          slot.appendChild(a);
        });
        observer.observe(sentinel);
      })();
    </script>
  `,
};
