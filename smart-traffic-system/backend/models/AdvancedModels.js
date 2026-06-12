import mongoose from 'mongoose';

// ============================================
// TRAFFIC METRICS MODEL - Real-time traffic data
// ============================================
const trafficMetricsSchema = new mongoose.Schema(
  {
    junctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Junction',
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    vehicleCount: {
      northBound: { type: Number, default: 0 },
      southBound: { type: Number, default: 0 },
      eastBound: { type: Number, default: 0 },
      westBound: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    congestionLevel: {
      type: Number, // 0-100 percentage
      min: 0,
      max: 100,
      required: true
    },
    averageWaitTime: Number, // in seconds
    averageSpeed: Number, // km/h
    vehicleTypes: {
      cars: { type: Number, default: 0 },
      buses: { type: Number, default: 0 },
      trucks: { type: Number, default: 0 },
      motorcycles: { type: Number, default: 0 },
      emergencyVehicles: { type: Number, default: 0 }
    },
    pollutionLevel: {
      pm25: Number,
      pm10: Number,
      nox: Number,
      co2: Number
    },
    weatherCondition: {
      condition: String, // sunny, rainy, foggy
      temperature: Number,
      humidity: Number,
      visibility: Number
    },
    dataQuality: {
      type: Number,
      min: 0,
      max: 100 // Confidence score
    }
  },
  { timestamps: true }
);

trafficMetricsSchema.index({ junctionId: 1, timestamp: -1 });

// ============================================
// AGENT STATE MODEL - Track agent decisions and state
// ============================================
const agentStateSchema = new mongoose.Schema(
  {
    agentId: {
      type: String, // L1, L2, L3 identifier
      required: true,
      index: true
    },
    level: {
      type: String,
      enum: ['L1', 'L2', 'L3'],
      required: true
    },
    assignedArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Junction', // L1: Junction, L2: Zone, L3: City
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'standby', 'error'],
      default: 'active'
    },
    currentDecisions: {
      signalTiming: {
        greenTime: Number,
        redTime: Number,
        yellowTime: { type: Number, default: 5 }
      },
      trafficDiversionEnabled: { type: Boolean, default: false },
      emergencyMode: { type: Boolean, default: false },
      dynamicLaneUsage: { type: Boolean, default: false }
    },
    performance: {
      efficiencyScore: { type: Number, min: 0, max: 100 },
      congestionReduction: { type: Number, default: 0 }, // percentage
      vehicleThroughput: { type: Number, default: 0 },
      waitTimeReduction: { type: Number, default: 0 },
      pollutionReduction: { type: Number, default: 0 }
    },
    coordinationWith: {
      parentAgent: { type: String }, // L1 → L2, L2 → L3
      siblingAgents: [String],
      collaborationScore: { type: Number, min: 0, max: 100, default: 0 }
    },
    lastUpdate: { type: Date, default: Date.now },
    nextOptimization: Date,
    algorithm: {
      type: String,
      enum: ['webster_adaptive', 'scats', 'scoot', 'vms', 'ml_predictive', 'hybrid'],
      default: 'webster_adaptive'
    },
    trainingData: {
      samplesProcessed: Number,
      accuracy: { type: Number, min: 0, max: 100 },
      predictionConfidence: { type: Number, min: 0, max: 100 }
    }
  },
  { timestamps: true }
);

agentStateSchema.index({ agentId: 1, timestamp: -1 });
agentStateSchema.index({ level: 1, assignedArea: 1 });

