const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs').promises;

// @desc    Upload voice recording
// @route   POST /api/voice/upload
// @access  Private
exports.uploadVoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No audio file uploaded'
      });
    }

    const { language } = req.body;

    // File information
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/voice/${req.file.filename}`,
      language: language || 'english'
    };

    // TODO: Upload to Appwrite Cloud Storage for production
    // For now, we're storing locally in uploads/voice folder

    res.status(200).json({
      status: 'success',
      message: 'Voice recording uploaded successfully',
      data: {
        file: fileInfo
      }
    });

  } catch (error) {
    console.error('Upload Voice Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error uploading voice recording',
      error: error.message
    });
  }
};

// @desc    Transcribe voice to text
// @route   POST /api/voice/transcribe
// @access  Private
exports.transcribeVoice = async (req, res) => {
  try {
    const { audioUrl, language } = req.body;

    if (!audioUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Audio URL is required'
      });
    }

    // TODO: Implement actual speech-to-text transcription
    // Options:
    // 1. Google Speech-to-Text API
    // 2. OpenAI Whisper API
    // 3. Browser Web Speech API (client-side)

    // For now, return a placeholder
    const transcript = {
      text: 'Transcription will be implemented with speech-to-text service',
      language: language || 'english',
      confidence: 0.95,
      duration: 30 // seconds
    };

    res.status(200).json({
      status: 'success',
      message: 'Voice transcribed successfully',
      data: {
        transcript
      }
    });

  } catch (error) {
    console.error('Transcribe Voice Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error transcribing voice',
      error: error.message
    });
  }
};

// @desc    Analyze voice recording with AI
// @route   POST /api/voice/analyze
// @access  Private
exports.analyzeVoice = async (req, res) => {
  try {
    const { transcript, language } = req.body;

    if (!transcript) {
      return res.status(400).json({
        status: 'error',
        message: 'Transcript is required for analysis'
      });
    }

    // Extract symptoms from transcript
    // This is a simple extraction - in production, use NLP
    const symptoms = extractSymptomsFromText(transcript);

    if (symptoms.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No symptoms detected in the transcript. Please describe your symptoms clearly.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Voice analyzed successfully',
      data: {
        symptoms,
        language: language || 'english',
        transcriptLength: transcript.length
      }
    });

  } catch (error) {
    console.error('Analyze Voice Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error analyzing voice',
      error: error.message
    });
  }
};

// Helper function to extract symptoms from text
// In production, use proper NLP or AI service
function extractSymptomsFromText(text) {
  const lowerText = text.toLowerCase();
  const symptoms = [];

  // Common symptom keywords
  const symptomKeywords = {
    'headache': ['headache', 'head pain', 'head ache'],
    'fever': ['fever', 'high temperature', 'hot'],
    'cough': ['cough', 'coughing'],
    'sore throat': ['sore throat', 'throat pain'],
    'fatigue': ['tired', 'fatigue', 'exhausted', 'weak'],
    'nausea': ['nausea', 'sick', 'vomit'],
    'dizziness': ['dizzy', 'dizziness', 'lightheaded'],
    'chest pain': ['chest pain', 'chest hurt'],
    'shortness of breath': ['shortness of breath', 'hard to breathe', 'breathing problem'],
    'stomach ache': ['stomach ache', 'stomach pain', 'belly pain'],
    'back pain': ['back pain', 'back ache'],
    'runny nose': ['runny nose', 'stuffy nose', 'congested']
  };

  // Check for each symptom
  for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        symptoms.push({
          symptom: symptom,
          severity: 'moderate', // Default severity
          duration: 'recent', // Default duration
          notes: `Detected from voice: "${keyword}"`
        });
        break; // Only add once per symptom type
      }
    }
  }

  return symptoms;
}

// @desc    Delete voice recording
// @route   DELETE /api/voice/:filename
// @access  Private
exports.deleteVoice = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/voice', filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        status: 'error',
        message: 'Voice recording not found'
      });
    }

    // Delete file
    await fs.unlink(filePath);

    res.status(200).json({
      status: 'success',
      message: 'Voice recording deleted successfully'
    });

  } catch (error) {
    console.error('Delete Voice Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting voice recording',
      error: error.message
    });
  }
};
