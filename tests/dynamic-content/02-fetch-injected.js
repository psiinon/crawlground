module.exports = {
  name: 'Link appears after fetch() network request',
  description: 'Container is empty on load; a fetch() call retrieves the score URL from the server, then injects a link. Crawlers must wait for network activity to settle, not just a fixed timer.',
  render: ({ scoreUrl }) => `
    <div id="net-slot">Loading…</div>
    <script>
      (function() {
        fetch('/api/reveal?url=' + encodeURIComponent(${JSON.stringify(scoreUrl)}))
          .then(function(r) { return r.json(); })
          .then(function(data) {
            var slot = document.getElementById('net-slot');
            slot.innerHTML = '';
            var a = document.createElement('a');
            a.href = data.url;
            a.textContent = 'Click me';
            slot.appendChild(a);
          });
      })();
    </script>
  `,
};
