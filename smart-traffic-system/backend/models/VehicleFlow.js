import mongoose from 'mongoose';

const vehicleFlowSchema = new mongoose.Schema(
  {
    junction: {
      type: String,
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    directions: {
      north: { type: Number, default: 0 },
      south: { type: Number, default: 0 },
      east: { type: Number, default: 0 },
      west: { type: Number, default: 0 }
    },
    heavyVehicleCount: {
      type: Number,
      default: 0
    },
    lightVehicleCount: {
      type: Number,
      default: 0
    },
    totalVehicles: {
      type: Number,
      default: function() {
        const dirs = this.directions;
        return (dirs.north || 0) + (dirs.south || 0) + (dirs.east || 0) + (dirs.west || 0);
      }
    },
    congestionLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  { timestamps: true }
);

// Index for efficient queries
vehicleFlowSchema.index({ junction: 1, timestamp: -1 });
vehicleFlowSchema.index({ timestamp: -1 });

const VehicleFlow = mongoose.model('VehicleFlow', vehicleFlowSchema);

export default VehicleFlow;
