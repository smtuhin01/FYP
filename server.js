const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

// DB and Routes
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const parameterRoutes = require('./routes/parameterRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assistantRoutes = require('./routes/assistantRoutes');

// Connect to DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Optional: Specific routes for clean HTML file serving
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/lecturer-login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lecturer', 'lecturer-login.html'));
});

// ✅ Ensure required directories exist
const ensureDirectoriesExist = () => {
  const directories = [
    './public/Video',
    './public/brain',
    './public/spine',
    './public/abdominal',
    './public/cardic',
    './temp-uploads'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectoriesExist();

// ✅ Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/parameters', parameterRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assistant', assistantRoutes);

// ✅ Multer + General Error Handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 10MB' });
    }
    return res.status(400).json({ message: 'File upload error' });
  }

  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
});
