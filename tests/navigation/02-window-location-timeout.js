module.exports = {
  name: 'window.location assigned in setTimeout',
  description: 'JavaScript navigates the page via window.location after a 1s delay. There is no link or button in the DOM.',
  render: ({ scoreUrl }) => `
    <p>Hold tight &mdash; JavaScript will navigate this page in 1 second.</p>
    <script>
      (function() {
        setTimeout(function() {
          window.location.href = ${JSON.stringify(scoreUrl)};
        }, 1000);
      })();
    </script>
  `,
};
