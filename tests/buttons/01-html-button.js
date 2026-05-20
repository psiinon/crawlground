module.exports = {
  name: 'HTML <button> with onclick',
  description: 'A standard <button> element whose onclick handler navigates to the marker URL.',
  render: ({ scoreUrl }) => `
    <button type="button" onclick="window.location.href='${scoreUrl}'">
      Click me
    </button>
  `,
};
