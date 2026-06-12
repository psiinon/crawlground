module.exports = {
  name: '<button formaction> overrides form action',
  description: 'The <form> has a benign action, but one submit button uses the formaction attribute to point to the score URL. Crawlers must recognise per-button formaction overrides.',
  render: ({ scoreUrl }) => `
    <form method="GET" action="/nowhere">
      <label>Name: <input type="text" name="name" value="crawler"></label>
      <br><br>
      <button type="submit">Regular submit (goes nowhere)</button>
      <button type="submit" formaction="${scoreUrl}">Submit here</button>
    </form>
  `,
};
