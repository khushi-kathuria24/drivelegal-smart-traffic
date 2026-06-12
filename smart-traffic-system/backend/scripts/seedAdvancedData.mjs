import mongoose from 'mongoose';
import {
  TrafficMetrics,
  AgentState,
  RealTimeEvent,
  TrafficPrediction,
  ZoneAnalytics,
  CityGovernorMetrics,
  VehicleDetection
} from '../models/AdvancedModels.js';

// Generic junctions - customize for your city
const CITY_JUNCTIONS = {
  'junction-north': '507f1f77bcf86cd799439001',
  'junction-central': '507f1f77bcf86cd799439002',
  'junction-south': '507f1f77bcf86cd799439003',
  'junction-east': '507f1f77bcf86cd799439004',
  'junction-west': '507f1f77bcf86cd799439005'
};

// Generic zones - customize for your city
const CITY_ZONES = {
  'zone-1': '507f1f77bcf86cd799439101',
  'zone-2': '507f1f77bcf86cd799439102',
  'zone-3': '507f1f77bcf86cd799439103',
  'zone-4': '507f1f77bcf86cd799439104',
  'zone-5': '507f1f77bcf86cd799439105'
};

/**
 * Generate realistic traffic metrics for a junction
 */
function generateTrafficMetrics(junctionId, congestionLevel = null) {
  const hour = new Date().getHours();
  
  let baseCongestion = 30;
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
    baseCongestion = 75 + Math.random() * 20;
  } else if (hour >= 10 && hour <= 17) {
    baseCongestion = 50 + Math.random() * 20;
  } else if (hour >= 19 || hour <= 6) {
    baseCongestion = 20 + Math.random() * 15;
  }

  const actualCongestion = congestionLevel || baseCongestion;
  const totalVehicles = Math.round((actualCongestion / 100) * 5000 + Math.random() * 500);

  return {
    junctionId: new mongoose.Types.ObjectId(junctionId),
    timestamp: new Date(),
    vehicleCount: {
      northBound: Math.round(totalVehicles * 0.25),
      southBound: Math.round(totalVehicles * 0.25),
      eastBound: Math.round(totalVehicles * 0.25),
      westBound: Math.round(totalVehicles * 0.25),
      total: totalVehicles
    },
    congestionLevel: Math.round(actualCongestion),
    averageWaitTime: Math.round((actualCongestion / 100) * 300),
    averageSpeed: Math.round(60 - (actualCongestion / 100) * 40),
    vehicleTypes: {
      cars: Math.round(totalVehicles * 0.60),
      buses: Math.round(totalVehicles * 0.15),
      trucks: Math.round(totalVehicles * 0.15),
      motorcycles: Math.round(totalVehicles * 0.08),
      emergencyVehicles: Math.round(Math.random() * 2)
    },
    pollutionLevel: {
      pm25: 40 + (actualCongestion / 100) * 80,
      pm10: 60 + (actualCongestion / 100) * 100,
      nox: 30 + (actualCongestion / 100) * 50,
      co2: 200 + (actualCongestion / 100) * 400
    },
    weatherCondition: {
      condition: 'sunny',
      temperature: 28 + Math.random() * 5,
      humidity: 60 + Math.random() * 20,
      visibility: 2 + Math.random() * 3
    },
    dataQuality: 95 + Math.random() * 5
  };
}

/**
 * Generate agent state
 */
function generateAgentState(agentId, level, assignedArea, efficiencyScore = null) {
  const efficiency = efficiencyScore || (50 + Math.random() * 50);
  
  return {
    agentId,
    level,
    assignedArea: new mongoose.Types.ObjectId(assignedArea),
    status: 'active',
    currentDecisions: {
      signalTiming: {
        greenTime: 30 + Math.random() * 40,
        redTime: 30 + Math.random() * 40,
        yellowTime: 5
      },
      trafficDiversionEnabled: Math.random() > 0.7,
      emergencyMode: Math.random() > 0.95,
      dynamicLaneUsage: Math.random() > 0.6
    },
    performance: {
      efficiencyScore: Math.round(efficiency),
      congestionReduction: Math.round(Math.random() * 40 + 30),
      vehicleThroughput: 2500 + Math.random() * 1500,
      waitTimeReduction: Math.round(Math.random() * 120 + 60),
      pollutionReduction: Math.round(Math.random() * 35 + 20)
    },
    coordinationWith: {
      parentAgent: level === 'L1' ? 'L2-COORDINATOR' : level === 'L2' ? 'L3-GOVERNOR' : null,
      siblingAgents: level === 'L1' ? ['L1-AGENT-2', 'L1-AGENT-3'] : [],
      collaborationScore: 50 + Math.random() * 50
    },
    lastUpdate: new Date(),
    algorithm: ['webster_adaptive', 'scats', 'ml_predictive'][Math.floor(Math.random() * 3)],
    trainingData: {
      samplesProcessed: 50000 + Math.random() * 50000,
      accuracy: 85 + Math.random() * 10,
      predictionConfidence: 80 + Math.random() * 15
    }
  };
}

