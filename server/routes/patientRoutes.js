const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patientController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// @route   GET /api/patients
// @desc    Get all patients (Doctor/Admin only)
// @access  Private
router.get('/', protect, restrictTo('doctor', 'admin'), patientController.getAllPatients);

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private
router.get('/:id', protect, patientController.getPatientById);

// @route   GET /api/patients/:id/assessments
// @desc    Get all assessments for a specific patient
// @access  Private
router.get('/:id/assessments', protect, patientController.getPatientAssessments);

module.exports = router;
