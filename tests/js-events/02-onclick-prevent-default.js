module.exports = {
  name: 'onclick with preventDefault — JS-only navigation',
  description: 'An <a href="#"> whose onclick calls event.preventDefault() then navigates via window.location. The href is a red herring; crawlers that follow href without firing the click event will not score.',
  render: ({ scoreUrl }) => `
    <a id="pd-link" href="#">Click me</a>
    <script>
      (function() {
        document.getElementById('pd-link').addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = ${JSON.stringify(scoreUrl)};
        });
      })();
    </script>
  `,
};