/**
 * Generate realistic traffic prediction
 */
function generateTrafficPrediction(junction) {
  const baseVehicles = Math.random() * 5000 + 1000;
  
  return {
    junction,
    timestamp: new Date(),
    actualVehicles: {
      north: baseVehicles * 0.25,
      south: baseVehicles * 0.25,
      east: baseVehicles * 0.25,
      west: baseVehicles * 0.25,
      total: baseVehicles
    },
    predictions: {
      nextHour: {
        vehicles: Math.round(baseVehicles * (0.9 + Math.random() * 0.2)),
        confidence: 85 + Math.random() * 10,
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing'
      },
      next4Hours: Array(4).fill(0).map((_, i) => ({
        hour: i + 1,
        vehicles: Math.round(baseVehicles * (0.8 + Math.random() * 0.3)),
        confidence: 80 + Math.random() * 10,
        congestionLevel: Math.random() > 0.5 ? 'high' : 'medium'
      })),
      next24Hours: Array(24).fill(0).map((_, i) => ({
        hour: i,
        avgVehicles: Math.round(baseVehicles * (0.5 + Math.random() * 0.6)),
        peakTime: (i >= 8 && i <= 10) || (i >= 17 && i <= 19)
      }))
    },
    seasonality: {
      weekday: new Date().getDay(),
      timeOfDay: 'peak',
      isPeakHour: true,
      historicalAvg: baseVehicles,
      deviation: Math.random() * 200 - 100
    },
    mlModel: {
      algorithm: 'LSTM+XGBoost',
      accuracy: 92 + Math.random() * 5,
      mape: 8 + Math.random() * 4,
      rmse: 150 + Math.random() * 100
    },
    status: 'accurate'
  };
}

/**
 * Generate real-time events
 */
function generateRealtimeEvents(count = 5) {
  const eventTypes = [
    'incident', 'emergency', 'congestion_high',
    'agent_decision', 'signal_change', 'vehicle_detection'
  ];

  const events = [];
  for (let i = 0; i < count; i++) {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const severity = ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)];

    events.push({
      eventType,
      severity,
      location: {
        junctionId: new mongoose.Types.ObjectId(Object.values(CITY_JUNCTIONS)[Math.floor(Math.random() * 5)]),
        coordinates: {
          latitude: 17.6 + Math.random() * 0.1,
          longitude: 75.8 + Math.random() * 0.2
        },
        area: Object.keys(CITY_JUNCTIONS)[Math.floor(Math.random() * 5)]
      },
      details: {
        agentId: `L${Math.floor(Math.random() * 3) + 1}-AGENT`,
        description: `${eventType} detected and processed`,
        data: { confidence: 90 + Math.random() * 10 }
      },
      impact: {
        affectedVehicles: Math.round(Math.random() * 500),
        delayInSeconds: Math.round(Math.random() * 300),
        emissionsImpact: Math.round(Math.random() * 50)
      },
      resolution: {
        resolved: Math.random() > 0.3,
        resolutionTime: Math.round(Math.random() * 600),
        resolvedBy: 'L2-COORDINATOR'
      },
      timestamp: new Date(Date.now() - Math.random() * 3600000)
    });
  }

  return events;
}

/**
 * Generate zone analytics
 */
