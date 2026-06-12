#!/usr/bin/env node

/**
 * Agent Initialization Script for DriveLegal Smart Traffic System
 * Initializes L1, L2, and L3 agents with Solapur city configuration
 * Usage: node initializeAgents.mjs --city solapur
 */

import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import models
import User from '../models/User.js';
import TrafficSignal from '../models/TrafficSignal.js';
import Zone from '../models/Zone.js';
import Junction from '../models/Junction.js';

// Solapur City Configuration
const SOLAPUR_CONFIG = {
  city: 'Solapur',
  center: { lat: 17.6690, lng: 75.9220 },
  zones: [
    {
      id: 'solapur_central',
      name: 'Central Business District',
      coordinates: { lat: 17.6690, lng: 75.9220 },
      type: 'commercial',
      radius: 2
    },
    {
      id: 'solapur_textile_corridor',
      name: 'Textile Corridor (Industrial)',
      coordinates: { lat: 17.6450, lng: 75.8900 },
      type: 'industrial',
      radius: 3,
      specialFeature: 'textile_industry'
    },
    {
      id: 'solapur_pilgrimage',
      name: 'Pilgrimage Zone (Siddheshwar)',
      coordinates: { lat: 17.6550, lng: 75.9150 },
      type: 'pilgrimage',
      radius: 1.5,
      specialFeature: 'siddheshwar_yatra'
    },
    {
      id: 'solapur_navi_peth',
      name: 'Navi Peth (Old City)',
      coordinates: { lat: 17.6700, lng: 75.9300 },
      type: 'residential',
      radius: 1.2,
      specialFeature: 'narrow_roads_encroachment'
    },
    {
      id: 'solapur_railway',
      name: 'Railway Station Area',
      coordinates: { lat: 17.6690, lng: 75.9220 },
      type: 'transportation_hub',
      radius: 1
    }
  ],
  junctions: [
    {
      name: 'Zillah Road Junction',
      coordinates: { lat: 17.6650, lng: 75.9200 },
      signals: 4,
      type: 'major'
    },
    {
      name: 'Railway Station Junction',
      coordinates: { lat: 17.6690, lng: 75.9220 },
      signals: 6,
      type: 'major'
    },
    {
      name: 'Jule Solapur Hub',
      coordinates: { lat: 17.6450, lng: 75.8900 },
      signals: 3,
      type: 'industrial'
    },
    {
      name: 'Cancer Center Junction',
      coordinates: { lat: 17.656601, lng: 75.896723 },
      signals: 3,
      type: 'minor'
    },
    {
      name: 'Navi Peth Market',
      coordinates: { lat: 17.6700, lng: 75.9300 },
      signals: 2,
      type: 'residential'
    }
  ]
};

async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/drivelegal-traffic';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createCityGovernor() {
  try {
    console.log('\n📍 Creating City Governor (L3 Agent)...');

    const existingGovernor = await User.findOne({
      email: 'citygovernor@solapur.gov',
      agentType: 'city_governor'
    });

    if (existingGovernor) {
      console.log('✅ City Governor already exists');
      return existingGovernor;
    }

    const governor = new User({
      name: 'Solapur City Governor L3 Agent',
      email: 'citygovernor@solapur.gov',
      password: 'agent_password_L3_2026',
      role: 'agent',
      authority: 'system',
      agentType: 'city_governor',
      department: 'Traffic Management',
      jurisdictionArea: 'solapur_city',
      metadata: {
        agentLevel: 3,
        capabilities: [
          'city_wide_analytics',
          'emergency_coordination',
          'resource_allocation',
          'inter_zone_optimization',
          'incident_management',
          'peak_hour_prediction'
        ],
        config: {
          updateInterval: 5000,
          predictionHorizon: 3600000,
          emergencyResponseTime: 300000
        }
      }
    });

    await governor.save();
    console.log('✅ City Governor created:', governor.email);
    return governor;
  } catch (error) {
    console.error('❌ Error creating City Governor:', error);
    throw error;
  }
}

