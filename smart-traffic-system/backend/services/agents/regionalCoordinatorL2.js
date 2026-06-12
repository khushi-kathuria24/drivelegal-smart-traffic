/**
 * Regional Coordinator Agent L2 - Zone-wide Traffic Coordination
 * Coordinates multiple junctions and manages zone-level services
 */

import TrafficSignal from '../../models/TrafficSignal.js';
import VehicleFlow from '../../models/VehicleFlow.js';
import EmergencyAlert from '../../models/EmergencyAlert.js';

class RegionalCoordinatorL2 {
  constructor(zoneId, zoneCoordinates, junctions = []) {
    this.zoneId = zoneId;
    this.zoneCoordinates = zoneCoordinates;
    this.junctions = junctions; // array of junction IDs
    this.updateInterval = 10000; // ms
    this.isRunning = false;
    this.services = {
      logisticsAgent: null,
      crowdDensityAgent: null,
      guardianAgent: null
    };
  }

  /**
   * Coordinate traffic green waves across junctions
   */
  async coordinateGreenWave(vehicleDirection, speed = 50) {
    try {
      const signals = await TrafficSignal.find({ junction: { $in: this.junctions } });

      // Calculate progression timing for smooth traffic flow
      for (let i = 0; i < signals.length - 1; i++) {
        const currentSignal = signals[i];
        const nextSignal = signals[i + 1];

        // Distance between junctions (simplified - should be from GPS)
        const distance = 500; // meters
        const timeBetweenSignals = (distance / (speed * 1000)) * 3600; // convert to seconds

        // Set green wave offset
        nextSignal.greenWaveOffset = timeBetweenSignals;
        await nextSignal.save();
      }

      console.log(`✅ Green wave coordinated for zone ${this.zoneId} direction ${vehicleDirection}`);
      return { status: 'green_wave_active', direction: vehicleDirection };
    } catch (error) {
      console.error('Green wave coordination error:', error);
      return null;
    }
  }

  /**
   * Manage logistics coordination (Solapur textile corridor)
   */
  async manageLogistics() {
    try {
      // Get all vehicle flows in zone
      const flowData = await VehicleFlow.find({ junction: { $in: this.junctions } });

      // Analyze vehicle types and routes
      const heavyVehicles = flowData.reduce((sum, flow) => sum + (flow.heavyVehicleCount || 0), 0);
      const lightVehicles = flowData.reduce((sum, flow) => sum + (flow.lightVehicleCount || 0), 0);

      // Calculate optimal routes for freight
      const logistics = {
        heavyVehicleCount: heavyVehicles,
        lightVehicleCount: lightVehicles,
        recommendedRoutes: await this.calculateOptimalFreightRoutes(),
        textileCorridorStatus: 'active',
        peakHours: [8, 9, 17, 18], // Solapur textile peak hours
        restrictedZones: []
      };

      this.services.logisticsAgent = logistics;
      return logistics;
    } catch (error) {
      console.error('Logistics management error:', error);
      return null;
    }
  }

  /**
   * Calculate optimal freight routes for Solapur corridor
   */
  async calculateOptimalFreightRoutes() {
    try {
      const signals = await TrafficSignal.find({ junction: { $in: this.junctions } });

      const routes = signals.map(signal => ({
        junction: signal.junction,
        congestionLevel: signal.congestionLevel || 0,
        suitableForFreight: (signal.congestionLevel || 0) < 0.6,
        estimatedDelay: Math.round(Math.random() * 10) // simplified
      }));

      return routes.filter(r => r.suitableForFreight);
    } catch (error) {
      console.error('Route calculation error:', error);
      return [];
    }
  }

  /**
   * Analyze crowd density (Solapur Siddheshwar Yatra management)
   */
  async analyzeCrowdDensity() {
    try {
      const flowData = await VehicleFlow.find({ junction: { $in: this.junctions } });

      let totalVehicles = 0;
      const densityByJunction = {};

      for (const flow of flowData) {
        const total = Object.values(flow.directions).reduce((a, b) => a + b, 0);
        totalVehicles += total;
        densityByJunction[flow.junction] = {
          vehicleCount: total,
          density: (total / 100) * 100, // percentage of capacity
          status: total > 80 ? 'high' : total > 50 ? 'medium' : 'low'
        };
      }

      const crowdData = {
        totalVehicles,
        averageDensity: (totalVehicles / (this.junctions.length * 100)) * 100,
        byJunction: densityByJunction,
        pilgrimageMode: await this.checkPilgrimageMode(),
        recommendations: []
      };

      // Generate recommendations
      if (crowdData.averageDensity > 80) {
        crowdData.recommendations.push('Activate Siddheshwar Yatra crowd management protocol');
        crowdData.recommendations.push('Increase traffic police presence');
        crowdData.recommendations.push('Divert non-essential traffic to alternate routes');
      }

      this.services.crowdDensityAgent = crowdData;
      return crowdData;
    } catch (error) {
      console.error('Crowd density analysis error:', error);
      return null;
    }
  }

