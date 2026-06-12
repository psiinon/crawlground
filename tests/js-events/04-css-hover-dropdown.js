module.exports = {
  name: 'Single-level CSS :hover dropdown',
  description: 'A nav bar with a CSS :hover dropdown menu. The score link is in the DOM but hidden — it only becomes visible when the cursor hovers over the menu trigger.',
  render: ({ scoreUrl }) => `
    <style>
      .dd { position: relative; display: inline-block; font-family: sans-serif; }
      .dd-trigger { padding: 8px 16px; background: #4a90d9; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 14px; }
      .dd-menu { display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #ccc; border-radius: 4px; list-style: none; margin: 2px 0 0; padding: 4px 0; min-width: 160px; box-shadow: 0 2px 8px rgba(0,0,0,.15); z-index: 10; }
      .dd:hover .dd-menu { display: block; }
      .dd-menu li a { display: block; padding: 8px 16px; color: #333; text-decoration: none; white-space: nowrap; }
      .dd-menu li a:hover { background: #f5f5f5; }
    </style>
    <nav>
      <div class="dd">
        <button class="dd-trigger" type="button">Menu ▾</button>
        <ul class="dd-menu">
          <li><a href="${scoreUrl}">Option 1</a></li>
          <li><a href="#">Option 2</a></li>
          <li><a href="#">Option 3</a></li>
        </ul>
      </div>
    </nav>
  `,
};