// ============================================
// TRAFFIC PREDICTION MODEL - ML-based traffic forecasting
// ============================================
const trafficPredictionSchema = new mongoose.Schema(
  {
    junction: { type: String, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    
    // Actual data
    actualVehicles: {
      north: Number,
      south: Number,
      east: Number,
      west: Number,
      total: Number
    },
    
    // ML Predictions (24-hour forecast)
    predictions: {
      nextHour: { vehicles: Number, confidence: Number, trend: String },
      next4Hours: [{ hour: Number, vehicles: Number, confidence: Number, congestionLevel: String }],
      next24Hours: [{ hour: Number, avgVehicles: Number, peakTime: Boolean }]
    },
    
    // Analytics
    seasonality: {
      weekday: Number,
      timeOfDay: String,
      isPeakHour: Boolean,
      historicalAvg: Number,
      deviation: Number
    },
    
    // ML Scores
    mlModel: {
      algorithm: { type: String, default: 'LSTM+XGBoost' },
      accuracy: Number,
      mape: Number, // Mean Absolute Percentage Error
      rmse: Number  // Root Mean Squared Error
    },
    
    status: { type: String, enum: ['accurate', 'needs_recalibration'], default: 'accurate' }
  },
  { timestamps: true }
);

trafficPredictionSchema.index({ junction: 1, timestamp: -1 });

// Recommendation Engine Model - AI suggestions for authorities
const recommendationSchema = new mongoose.Schema(
  {
    forAuthority: { type: String, enum: ['road_authority', 'municipal_corp', 'traffic_police'] },
    zone: String,
    
    recommendations: [{
      type: { type: String, enum: ['signal_adjustment', 'patrol_deployment', 'route_diversion', 'enforcement_focus'] },
      priority: { type: String, enum: ['critical', 'high', 'medium', 'low'] },
      title: String,
      description: String,
      actionItems: [String],
      estimatedImpact: {
        congestionReduction: String,  // e.g., "15-20%"
        timeSaved: String,            // e.g., "5-7 min"
        safetyImprovement: String
      },
      confidence: Number,
      aiModel: { type: String, default: 'Decision_Forest' },
      generatedAt: { type: Date, default: Date.now },
      isImplemented: Boolean,
      implementation: {
        startedAt: Date,
        completedAt: Date,
        actualImpact: Object
      }
    }],
    
    reasoning: String,
    dataPoints: [String],
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

// Real-time Analytics Model
const analyticsSchema = new mongoose.Schema(
  {
    zone: String,
    timestamp: { type: Date, default: Date.now, index: true },
    
    // Traffic Metrics
    traffic: {
      totalVehicles: Number,
      avgSpeed: Number,
      congestionIndex: Number, // 0-100
      flowIndex: Number,
      incidents: Number,
      accidents: Number
    },
    
    // Violations & Enforcement
    violations: {
      speeding: Number,
      illegal_parking: Number,
      signal_jumps: Number,
      encroachments: Number,
      totalChallan: Number,
      revenue: Number
    },
    
    // Emergency Response
    emergencies: {
      active: Number,
      ambulances: Number,
      firetrucks: Number,
      police: Number,
      avgResponseTime: Number,
      clearanceTime: Number
    },
    
    // Signals Performance
    signals: {
      optimized: Number,
      manual: Number,
      failedAttempts: Number,
      avgGreenTime: Number
    },
    
    // Environmental
    air_quality: {
      pm25: Number,
      pm10: Number,
      no2: Number,
      co: Number
    },
    
    // Safety Score (0-100)
    safetyScore: Number,
    efficiencyScore: Number,
    overallHealthScore: Number
  },
  { timestamps: true }
);

analyticsSchema.index({ zone: 1, timestamp: -1 });

// User Behavior Model - Learning from user actions
const userBehaviorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    authority: String,
    
    // Interaction Data
    interactions: [{
      action: String,
      module: String,
      timestamp: Date,
      duration: Number, // seconds
      result: String
    }],
    
    // Preferences
    preferences: {
      preferredAlerts: [String],
      notificationTime: String,
      dashboardLayout: Object,
      reportFormat: String
    },
    
    // Performance Metrics
    performance: {
      avgResponseTime: Number,
      decisionsPerDay: Number,
      implementedRecommendations: Number,
      successRate: Number
    },
    
    // AI Personalization
    personalizedSettings: {
      aiRecommendationStyle: String, // 'aggressive', 'conservative', 'balanced'
      dataVisualizationPreference: String,
      automationLevel: Number // 0-100
    }
  },
  { timestamps: true }
);

// System Performance Model
const systemPerformanceSchema = new mongoose.Schema(
  {
    metric: String,
    timestamp: { type: Date, default: Date.now, index: true },
    
    // API Performance
    apiPerformance: {
      avgResponseTime: Number,
      errorRate: Number,
      requestsPerSecond: Number,
      uptime: Number // percentage
    },
    
    // Database Performance
    dbPerformance: {
      queryTime: Number,
      indexHitRate: Number,
      cacheHitRate: Number
    },
    
    // Agent Performance
    agentPerformance: {
      junctionAgents: {
        running: Number,
        optimizationTime: Number,
        successRate: Number
      },
      regionalCoordinators: {
        running: Number,
        coordinationTime: Number,
        zonesManaged: Number
      },
      cityGovernor: {
        running: Boolean,
        analysisTime: Number,
        decisionsPerMinute: Number
      }
    },
    
    // Alerts
    alerts: [{
      level: String, // 'critical', 'warning', 'info'
      message: String,
      autoResolved: Boolean
    }]
  },
  { timestamps: true }
);

// Smart Insights Model - AI-generated insights
const insightsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['trend', 'anomaly', 'opportunity', 'risk', 'pattern'] },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    
    title: String,
    description: String,
    detail: String,
    
    // Data Source
    sources: [String], // e.g., ['traffic_data', 'violation_reports', 'emergency_logs']
    zone: String,
    period: { startDate: Date, endDate: Date },
    
    // AI Analysis
    aiAnalysis: {
      algorithm: String,
      confidence: Number,
      relatedMetrics: [String],
      historicalContext: String
    },
    
    // Recommended Actions
    recommendedActions: [{
      action: String,
      priority: String,
      expectedOutcome: String
    }],
    
    // Impact Metrics
    impact: {
      affectedAreas: [String],
      estimatedCost: Number,
      timeframe: String
    },
    
    status: { type: String, enum: ['new', 'acknowledged', 'acted_upon', 'resolved'], default: 'new' },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

