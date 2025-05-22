const express = require('express');
const router = express.Router();
const Parameter = require('../models/parameter'); 


router.post('/save', async (req, res) => {
  const { userId, imageName, parameters } = req.body;

  try {
    
    const existing = await Parameter.findOne({ userId, imageName });

    if (existing) {
      
      existing.parameters = parameters;
      await existing.save();
      return res.status(200).json({ message: 'Parameters updated successfully.' });
    }

   
    const newEntry = new Parameter({ userId, imageName, parameters });
    await newEntry.save();
    res.status(201).json({ message: 'Parameters saved successfully.' });
  } catch (err) {
    console.error('Error saving parameters:', err);
    res.status(500).json({ error: 'Server error while saving parameters.' });
  }
});


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
