const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const assessmentController = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/assessments
// @desc    Create new health assessment
// @access  Private
router.post('/', protect, [
  body('symptoms').isArray().withMessage('Symptoms must be an array'),
  body('language').isIn(['english', 'amharic', 'afaan_oromoo'])
], assessmentController.createAssessment);

// @route   GET /api/assessments
// @desc    Get all assessments for logged-in user
// @access  Private
router.get('/', protect, assessmentController.getMyAssessments);

// @route   GET /api/assessments/:id
// @desc    Get single assessment by ID
// @access  Private
router.get('/:id', protect, assessmentController.getAssessmentById);

// @route   PUT /api/assessments/:id
// @desc    Update assessment (add doctor notes, etc.)
// @access  Private
router.put('/:id', protect, assessmentController.updateAssessment);

// @route   DELETE /api/assessments/:id
// @desc    Delete assessment
// @access  Private
router.delete('/:id', protect, assessmentController.deleteAssessment);

// @route   GET /api/assessments/stats/overview
// @desc    Get assessment statistics for user
// @access  Private
router.get('/stats/overview', protect, assessmentController.getAssessmentStats);

module.exports = router;
