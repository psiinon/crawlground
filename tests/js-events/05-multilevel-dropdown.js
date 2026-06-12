module.exports = {
  name: 'Multi-level JS dropdown menu',
  description: 'A two-level dropdown: clicking the top button opens the first menu; hovering "Category B ▶" opens a nested submenu where the score link is injected. Crawlers must navigate both levels to find it.',
  render: ({ scoreUrl }) => `
    <style>
      .ml-nav { font-family: sans-serif; position: relative; display: inline-block; }
      .ml-btn { padding: 8px 16px; background: #4a90d9; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 14px; }
      .ml-menu, .ml-sub { list-style: none; margin: 0; padding: 4px 0; background: white; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,.15); min-width: 160px; }
      .ml-menu { position: absolute; top: 100%; left: 0; margin-top: 2px; }
      .ml-sub-wrap { position: relative; }
      .ml-sub { position: absolute; top: -4px; left: 100%; }
      .ml-menu a, .ml-sub a, .ml-sub-label { display: block; padding: 8px 16px; color: #333; text-decoration: none; white-space: nowrap; cursor: pointer; }
      .ml-menu a:hover, .ml-sub a:hover, .ml-sub-label:hover { background: #f5f5f5; }
    </style>
    <nav class="ml-nav">
      <button class="ml-btn" id="ml-btn" type="button">Products ▾</button>
      <ul class="ml-menu" id="ml-menu" hidden>
        <li><a href="#">Category A</a></li>
        <li class="ml-sub-wrap" id="ml-sub-wrap">
          <span class="ml-sub-label">Category B ▶</span>
          <ul class="ml-sub" id="ml-sub" hidden></ul>
        </li>
        <li><a href="#">Category C</a></li>
      </ul>
    </nav>
    <script>
      (function() {
        var btn     = document.getElementById('ml-btn');
        var menu    = document.getElementById('ml-menu');
        var wrap    = document.getElementById('ml-sub-wrap');
        var sub     = document.getElementById('ml-sub');
        var injected = false;

        btn.addEventListener('click', function() {
          menu.hidden = !menu.hidden;
        });

        wrap.addEventListener('mouseenter', function() {
          if (!injected) {
            injected = true;
            var a  = document.createElement('a');
            a.href = ${JSON.stringify(scoreUrl)};
            a.textContent = 'Item 1';
            var li = document.createElement('li');
            li.appendChild(a);
            sub.appendChild(li);
          }
          sub.hidden = false;
        });

        wrap.addEventListener('mouseleave', function() {
          sub.hidden = true;
        });
      })();
    </script>
  `,
};