  /**
   * Check if Siddheshwar Yatra mode should be active
   */
  async checkPilgrimageMode() {
    // Check calendar and time
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    // Siddheshwar Yatra typically around Jyotiba festival
    const pilgrimagePeriods = [
      { month: 12, start: 20, end: 31 }, // December Jyotiba festival
      { month: 6, start: 1, end: 15 } // June monsoon festival
    ];

    for (const period of pilgrimagePeriods) {
      if (month === period.month && date >= period.start && date <= period.end) {
        return true;
      }
    }

    return false;
  }

  /**
   * Guardian Agent - Handle encroachment and violations
   */
  async manageEncroachments() {
    try {
      const guardianData = {
        activeEncroachments: 0,
        resolvedToday: 0,
        illegalParkingCases: 0,
        streetEncroachmentCases: 0,
        responseTime: 0,
        zoneId: this.zoneId
      };

      // Get encroachment data from traffic violations
      const violations = await EmergencyAlert.find({
        zone: this.zoneId,
        type: { $in: ['encroachment', 'illegal_parking', 'street_encroachment'] },
        resolved: false
      }).limit(20);

      guardianData.activeEncroachments = violations.length;

      for (const violation of violations) {
        if (violation.type === 'illegal_parking') guardianData.illegalParkingCases++;
        else if (violation.type === 'street_encroachment') guardianData.streetEncroachmentCases++;
      }

      this.services.guardianAgent = guardianData;
      return guardianData;
    } catch (error) {
      console.error('Encroachment management error:', error);
      return null;
    }
  }

  /**
   * Distribute emergency vehicle priorities across zone
   */
  async distributeEmergencyPriority(emergencyData) {
    try {
      const { vehicleType, location, eta } = emergencyData;

      // Find affected junctions
      const affected = await TrafficSignal.find({
        junction: { $in: this.junctions },
        location: { $near: { $geometry: location } }
      }).limit(3);

      const priorityRoute = affected.map(signal => ({
        junction: signal.junction,
        action: 'extend_green_wave',
        duration: 30
      }));

      console.log(`🚨 Emergency priority distributed for ${vehicleType}`);
      return priorityRoute;
    } catch (error) {
      console.error('Emergency priority distribution error:', error);
      return null;
    }
  }

  /**
   * Get zone-wide metrics and status
   */
  async getZoneMetrics() {
    try {
      const signals = await TrafficSignal.find({ junction: { $in: this.junctions } });
      const flowData = await VehicleFlow.find({ junction: { $in: this.junctions } });

      const totalCongestion = signals.reduce((sum, s) => sum + (s.congestionLevel || 0), 0) / signals.length;

      return {
        zoneId: this.zoneId,
        agentType: 'regional_coordinator_l2',
        junctionCount: this.junctions.length,
        averageCongestion: totalCongestion,
        logistics: this.services.logisticsAgent,
        crowdDensity: this.services.crowdDensityAgent,
        encroachments: this.services.guardianAgent,
        totalVehicles: flowData.reduce((sum, f) => sum + Object.values(f.directions).reduce((a, b) => a + b, 0), 0),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Zone metrics error:', error);
      return null;
    }
  }

  /**
   * Start zone coordination
   */
  async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log(`🌍 Regional Coordinator L2 started for zone ${this.zoneId}`);

    this.coordinationLoop = setInterval(async () => {
      try {
        await this.coordinateGreenWave('north');
        await this.manageLogistics();
        await this.analyzeCrowdDensity();
        await this.manageEncroachments();
      } catch (error) {
        console.error('Coordination loop error:', error);
      }
    }, this.updateInterval);
  }

  /**
   * Stop zone coordination
   */
  stop() {
    if (this.coordinationLoop) {
      clearInterval(this.coordinationLoop);
      this.isRunning = false;
      console.log(`🛑 Regional Coordinator L2 stopped for zone ${this.zoneId}`);
    }
  }
}

export default RegionalCoordinatorL2;