async function createZones() {
  try {
    console.log('\n🗺️ Creating Traffic Zones (L2 Coordinator Level)...');

    for (const zoneConfig of SOLAPUR_CONFIG.zones) {
      const existingZone = await Zone.findOne({ zoneId: zoneConfig.id });

      if (existingZone) {
        console.log(`✅ Zone already exists: ${zoneConfig.name}`);
        continue;
      }

      // Create Zone Coordinator agent
      const coordinator = new User({
        name: `${zoneConfig.name} Coordinator (L2)`,
        email: `coordinator_${zoneConfig.id}@solapur.gov`,
        password: 'agent_password_L2_2026',
        role: 'agent',
        authority: 'system',
        agentType: 'zone_coordinator',
        department: 'Zone Management',
        jurisdictionArea: zoneConfig.id,
        metadata: {
          agentLevel: 2,
          zoneId: zoneConfig.id,
          zoneName: zoneConfig.name,
          zoneType: zoneConfig.type,
          specialFeature: zoneConfig.specialFeature,
          capabilities: [
            'traffic_optimization',
            'green_wave_creation',
            'congestion_management',
            zoneConfig.specialFeature ? `${zoneConfig.specialFeature}_management` : null,
            'vehicle_routing',
            'incident_response'
          ].filter(Boolean),
          config: {
            updateInterval: 10000,
            congestionThreshold: 70,
            emergencyPriority: true
          }
        }
      });

      await coordinator.save();
      console.log(`✅ Zone Coordinator created: ${zoneConfig.name}`);

      // Create Zone document if not using embedded coordinator
      if (typeof Zone !== 'undefined') {
        const zone = new Zone({
          zoneId: zoneConfig.id,
          name: zoneConfig.name,
          coordinates: zoneConfig.coordinates,
          radius: zoneConfig.radius,
          type: zoneConfig.type,
          specialFeature: zoneConfig.specialFeature,
          coordinatorId: coordinator._id,
          status: 'operational'
        });
        await zone.save();
      }
    }

    console.log(`✅ Created ${SOLAPUR_CONFIG.zones.length} traffic zones`);
  } catch (error) {
    console.error('❌ Error creating zones:', error);
    throw error;
  }
}

async function createJunctionsAndL1Agents() {
  try {
    console.log('\n🚦 Creating Traffic Junctions & L1 Agents...');

    for (const junctionConfig of SOLAPUR_CONFIG.junctions) {
      const existingJunction = await Junction.findOne({ name: junctionConfig.name });

      if (existingJunction) {
        console.log(`✅ Junction already exists: ${junctionConfig.name}`);
        continue;
      }

      // Create L1 Junction Agent
      const agentName = junctionConfig.name.replace(/\s+/g, '_').toLowerCase();
      const l1Agent = new User({
        name: `${junctionConfig.name} L1 Agent`,
        email: `agent_${agentName}@solapur.gov`,
        password: 'agent_password_L1_2026',
        role: 'agent',
        authority: 'system',
        agentType: 'junction_agent',
        department: 'Junction Management',
        jurisdictionArea: agentName,
        metadata: {
          agentLevel: 1,
          junctionName: junctionConfig.name,
          junctionType: junctionConfig.type,
          numSignals: junctionConfig.signals,
          coordinates: junctionConfig.coordinates,
          capabilities: [
            'real_time_signal_optimization',
            'congestion_detection',
            'adaptive_timing',
            'emergency_priority',
            'vehicle_detection',
            'incident_detection'
          ],
          algorithm: 'webster_adaptive',
          config: {
            updateInterval: 2000,
            minGreenTime: 15,
            maxGreenTime: 120,
            updateThreshold: 10,
            congestionDetectionThreshold: 80
          }
        }
      });

      await l1Agent.save();
      console.log(`✅ L1 Agent created: ${junctionConfig.name}`);

      // Create traffic signals for this junction
      for (let i = 1; i <= junctionConfig.signals; i++) {
        const existingSignal = await TrafficSignal.findOne({
          location: junctionConfig.name,
          signalId: i
        });

        if (existingSignal) continue;

        const signal = new TrafficSignal({
          location: junctionConfig.name,
          signalId: i,
          coordinates: junctionConfig.coordinates,
          status: 'operational',
          greenTime: 45,
          redTime: 30,
          yellowTime: 5,
          congestionLevel: 0,
          vehicleCount: 0,
          l1AgentId: l1Agent._id,
          optimized: false,
          lastUpdated: new Date()
        });

        await signal.save();
      }

      console.log(`   └─ Created ${junctionConfig.signals} traffic signals`);

      // Create Junction document
      if (typeof Junction !== 'undefined') {
        const junction = new Junction({
          name: junctionConfig.name,
          coordinates: junctionConfig.coordinates,
          type: junctionConfig.type,
          numSignals: junctionConfig.signals,
          agentId: l1Agent._id,
          status: 'operational'
        });
        await junction.save();
      }
    }

    console.log(`✅ Created ${SOLAPUR_CONFIG.junctions.length} junctions with L1 agents`);
  } catch (error) {
    console.error('❌ Error creating junctions:', error);
    throw error;
  }
}

