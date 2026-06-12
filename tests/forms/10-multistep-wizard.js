module.exports = {
  name: 'Multi-step form wizard',
  description: 'A two-step form: submitting step 1 hides it and reveals step 2, which submits to the score URL. Crawlers must complete both steps.',
  render: ({ scoreUrl }) => `
    <div id="step1">
      <form id="form1">
        <p style="margin:0 0 8px;font-weight:bold">Step 1 of 2</p>
        <label>Name: <input type="text" name="name" value="crawler"></label>
        <button type="submit">Next &rarr;</button>
      </form>
    </div>
    <div id="step2" hidden>
      <form method="GET" action="${scoreUrl}">
        <p style="margin:0 0 8px;font-weight:bold">Step 2 of 2</p>
        <label>Email: <input type="email" name="email" value="crawler@example.com"></label>
        <button type="submit">Finish</button>
      </form>
    </div>
    <script>
      (function() {
        document.getElementById('form1').addEventListener('submit', function(e) {
          e.preventDefault();
          document.getElementById('step1').hidden = true;
          document.getElementById('step2').hidden = false;
        });
      })();
    </script>
  `,
};
