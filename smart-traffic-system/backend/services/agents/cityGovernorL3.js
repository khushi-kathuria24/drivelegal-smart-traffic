/**
 * City Governor Agent L3 - City-wide Traffic Management
 * Central intelligence for entire city traffic system
 */

import RegionalCoordinatorL2 from './regionalCoordinatorL2.js';
import TrafficSignal from '../../models/TrafficSignal.js';
import VehicleFlow from '../../models/VehicleFlow.js';
import EmergencyAlert from '../../models/EmergencyAlert.js';

class CityGovernorL3 {
  constructor(cityName = 'Solapur') {
    this.cityName = cityName;
    this.zones = new Map(); // zone_id -> RegionalCoordinatorL2
    this.updateInterval = 15000; // ms
    this.isRunning = false;
    this.cityMetrics = {
      totalCongestion: 0,
      totalVehicles: 0,
      activeEmergencies: 0,
      avgResponseTime: 0
    };
  }

  /**
   * Register a zone with its coordinator
   */
  registerZone(zoneId, coordinator) {
    this.zones.set(zoneId, coordinator);
    console.log(`📍 Zone ${zoneId} registered with City Governor`);
    return true;
  }

  /**
   * Get city-wide traffic analytics
   */
  async getCityAnalytics() {
    try {
      const signals = await TrafficSignal.find({});
      const flowData = await VehicleFlow.find({});
      const emergencies = await EmergencyAlert.find({ resolved: false });

      const analytics = {
        cityName: this.cityName,
        timestamp: new Date(),
        trafficMetrics: {
          totalJunctions: signals.length,
          totalVehicles: flowData.reduce((sum, f) => sum + Object.values(f.directions).reduce((a, b) => a + b, 0), 0),
          averageCongestion: signals.length > 0 ? signals.reduce((sum, s) => sum + (s.congestionLevel || 0), 0) / signals.length : 0,
          highCongestionJunctions: signals.filter(s => (s.congestionLevel || 0) > 0.8).length,
          mediumCongestionJunctions: signals.filter(s => (s.congestionLevel || 0) > 0.5 && (s.congestionLevel || 0) <= 0.8).length
        },
        emergencyMetrics: {
          activeEmergencies: emergencies.length,
          ambulances: emergencies.filter(e => e.type === 'ambulance').length,
          firetrucks: emergencies.filter(e => e.type === 'fire').length,
          police: emergencies.filter(e => e.type === 'police').length
        },
        zoneMetrics: {}
      };

      // Aggregate zone metrics
      for (const [zoneId, coordinator] of this.zones) {
        const zoneMetrics = await coordinator.getZoneMetrics();
        analytics.zoneMetrics[zoneId] = zoneMetrics;
      }

      this.cityMetrics = {
        totalCongestion: analytics.trafficMetrics.averageCongestion,
        totalVehicles: analytics.trafficMetrics.totalVehicles,
        activeEmergencies: analytics.emergencyMetrics.activeEmergencies,
        avgResponseTime: 0 // would calculate from historical data
      };

      return analytics;
    } catch (error) {
      console.error('City analytics error:', error);
      return null;
    }
  }

  /**
   * Intelligent incident management
   */
  async manageIncidents() {
    try {
      const incidents = await EmergencyAlert.find({ resolved: false }).sort({ createdAt: -1 }).limit(10);

      const incidentSummary = {
        totalActive: incidents.length,
        byType: {},
        byLocation: {},
        recommendations: []
      };

      for (const incident of incidents) {
        // Group by type
        if (!incidentSummary.byType[incident.type]) {
          incidentSummary.byType[incident.type] = 0;
        }
        incidentSummary.byType[incident.type]++;

        // Group by location/zone
        const zone = incident.zone || 'unknown';
        if (!incidentSummary.byLocation[zone]) {
          incidentSummary.byLocation[zone] = [];
        }
        incidentSummary.byLocation[zone].push({
          id: incident._id,
          type: incident.type,
          priority: incident.priority
        });
      }

      // Generate recommendations
      for (const [zone, incidents] of Object.entries(incidentSummary.byLocation)) {
        if (incidents.length > 3) {
          incidentSummary.recommendations.push(`High incident rate in zone ${zone} - activate reinforcements`);
        }
      }

      return incidentSummary;
    } catch (error) {
      console.error('Incident management error:', error);
      return null;
    }
  }

  /**
   * Predictive traffic analysis
   */
  async predictCityTraffic() {
    try {
      const flowData = await VehicleFlow.find({}).sort({ timestamp: -1 }).limit(100);

      // Analyze patterns by hour
      const hourlyPatterns = {};
      const now = new Date();

      for (const data of flowData) {
        const hour = data.timestamp.getHours();
        if (!hourlyPatterns[hour]) {
          hourlyPatterns[hour] = { total: 0, count: 0 };
        }
        hourlyPatterns[hour].total += Object.values(data.directions).reduce((a, b) => a + b, 0);
        hourlyPatterns[hour].count++;
      }

      const predictions = {};
      for (const [hour, data] of Object.entries(hourlyPatterns)) {
        const avgVehicles = data.total / data.count;
        predictions[hour] = {
          predictedVehicles: Math.round(avgVehicles),
          expectedCongestion: avgVehicles > 80 ? 'high' : avgVehicles > 50 ? 'medium' : 'low'
        };
      }

      // Identify peak hours
      const peakHours = Object.entries(predictions)
        .filter(([_, p]) => p.expectedCongestion === 'high')
        .map(([hour, _]) => parseInt(hour));

      return {
        predictions,
        peakHours,
        recommendations: [
          `Expected high traffic during hours: ${peakHours.join(', ')}`,
          'Increase traffic police deployment during peak hours',
          'Activate emergency lanes on major corridors'
        ]
      };
    } catch (error) {
      console.error('Traffic prediction error:', error);
      return null;
    }
  }

