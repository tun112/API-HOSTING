const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let texts = [];

// Load existing texts from texts.json
const loadTexts = () => {
    try {
        const data = fs.readFileSync('texts.json');
        texts = JSON.parse(data);
    } catch (error) {
        console.error('Error reading texts.json:', error);
        texts = [];
    }
};

// Save texts to texts.json
const saveTexts = () => {
    fs.writeFileSync('texts.json', JSON.stringify(texts, null, 2));
};

// Load existing texts on server start
loadTexts();

// Route to return the latest 10 messages
app.get('/api/texts', (req, res) => {
    res.json(texts.slice(-10)); // Return the last 10 messages
});

// Route to return all messages
app.get('/api/all-texts', (req, res) => {
    res.json(texts); // Return all messages
});

// Route to submit a new message
app.post('/api/submit', (req, res) => {
    const { text } = req.body;
    if (text) {
        texts.push(text);
        saveTexts();
        res.json({ message: 'Text submitted successfully!' });
    } else {
        res.status(400).json({ message: 'Text is required!' });
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
