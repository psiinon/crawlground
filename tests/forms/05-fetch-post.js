module.exports = {
  name: 'AJAX fetch() POST — no <form> element',
  description: 'A button whose click handler uses fetch() to POST to the marker URL. There is no <form> element — crawlers must execute JS and handle the async submission.',
  render: ({ scoreUrl }) => `
    <button id="ajax-btn" type="button">Submit via fetch</button>
    <div id="status" style="margin-top:8px"></div>
    <script>
      (function() {
        document.getElementById('ajax-btn').addEventListener('click', function() {
          fetch(${JSON.stringify(scoreUrl)}, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'ajax' })
          }).then(function() {
            document.getElementById('status').textContent = 'Submitted!';
          });
        });
      })();
    </script>
  `,
};
