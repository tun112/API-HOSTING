const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Enable JSON parsing for incoming requests

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// API endpoint that responds to /api/hello
app.get('/api/hello', (req, res) => {
    console.log('Received request for /api/hello'); // Debug line
    res.json({ message: 'Hello from the server!' }); // This will respond with a JSON object
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
