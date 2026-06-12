import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['road_authority', 'municipal_corp', 'traffic_police', 'citizen', 'drivelegal', 'agent'],
      default: 'citizen',
      index: true
    },
    authority: {
      type: String,
      enum: ['road_authority', 'municipal_corp', 'traffic_police', 'individual', 'system'],
      default: 'individual'
    },
    department: String,
    badgeNumber: String,
    jurisdictionArea: String,
    agentType: {
      type: String,
      enum: ['junction_agent_l1', 'regional_coordinator_l2', 'city_governor_l3', null],
      default: null
    },
    phone: {
      type: String,
      trim: true
    },
    vehicleNumber: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date,
    profilePicture: String,
    metadata: {
      assignedZones: [String],
      trafficAuthority: String,
      reportingTo: String
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving and normalize vehicleNumber
userSchema.pre('save', async function (next) {
  if (this.vehicleNumber) {
    this.vehicleNumber = this.vehicleNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  }
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Sanitize user data (remove password from response)
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
