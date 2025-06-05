const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: String,
  category: { type: String, enum: ['Brain', 'Spine', 'Abdominal', 'Cardiac'] },
  type: { type: String, enum: ['image', 'video'] },
  filePath: String,
  uploadedBy: String
});

module.exports = mongoose.model('Media', mediaSchema);
