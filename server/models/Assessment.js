const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  assessmentId: {
    type: String,
    unique: true,
    required: true
  },
  // Voice Recording Data
  voiceRecording: {
    url: String,
    duration: Number, // in seconds
    language: {
      type: String,
      enum: ['english', 'amharic', 'afaan_oromoo'],
      required: true
    },
    transcript: String
  },
  // Symptoms
  symptoms: [{
    symptom: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical']
    },
    duration: String, // e.g., "2 days", "1 week"
    notes: String
  }],
  // AI Analysis
  aiAnalysis: {
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    possibleConditions: [{
      condition: String,
      probability: Number,
      description: String
    }],
    recommendations: [String],
    urgencyLevel: {
      type: String,
      enum: ['routine', 'urgent', 'emergency'],
      default: 'routine'
    },
    clinicalSummary: {
      type: String,
      required: true
    },
    processedAt: {
      type: Date,
      default: Date.now
    }
  },
  // Medical Context
  vitalSigns: {
    temperature: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    respiratoryRate: Number
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'reviewed', 'archived'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  doctorNotes: String,
  // Flags
  isEmergency: {
    type: Boolean,
    default: false
  },
  requiresFollowUp: {
    type: Boolean,
    default: false
  },
  followUpDate: Date
}, {
  timestamps: true
});

// Index for efficient queries
assessmentSchema.index({ patient: 1, createdAt: -1 });
assessmentSchema.index({ assessmentId: 1 });
assessmentSchema.index({ status: 1 });

// Pre-save hook to generate assessment ID
assessmentSchema.pre('save', async function(next) {
  if (!this.assessmentId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    this.assessmentId = `TENA-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Virtual for assessment age
assessmentSchema.virtual('assessmentAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInMs = now - created;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
