module.exports = {
  name: 'GET form with checkboxes',
  description: 'A GET form containing checkbox inputs. Tests whether the crawler submits forms that include checkboxes.',
  render: ({ scoreUrl }) => `
    <form method="GET" action="${scoreUrl}">
      <fieldset>
        <legend>Interests:</legend>
        <label><input type="checkbox" name="interest" value="sports" checked> Sports</label>
        <label><input type="checkbox" name="interest" value="music"> Music</label>
        <label><input type="checkbox" name="interest" value="tech" checked> Tech</label>
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  `,
};
