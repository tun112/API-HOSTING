const express = require('express');
const cors = require('cors'); // Include cors
const app = express();
const port = 10000;

// Use cors middleware
app.use(cors());

app.get('/api/hello', (req, res) => {
    res.send('Hello, this is your server responding!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
