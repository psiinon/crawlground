module.exports = {
  name: 'Keyboard Enter on non-button element',
  description: 'A <div tabindex="0" role="link"> navigates to the score URL when Enter is pressed. Crawlers must focus the element and dispatch a keydown event to score.',
  render: ({ scoreUrl }) => `
    <div id="kb-target" tabindex="0" role="link"
         style="display:inline-block;padding:12px 24px;border:1px solid #888;border-radius:4px;background:#f5f5f5;cursor:pointer;user-select:none">
      Press Enter on me
    </div>
    <script>
      (function() {
        document.getElementById('kb-target').addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            window.location.href = ${JSON.stringify(scoreUrl)};
          }
        });
      })();
    </script>
  `,
};
