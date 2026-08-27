const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  stripePaymentId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  plan: {
    type: String,
    enum: ['basic', 'premium'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'card'
  },
  billingPeriod: {
    start: Date,
    end: Date
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ stripePaymentId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