function generateZoneAnalytics(zoneId, zoneName) {
  return {
    zoneId: new mongoose.Types.ObjectId(zoneId),
    date: new Date(),
    metrics: {
      totalVehicles: 10000 + Math.random() * 5000,
      peakCongestion: 70 + Math.random() * 25,
      averageCongestion: 50 + Math.random() * 30,
      averageWaitTime: 100 + Math.random() * 150,
      totalDelay: 5000 + Math.random() * 10000,
      totalEmissions: 500 + Math.random() * 300
    },
    trafficFlow: {
      throughput: 1000 + Math.random() * 500,
      smoothness: 60 + Math.random() * 30,
      bottlenecks: []
    },
    incidents: {
      count: Math.floor(Math.random() * 5),
      criticalCount: Math.floor(Math.random() * 2),
      averageResolutionTime: 300 + Math.random() * 300
    },
    agentPerformance: {
      coordinatorId: 'L2-' + zoneName.toUpperCase(),
      decisionCount: 20 + Math.floor(Math.random() * 40),
      effectiveDecisions: 15 + Math.floor(Math.random() * 30),
      efficiency: 70 + Math.random() * 25
    },
    peakHours: Array(24).fill(0).map((_, hour) => ({
      hour,
      congestion: (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)
        ? 75 + Math.random() * 20
        : 30 + Math.random() * 25,
      vehicles: (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)
        ? 4000 + Math.random() * 2000
        : 1500 + Math.random() * 1000
    })),
    recommendations: [
      'Implement dynamic lane allocation',
      'Increase green time during peak hours',
      'Deploy additional traffic monitoring'
    ]
  };
}

/**
 * Generate city governor metrics
 */
function generateCityGovernorMetrics() {
  return {
    date: new Date(),
    cityWideMetrics: {
      totalVehicles: 50000 + Math.random() * 30000,
      averageCongestion: 55 + Math.random() * 30,
      totalDelay: 50000 + Math.random() * 100000,
      totalEmissions: 3000 + Math.random() * 2000
    },
    zonePerformance: Object.entries(CITY_ZONES).map(([zoneName, zoneId]) => ({
      zoneId: new mongoose.Types.ObjectId(zoneId),
      congestion: 40 + Math.random() * 40,
      throughput: 2000 + Math.random() * 1000,
      efficiency: 60 + Math.random() * 35
    })),
    emergencyResponse: {
      activeIncidents: Math.floor(Math.random() * 5),
      averageResponseTime: 600 + Math.random() * 300,
      averageResolutionTime: 1200 + Math.random() * 600,
      priorityAlerts: Math.floor(Math.random() * 3)
    },
    agentCoordination: {
      l1Agents: {
        active: 5,
        effective: 4 + Math.floor(Math.random() * 2)
      },
      l2Agents: {
        active: 5,
        effective: 4 + Math.floor(Math.random() * 2)
      },
      l3Agent: {
        active: true,
        efficiency: 85 + Math.random() * 10
      }
    },
    predictions: {
      peakHourForecast: '17:00-18:00',
      estimatedCongestion: 80 + Math.random() * 15,
      recommendedActions: [
        'Increase public transportation',
        'Implement route diversion',
        'Deploy emergency services'
      ]
    },
    criticalAreas: Array(2).fill(0).map((_, i) => ({
      areaId: new mongoose.Types.ObjectId(Object.values(CITY_ZONES)[i]),
      issue: 'High congestion',
      severity: 'high',
      suggestedIntervention: 'Signal adjustment'
    }))
  };
}

/**
 * Main seeding function
 */
