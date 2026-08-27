import mongoose from 'mongoose';

const triageRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    patientAge: {
      type: Number,
      required: true,
    },
    patientGender: {
      type: String,
      default: 'unspecified',
    },
    symptoms: {
      type: [String],
      required: true,
    },
    symptomDuration: {
      type: String,
      default: '1-3 days',
    },
    severityRating: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    existingConditions: {
      type: [String],
      default: [],
    },
    // AI Triage Output
    severityLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'Urgent', 'Emergency'],
      required: true,
    },
    clinicalSummary: {
      type: String,
      required: true,
    },
    possibleConditions: {
      type: [String],
      default: [],
    },
    recommendedActions: {
      type: [String],
      required: true,
    },
    suggestedSpecialties: {
      type: [String],
      default: ['General Medicine'],
    },
    redFlags: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: 'en',
    }
  },
  { timestamps: true }
);

export const TriageRecord = mongoose.model('TriageRecord', triageRecordSchema);
