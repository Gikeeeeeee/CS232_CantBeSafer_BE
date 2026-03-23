const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Define a basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my Node.js backend!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});