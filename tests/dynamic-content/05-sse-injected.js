module.exports = {
  name: 'Link delivered via Server-Sent Events',
  description: 'The page opens an EventSource connection; the server pushes the score URL as an SSE event ~250 ms later and the client injects the link. Crawlers must process SSE streams to discover it.',
  render: ({ scoreUrl }) => `
    <div id="sse-slot">Waiting for server push&hellip;</div>
    <script>
      (function() {
        var src = new EventSource('/api/sse-reveal?url=' + encodeURIComponent(${JSON.stringify(scoreUrl)}));
        src.addEventListener('message', function(e) {
          var data = JSON.parse(e.data);
          var slot = document.getElementById('sse-slot');
          slot.innerHTML = '';
          var a = document.createElement('a');
          a.href = data.url;
          a.textContent = 'Click me';
          slot.appendChild(a);
          src.close();
        });
      })();
    </script>
  `,
};
