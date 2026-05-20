module.exports = {
  name: 'Plain anchor with href',
  description: 'A standard <a href="..."> link to the marker URL. The baseline link test.',
  render: ({ scoreUrl }) => `
    <a href="${scoreUrl}">Click me</a>
  `,
};
