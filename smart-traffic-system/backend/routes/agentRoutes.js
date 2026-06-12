import express from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth.js';
import User from '../models/User.js';
import JunctionAgentL1 from '../services/agents/junctionAgentL1.js';
import RegionalCoordinatorL2 from '../services/agents/regionalCoordinatorL2.js';
import CityGovernorL3 from '../services/agents/cityGovernorL3.js';

const router = express.Router();

// Global agent instances
let junctionAgents = new Map();
let regionalCoordinators = new Map();
let cityGovernor = null;

/**
 * Initialize City Governor Agent (L3)
 */
router.post('/initialize-city-governor', authMiddleware, requirePermission('admin:read'), async (req, res) => {
  try {
    const { cityName = 'Solapur' } = req.body;

    if (cityGovernor) {
      return res.status(400).json({ message: 'City Governor Agent already initialized' });
    }

    cityGovernor = new CityGovernorL3(cityName);
    await cityGovernor.start();

    res.status(201).json({
      status: 'success',
      agent: {
        type: 'city_governor_l3',
        cityName,
        initialized: true,
        message: `${cityName} City Governor Agent initialized and running`
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Create and start a Junction Agent L1
 */
router.post('/junctions/:junctionId/agent', authMiddleware, requirePermission('traffic:update'), async (req, res) => {
  try {
    const { junctionId } = req.params;
    const { coordinates } = req.body;

    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).json({ message: 'Coordinates (lat, lng) required' });
    }

    if (junctionAgents.has(junctionId)) {
      return res.status(400).json({ message: 'Agent already exists for this junction' });
    }

    const agent = new JunctionAgentL1(junctionId, coordinates);
    await agent.start();
    junctionAgents.set(junctionId, agent);

    res.status(201).json({
      status: 'success',
      agent: {
        type: 'junction_l1',
        junctionId,
        coordinates,
        running: true,
        message: `Junction Agent L1 initialized for junction ${junctionId}`
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get Junction Agent status
 */
router.get('/junctions/:junctionId/agent/status', authMiddleware, requirePermission('traffic:read'), async (req, res) => {
  try {
    const { junctionId } = req.params;
    const agent = junctionAgents.get(junctionId);

    if (!agent) {
      return res.status(404).json({ message: 'Junction Agent not found' });
    }

    const status = await agent.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Create and start Regional Coordinator L2
 */
router.post('/zones/:zoneId/coordinator', authMiddleware, requirePermission('traffic:update'), async (req, res) => {
  try {
    const { zoneId } = req.params;
    const { junctions, zoneCoordinates } = req.body;

    if (!Array.isArray(junctions) || junctions.length === 0) {
      return res.status(400).json({ message: 'Array of junction IDs required' });
    }

    if (regionalCoordinators.has(zoneId)) {
      return res.status(400).json({ message: 'Coordinator already exists for this zone' });
    }

    const coordinator = new RegionalCoordinatorL2(zoneId, zoneCoordinates, junctions);
    await coordinator.start();
    regionalCoordinators.set(zoneId, coordinator);

    // Register with city governor if it exists
    if (cityGovernor) {
      cityGovernor.registerZone(zoneId, coordinator);
    }

    res.status(201).json({
      status: 'success',
      agent: {
        type: 'regional_coordinator_l2',
        zoneId,
        junctionCount: junctions.length,
        running: true,
        message: `Regional Coordinator L2 initialized for zone ${zoneId}`
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get Regional Coordinator status and metrics
 */
router.get('/zones/:zoneId/coordinator/metrics', authMiddleware, requirePermission('traffic:read'), async (req, res) => {
  try {
    const { zoneId } = req.params;
    const coordinator = regionalCoordinators.get(zoneId);

    if (!coordinator) {
      return res.status(404).json({ message: 'Regional Coordinator not found' });
    }

    const metrics = await coordinator.getZoneMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Trigger green wave coordination
 */
router.post('/zones/:zoneId/green-wave', authMiddleware, requirePermission('traffic:update'), async (req, res) => {
  try {
    const { zoneId } = req.params;
    const { direction, speed = 50 } = req.body;

    const coordinator = regionalCoordinators.get(zoneId);
    if (!coordinator) {
      return res.status(404).json({ message: 'Regional Coordinator not found' });
    }

    const result = await coordinator.coordinateGreenWave(direction, speed);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get City Governor status and analytics
 */
router.get('/city-governor/status', authMiddleware, requirePermission('traffic:read'), async (req, res) => {
  try {
    if (!cityGovernor) {
      return res.status(404).json({ message: 'City Governor Agent not initialized' });
    }

    const status = await cityGovernor.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Generate comprehensive city report
 */
router.get('/city-governor/report', authMiddleware, requirePermission('admin:read'), async (req, res) => {
  try {
    if (!cityGovernor) {
      return res.status(404).json({ message: 'City Governor Agent not initialized' });
    }

    const report = await cityGovernor.generateCityReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get city-wide analytics
 */
router.get('/city-governor/analytics', authMiddleware, requirePermission('traffic:read'), async (req, res) => {
  try {
    if (!cityGovernor) {
      return res.status(404).json({ message: 'City Governor Agent not initialized' });
    }

    const analytics = await cityGovernor.getCityAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Handle emergency coordination
 */
router.post('/city-governor/emergency', authMiddleware, requirePermission('emergency:activate'), async (req, res) => {
  try {
    if (!cityGovernor) {
      return res.status(404).json({ message: 'City Governor Agent not initialized' });
    }

    const { vehicleType, location, priority } = req.body;
    const result = await cityGovernor.coordinateEmergencies({
      vehicleType,
      location,
      priority
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get resource allocation
 */
router.get('/city-governor/resources', authMiddleware, requirePermission('admin:read'), async (req, res) => {
  try {
    if (!cityGovernor) {
      return res.status(404).json({ message: 'City Governor Agent not initialized' });
    }

    const allocation = await cityGovernor.allocateResources();
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Handle emergency vehicle priority at junction
 */
router.post('/junctions/:junctionId/emergency-priority', authMiddleware, requirePermission('emergency:activate'), async (req, res) => {
  try {
    const { junctionId } = req.params;
    const { vehicleType, direction, eta } = req.body;

    const agent = junctionAgents.get(junctionId);
    if (!agent) {
      return res.status(404).json({ message: 'Junction Agent not found' });
    }

    const result = await agent.prioritizeEmergencyVehicle({
      vehicleType,
      direction,
      eta
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Stop all agents (admin only)
 */
router.post('/stop-all', authMiddleware, requirePermission('admin:read'), async (req, res) => {
  try {
    // Stop all junction agents
    for (const [junctionId, agent] of junctionAgents) {
      agent.stop();
    }
    junctionAgents.clear();

    // Stop all regional coordinators
    for (const [zoneId, coordinator] of regionalCoordinators) {
      coordinator.stop();
    }
    regionalCoordinators.clear();

    // Stop city governor
    if (cityGovernor) {
      await cityGovernor.stop();
      cityGovernor = null;
    }

    res.json({
      status: 'success',
      message: 'All agents stopped successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all agents status
 */
router.get('/all-agents/status', authMiddleware, requirePermission('traffic:read'), async (req, res) => {
  try {
    const status = {
      junctionAgents: Array.from(junctionAgents.keys()).length,
      regionalCoordinators: Array.from(regionalCoordinators.keys()).length,
      cityGovernor: cityGovernor ? 'running' : 'not_initialized',
      timestamp: new Date()
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
