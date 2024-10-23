const express = require('express');
const router = express.Router();

// Sample data array
const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
];

// Get all data
router.get('/', (req, res) => {
    res.json(data);
});

// Get a single item by ID
router.get('/:id', (req, res) => {
    const item = data.find(d => d.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Create a new item
router.post('/', (req, res) => {
    const newItem = { id: data.length + 1, name: req.body.name };
    data.push(newItem);
    res.status(201).json(newItem);
});

// Update an item by ID
router.put('/:id', (req, res) => {
    const item = data.find(d => d.id === parseInt(req.params.id));
    if (item) {
        item.name = req.body.name;
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Delete an item by ID
router.delete('/:id', (req, res) => {
    const index = data.findIndex(d => d.id === parseInt(req.params.id));
    if (index !== -1) {
        data.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

module.exports = router;
