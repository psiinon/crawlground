module.exports = {
  name: 'Form submitted programmatically via JS',
  description: 'A timer calls form.requestSubmit() after 1 second — there is no submit button for the crawler to click. Crawlers must detect the programmatic form submission.',
  render: ({ scoreUrl }) => `
    <form id="auto-form" method="GET" action="${scoreUrl}">
      <input type="hidden" name="source" value="js-submit">
      <p>This form will submit itself via form.requestSubmit() in 1 second.</p>
    </form>
    <script>
      (function() {
        setTimeout(function() {
          var form = document.getElementById('auto-form');
          if (form.requestSubmit) {
            form.requestSubmit();
          } else {
            form.submit();
          }
        }, 1000);
      })();
    </script>
  `,
};
