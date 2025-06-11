const ImageParameter = require('../models/ImageParameter');

// MRI sequence recommendations
const MRI_RECOMMENDATIONS = {
  'T1-Weighted': {
    tr: { min: 300, max: 800, ideal: 500 },
    te: { min: 10, max: 30, ideal: 20 },
    flipAngle: { ideal: 90 },
    description: 'T1-weighted imaging is useful for anatomical detail and fat-containing structures.'
  },
  'T2-Weighted': {
    tr: { min: 1500, max: 3000, ideal: 2000 },
    te: { min: 70, max: 150, ideal: 90 },
    flipAngle: { ideal: 90 },
    description: 'T2-weighted imaging is excellent for detecting pathology and fluid.'
  },
  'FLAIR': {
    tr: { min: 2000, max: 5000, ideal: 3000 },
    te: { min: 80, max: 140, ideal: 100 },
    description: 'FLAIR is useful for suppressing CSF signal while maintaining T2 contrast.'
  },
  'DWI': {
    tr: { min: 3000, max: 6000, ideal: 4000 },
    te: { min: 70, max: 120, ideal: 90 },
    description: 'Diffusion-weighted imaging is crucial for detecting early ischemic changes.'
  },
  'GRE': {
    tr: { ideal: 1000 },
    te: { ideal: 25 },
    flipAngle: { ideal: 30 },
    description: 'Gradient echo sequences are useful for detecting hemorrhage and calcification.'
  }
};

const generateResponse = async (message, currentParams, imageName, sequenceType) => {
  return getStandardResponse(message, currentParams, sequenceType);
};

const getStandardResponse = (message, currentParams, sequenceType) => {
  const msg = message.toLowerCase();

  // Parameter recommendations
  if (msg.includes('recommend') || msg.includes('suggestion') || 
      msg.includes('optimal') || msg.includes('parameter') || 
      msg.includes('settings')) {
    const sequence = MRI_RECOMMENDATIONS[sequenceType];
    if (sequence) {
      return {
        response: `For ${sequenceType} sequences, I recommend:\n` +
          `• TR: ${sequence.tr.ideal}ms (range: ${sequence.tr.min}-${sequence.tr.max}ms)\n` +
          `• TE: ${sequence.te.ideal}ms (range: ${sequence.te.min}-${sequence.te.max}ms)\n` +
          `• Flip Angle: ${sequence.flipAngle?.ideal || 'Variable'}°\n\n` +
          `${sequence.description}`,
        suggestedParams: {
          tr: sequence.tr.ideal,
          te: sequence.te.ideal,
          flipAngle: sequence.flipAngle?.ideal
        }
      };
    }
  }

  // Slice positioning advice
  if (msg.includes('slice') || msg.includes('position') || 
      msg.includes('overlay')) {
    return {
      response: "For optimal slice positioning:\n" +
        "1. Center the overlay box on your target anatomy\n" +
        "2. Ensure margins of at least 10% around the region of interest\n" +
        "3. Avoid oblique angles unless specifically required\n" +
        "4. Consider using multiple planes for complete coverage"
    };
  }

  // Artifact prevention
  if (msg.includes('artifact') || msg.includes('quality')) {
    return {
      response: "To minimize artifacts:\n" +
        "1. Use appropriate FOV (too small can cause wrap-around)\n" +
        "2. Maintain adequate slice gap (25-30% of slice thickness)\n" +
        "3. Adjust matrix size based on required resolution\n" +
        "4. Consider breath-holding or gating for motion-sensitive areas"
    };
  }

  // Default response
  return {
    response: "I can help you with:\n" +
      "• Parameter recommendations\n" +
      "• Slice positioning advice\n" +
      "• Artifact prevention\n" +
      "• Parameter validation\n\n" +
      "What specific aspect would you like to know about?"
  };
};

exports.chat = async (req, res) => {
  try {
    const { message, currentParams, imageName, sequenceType } = req.body;
    const response = await generateResponse(message, currentParams, imageName, sequenceType);
    res.json(response);
  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
};