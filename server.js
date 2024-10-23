const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs'); // Import the fs module

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to read texts from JSON file
const readTextsFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'texts.json'));
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading texts from file:', error);
        return []; // Return an empty array if there's an error
    }
};

// Function to write texts to JSON file
const writeTextsToFile = (texts) => {
    try {
        fs.writeFileSync(path.join(__dirname, 'texts.json'), JSON.stringify(texts, null, 2));
    } catch (error) {
        console.error('Error writing texts to file:', error);
    }
};

// Route to handle text submission
app.post('/api/submit', (req, res) => {
    const { text } = req.body; // Get the text from the request body
    console.log('Received text from client:', text);

    // Read existing texts, add the new text, and write back to the file
    const texts = readTextsFromFile();
    texts.push(text);
    writeTextsToFile(texts);

    res.json({ message: `You submitted: ${text}` }); // Send the same text back
});

// Route to get all submitted texts
app.get('/api/texts', (req, res) => {
    const texts = readTextsFromFile(); // Read texts from the file
    res.json(texts); // Send the array of texts back to the client
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
