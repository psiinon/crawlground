module.exports = {
  name: 'Popover API — link injected on open',
  description: 'A <div popover> is opened via the native Popover API. The score link is injected into it on the toggle event — it is not in the DOM until the popover is opened.',
  render: ({ scoreUrl }) => `
    <button type="button" popovertarget="pop">Open popover</button>
    <div id="pop" popover style="padding:20px;border-radius:6px;border:1px solid #ccc">
      <p>This is a popover.</p>
      <div id="pop-slot"></div>
      <br>
      <button type="button" popovertarget="pop">Close</button>
    </div>
    <script>
      (function() {
        var scoreUrl = ${JSON.stringify(scoreUrl)};
        document.getElementById('pop').addEventListener('toggle', function(e) {
          if (e.newState !== 'open') return;
          var slot = document.getElementById('pop-slot');
          if (slot.firstChild) return;
          var a = document.createElement('a');
          a.href = scoreUrl;
          a.textContent = 'Click me';
          slot.appendChild(a);
        });
      })();
    </script>
  `,
};
