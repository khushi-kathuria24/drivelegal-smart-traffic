import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema(
  {
    zone: {
      type: String,
      required: true,
      index: true
    },
    location: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['speeding', 'illegal_parking', 'signal_jump', 'accident', 'encroachment', 'emergency_vehicle', 'crowd_density'],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    coordinates: {
      lat: Number,
      lng: Number,
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [lng, lat] for GeoJSON
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    resolved: {
      type: Boolean,
      default: false,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'unpaid', 'acknowledged'],
      default: 'pending'
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    description: String,
    vehicleInfo: {
      licensePlate: String,
      vehicleType: String,
      color: String
    },
    response: {
      responseTime: Number,
      respondedBy: String,
      responseNotes: String
    }
  },
  { timestamps: true }
);

// Index for efficient queries
emergencyAlertSchema.index({ zone: 1, timestamp: -1 });
emergencyAlertSchema.index({ type: 1, timestamp: -1 });
emergencyAlertSchema.index({ coordinates: '2dsphere' });

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);

export default EmergencyAlert;
