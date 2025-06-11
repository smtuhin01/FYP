const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');

// Log MongoDB URI availability and value
console.log('MONGO_URI available:', !!process.env.MONGO_URI);

// Configure GridFS storage
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'media',
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

// Configure multer
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

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
router.post('/media', 
  verifyToken, 
  verifyAdmin, 
  upload.single('file'), 
  adminController.uploadMedia
);
router.get('/media', verifyToken, verifyAdmin, adminController.getAllMedia);
router.get('/media/:category', verifyToken, verifyAdmin, adminController.getMediaByCategory);
router.delete('/media/:id', verifyToken, verifyAdmin, adminController.deleteMedia);

module.exports = router;