async function createAuthorityUsers() {
  try {
    console.log('\n👥 Creating Authority Users with Role-Based Access...');

    const authorities = [
      {
        name: 'Road Authority Officer',
        email: 'road@solapur.gov',
        role: 'road_authority',
        authority: 'road_authority',
        department: 'Challan & Violation Management',
        badgeNumber: 'RA-001'
      },
      {
        name: 'Municipal Corporation Officer',
        email: 'municipal@solapur.gov',
        role: 'municipal_corp',
        authority: 'municipal_corp',
        department: 'Traffic Signal Control',
        badgeNumber: 'MC-001'
      },
      {
        name: 'Traffic Police Officer',
        email: 'police@solapur.gov',
        role: 'traffic_police',
        authority: 'traffic_police',
        department: 'Emergency Response',
        badgeNumber: 'TP-001'
      },
      {
        name: 'DriveLegal Partner',
        email: 'driveLegal@example.com',
        role: 'driveLegal_partner',
        authority: 'driveLegal_partner',
        department: 'Fine Management',
        badgeNumber: 'DL-001'
      }
    ];

    for (const authConfig of authorities) {
      const existing = await User.findOne({ email: authConfig.email });

      if (existing) {
        console.log(`✅ ${authConfig.role} user already exists`);
        continue;
      }

      const user = new User({
        name: authConfig.name,
        email: authConfig.email,
        password: 'password123',
        role: authConfig.role,
        authority: authConfig.authority,
        department: authConfig.department,
        badgeNumber: authConfig.badgeNumber,
        jurisdictionArea: 'solapur_city',
        phone: '9876543210'
      });

      await user.save();
      console.log(`✅ Created: ${authConfig.name}`);
    }

    console.log(`✅ Created all authority users`);
  } catch (error) {
    console.error('❌ Error creating authority users:', error);
    throw error;
  }
}

async function createSystemLog() {
  try {
    console.log('\n📝 Creating System Initialization Record...');

    const initLog = {
      timestamp: new Date(),
      city: SOLAPUR_CONFIG.city,
      agents: {
        l3_governor: 1,
        l2_coordinators: SOLAPUR_CONFIG.zones.length,
        l1_junctions: SOLAPUR_CONFIG.junctions.length,
        total_signals: SOLAPUR_CONFIG.junctions.reduce((sum, j) => sum + j.signals, 0)
      },
      authority_users: 4,
      status: 'initialized'
    };

    console.log('\n📊 Initialization Summary:');
    console.log(`   City: ${initLog.city}`);
    console.log(`   L3 City Governor: ${initLog.agents.l3_governor}`);
    console.log(`   L2 Zone Coordinators: ${initLog.agents.l2_coordinators}`);
    console.log(`   L1 Junction Agents: ${initLog.agents.l1_junctions}`);
    console.log(`   Total Traffic Signals: ${initLog.agents.total_signals}`);
    console.log(`   Authority Users: ${initLog.authority_users}`);

    return initLog;
  } catch (error) {
    console.error('❌ Error creating system log:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 DriveLegal Smart Traffic System - Agent Initialization');
    console.log('================================================\n');

    await connectDB();

    // Initialize all components
    await createCityGovernor();
    await createZones();
    await createJunctionsAndL1Agents();
    await createAuthorityUsers();
    const initLog = await createSystemLog();

    console.log('\n✅ Agent Initialization Complete!');
    console.log('\n📌 Next Steps:');
    console.log('   1. Start the backend server: npm run server');
    console.log('   2. Login to authority dashboard at: http://localhost:3000/authority-login');
    console.log('   3. Test agent status: GET /api/agents/city-governor/status');
    console.log('   4. Monitor real-time updates via WebSocket');

    console.log('\n🔐 Test Credentials:');
    console.log('   Road Authority: road@solapur.gov / password123');
    console.log('   Municipal Corp: municipal@solapur.gov / password123');
    console.log('   Traffic Police: police@solapur.gov / password123');
    console.log('   DriveLegal Partner: driveLegal@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

main();
