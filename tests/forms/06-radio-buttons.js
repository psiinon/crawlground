module.exports = {
  name: 'GET form with radio buttons',
  description: 'A GET form containing radio button inputs. Tests whether the crawler submits forms with radio inputs and handles the selected value correctly.',
  render: ({ scoreUrl }) => `
    <form method="GET" action="${scoreUrl}">
      <fieldset>
        <legend>Preferred colour:</legend>
        <label><input type="radio" name="colour" value="red"> Red</label>
        <label><input type="radio" name="colour" value="green"> Green</label>
        <label><input type="radio" name="colour" value="blue" checked> Blue</label>
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  `,
};
