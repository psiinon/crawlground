module.exports = {
  name: 'Meta refresh redirect',
  description: 'The page <head> contains <meta http-equiv="refresh"> pointing to the marker URL. No user interaction is required.',
  head: ({ scoreUrl }) => `<meta http-equiv="refresh" content="2; url=${scoreUrl}">`,
  render: () => `
    <p>This page will redirect via &lt;meta http-equiv="refresh"&gt; in 2 seconds.</p>
  `,
};
