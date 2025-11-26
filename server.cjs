const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - return index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3063;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 VoteSphere Frontend running on port ${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'dist')}`);
});


