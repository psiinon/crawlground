module.exports = {
  name: '"Load more" button appends score link',
  description: 'An initial list of items is visible on load; clicking "Load more" appends a second batch containing the score link. Crawlers must click the button to discover it.',
  render: ({ scoreUrl }) => `
    <ul id="item-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <button id="load-more" type="button">Load more</button>
    <script>
      (function() {
        var scoreUrl = ${JSON.stringify(scoreUrl)};
        var loaded = false;
        document.getElementById('load-more').addEventListener('click', function() {
          if (loaded) return;
          loaded = true;
          var list = document.getElementById('item-list');
          ['Item 4', 'Item 5'].forEach(function(label) {
            var li = document.createElement('li');
            li.textContent = label;
            list.appendChild(li);
          });
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = scoreUrl;
          a.textContent = 'Item 6 — click me';
          li.appendChild(a);
          list.appendChild(li);
          document.getElementById('load-more').hidden = true;
        });
      })();
    </script>
  `,
};
