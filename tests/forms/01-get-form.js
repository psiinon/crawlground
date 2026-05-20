module.exports = {
  name: 'GET form with submit button',
  description: 'A <form method="GET"> that submits to the marker URL. Tests crawler form discovery via GET.',
  render: ({ scoreUrl }) => `
    <form method="GET" action="${scoreUrl}">
      <label>Name: <input type="text" name="name" value="crawler"></label>
      <button type="submit">Submit</button>
    </form>
  `,
};
