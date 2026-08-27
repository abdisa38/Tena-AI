import mongoose from 'mongoose';

const medicationItemSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g. '500mg'
  frequency: { type: String, required: true }, // e.g. 'Twice daily after meals'
  duration: { type: String, required: true }, // e.g. '5 days'
  timing: {
    morning: { type: Boolean, default: true },
    afternoon: { type: Boolean, default: false },
    night: { type: Boolean, default: true },
  },
  instructions: { type: String, default: '' },
});

const prescriptionSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medications: [medicationItemSchema],
    generalAdvice: {
      type: String,
      default: 'Drink plenty of water and rest well.',
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'discontinued'],
      default: 'active',
    }
  },
  { timestamps: true }
);

export const Prescription = mongoose.model('Prescription', prescriptionSchema);
