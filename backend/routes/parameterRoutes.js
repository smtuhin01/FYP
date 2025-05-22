
const express = require('express');
const router = express.Router();
const ImageParam = require('../models/parameter');

router.post('/save', async (req, res) => {
  const { studentId, imageId, imageName, parameters } = req.body;

  try {
    const existing = await ImageParam.findOne({ studentId, imageId });

    if (existing) {
      existing.parameters = parameters;
      await existing.save();
      res.status(200).json({ message: 'Parameters updated successfully.' });
    } else {
      await ImageParam.create({ studentId, imageId, imageName, parameters });
      res.status(201).json({ message: 'Parameters saved successfully.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save parameters.' });
  }
});

// Get all saved parameters for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const data = await ImageParam.find({ studentId: req.params.studentId });
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch parameters.' });
  }
});

module.exports = router;
