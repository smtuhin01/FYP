const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const parameterRoutes = require('./routes/parameterRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//  Serve all files inside /frontend at the root level
app.use(express.static(path.join(__dirname, 'frontend')));
// Serve all frontend files
app.use(express.static(path.join(__dirname, '../frontend')));


// API routes
app.use('/api/auth', authRoutes);
app.use('/api/parameters', parameterRoutes);

//  Default route to home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
