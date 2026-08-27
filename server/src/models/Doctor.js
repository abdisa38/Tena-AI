import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      enum: [
        'General Medicine',
        'Pediatrics',
        'Cardiology',
        'Dermatology',
        'Gynecology & Obstetrics',
        'Internal Medicine',
        'Orthopedics',
        'Psychiatry',
        'Ophthalmology',
        'Neurology',
      ],
    },
    qualification: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    experienceYears: {
      type: Number,
      default: 3,
    },
    consultationFee: {
      type: Number,
      required: true,
      default: 500, // ETB
    },
    currency: {
      type: String,
      default: 'ETB',
    },
    clinicAffiliation: {
      type: String,
      default: 'St. Paul Hospital Millennium Medical College',
    },
    city: {
      type: String,
      default: 'Addis Ababa',
    },
    bio: {
      type: String,
      default: 'Dedicated healthcare practitioner focused on compassionate and evidence-based patient care.',
    },
    languages: {
      type: [String],
      default: ['English', 'Amharic'],
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 18,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    timeSlots: {
      type: [String],
      default: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
    }
  },
  { timestamps: true }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
