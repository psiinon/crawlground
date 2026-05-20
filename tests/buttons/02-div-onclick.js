module.exports = {
  name: 'Div styled as button',
  description: 'A <div role="button"> with an inline onclick handler that navigates to the marker URL.',
  render: ({ scoreUrl }) => `
    <div role="button" tabindex="0"
         onclick="window.location.href='${scoreUrl}'"
         style="display:inline-block;padding:8px 16px;border:1px solid #444;border-radius:4px;background:#eef;cursor:pointer;user-select:none">
      Click me
    </div>
  `,
};
