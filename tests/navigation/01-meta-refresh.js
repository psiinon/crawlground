module.exports = {
  name: 'Meta refresh redirect',
  description: 'The page <head> contains <meta http-equiv="refresh"> pointing to the marker URL after 1 second. No user interaction is required.',
  head: ({ scoreUrl }) => `<meta http-equiv="refresh" content="1; url=${scoreUrl}">`,
  render: () => `
    <p>This page will redirect via &lt;meta http-equiv="refresh"&gt; in 1 second.</p>
  `,
};
