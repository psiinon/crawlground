module.exports = {
  name: 'Link inside <noscript>',
  description: 'The score link is wrapped in a <noscript> element, visible only when scripting is disabled. Crawlers must make a non-JS pass of the page to discover it.',
  render: ({ scoreUrl }) => `
    <p>JavaScript is enabled — the link below is hidden from this view.</p>
    <noscript><a href="${scoreUrl}">Click me</a></noscript>
    <p><em>A crawler with JS disabled is required to score this test.</em></p>
  `,
};
