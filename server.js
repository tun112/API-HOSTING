const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// JSON file path
const jsonFilePath = path.join(__dirname, 'texts.json');

// Function to load messages from the JSON file
const loadMessagesFromFile = () => {
    try {
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading the JSON file:', err);
        return [];
    }
};

// Function to save messages to the JSON file
const saveMessagesToFile = (messages) => {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(messages, null, 2));
        console.log('Messages saved to file');
    } catch (err) {
        console.error('Error saving the JSON file:', err);
    }
};

// Load existing messages from the file into memory when the server starts
let messages = loadMessagesFromFile();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to return the latest 10 submitted texts
app.get('/api/texts', (req, res) => {
    res.json(messages.slice(-10)); // Return only the latest 10 messages
});

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send the current texts to the new client
    ws.send(JSON.stringify(messages.slice(-10))); // Send the latest 10 messages to the new client

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Handle upgrade requests to add WebSocket support
app.server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Route to handle text submissions
app.post('/api/submit', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'Text is required' });
    }

    // Add the new message to the in-memory array
    messages.push(text);

    // Save messages to the JSON file
    saveMessagesToFile(messages);

    // Notify all connected WebSocket clients about the new message
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messages.slice(-10))); // Send the latest 10 messages to all clients
        }
    });

    res.json({ message: 'Text submitted successfully' });
});
