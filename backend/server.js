const express = require('express');
const app = express();
const port = 3001; // Use a port different from the React app

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
