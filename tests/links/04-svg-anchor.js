module.exports = {
  name: 'SVG <a> element',
  description: 'The score link is an <a> element inside an inline SVG. Crawlers that only scan HTML anchor tags will miss links embedded in SVG.',
  render: ({ scoreUrl }) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="40">
      <a href="${scoreUrl}">
        <rect width="120" height="40" rx="4" fill="#4a90d9"/>
        <text x="60" y="26" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif">Click me</text>
      </a>
    </svg>
  `,
};
