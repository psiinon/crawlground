module.exports = {
  name: 'Link delivered via WebSocket',
  description: 'The page opens a WebSocket connection; the server pushes the score URL as a message ~250 ms later and the client injects the link. Crawlers must process WebSocket messages to discover it.',
  render: ({ scoreUrl }) => `
    <div id="ws-slot">Waiting for server push&hellip;</div>
    <script>
      (function() {
        var proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
        var ws = new WebSocket(proto + '//' + location.host + '/api/ws-reveal?url=' + encodeURIComponent(${JSON.stringify(scoreUrl)}));
        ws.addEventListener('message', function(e) {
          var data = JSON.parse(e.data);
          var slot = document.getElementById('ws-slot');
          slot.innerHTML = '';
          var a = document.createElement('a');
          a.href = data.url;
          a.textContent = 'Click me';
          slot.appendChild(a);
          ws.close();
        });
      })();
    </script>
  `,
};
