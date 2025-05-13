const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
  imageId: { type: String, required: true, unique: true },
  geometry: {
    fov: Number,
    matrixSize: String,
    sliceThickness: Number,
    sliceGap: Number,
    planeOrientation: String,
    foldoverDirection: String
  },
  sequence: {
    tr: Number,
    te: Number,
    flipAngle: Number,
    pulseSequence: String
  }
});

module.exports = mongoose.model('Parameter', parameterSchema);
