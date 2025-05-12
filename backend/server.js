const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // <-- added
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/auth', authRoutes);

// Catch-all to serve index.html for any unknown routes 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
