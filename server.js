const express = require('express');
const app = express();

// Setting the port dynamically for Render, or default to 10000 for local use
const PORT = process.env.PORT || 10000;

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Add more routes here as needed
// For example:
// app.get('/api/another-endpoint', (req, res) => {
//   res.json({ message: 'Another endpoint!' });
// });

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