async function seedAdvancedData() {
  try {
    console.log('🌱 Starting advanced database seeding...\n');

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/drivelegal-traffic';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      TrafficMetrics.deleteMany({}),
      AgentState.deleteMany({}),
      RealTimeEvent.deleteMany({}),
      TrafficPrediction.deleteMany({}),
      ZoneAnalytics.deleteMany({}),
      CityGovernorMetrics.deleteMany({}),
      VehicleDetection.deleteMany({})
    ]);
    console.log('✅ Data cleared\n');

    // Seed Traffic Metrics
    console.log('📊 Seeding traffic metrics...');
    for (let hour = 0; hour < 24; hour++) {
      for (const [junctionName, junctionId] of Object.entries(CITY_JUNCTIONS)) {
        const congestion = ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19))
          ? 75 + Math.random() * 20
          : 30 + Math.random() * 25;

        const metrics = generateTrafficMetrics(junctionId, congestion);
        metrics.timestamp = new Date(Date.now() - (24 - hour) * 3600000);
        await TrafficMetrics.create(metrics);
      }
    }
    console.log('✅ Traffic metrics seeded\n');

    // Seed Agent States
    console.log('🤖 Seeding agent states...');
    for (const [junctionName, junctionId] of Object.entries(CITY_JUNCTIONS)) {
      const agent = generateAgentState(`L1-${junctionName.toUpperCase()}`, 'L1', junctionId);
      await AgentState.create(agent);
    }
    for (const [zoneName, zoneId] of Object.entries(CITY_ZONES)) {
      const agent = generateAgentState(`L2-${zoneName.toUpperCase()}`, 'L2', zoneId, 85 + Math.random() * 10);
      await AgentState.create(agent);
    }
    const l3Agent = generateAgentState('L3-CITY-GOVERNOR', 'L3', Object.values(CITY_ZONES)[0], 90);
    await AgentState.create(l3Agent);
    console.log('✅ Agent states seeded (11 total)\n');

    // Seed Real-Time Events
    console.log('📡 Seeding real-time events...');
    const events = generateRealtimeEvents(50);
    await RealTimeEvent.insertMany(events);
    console.log('✅ Real-time events seeded\n');

    // Seed Traffic Predictions
    console.log('🔮 Seeding traffic predictions...');
    for (const [junctionName] of Object.entries(CITY_JUNCTIONS)) {
      const prediction = generateTrafficPrediction(junctionName);
      await TrafficPrediction.create(prediction);
    }
    console.log('✅ Traffic predictions seeded\n');

    // Seed Zone Analytics
    console.log('📈 Seeding zone analytics...');
    for (const [zoneName, zoneId] of Object.entries(CITY_ZONES)) {
      const analytics = generateZoneAnalytics(zoneId, zoneName);
      await ZoneAnalytics.create(analytics);
    }
    console.log('✅ Zone analytics seeded\n');

    // Seed City Governor Metrics
    console.log('🏛️  Seeding city governor metrics...');
    const cityMetrics = generateCityGovernorMetrics();
    await CityGovernorMetrics.create(cityMetrics);
    console.log('✅ City governor metrics seeded\n');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`  • Traffic Metrics: 120 records (5 junctions × 24 hours)`);
    console.log(`  • Agent States: 11 records (5 L1 + 5 L2 + 1 L3)`);
    console.log(`  • Real-Time Events: 50 records`);
    console.log(`  • Traffic Predictions: 5 records`);
    console.log(`  • Zone Analytics: 5 records`);
    console.log(`  • City Governor Metrics: 1 record`);
    console.log(`  • Total: 192 records\n`);

    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

