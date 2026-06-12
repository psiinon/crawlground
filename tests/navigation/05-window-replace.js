module.exports = {
  name: 'window.location.replace() navigation',
  description: 'JavaScript navigates the page via window.location.replace() after a 1s delay. Unlike window.location.href assignment, replace() does not add an entry to the browser history.',
  render: ({ scoreUrl }) => `
    <p>Hold tight &mdash; JavaScript will navigate this page via window.location.replace() in 1 second.</p>
    <script>
      (function() {
        setTimeout(function() {
          window.location.replace(${JSON.stringify(scoreUrl)});
        }, 1000);
      })();
    </script>
  `,
};
