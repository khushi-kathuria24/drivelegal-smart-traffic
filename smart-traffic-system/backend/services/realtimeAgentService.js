/**
 * Real-Time Socket.io Service for Agent Data Broadcasting
 * Streams live agent metrics, traffic data, and emergency alerts to dashboards
 */

export class RealtimeAgentService {
  constructor(io) {
    this.io = io;
    this.agentMetrics = new Map();
    this.zoneMetrics = new Map();
    this.junctionMetrics = new Map();
    this.emergencyAlerts = [];
    this.setupNamespaces();
  }

  setupNamespaces() {
    // City Governor (L3) namespace
    this.io.of('/agents/governor').on('connection', (socket) => {
      console.log('📍 City Governor dashboard connected');
      socket.emit('connection', { status: 'connected', level: 'L3' });

      socket.on('subscribe_city_metrics', () => {
        socket.join('city_metrics');
        socket.emit('city_metrics', this.getCityMetrics());
      });

      socket.on('subscribe_emergency', () => {
        socket.join('emergency_alerts');
        socket.emit('emergency_list', this.emergencyAlerts);
      });

      socket.on('disconnect', () => {
        console.log('📍 City Governor dashboard disconnected');
      });
    });

    // Zone Coordinators (L2) namespace
    this.io.of('/agents/coordinator').on('connection', (socket) => {
      console.log('🗺️ Zone Coordinator dashboard connected');
      socket.emit('connection', { status: 'connected', level: 'L2' });

      socket.on('subscribe_zone', (zoneId) => {
        socket.join(`zone_${zoneId}`);
        const metrics = this.zoneMetrics.get(zoneId) || {};
        socket.emit('zone_metrics', metrics);
      });

      socket.on('disconnect', () => {
        console.log('🗺️ Zone Coordinator dashboard disconnected');
      });
    });

    // Junction Agents (L1) namespace
    this.io.of('/agents/junction').on('connection', (socket) => {
      console.log('🚦 Junction Agent dashboard connected');
      socket.emit('connection', { status: 'connected', level: 'L1' });

      socket.on('subscribe_junction', (junctionId) => {
        socket.join(`junction_${junctionId}`);
        const metrics = this.junctionMetrics.get(junctionId) || {};
        socket.emit('junction_metrics', metrics);
      });

      socket.on('disconnect', () => {
        console.log('🚦 Junction Agent dashboard disconnected');
      });
    });

    // Authority Dashboards namespace
    this.io.of('/dashboards/authority').on('connection', (socket) => {
      console.log('👥 Authority dashboard connected');
      socket.emit('connection', { status: 'connected' });

      socket.on('subscribe_authority', (authority) => {
        socket.join(`authority_${authority}`);
        this.broadcastAuthorityData(authority, socket);
      });

      socket.on('disconnect', () => {
        console.log('👥 Authority dashboard disconnected');
      });
    });
  }

  // Broadcast city-wide metrics
  broadcastCityMetrics(metrics) {
    this.agentMetrics.set('city_governor', metrics);
    this.io.of('/agents/governor').to('city_metrics').emit('city_metrics_update', {
      timestamp: new Date(),
      data: metrics
    });
  }

  // Broadcast zone metrics
  broadcastZoneMetrics(zoneId, metrics) {
    this.zoneMetrics.set(zoneId, metrics);
    this.io.of('/agents/coordinator').to(`zone_${zoneId}`).emit('zone_metrics_update', {
      timestamp: new Date(),
      zoneId,
      data: metrics
    });

    // Also broadcast to authority dashboards
    const authority = this.getAuthorityForZone(zoneId);
    if (authority) {
      this.io.of('/dashboards/authority').to(`authority_${authority}`).emit('zone_update', {
        zoneId,
        metrics
      });
    }
  }

  // Broadcast junction metrics
  broadcastJunctionMetrics(junctionId, metrics) {
    this.junctionMetrics.set(junctionId, metrics);
    this.io.of('/agents/junction').to(`junction_${junctionId}`).emit('junction_metrics_update', {
      timestamp: new Date(),
      junctionId,
      data: metrics
    });

    // Broadcast to municipal corp dashboard
    this.io.of('/dashboards/authority').to('authority_municipal_corp').emit('junction_update', {
      junctionId,
      metrics
    });
  }

  // Broadcast emergency alert
  broadcastEmergencyAlert(alert) {
    this.emergencyAlerts.push({
      ...alert,
      timestamp: new Date(),
      id: Date.now()
    });

    // Keep only last 50 alerts
    if (this.emergencyAlerts.length > 50) {
      this.emergencyAlerts.shift();
    }

    // Broadcast to all connected clients
    this.io.of('/agents/governor').to('emergency_alerts').emit('emergency_alert', alert);
    this.io.of('/dashboards/authority').to('authority_traffic_police').emit('emergency_alert', alert);
    this.io.of('/dashboards/authority').to('authority_municipal_corp').emit('traffic_incident', alert);
  }

  // Broadcast traffic incident
  broadcastTrafficIncident(incident) {
    this.io.of('/dashboards/authority').emit('traffic_incident', {
      timestamp: new Date(),
      data: incident
    });
  }