export default seedAdvancedData;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdvancedData();
}
          },
          mlModel: {
            algorithm: 'LSTM+XGBoost',
            accuracy: 0.88 + Math.random() * 0.11,
            mape: 12 + Math.random() * 8,
            rmse: 15 + Math.random() * 10
          }
        });
        predictions.push(prediction);
      }
    }
    await TrafficPrediction.insertMany(predictions);
    console.log(`✅ Created ${predictions.length} traffic predictions`);

    // 2. Seed Recommendations
    console.log('\n💡 Seeding AI Recommendations...');
    const recommendations = [];
    for (const zone of ZONES) {
      for (const authority of ['municipal_corp', 'road_authority']) {
        const rec = new Recommendation({
          forAuthority: authority,
          zone,
          recommendations: [
            {
              type: authority === 'municipal_corp' ? 'signal_adjustment' : 'enforcement_focus',
              priority: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)],
              title: `Optimize ${zone} - ${authority}`,
              description: `ML analysis suggests optimization potential`,
              actionItems: [
                'Action Item 1',
                'Action Item 2',
                'Action Item 3'
              ],
              estimatedImpact: {
                congestionReduction: `${Math.floor(Math.random() * 25) + 5}-${Math.floor(Math.random() * 15) + 15}%`,
                timeSaved: `${Math.floor(Math.random() * 5) + 2}-${Math.floor(Math.random() * 5) + 5} min`,
                safetyImprovement: `${Math.floor(Math.random() * 20) + 10}-${Math.floor(Math.random() * 20) + 15}%`
              },
              confidence: 0.75 + Math.random() * 0.24,
              aiModel: 'Decision_Forest',
              isImplemented: Math.random() > 0.7
            }
          ],
          reasoning: 'Generated based on historical patterns and real-time data analysis',
          dataPoints: ['traffic_data', 'violation_reports', 'emergency_logs']
        });
        recommendations.push(rec);
      }
    }
    await Recommendation.insertMany(recommendations);
    console.log(`✅ Created ${recommendations.length} recommendations`);

    // 3. Seed Analytics Data
    console.log('\n📈 Seeding Analytics Data...');
    const analyticsData = [];
    for (const zone of ZONES) {
      for (let i = 0; i < 24; i++) {
        const analytics = new Analytics({
          zone,
          timestamp: new Date(Date.now() - i * 3600000),
          traffic: {
            totalVehicles: Math.floor(Math.random() * 1000),
            avgSpeed: 15 + Math.random() * 45,
            congestionIndex: Math.floor(Math.random() * 100),
            flowIndex: Math.floor(Math.random() * 100),
            incidents: Math.floor(Math.random() * 10),
            accidents: Math.floor(Math.random() * 3)
          },
          violations: {
            speeding: Math.floor(Math.random() * 50),
            illegal_parking: Math.floor(Math.random() * 40),
            signal_jumps: Math.floor(Math.random() * 30),
            encroachments: Math.floor(Math.random() * 20),
            totalChallan: Math.floor(Math.random() * 100),
            revenue: Math.floor(Math.random() * 50000)
          },
          emergencies: {
            active: Math.floor(Math.random() * 5),
            ambulances: Math.floor(Math.random() * 2),
            firetrucks: Math.floor(Math.random() * 1),
            police: Math.floor(Math.random() * 3),
            avgResponseTime: 4 + Math.random() * 3,
            clearanceTime: 8 + Math.random() * 5
          },
          signals: {
            optimized: Math.floor(Math.random() * 50),
            manual: Math.floor(Math.random() * 20),
            failedAttempts: Math.floor(Math.random() * 5),
            avgGreenTime: 30 + Math.random() * 20
          },
          air_quality: {
            pm25: 30 + Math.random() * 50,
            pm10: 50 + Math.random() * 80,
            no2: 40 + Math.random() * 60,
            co: 1 + Math.random() * 2
          },
          safetyScore: 60 + Math.random() * 40,
          efficiencyScore: 50 + Math.random() * 50,
          overallHealthScore: 65 + Math.random() * 35
        });
        analyticsData.push(analytics);
      }
    }
    await Analytics.insertMany(analyticsData);
    console.log(`✅ Created ${analyticsData.length} analytics records`);

    // 4. Seed Smart Insights
    console.log('\n💭 Seeding Smart Insights...');
    const insights = [];
    for (const zone of ZONES) {
      const insightTypes = [
        {
          type: 'trend',
          title: 'Increasing Violation Trend',
          description: 'Violations increased 25% week-over-week',
          severity: 'high'
        },
        {
          type: 'anomaly',
          title: 'Unusual Traffic Pattern',
          description: 'Unexpected congestion spike detected',
          severity: 'high'
        },
        {
          type: 'opportunity',
          title: 'Optimization Opportunity',
          description: 'Green wave coordination can reduce delays',
          severity: 'medium'
        }
      ];

      for (const insightType of insightTypes) {
        const insight = new SmartInsights({
          type: insightType.type,
          severity: insightType.severity,
          title: insightType.title,
          description: insightType.description,
          detail: `Detailed analysis for ${zone}: ${insightType.description}`,
          sources: ['traffic_data', 'violation_reports', 'historical_data'],
          zone,
          period: {
            startDate: new Date(Date.now() - 24 * 3600000),
            endDate: new Date()
          },
          aiAnalysis: {
            algorithm: 'Isolation_Forest',
            confidence: 0.80 + Math.random() * 0.19,
            relatedMetrics: ['congestion', 'violations', 'response_time'],
            historicalContext: '95% beyond normal range'
          },
          recommendedActions: [
            'Action 1: Implement control measure',
            'Action 2: Monitor situation',
            'Action 3: Review policies'
          ],
          impact: {
            affectedAreas: [zone],
            estimatedCost: `₹${Math.floor(Math.random() * 100000)}`,
            timeframe: 'Immediate to 1 week'
          }
        });
        insights.push(insight);
      }
    }
    await SmartInsights.insertMany(insights);
    console.log(`✅ Created ${insights.length} smart insights`);

    // 5. Seed ML Models
    console.log('\n🤖 Seeding ML Models...');
    const models = [
      {
        modelName: 'traffic_predictor_lstm',
        version: '1.0',
        purpose: 'traffic_prediction',
        algorithm: 'LSTM',
        performance: {
          accuracy: 0.92,
          precision: 0.89,
          recall: 0.91,
          f1Score: 0.90,
          mae: 12.5,
          rmse: 18.3
        },
        status: 'deployed'
      },
      {
        modelName: 'anomaly_detector_if',
        version: '1.0',
        purpose: 'anomaly_detection',
        algorithm: 'Isolation_Forest',
        performance: {
          accuracy: 0.88,
          precision: 0.85,
          recall: 0.87,
          f1Score: 0.86,
          auc: 0.91
        },
        status: 'deployed'
      },
      {
        modelName: 'recommendation_engine_rf',
        version: '2.0',
        purpose: 'recommendation',
        algorithm: 'Random_Forest',
        performance: {
          accuracy: 0.85,
          precision: 0.83,
          recall: 0.84,
          f1Score: 0.835,
          auc: 0.89
        },
        status: 'deployed'
      }
    ];

    for (const model of models) {
      const mlModel = new MLModel({
        ...model,
        trainingData: {
          samples: 100000,
          features: 45,
          dateRange: {
            start: new Date(Date.now() - 365 * 24 * 3600000),
            end: new Date()
          }
        },
        deployment: {
          environment: 'production',
          containerImage: 'traffic-ml:1.0',
          memoryRequired: '2GB',
          computeRequired: '2 CPU cores'
        },
        usageCount: Math.floor(Math.random() * 10000),
        lastUsed: new Date()
      });
      await mlModel.save();
    }
    console.log(`✅ Created ${models.length} ML models`);

    // 6. Seed Vehicle Flow Data (for ML training)
    console.log('\n🚗 Seeding Vehicle Flow Data...');
    const flowData = [];
    for (const junction of JUNCTIONS) {
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          let multiplier = 1;
          if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) multiplier = 2.5; // peak hours
          if (day === 0 || day === 6) multiplier *= 0.8; // weekends

          const flow = new VehicleFlow({
            junction,
            timestamp: new Date(Date.now() - (7 - day) * 24 * 3600000 - (24 - hour) * 3600000),
            directions: {
              north: Math.floor((40 + Math.random() * 60) * multiplier),
              south: Math.floor((35 + Math.random() * 55) * multiplier),
              east: Math.floor((30 + Math.random() * 50) * multiplier),
              west: Math.floor((32 + Math.random() * 52) * multiplier)
            },
            heavyVehicleCount: Math.floor(Math.random() * 20),
            lightVehicleCount: Math.floor(Math.random() * 100)
          });
          flowData.push(flow);
        }
      }
    }
    await VehicleFlow.insertMany(flowData);
    console.log(`✅ Created ${flowData.length} vehicle flow records`);

    // 7. Seed Emergency Alerts for violation data
    console.log('\n🚨 Seeding Emergency Alerts & Violations...');
    const emergencies = [];
    for (const zone of ZONES) {
      for (let i = 0; i < 20; i++) {
        const emergency = new EmergencyAlert({
          zone,
          location: `Location ${Math.floor(Math.random() * 100)}`,
          type: ['speeding', 'illegal_parking', 'signal_jump', 'accident', 'encroachment'][Math.floor(Math.random() * 5)],
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          coordinates: {
            lat: 17.66 + Math.random() * 0.02,
            lng: 75.92 + Math.random() * 0.02
          },
          timestamp: new Date(Date.now() - Math.random() * 168 * 3600000),
          resolved: Math.random() > 0.3,
          status: Math.random() > 0.7 ? 'unpaid' : 'paid',
          priority: Math.floor(Math.random() * 5) + 1
        });
        emergencies.push(emergency);
      }
    }
    await EmergencyAlert.insertMany(emergencies);
    console.log(`✅ Created ${emergencies.length} emergency alerts`);

    console.log('\n✅ ===== ADVANCED DATA SEEDING COMPLETE =====');
    console.log(`
📊 Summary:
  - Traffic Predictions: ${predictions.length}
  - Recommendations: ${recommendations.length}
  - Analytics Records: ${analyticsData.length}
  - Smart Insights: ${insights.length}
  - ML Models: ${models.length}
  - Vehicle Flow Data: ${flowData.length}
  - Emergency Alerts: ${emergencies.length}

🎯 Next Steps:
  1. Start backend server: npm start
  2. Access dashboard: http://localhost:3000/dashboard-advanced
  3. View recommendations: http://localhost:5000/api/advanced/recommendations
  4. Check predictions: http://localhost:5000/api/advanced/forecast/{junctionId}
  5. View insights: http://localhost:5000/api/advanced/insights
    `);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedAdvancedData();
