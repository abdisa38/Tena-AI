const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const voiceController = require('../controllers/voiceController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/voice');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'voice-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept audio files only
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @route   POST /api/voice/upload
// @desc    Upload voice recording
// @access  Private
router.post('/upload', protect, upload.single('voice'), voiceController.uploadVoice);

// @route   POST /api/voice/transcribe
// @desc    Transcribe voice to text
// @access  Private
router.post('/transcribe', protect, voiceController.transcribeVoice);

// @route   POST /api/voice/analyze
// @desc    Analyze voice recording with AI
// @access  Private
router.post('/analyze', protect, voiceController.analyzeVoice);

module.exports = router;
