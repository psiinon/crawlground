module.exports = {
  name: 'Tab panel with JS-rendered content',
  description: 'A tab panel where each tab\'s content is injected on click — inactive tabs have nothing in the DOM. The score link is only rendered when the second tab is selected.',
  render: ({ scoreUrl }) => `
    <style>
      .tab-bar { display: flex; gap: 2px; }
      .tab-btn { padding: 8px 16px; border: 1px solid #ccc; border-bottom: none; background: #f0f0f0; cursor: pointer; border-radius: 4px 4px 0 0; font-size: 14px; }
      .tab-btn[aria-selected="true"] { background: white; font-weight: bold; }
      .tab-panel { border: 1px solid #ccc; padding: 16px; min-height: 60px; }
    </style>
    <div class="tab-bar" role="tablist">
      <button class="tab-btn" role="tab" aria-selected="true"  data-tab="1">Tab 1</button>
      <button class="tab-btn" role="tab" aria-selected="false" data-tab="2">Tab 2</button>
      <button class="tab-btn" role="tab" aria-selected="false" data-tab="3">Tab 3</button>
    </div>
    <div class="tab-panel" id="tab-panel"><p>Content for Tab 1.</p></div>
    <script>
      (function() {
        var scoreUrl = ${JSON.stringify(scoreUrl)};
        var contents = {
          '1': function() { return '<p>Content for Tab 1.</p>'; },
          '2': function() {
            var p = document.createElement('p');
            p.appendChild(document.createTextNode('Content for Tab 2. '));
            var a = document.createElement('a');
            a.href = scoreUrl;
            a.textContent = 'Click me';
            p.appendChild(a);
            return p;
          },
          '3': function() { return '<p>Content for Tab 3.</p>'; }
        };
        var panel = document.getElementById('tab-panel');
        document.querySelectorAll('.tab-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(function(b) {
              b.setAttribute('aria-selected', 'false');
            });
            btn.setAttribute('aria-selected', 'true');
            var c = contents[btn.dataset.tab]();
            panel.innerHTML = '';
            if (typeof c === 'string') {
              panel.innerHTML = c;
            } else {
              panel.appendChild(c);
            }
          });
        });
      })();
    </script>
  `,
};
