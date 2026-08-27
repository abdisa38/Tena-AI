const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe checkout session
// @access  Private
router.post('/create-checkout-session', protect, paymentController.createCheckoutSession);

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public (Stripe verifies)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', protect, paymentController.getPaymentHistory);

// @route   POST /api/payments/cancel-subscription
// @desc    Cancel subscription
// @access  Private
router.post('/cancel-subscription', protect, paymentController.cancelSubscription);

module.exports = router;
