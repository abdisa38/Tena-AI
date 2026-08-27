const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controller (will create next)
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register new user from Clerk webhook
// @access  Public
router.post('/register', [
  body('clerkId').notEmpty().withMessage('Clerk ID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required')
], authController.register);

// @route   POST /api/auth/sync
// @desc    Sync user data with Clerk
// @access  Private
router.post('/sync', protect, authController.syncUser);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, authController.getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phoneNumber').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']),
  body('language').optional().isIn(['english', 'amharic', 'afaan_oromoo'])
], authController.updateProfile);

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', protect, authController.deleteAccount);

module.exports = router;
