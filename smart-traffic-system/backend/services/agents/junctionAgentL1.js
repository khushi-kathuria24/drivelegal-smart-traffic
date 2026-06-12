/**
 * Junction Agent L1 - Real-time Traffic Signal Control at Intersections
 * Operates at individual junction level with local data
 */

import TrafficSignal from '../../models/TrafficSignal.js';
import VehicleFlow from '../../models/VehicleFlow.js';

class JunctionAgentL1 {
  constructor(junctionId, coordinates) {
    this.junctionId = junctionId;
    this.coordinates = coordinates;
    this.cycleTime = 120; // seconds
    this.updateInterval = 5000; // ms
    this.isRunning = false;
    this.currentPhase = 0;
  }

  /**
   * Calculate optimal signal timing based on real-time vehicle data
   */
  async optimizeSignalTiming() {
    try {
      const signal = await TrafficSignal.findOne({ junction: this.junctionId });
      if (!signal) return null;

      // Get vehicle flow data for all directions
      const flowData = await VehicleFlow.findOne({ junction: this.junctionId });
      if (!flowData) return signal;

      const northFlow = flowData.directions.north || 0;
      const southFlow = flowData.directions.south || 0;
      const eastFlow = flowData.directions.east || 0;
      const westFlow = flowData.directions.west || 0;

      // Calculate optimal green time distribution (40-50% of cycle time)
      const totalFlow = northFlow + southFlow + eastFlow + westFlow;
      if (totalFlow === 0) return signal;

      const cycleTime = this.cycleTime;
      const greenTimeAvailable = cycleTime * 0.7; // 70% for green, 30% for yellow/all-red

      signal.phaseA = {
        green: Math.round(greenTimeAvailable * (northFlow / totalFlow)),
        yellow: 3,
        red: cycleTime - Math.round(greenTimeAvailable * (northFlow / totalFlow)) - 3
      };

      signal.phaseB = {
        green: Math.round(greenTimeAvailable * (eastFlow / totalFlow)),
        yellow: 3,
        red: cycleTime - Math.round(greenTimeAvailable * (eastFlow / totalFlow)) - 3
      };

      signal.lastOptimized = new Date();
      signal.optimization = {
        algorithm: 'webster_adaptive',
        cycleTime,
        vehicleFlows: { northFlow, southFlow, eastFlow, westFlow }
      };

      await signal.save();
      return signal;
    } catch (error) {
      console.error('Junction Agent L1 optimization error:', error);
      return null;
    }
  }

  /**
   * Detect congestion and activate emergency protocols
   */
  async detectCongestion() {
    try {
      const flowData = await VehicleFlow.findOne({ junction: this.junctionId });
      if (!flowData) return { congested: false };

      const congestionThreshold = 0.8; // 80% capacity
      const directions = flowData.directions;
      const maxCapacity = 100; // vehicles per 5 min interval

      const congestionStatus = {};
      let isCongested = false;

      for (const [direction, count] of Object.entries(directions)) {
        const congestionLevel = count / maxCapacity;
        congestionStatus[direction] = {
          count,
          level: congestionLevel,
          isCongested: congestionLevel > congestionThreshold
        };
        if (congestionLevel > congestionThreshold) {
          isCongested = true;
        }
      }

      return { congested: isCongested, status: congestionStatus };
    } catch (error) {
      console.error('Congestion detection error:', error);
      return { congested: false };
    }
  }

  /**
   * Handle emergency vehicle priority
   */
  async prioritizeEmergencyVehicle(emergencyData) {
    try {
      const { vehicleType, direction, eta } = emergencyData;

      // Immediate green for emergency direction
      const signal = await TrafficSignal.findOne({ junction: this.junctionId });
      if (!signal) return null;

      signal.emergencyMode = true;
      signal.emergencyVehicle = vehicleType;
      signal.emergencyDirection = direction;
      signal.allRed = true;

      // Clear intersection (all red)
      await new Promise(resolve => setTimeout(resolve, 2000));

      signal.allRed = false;
      signal.activeDirection = direction;
      signal.emergencyGreenTime = 30; // 30 seconds green for emergency vehicle

      await signal.save();

      return {
        status: 'priority_granted',
        greenTime: 30,
        direction,
        vehicleType
      };
    } catch (error) {
      console.error('Emergency priority error:', error);
      return null;
    }
  }

  /**
   * Predict traffic flow for next cycle
   */
  async predictFlow() {
    try {
      const flowData = await VehicleFlow.find({ junction: this.junctionId }).sort({ timestamp: -1 }).limit(20);
      
      if (flowData.length < 5) return null;

      // Simple moving average prediction
      const predictions = {};
      const directions = ['north', 'south', 'east', 'west'];

      for (const direction of directions) {
        const historicalData = flowData.map(d => d.directions[direction] || 0);
        const average = historicalData.reduce((a, b) => a + b) / historicalData.length;
        const trend = (historicalData[0] - historicalData[historicalData.length - 1]) / historicalData.length;

        predictions[direction] = Math.round(average + trend);
      }

      return predictions;
    } catch (error) {
      console.error('Flow prediction error:', error);
      return null;
    }
  }

  /**
   * Start continuous optimization cycle
   */
  async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log(`🚦 Junction Agent L1 started for junction ${this.junctionId}`);

    this.optimizationLoop = setInterval(async () => {
      try {
        // Check for congestion
        const congestion = await this.detectCongestion();
        if (congestion.congested) {
          console.log(`⚠️ Congestion detected at junction ${this.junctionId}`);
        }

        // Optimize signals
        await this.optimizeSignalTiming();

        // Predict next flow
        const prediction = await this.predictFlow();
        if (prediction) {
          console.log(`📊 Traffic prediction for ${this.junctionId}:`, prediction);
        }
      } catch (error) {
        console.error('Optimization loop error:', error);
      }
    }, this.updateInterval);
  }

  /**
   * Stop optimization cycle
   */
  stop() {
    if (this.optimizationLoop) {
      clearInterval(this.optimizationLoop);
      this.isRunning = false;
      console.log(`🛑 Junction Agent L1 stopped for junction ${this.junctionId}`);
    }
  }

  /**
   * Get agent status and metrics
   */
  async getStatus() {
    const signal = await TrafficSignal.findOne({ junction: this.junctionId });
    const flowData = await VehicleFlow.findOne({ junction: this.junctionId });

    return {
      agentId: this.junctionId,
      agentType: 'junction_l1',
      isRunning: this.isRunning,
      signalStatus: signal ? {
        currentPhase: signal.activeDirection,
        emergencyMode: signal.emergencyMode,
        lastOptimized: signal.lastOptimized
      } : null,
      flowData: flowData ? flowData.directions : null,
      coordinates: this.coordinates,
      timestamp: new Date()
    };
  }
}

export default JunctionAgentL1;
