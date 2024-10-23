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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to return the latest 10 submitted texts
app.get('/api/texts', (req, res) => {
    const texts = JSON.parse(fs.readFileSync('texts.json', 'utf8'));
    res.json(texts.slice(-10)); // Return only the latest 10 messages
});

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send the current texts to the new client
    const texts = JSON.parse(fs.readFileSync('texts.json', 'utf8'));
    ws.send(JSON.stringify(texts.slice(-10))); // Send the latest 10 messages to the new client

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

    // Read existing texts
    const texts = JSON.parse(fs.readFileSync('texts.json', 'utf8'));
    texts.push(text);

    // Save updated texts to JSON file
    fs.writeFileSync('texts.json', JSON.stringify(texts, null, 2));

    // Notify all connected WebSocket clients about the new message
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(texts.slice(-10))); // Send the latest 10 messages to all clients
        }
    });

    res.json({ message: 'Text submitted successfully' });
});
