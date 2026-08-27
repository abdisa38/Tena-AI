import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['video', 'in-person', 'chat'],
      default: 'video',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    symptomsDescription: {
      type: String,
      default: '',
    },
    triageRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TriageRecord',
      default: null,
    },
    fee: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'ETB',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    stripePaymentIntentId: {
      type: String,
      default: '',
    },
    doctorNotes: {
      type: String,
      default: '',
    },
    meetingLink: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);
