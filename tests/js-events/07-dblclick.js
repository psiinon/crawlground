module.exports = {
  name: 'Double-click navigation',
  description: 'An element navigates to the score URL on dblclick. A single click does nothing — crawlers that only fire single clicks will not score.',
  render: ({ scoreUrl }) => `
    <div id="dbl-target" tabindex="0"
         style="display:inline-block;padding:12px 24px;border:1px solid #888;border-radius:4px;background:#f5f5f5;cursor:pointer;user-select:none">
      Double-click me
    </div>
    <script>
      (function() {
        document.getElementById('dbl-target').addEventListener('dblclick', function() {
          window.location.href = ${JSON.stringify(scoreUrl)};
        });
      })();
    </script>
  `,
};
