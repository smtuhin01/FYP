const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  imageName: { type: String, required: true },
  parameters: {
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Parameter', parameterSchema);

