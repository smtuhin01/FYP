const express = require('express');
const router = express.Router();
const Parameter = require('../models/ImageParameter');


router.post('/save', async (req, res) => {
  const { userId, imageId, imageName, parameters } = req.body;

  try {
    // Check if this image has already been saved for this user
    const existing = await Parameter.findOne({ userId, imageId });

    if (existing) {
      existing.parameters = parameters;
      await existing.save();
      return res.status(200).json({ message: 'Parameters updated successfully.' });
    }

    // If not existing, create new entry
    const newEntry = new Parameter({ userId, imageId, imageName, parameters });
    await newEntry.save();
    res.status(201).json({ message: 'Parameters saved successfully.' });
  } catch (err) {
    console.error('Error saving parameters:', err);
    res.status(500).json({ error: 'Server error while saving parameters.' });
  }
});

// @route   GET /api/simulation/user/:userId
// @desc    Get all saved parameters for a student
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const entries = await Parameter.find({ userId });
    res.status(200).json(entries);
  } catch (err) {
    console.error('Error fetching parameters:', err);
    res.status(500).json({ error: 'Server error while fetching parameters.' });
  }
});

module.exports = router;


router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userParameters = await Parameter.find({ userId });
    res.status(200).json(userParameters);
  } catch (err) {
    console.error('Error fetching parameters:', err);
    res.status(500).json({ error: 'Server error while fetching parameters.' });
  }
});

module.exports = router;
