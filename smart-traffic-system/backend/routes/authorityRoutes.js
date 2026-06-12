import express from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth.js';
import Challan from '../models/Challan.js';
import Violation from '../models/Violation.js';
import TrafficSignal from '../models/TrafficSignal.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// ============= ROAD AUTHORITY ENDPOINTS =============

// Get road authority statistics
router.get('/road/statistics', authenticateToken, checkPermission('fine:view'), async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const totalIssued = await Challan.countDocuments({ issuedBy: userId });
    const totalViolations = await Violation.countDocuments({ documentedBy: userId });
    const pending = await Challan.countDocuments({ issuedBy: userId, status: 'pending' });
    
    const paidChallans = await Challan.find({ issuedBy: userId, status: 'paid' });
    const totalRevenue = paidChallans.reduce((sum, challan) => sum + challan.fineAmount, 0);

    res.json({
      totalIssued,
      totalViolations,
      pending,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all challans issued by this authority
router.get('/road/challans', authenticateToken, checkPermission('fine:view'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const challans = await Challan.find({ issuedBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Challan.countDocuments({ issuedBy: userId });

    res.json({
      data: challans,
      page,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Issue a new challan
router.post('/road/challan/issue', authenticateToken, checkPermission('fine:issue'), async (req, res) => {
  try {
    const { vehicleNumber, violationType, fineAmount, location, photoUrl, description } = req.body;

    const challan = new Challan({
      vehicleNumber,
      violationType,
      fineAmount,
      location,
      photoUrl,
      description,
      issuedBy: req.user.userId,
      status: 'issued',
      issuedDate: new Date()
    });

    await challan.save();

    res.status(201).json({
      message: 'Challan issued successfully',
      challan
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get violations
router.get('/road/violations', authenticateToken, checkPermission('fine:view'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    let query = { documentedBy: userId };
    if (status) query.status = status;

    const violations = await Violation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Violation.countDocuments(query);

    res.json({
      data: violations,
      page,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reports
router.get('/road/reports', authenticateToken, checkPermission('report:view'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    let query = { issuedBy: userId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const challans = await Challan.find(query);
    const violations = await Violation.find({ documentedBy: userId });

    const report = {
      totalChallans: challans.length,
      totalViolations: violations.length,
      totalRevenue: challans.reduce((sum, c) => sum + c.fineAmount, 0),
      averageFine: challans.length > 0 ? 
        challans.reduce((sum, c) => sum + c.fineAmount, 0) / challans.length : 0,
      byViolationType: {}
    };

    violations.forEach(v => {
      if (!report.byViolationType[v.violationType]) {
        report.byViolationType[v.violationType] = 0;
      }
      report.byViolationType[v.violationType]++;
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= MUNICIPAL CORPORATION ENDPOINTS =============

// Get traffic metrics
router.get('/municipal/traffic-metrics', authenticateToken, checkPermission('traffic:view'), async (req, res) => {
  try {
    const { zoneId } = req.query;

    let query = {};
    if (zoneId) query.zoneId = zoneId;

    const signals = await TrafficSignal.find(query);
    
    let totalCongestion = 0;
    signals.forEach(signal => {
      totalCongestion += signal.congestionLevel || 0;
    });
    const avgCongestion = signals.length > 0 ? 
      Math.round(totalCongestion / signals.length) : 0;

    res.json({
      avgCongestion,
      totalSignals: signals.length,
      signals: signals.map(s => ({
        id: s._id,
        location: s.location,
        congestionLevel: s.congestionLevel,
        status: s.status,
        greenTime: s.greenTime,
        redTime: s.redTime
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get zones
router.get('/municipal/zones', authenticateToken, checkPermission('traffic:view'), async (req, res) => {
  try {
    // Get unique zones from traffic signals
    const signals = await TrafficSignal.find().distinct('zoneId');
    const zones = signals.map((zone, idx) => ({
      id: zone,
      name: `Zone ${idx + 1}`,
      status: 'operational'
    }));

    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get signal status
router.get('/municipal/signals', authenticateToken, checkPermission('traffic:view'), async (req, res) => {
  try {
    const signals = await TrafficSignal.find();

    res.json(signals.map(s => ({
      id: s._id,
      location: s.location,
      status: s.status,
      greenTime: s.greenTime,
      redTime: s.redTime,
      congestionLevel: s.congestionLevel,
      zoneId: s.zoneId
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update signal timing
router.post('/municipal/signals/update', authenticateToken, checkPermission('traffic:update'), async (req, res) => {
  try {
    const { signalId, greenTime, redTime } = req.body;

    const signal = await TrafficSignal.findByIdAndUpdate(
      signalId,
      { greenTime, redTime, lastUpdated: new Date() },
      { new: true }
    );

    res.json({
      message: 'Signal updated successfully',
      signal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analytics
router.get('/municipal/analytics', authenticateToken, checkPermission('traffic:view'), async (req, res) => {
  try {
    const { metric } = req.query;

    const signals = await TrafficSignal.find();
    const totalCongestion = signals.reduce((sum, s) => sum + (s.congestionLevel || 0), 0);
    const avgCongestion = signals.length > 0 ? Math.round(totalCongestion / signals.length) : 0;

    const analytics = {
      avgCongestion,
      signalsOptimized: signals.filter(s => s.optimized).length,
      emergencyAlerts: 0,
      efficiency: Math.max(0, 100 - avgCongestion)
    };

    if (metric === 'peak_hours') {
      analytics.peakHours = [
        { time: '08:00-09:00', congestion: 85 },
        { time: '17:00-18:00', congestion: 78 },
        { time: '13:00-14:00', congestion: 65 }
      ];
    } else if (metric === 'congestion') {
      analytics.congestionTrend = [
        { hour: 0, level: 30 },
        { hour: 6, level: 45 },
        { hour: 12, level: 70 },
        { hour: 18, level: 75 },
        { hour: 23, level: 35 }
      ];
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= TRAFFIC POLICE ENDPOINTS =============

// Get incidents
router.get('/police/incidents', authenticateToken, checkPermission('incident:view'), async (req, res) => {
  try {
    const { status, type, page } = req.query;
    const limit = 10;
    const pageNum = parseInt(page) || 1;

    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((pageNum - 1) * limit);

    const totalResolved = await Incident.countDocuments({ status: 'resolved' });
    const avgResponseTime = 4.2; // Mock value - calculate from real data

    res.json({
      data: incidents,
      totalResolved,
      avgResponseTime: `${avgResponseTime} min`,
      page: pageNum,
      total: await Incident.countDocuments(query)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get emergency vehicles
router.get('/police/emergency-vehicles', authenticateToken, checkPermission('emergency:view'), async (req, res) => {
  try {
    // Mock emergency vehicles - in production, fetch from database
    const vehicles = [
      { id: '1', type: 'ambulance', status: 'available', location: 'Station 1' },
      { id: '2', type: 'fire', status: 'on-duty', location: 'Station 2' },
      { id: '3', type: 'police', status: 'available', location: 'Station 3' }
    ];

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dispatch emergency
router.post('/police/emergency/dispatch', authenticateToken, checkPermission('emergency:dispatch'), async (req, res) => {
  try {
    const { type, location } = req.body;

    // Create incident record
    const incident = new Incident({
      type,
      location,
      status: 'active',
      priority: 'high',
      dispatchedBy: req.user.userId,
      createdAt: new Date()
    });

    await incident.save();

    res.status(201).json({
      message: 'Emergency dispatched successfully',
      incident
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patrols
router.get('/police/patrols', authenticateToken, checkPermission('patrol:view'), async (req, res) => {
  try {
    const patrols = await Patrol.find({ status: 'active' });

    res.json(patrols || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update patrol status
router.post('/police/patrol/update', authenticateToken, checkPermission('patrol:update'), async (req, res) => {
  try {
    const { patrolId, status, location } = req.body;

    const patrol = await Patrol.findByIdAndUpdate(
      patrolId,
      { status, location, lastUpdated: new Date() },
      { new: true }
    );

    res.json({
      message: 'Patrol updated successfully',
      patrol
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enforcement reports
router.get('/police/enforcement-reports', authenticateToken, checkPermission('report:view'), async (req, res) => {
  try {
    const violations = await Violation.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      totalEnforced: await Violation.countDocuments(),
      recentEnforcements: violations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= DRIVELEGAL PARTNER ENDPOINTS (Read-only) =============

// Get fine summary for DriveLegal partners
router.get('/partner/driveLegal/fines', authenticateToken, checkPermission('partner:access'), async (req, res) => {
  try {
    const { status, period } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    // Add date filtering based on period
    if (period) {
      const now = new Date();
      const startDate = new Date();
      
      if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      query.createdAt = { $gte: startDate };
    }

    const fines = await Challan.find(query)
      .select('vehicleNumber fineAmount status violationType location createdAt')
      .limit(100);

    const metrics = {
      total: await Challan.countDocuments(query),
      paid: await Challan.countDocuments({ ...query, status: 'paid' }),
      pending: await Challan.countDocuments({ ...query, status: 'pending' }),
      dispute: await Challan.countDocuments({ ...query, status: 'dispute' })
    };

    res.json({
      data: fines,
      metrics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get DriveLegal partner metrics
router.get('/partner/driveLegal/metrics', authenticateToken, checkPermission('partner:access'), async (req, res) => {
  try {
    const metrics = {
      totalFinesInSystem: await Challan.countDocuments(),
      revenue: 0,
      collectionRate: 0,
      topViolations: []
    };

    const paidFines = await Challan.find({ status: 'paid' });
    metrics.revenue = paidFines.reduce((sum, f) => sum + f.fineAmount, 0);

    const totalFines = await Challan.countDocuments();
    metrics.collectionRate = totalFines > 0 ? 
      Math.round((paidFines.length / totalFines) * 100) : 0;

    // Get top violations
    const violations = await Violation.aggregate([
      { $group: { _id: '$violationType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    metrics.topViolations = violations;

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment-ready fines for DriveLegal
router.get('/partner/driveLegal/fines/payment-ready', authenticateToken, checkPermission('partner:access'), async (req, res) => {
  try {
    const paymentReadyFines = await Challan.find({ status: 'pending' })
      .select('vehicleNumber fineAmount violationType issuedDate')
      .limit(50);

    res.json(paymentReadyFines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
