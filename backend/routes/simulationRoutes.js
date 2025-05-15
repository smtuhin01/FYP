const express = require('express');
const router = express.Router();
const Parameter = require('../models/parameter'); // ✅ Correct model

// @desc Save or update simulation parameters
// @route POST /api/simulation/save
router.post('/save', async (req, res) => {
  const { userId, imageName, parameters } = req.body;

  try {
    // Check if a record already exists for this user and image
    const existing = await Parameter.findOne({ userId, imageName });

    if (existing) {
      // Update existing parameter
      existing.parameters = parameters;
      await existing.save();
      return res.status(200).json({ message: 'Parameters updated successfully.' });
    }

    // Create new parameter record
    const newEntry = new Parameter({ userId, imageName, parameters });
    await newEntry.save();
    res.status(201).json({ message: 'Parameters saved successfully.' });
  } catch (err) {
    console.error('Error saving parameters:', err);
    res.status(500).json({ error: 'Server error while saving parameters.' });
  }
});

// @desc Fetch all parameters for a user
// @route GET /api/simulation/user/:userId
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
