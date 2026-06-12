module.exports = {
  name: 'Link inside same-origin iframe (srcdoc)',
  description: 'The score link is embedded inside a <iframe srcdoc="...">. Crawlers must parse iframe contents to discover the link — it does not appear in the outer DOM.',
  render: ({ scoreUrl }) => {
    const inner = `<a href="${scoreUrl}">Click me</a>`.replace(/"/g, '&quot;');
    return `<iframe srcdoc="${inner}" style="width:300px;height:60px;border:1px solid #ccc"></iframe>`;
  },
};
