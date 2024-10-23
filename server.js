const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (your client HTML)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 10000;

// Root Route - Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Route to handle client messages
app.post('/api/send-message', (req, res) => {
  const clientMessage = req.body.message; // Access the message sent from the client
  console.log('Message from the client:', clientMessage);

  // Respond back to the client with a message
  res.json({ response: 'Message received: ' + clientMessage });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
