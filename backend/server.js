const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const parameterRoutes = require('./routes/parameterRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');

// ✅ NEW: Admin routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

dotenv.config();
connectDB();

const { initializeAdmin } = require('./controllers/adminController');
initializeAdmin();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve all static files from ../frontend (correct path from backend/server.js)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ✅ (Optional) Alias /lecturer-login.html to the subfolder
app.get('/lecturer-login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'lecturer', 'lecturer-login.html'));
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/parameters', parameterRoutes);
app.use('/api/lecturer', lecturerRoutes);

// ✅ NEW: Admin & Media management routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);

// ✅ Default route to home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

