module.exports = {
  name: 'POST form with submit button',
  description: 'A <form method="POST"> that submits to the marker URL. Crawlers that only follow GET links will miss this.',
  render: ({ scoreUrl }) => `
    <form method="POST" action="${scoreUrl}">
      <label>Payload: <input type="text" name="payload" value="hello"></label>
      <button type="submit">Submit</button>
    </form>
  `,
};
