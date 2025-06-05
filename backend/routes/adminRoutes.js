const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');

// Log MongoDB URI availability and value
console.log('MONGO_URI available:', !!process.env.MONGO_URI);

// Create storage based on available connection information
let storage;

if (process.env.MONGO_URI) {
  // Use the URI if available
  storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
  });
} else if (mongoose.connection.readyState === 1) {
  // Otherwise use the existing mongoose connection if it's connected
  storage = new GridFsStorage({
    db: mongoose.connection,
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  });
} else {
  console.error('No MongoDB connection available for GridFS storage');
  // Fallback to memory storage for development/testing only
  storage = multer.memoryStorage();
}

const upload = multer({ storage });

// Admin auth routes
router.post('/login', adminController.login);

// Protected admin routes
router.get('/students', verifyToken, verifyAdmin, adminController.getAllStudents);
router.post('/students', verifyToken, verifyAdmin, adminController.createStudent);
router.put('/students/:id', verifyToken, verifyAdmin, adminController.updateStudent);
router.delete('/students/:id', verifyToken, verifyAdmin, adminController.deleteStudent);

router.get('/lecturers', verifyToken, verifyAdmin, adminController.getAllLecturers);
router.post('/lecturers', verifyToken, verifyAdmin, adminController.createLecturer);
router.put('/lecturers/:id', verifyToken, verifyAdmin, adminController.updateLecturer);
router.delete('/lecturers/:id', verifyToken, verifyAdmin, adminController.deleteLecturer);

// Media routes
router.post('/media', verifyToken, verifyAdmin, upload.single('file'), adminController.uploadMedia);
router.get('/media', verifyToken, verifyAdmin, adminController.getAllMedia);
router.get('/media/:category', verifyToken, verifyAdmin, adminController.getMediaByCategory);
router.delete('/media/:id', verifyToken, verifyAdmin, adminController.deleteMedia);

module.exports = router;