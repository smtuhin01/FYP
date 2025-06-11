const ImageParameter = require('../models/ImageParameter');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
  // First get standard response
  const standardResponse = getStandardResponse(message, currentParams, sequenceType);

  try {
    // Call ChatGPT API with updated client
    const chatGPTResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are an expert MRI technologist assistant. Provide detailed, technical, yet understandable answers about MRI parameters, protocols, and best practices."
      }, {
        role: "user",
        content: `Help with this MRI question in context of these parameters:
        Question: ${message}
        Current parameters:
        - Sequence Type: ${sequenceType}
        - TR: ${currentParams.sequence.tr}ms
        - TE: ${currentParams.sequence.te}ms
        - Flip Angle: ${currentParams.sequence.flipAngle}°
        - FOV: ${currentParams.geometry.fov}mm
        - Matrix Size: ${currentParams.geometry.matrixSize}
        - Slice Thickness: ${currentParams.geometry.sliceThickness}mm
        - Image Type: ${imageName}`
      }]
    });

    // Update response handling for new OpenAI client
    return {
      response: `${standardResponse.response}\n\nAdditional insights from ChatGPT:\n${chatGPTResponse.choices[0].message.content}`,
      suggestedParams: standardResponse.suggestedParams
    };

  } catch (error) {
    console.error('ChatGPT API error:', error);
    // Fallback to standard response if ChatGPT fails
    return standardResponse;
  }
};

// Rename existing generateResponse to getStandardResponse
const getStandardResponse = (msg, currentParams, sequenceType) => {
  // Move existing response logic here
  const message = msg.toLowerCase();

  // Check for parameter recommendations
  if (message.includes('recommend') || message.includes('suggestion') || 
      message.includes('optimal') || message.includes('parameter') || 
      message.includes('settings')) {
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

  // Check for slice positioning advice
  if (message.includes('slice') || message.includes('position') || 
      message.includes('overlay')) {
    return {
      response: "For optimal slice positioning:\n" +
        "1. Center the overlay box on your target anatomy\n" +
        "2. Ensure margins of at least 10% around the region of interest\n" +
        "3. Avoid oblique angles unless specifically required\n" +
        "4. Consider using multiple planes for complete coverage"
    };
  }

  // Check for artifact prevention
  if (message.includes('artifact') || message.includes('quality')) {
    return {
      response: "To minimize artifacts:\n" +
        "1. Use appropriate FOV (too small can cause wrap-around)\n" +
        "2. Maintain adequate slice gap (25-30% of slice thickness)\n" +
        "3. Adjust matrix size based on required resolution\n" +
        "4. Consider breath-holding or gating for motion-sensitive areas"
    };
  }

  // Default response for unrecognized queries
  return {
    response: "I can help you with:\n" +
      "• Parameter recommendations\n" +
      "• Slice positioning advice\n" +
      "• Artifact prevention\n" +
      "• Parameter validation\n\n" +
      "What specific aspect would you like to know about?"
  };
};

const validateParameters = (params) => {
  const issues = [];
  const { geometry, sequence } = params;

  // Geometry validation
  if (geometry.fov < 100 || geometry.fov > 500) {
    issues.push("⚠️ FOV should be between 100-500mm");
  }
  if (geometry.sliceThickness < 0.5 || geometry.sliceThickness > 10) {
    issues.push("⚠️ Slice thickness should be between 0.5-10mm");
  }
  if (geometry.sliceGap >= geometry.sliceThickness) {
    issues.push("⚠️ Slice gap should be less than slice thickness");
  }

  // Sequence validation
  const recommendations = MRI_RECOMMENDATIONS[sequence.pulseSequence];
  if (recommendations) {
    if (sequence.tr < recommendations.tr?.min || sequence.tr > recommendations.tr?.max) {
      issues.push(`⚠️ TR should be between ${recommendations.tr.min}-${recommendations.tr.max}ms for ${sequence.pulseSequence}`);
    }
    if (sequence.te < recommendations.te?.min || sequence.te > recommendations.te?.max) {
      issues.push(`⚠️ TE should be between ${recommendations.te.min}-${recommendations.te.max}ms for ${sequence.pulseSequence}`);
    }
  }

  return issues;
};

const getOptimalParameters = (sequenceType) => {
  const recommendations = MRI_RECOMMENDATIONS[sequenceType];
  if (!recommendations) return null;

  return {
    tr: recommendations.tr?.ideal,
    te: recommendations.te?.ideal,
    flipAngle: recommendations.flipAngle?.ideal
  };
};

exports.chat = async (req, res) => {
  try {
    const { message, currentParams, imageName, sequenceType } = req.body;
    
    console.log('Received request:', {
      message,
      currentParams,
      imageName,
      sequenceType
    });

    const response = await generateResponse(message, currentParams, imageName, sequenceType);
    
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
};