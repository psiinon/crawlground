module.exports = {
  name: '<input type="image"> submit button',
  description: 'A GET form whose submit control is <input type="image"> instead of <button type="submit">. Crawlers that only trigger <button> elements will miss this.',
  render: ({ scoreUrl }) => `
    <form method="GET" action="${scoreUrl}">
      <label>Name: <input type="text" name="name" value="crawler"></label>
      <br><br>
      <input type="image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='30'%3E%3Crect width='80' height='30' rx='4' fill='%234a90d9'/%3E%3Ctext x='40' y='20' text-anchor='middle' fill='white' font-size='13' font-family='sans-serif'%3ESubmit%3C/text%3E%3C/svg%3E"
           alt="Submit">
    </form>
  `,
};
