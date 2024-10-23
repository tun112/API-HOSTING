const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the API!'); // This will respond to GET requests at the root URL
});

// Define a route for your specific API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