  /**
   * Real-time emergency coordination across city
   */
  async coordinateEmergencies(emergency) {
    try {
      const { vehicleType, location, priority } = emergency;

      // Find nearest junctions
      const nearestSignals = await TrafficSignal.find({
        location: { $near: { $geometry: location } }
      }).limit(5);

      // Calculate best route
      const route = [];
      for (const signal of nearestSignals) {
        route.push({
          junction: signal.junction,
          action: 'prioritize_emergency',
          greenTime: 30,
          allRed: false
        });
      }

      console.log(`🚨 City Governor coordinating ${vehicleType} emergency`);
      return {
        status: 'emergency_coordinated',
        vehicleType,
        route,
        estimatedClearance: Math.round(route.length * 30) // seconds
      };
    } catch (error) {
      console.error('Emergency coordination error:', error);
      return null;
    }
  }

  /**
   * Generate comprehensive city report
   */
  async generateCityReport() {
    try {
      const analytics = await this.getCityAnalytics();
      const incidents = await this.manageIncidents();
      const predictions = await this.predictCityTraffic();

      const report = {
        cityName: this.cityName,
        generatedAt: new Date(),
        executiveSummary: {
          totalJunctions: analytics.trafficMetrics.totalJunctions,
          totalVehicles: analytics.trafficMetrics.totalVehicles,
          averageCongestion: `${(analytics.trafficMetrics.averageCongestion * 100).toFixed(1)}%`,
          activeEmergencies: analytics.emergencyMetrics.activeEmergencies,
          systemStatus: analytics.trafficMetrics.averageCongestion > 0.8 ? 'Critical' : analytics.trafficMetrics.averageCongestion > 0.5 ? 'Alert' : 'Normal'
        },
        trafficAnalysis: analytics.trafficMetrics,
        emergencyStatus: analytics.emergencyMetrics,
        incidentSummary: incidents,
        trafficPredictions: predictions,
        recommendations: [
          ...incidents.recommendations,
          ...predictions.recommendations,
          'Maintain emergency vehicle lanes clear',
          'Coordinate with Solapur Municipal Corporation for street maintenance'
        ]
      };

      return report;
    } catch (error) {
      console.error('Report generation error:', error);
      return null;
    }
  }

  /**
   * Dynamic resource allocation
   */
  async allocateResources() {
    try {
      const analytics = await this.getCityAnalytics();

      const allocation = {
        policePersonnel: {},
        emergencyVehicles: {},
        signalOptimization: {},
        timestamp: new Date()
      };

      // Allocate based on congestion
      for (const [zoneId, zoneMetrics] of Object.entries(analytics.zoneMetrics)) {
        const congestion = zoneMetrics.averageCongestion;

        allocation.policePersonnel[zoneId] = Math.ceil(congestion * 20); // 0-20 officers
        allocation.emergencyVehicles[zoneId] = Math.ceil(congestion * 5); // 0-5 vehicles
        allocation.signalOptimization[zoneId] = congestion > 0.7 ? 'adaptive_control' : 'standard_control';
      }

      return allocation;
    } catch (error) {
      console.error('Resource allocation error:', error);
      return null;
    }
  }

  /**
   * Start city-wide management
   */
  async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log(`🏛️ City Governor Agent started for ${this.cityName}`);

    // Start all zone coordinators
    for (const [zoneId, coordinator] of this.zones) {
      if (!coordinator.isRunning) {
        await coordinator.start();
      }
    }

    // Main governance loop
    this.governanceLoop = setInterval(async () => {
      try {
        await this.getCityAnalytics();
        await this.manageIncidents();
        await this.predictCityTraffic();
        await this.allocateResources();
      } catch (error) {
        console.error('Governance loop error:', error);
      }
    }, this.updateInterval);
  }

  /**
   * Stop city-wide management
   */
  async stop() {
    if (this.governanceLoop) {
      clearInterval(this.governanceLoop);
    }

    // Stop all zone coordinators
    for (const [zoneId, coordinator] of this.zones) {
      if (coordinator.isRunning) {
        coordinator.stop();
      }
    }

    this.isRunning = false;
    console.log(`🛑 City Governor Agent stopped for ${this.cityName}`);
  }

  /**
   * Get agent status
   */
  async getStatus() {
    const cityAnalytics = await this.getCityAnalytics();

    return {
      agentId: `${this.cityName.toLowerCase()}_governor`,
      agentType: 'city_governor_l3',
      cityName: this.cityName,
      isRunning: this.isRunning,
      zoneCount: this.zones.size,
      cityMetrics: this.cityMetrics,
      analytics: cityAnalytics,
      timestamp: new Date()
    };
  }
}

export default CityGovernorL3;
