const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer'); // Middleware for handling file uploads
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

// Initialize Multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Google Cloud Storage
const storageGCS = new Storage();
const bucket = storageGCS.bucket('romed-file-storage'); // Replace with your actual bucket name

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Log requests to the console

// Root route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Welcome to the Express server!' });
});

// Route to handle file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file; // Multer places the file in req.file
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  
  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('finish', () => {
    res.status(200).send('File uploaded successfully');
  });
  
  blobStream.on('error', (err) => {
    res.status(500).send(err);
  });
  
  // End the stream by passing the file buffer
  blobStream.end(file.buffer);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