  // Broadcast challan update
  broadcastChallanUpdate(challan) {
    this.io.of('/dashboards/authority').to('authority_road_authority').emit('challan_update', {
      timestamp: new Date(),
      data: challan
    });

    // Also broadcast to DriveLegal
    this.io.of('/dashboards/authority').to('authority_driveLegal').emit('fine_update', {
      timestamp: new Date(),
      data: challan
    });
  }

  // Send authority-specific data
  broadcastAuthorityData(authority, socket) {
    const data = this.getAuthorityDashboardData(authority);
    socket.emit('authority_dashboard_data', {
      timestamp: new Date(),
      authority,
      data
    });
  }

  // Get city-wide metrics
  getCityMetrics() {
    const zones = Array.from(this.zoneMetrics.values());
    const junctions = Array.from(this.junctionMetrics.values());

    const totalCongestion = junctions.reduce((sum, j) => sum + (j.congestionLevel || 0), 0);
    const avgCongestion = junctions.length > 0 ? Math.round(totalCongestion / junctions.length) : 0;

    const totalVehicles = junctions.reduce((sum, j) => sum + (j.vehicleCount || 0), 0);
    const avgWaitTime = junctions.reduce((sum, j) => sum + (j.avgWaitTime || 0), 0) / Math.max(junctions.length, 1);

    return {
      avgCongestion,
      totalVehicles,
      avgWaitTime: Math.round(avgWaitTime),
      activeZones: zones.length,
      activeJunctions: junctions.length,
      emergencyAlerts: this.emergencyAlerts.length,
      signalsOptimized: junctions.filter(j => j.optimized).length,
      systemHealth: 'operational'
    };
  }

  // Get authority-specific data
  getAuthorityDashboardData(authority) {
    const data = {};

    switch (authority) {
      case 'road_authority':
        data.stats = {
          challanIssued: 0,
          violationsDocumented: 0,
          pendingChallan: 0,
          revenue: 0
        };
        break;

      case 'municipal_corp':
        data.metrics = {
          avgCongestion: this.getAverageCongestion(),
          activeZones: this.zoneMetrics.size,
          signalsOptimized: Array.from(this.junctionMetrics.values()).filter(j => j.optimized).length,
          emergencyAlerts: this.emergencyAlerts.length
        };
        break;

      case 'traffic_police':
        data.incidents = {
          active: this.emergencyAlerts.filter(a => a.status === 'active').length,
          resolved: this.emergencyAlerts.filter(a => a.status === 'resolved').length,
          responseTime: this.getAverageResponseTime(),
          patrols: 0
        };
        break;

      case 'driveLegal':
        data.fines = {
          totalInSystem: 0,
          revenue: 0,
          collectionRate: 0,
          paymentReady: 0
        };
        break;
    }

    return data;
  }

  getAverageCongestion() {
    const junctions = Array.from(this.junctionMetrics.values());
    if (junctions.length === 0) return 0;
    const total = junctions.reduce((sum, j) => sum + (j.congestionLevel || 0), 0);
    return Math.round(total / junctions.length);
  }

  getAverageResponseTime() {
    if (this.emergencyAlerts.length === 0) return 0;
    const total = this.emergencyAlerts.reduce((sum, a) => sum + (a.responseTime || 0), 0);
    return Math.round(total / this.emergencyAlerts.length);
  }

  getAuthorityForZone(zoneId) {
    // Map zones to authorities
    const zoneToAuthority = {
      solapur_textile_corridor: 'road_authority',
      solapur_pilgrimage: 'municipal_corp',
      solapur_navi_peth: 'road_authority',
      solapur_railway: 'traffic_police'
    };

    return zoneToAuthority[zoneId] || 'municipal_corp';
  }

  // Start periodic broadcasts (simulating agent updates)
  startPeriodicBroadcasts() {
    // Simulate city-wide updates every 5 seconds
    setInterval(() => {
      this.broadcastCityMetrics(this.getCityMetrics());
    }, 5000);

    // Simulate zone updates every 10 seconds
    setInterval(() => {
      this.zoneMetrics.forEach((_, zoneId) => {
        const updatedMetrics = {
          ...this.zoneMetrics.get(zoneId),
          lastUpdate: new Date(),
          congestion: Math.floor(Math.random() * 100)
        };
        this.broadcastZoneMetrics(zoneId, updatedMetrics);
      });
    }, 10000);

    // Simulate junction updates every 2 seconds
    setInterval(() => {
      this.junctionMetrics.forEach((_, junctionId) => {
        const updatedMetrics = {
          ...this.junctionMetrics.get(junctionId),
          lastUpdate: new Date(),
          congestionLevel: Math.floor(Math.random() * 100),
          vehicleCount: Math.floor(Math.random() * 200),
          avgWaitTime: Math.floor(Math.random() * 60)
        };
        this.broadcastJunctionMetrics(junctionId, updatedMetrics);
      });
    }, 2000);
  }
}

export default RealtimeAgentService;
