import mongoose from 'mongoose';

const violationSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    index: true
  },
  violationType: {
    type: String,
    enum: [
      'speeding',
      'signal_breaking',
      'lane_violation',
      'rash_driving',
      'no_helmet',
      'improper_helmet',
      'helmet_removed',
      'no_insurance',
      'no_puc',
      'illegal_parking',
      'encroachment',
      'other'
    ],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['traffic', 'helmet', 'parking', 'documentation', 'other'],
    default: 'traffic'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical', 'warning'],
    default: 'medium'
  },
  location: {
    type: String,
    required: true
  },
  latitude: Number,
  longitude: Number,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  cameraId: String,
  photoUrl: String,
  videoUrl: String,
  description: String,
  fineAmount: {
    type: Number,
    default: 500
  },
  vehicleClass: {
    type: String,
    enum: ['2-wheeler', '4-wheeler', 'truck', 'bus', 'auto', 'other'],
    default: 'other'
  },
  driver: {
    name: String,
    phone: String,
    licenseNumber: String
  },
  documentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'challenged', 'resolved', 'dismissed'],
    default: 'pending'
  },
  verifiedBy: mongoose.Schema.Types.ObjectId,
  verifiedAt: Date,
  resolvedAt: Date,
  remarks: String,
  attachments: [
    {
      type: String,
      url: String
    }
  ]
}, { timestamps: true });

// Index for common queries
violationSchema.index({ vehicleNumber: 1, timestamp: -1 });
violationSchema.index({ documentedBy: 1, timestamp: -1 });
violationSchema.index({ status: 1 });
violationSchema.index({ violationType: 1 });

const Violation = mongoose.model('Violation', violationSchema);

export default Violation;