// ML Model Performance Tracking
const mlModelSchema = new mongoose.Schema(
  {
    modelName: String,
    version: String,
    purpose: String, // 'traffic_prediction', 'anomaly_detection', 'recommendation'
    
    // Model Info
    algorithm: String,
    hyperparameters: Object,
    trainingDate: Date,
    
    // Performance Metrics
    performance: {
      accuracy: Number,
      precision: Number,
      recall: Number,
      f1Score: Number,
      auc: Number,
      mae: Number,
      rmse: Number
    },
    
    // Training Data
    trainingData: {
      samples: Number,
      features: Number,
      dateRange: { start: Date, end: Date }
    },
    
    // Validation
    validationMetrics: Object,
    testMetrics: Object,
    
    // Status
    status: { type: String, enum: ['training', 'validating', 'deployed', 'deprecated'], default: 'deployed' },
    lastUsed: Date,
    usageCount: Number,
    
    // Deployment
    deployment: {
      environment: String,
      containerImage: String,
      memoryRequired: String,
      computeRequired: String
    }
  },
  { timestamps: true }
);

// ============================================
// REAL-TIME EVENTS MODEL - Event logging
// ============================================
const realTimeEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: [
        'incident', 'emergency', 'congestion_high', 'congestion_cleared',
        'agent_decision', 'signal_change', 'vehicle_detection',
        'pollution_spike', 'weather_change', 'system_alert'
      ],
      required: true,
      index: true
    },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      default: 'info'
    },
    location: {
      junctionId: mongoose.Schema.Types.ObjectId,
      coordinates: { latitude: Number, longitude: Number },
      area: String
    },
    details: {
      agentId: String,
      description: String,
      data: mongoose.Schema.Types.Mixed
    },
    impact: {
      affectedVehicles: Number,
      delayInSeconds: Number,
      emissionsImpact: Number
    },
    resolution: {
      resolved: { type: Boolean, default: false },
      resolvedAt: Date,
      resolutionTime: Number,
      resolvedBy: String
    },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

realTimeEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

// ============================================
// ZONE ANALYTICS MODEL - Zone-level performance
// ============================================
const zoneAnalyticsSchema = new mongoose.Schema(
  {
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
      required: true,
      index: true
    },
    date: { type: Date, required: true },
    metrics: {
      totalVehicles: Number,
      peakCongestion: { type: Number, min: 0, max: 100 },
      averageCongestion: { type: Number, min: 0, max: 100 },
      averageWaitTime: Number,
      totalDelay: Number,
      totalEmissions: Number
    },
    trafficFlow: {
      throughput: Number,
      smoothness: { type: Number, min: 0, max: 100 },
      bottlenecks: [String]
    },
    incidents: {
      count: Number,
      criticalCount: Number,
      averageResolutionTime: Number
    },
    agentPerformance: {
      coordinatorId: String,
      decisionCount: Number,
      effectiveDecisions: Number,
      efficiency: { type: Number, min: 0, max: 100 }
    },
    peakHours: [
      {
        hour: Number,
        congestion: Number,
        vehicles: Number
      }
    ],
    recommendations: [String]
  },
  { timestamps: true }
);

