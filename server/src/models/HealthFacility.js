import mongoose from 'mongoose';

const healthFacilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Hospital', 'Clinic', 'Pharmacy', 'Emergency Center', 'Diagnostic Lab'],
      required: true,
    },
    city: {
      type: String,
      default: 'Addis Ababa',
      required: true,
    },
    subCity: {
      type: String,
      default: 'Bole',
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emergencyHotline: {
      type: String,
      default: '907',
    },
    is24Hours: {
      type: Boolean,
      default: false,
    },
    hasAmbulance: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    latitude: {
      type: Number,
      default: 9.010793,
    },
    longitude: {
      type: Number,
      default: 38.761253,
    }
  },
  { timestamps: true }
);

export const HealthFacility = mongoose.model('HealthFacility', healthFacilitySchema);
