module.exports = {
  name: 'Link inside <dialog> modal',
  description: 'A button calls showModal() to open a <dialog> element containing the score link. Crawlers must open the dialog to discover the link.',
  render: ({ scoreUrl }) => `
    <button id="open-btn" type="button">Open dialog</button>
    <dialog id="modal" style="padding:24px;border-radius:6px;border:1px solid #ccc">
      <p>This is a modal dialog.</p>
      <a href="${scoreUrl}">Click me</a>
      <br><br>
      <form method="dialog"><button>Close</button></form>
    </dialog>
    <script>
      (function() {
        document.getElementById('open-btn').addEventListener('click', function() {
          document.getElementById('modal').showModal();
        });
      })();
    </script>
  `,
};