zoneAnalyticsSchema.index({ zoneId: 1, date: -1 });

// ============================================
// CITY GOVERNOR METRICS MODEL
// ============================================
const cityGovernorMetricsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    cityWideMetrics: {
      totalVehicles: Number,
      averageCongestion: { type: Number, min: 0, max: 100 },
      totalDelay: Number,
      totalEmissions: Number
    },
    zonePerformance: [
      {
        zoneId: mongoose.Schema.Types.ObjectId,
        congestion: { type: Number, min: 0, max: 100 },
        throughput: Number,
        efficiency: { type: Number, min: 0, max: 100 }
      }
    ],
    emergencyResponse: {
      activeIncidents: Number,
      averageResponseTime: Number,
      averageResolutionTime: Number,
      priorityAlerts: Number
    },
    agentCoordination: {
      l1Agents: { active: Number, effective: Number },
      l2Agents: { active: Number, effective: Number },
      l3Agent: { active: Boolean, efficiency: Number }
    },
    predictions: {
      peakHourForecast: String,
      estimatedCongestion: Number,
      recommendedActions: [String]
    },
    criticalAreas: [
      {
        areaId: mongoose.Schema.Types.ObjectId,
        issue: String,
        severity: String,
        suggestedIntervention: String
      }
    ]
  },
  { timestamps: true }
);

cityGovernorMetricsSchema.index({ date: -1 });

// ============================================
// VEHICLE DETECTION MODEL
// ============================================
const vehicleDetectionSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    junctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Junction',
      required: true,
      index: true
    },
    vehicles: [
      {
        vehicleId: String,
        type: {
          type: String,
          enum: ['car', 'bus', 'truck', 'motorcycle', 'ambulance', 'fire', 'police']
        },
        speed: Number,
        direction: String,
        confidence: { type: Number, min: 0, max: 100 },
        timestamp: Date
      }
    ],
    totalCount: Number,
    crowdLevel: { type: Number, min: 0, max: 100 },
    cameraId: String,
    dataQuality: { type: Number, min: 0, max: 100 }
  },
  { timestamps: true }
);

vehicleDetectionSchema.index({ timestamp: 1 }, { expireAfterSeconds: 172800 });

// ============================================
// AGENT COMMUNICATION LOG MODEL
// ============================================
const agentCommunicationSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
      index: true
    },
    receiverId: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ['coordination', 'alert', 'data_sync', 'request', 'acknowledgment']
    },
    content: mongoose.Schema.Types.Mixed,
    priority: {
      type: String,
      enum: ['critical', 'high', 'normal', 'low'],
      default: 'normal'
    },
    processed: { type: Boolean, default: false },
    response: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

agentCommunicationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

// Export models
export const TrafficMetrics = mongoose.model('TrafficMetrics', trafficMetricsSchema);
export const AgentState = mongoose.model('AgentState', agentStateSchema);
export const TrafficPrediction = mongoose.model('TrafficPrediction', trafficPredictionSchema);
export const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export const Analytics = mongoose.model('Analytics', analyticsSchema);
export const UserBehavior = mongoose.model('UserBehavior', userBehaviorSchema);
export const SystemPerformance = mongoose.model('SystemPerformance', systemPerformanceSchema);
export const SmartInsights = mongoose.model('SmartInsights', insightsSchema);
export const MLModel = mongoose.model('MLModel', mlModelSchema);
export const RealTimeEvent = mongoose.model('RealTimeEvent', realTimeEventSchema);
export const ZoneAnalytics = mongoose.model('ZoneAnalytics', zoneAnalyticsSchema);
export const CityGovernorMetrics = mongoose.model('CityGovernorMetrics', cityGovernorMetricsSchema);
export const VehicleDetection = mongoose.model('VehicleDetection', vehicleDetectionSchema);
export const AgentCommunication = mongoose.model('AgentCommunication', agentCommunicationSchema);
