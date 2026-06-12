module.exports = {
  name: 'GET form with <select> dropdown',
  description: 'A GET form containing a <select> element. Tests whether the crawler submits forms that include dropdown inputs.',
  render: ({ scoreUrl }) => `
    <form method="GET" action="${scoreUrl}">
      <label>
        Colour:
        <select name="colour">
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  `,
};
