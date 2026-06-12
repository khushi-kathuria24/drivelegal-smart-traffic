'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import {
  Activity, AlertTriangle, TrendingDown, TrendingUp, Zap,
  MapPin, Clock, Users, AlertCircle, CheckCircle, Brain, Gauge
} from 'lucide-react';

/**
 * Professional Smart Traffic Dashboard
 * Enterprise-grade UI with real-time analytics and agent metrics
 */
export default function ProfessionalDashboard({ authority = 'road_authority' }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedZone, setSelectedZone] = useState('all');
  const [animateMetrics, setAnimateMetrics] = useState(false);

  useEffect(() => {
    // Trigger animations on load
    setAnimateMetrics(true);
    // Fetch real data from API
    fetchDashboardData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeRange, selectedZone]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/authority/${authority}/dashboard?timeRange=${timeRange}&zone=${selectedZone}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  // Mock data for demo (replace with real API data)
  const mockData = {
    metrics: {
      currentCongestion: 65,
      totalVehicles: 4250,
      activeIncidents: 3,
      avgWaitTime: 240,
      congestionTrend: -5,
      systemHealth: 92
    },
    trafficTrend: [
      { time: '00:00', congestion: 30, vehicles: 1200 },
      { time: '06:00', congestion: 45, vehicles: 2100 },
      { time: '09:00', congestion: 82, vehicles: 4800 },
      { time: '12:00', congestion: 78, vehicles: 4600 },
      { time: '15:00', congestion: 88, vehicles: 5200 },
      { time: '18:00', congestion: 92, vehicles: 5800 },
      { time: '21:00', congestion: 55, vehicles: 3200 },
      { time: '23:00', congestion: 25, vehicles: 800 }
    ],
    zoneMetrics: [
      { zone: 'Central CBD', congestion: 85, efficiency: 75, incidents: 2 },
      { zone: 'Textile Corridor', congestion: 62, efficiency: 82, incidents: 1 },
      { zone: 'Pilgrimage Zone', congestion: 45, efficiency: 90, incidents: 0 },
      { zone: 'Railway Hub', congestion: 78, efficiency: 78, incidents: 2 },
      { zone: 'Navi Peth', congestion: 58, efficiency: 85, incidents: 0 }
    ],
    agentPerformance: [
      { agent: 'L1-Junction1', efficiency: 88, decisions: 12, status: 'active' },
      { agent: 'L1-Junction2', efficiency: 82, decisions: 10, status: 'active' },
      { agent: 'L1-Junction3', efficiency: 91, decisions: 14, status: 'active' },
      { agent: 'L1-Junction4', efficiency: 85, decisions: 11, status: 'active' },
      { agent: 'L2-Coordinator', efficiency: 87, decisions: 25, status: 'active' },
      { agent: 'L3-Governor', efficiency: 89, decisions: 8, status: 'active' }
    ],
    incidentResponse: [
      { time: 'Today 14:32', type: 'Accident', location: 'Zillah Road', status: 'Resolved', responseTime: 8 },
      { time: 'Today 16:45', type: 'Breakdown', location: 'Railway Hub', status: 'Active', responseTime: 12 },
      { time: 'Today 18:20', type: 'Traffic Jam', location: 'Central CBD', status: 'Active', responseTime: 6 }
    ]
  };

  const data = dashboardData || mockData;
  const isHighCongestion = data.metrics.currentCongestion > 75;
  const trend = data.metrics.congestionTrend < 0 ? 'improving' : 'worsening';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Smart Traffic Control Center
            </h1>
            <p className="text-blue-200">Real-time traffic management with AI-powered agents</p>
          </div>
          <div className="flex gap-3">
            {['1h', '24h', '7d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Current Congestion */}
          <div className={`p-6 rounded-lg backdrop-blur-md border transition-all transform hover:scale-105 ${
            isHighCongestion
              ? 'bg-red-900/20 border-red-500/30 shadow-lg shadow-red-500/10'
              : 'bg-emerald-900/20 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 text-sm font-semibold">Current Congestion</span>
              <Gauge className={isHighCongestion ? 'text-red-400' : 'text-emerald-400'} size={20} />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{data.metrics.currentCongestion}%</div>
            <div className="flex items-center gap-2">
              {data.metrics.congestionTrend < 0 ? (
                <TrendingDown className="text-emerald-400" size={16} />
              ) : (
                <TrendingUp className="text-red-400" size={16} />
              )}
              <span className={data.metrics.congestionTrend < 0 ? 'text-emerald-400' : 'text-red-400'}>
                {Math.abs(data.metrics.congestionTrend)}% {trend}
              </span>
            </div>
          </div>

          {/* Total Vehicles */}
          <div className="p-6 rounded-lg backdrop-blur-md bg-blue-900/20 border border-blue-500/30 shadow-lg shadow-blue-500/10 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 text-sm font-semibold">Active Vehicles</span>
              <Users className="text-blue-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{data.metrics.totalVehicles.toLocaleString()}</div>
            <div className="text-blue-300 text-sm">+240 from last hour</div>
          </div>

          {/* Active Incidents */}
          <div className={`p-6 rounded-lg backdrop-blur-md border transition-all transform hover:scale-105 ${
            data.metrics.activeIncidents > 0
              ? 'bg-amber-900/20 border-amber-500/30 shadow-lg shadow-amber-500/10'
              : 'bg-slate-800/20 border-slate-500/30'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 text-sm font-semibold">Active Incidents</span>
              <AlertTriangle className="text-amber-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{data.metrics.activeIncidents}</div>
            <div className="text-amber-300 text-sm">{data.metrics.activeIncidents > 0 ? 'Requires attention' : 'All clear'}</div>
          </div>

          {/* Avg Wait Time */}
          <div className="p-6 rounded-lg backdrop-blur-md bg-purple-900/20 border border-purple-500/30 shadow-lg shadow-purple-500/10 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 text-sm font-semibold">Avg Wait Time</span>
              <Clock className="text-purple-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(data.metrics.avgWaitTime / 60)}m</div>
            <div className="text-purple-300 text-sm">Optimizing with agents</div>
          </div>

          {/* System Health */}
          <div className="p-6 rounded-lg backdrop-blur-md bg-emerald-900/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 text-sm font-semibold">System Health</span>
              <Activity className="text-emerald-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{data.metrics.systemHealth}%</div>
            <div className="text-emerald-300 text-sm">All systems operational</div>
          </div>
        </div>
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Traffic Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-400" />
            Traffic Pattern Analysis (24h)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.trafficTrend}>
              <defs>
                <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="congestion"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCongestion)"
                isAnimationActive={animateMetrics}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Comparison */}
        <div className="p-6 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="text-purple-400" />
            Zone Status
          </h2>
          <div className="space-y-3">
            {data.zoneMetrics.map((zone, idx) => (
              <div key={idx} className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-white">{zone.zone}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    zone.congestion > 70 ? 'bg-red-500/20 text-red-200' : 'bg-emerald-500/20 text-emerald-200'
                  }`}>
                    {zone.congestion}%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      zone.congestion > 70 ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${zone.congestion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance & Incident Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <div className="p-6 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="text-cyan-400" />
            AI Agent Performance
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.agentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="agent" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155' }} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="efficiency" fill="#06b6d4" radius={[8, 8, 0, 0]} isAnimationActive={animateMetrics} />
              <Bar dataKey="decisions" fill="#8b5cf6" radius={[8, 8, 0, 0]} isAnimationActive={animateMetrics} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
            <p className="text-sm text-cyan-200">
              ✓ All agents active and coordinating | Avg efficiency: <span className="font-bold">87%</span>
            </p>
          </div>
        </div>

        {/* Incident Response */}
        <div className="p-6 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="text-amber-400" />
            Incident Response Log
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.incidentResponse.map((incident, idx) => (
              <div key={idx} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-white text-sm">{incident.type}</p>
                    <p className="text-xs text-slate-400">{incident.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                    incident.status === 'Resolved'
                      ? 'bg-emerald-500/20 text-emerald-200'
                      : 'bg-amber-500/20 text-amber-200'
                  }`}>
                    {incident.status === 'Resolved' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    {incident.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{incident.time}</span>
                  <span>Response: {incident.responseTime}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 p-4 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 text-center">
        <p className="text-slate-300 text-sm">
          🤖 <span className="font-semibold text-cyan-400">6 AI Agents Active</span> | 
          ✅ <span className="font-semibold text-emerald-400">18 Traffic Signals Optimized</span> | 
          🔄 <span className="font-semibold text-blue-400">Last Update: 30s ago</span>
        </p>
      </div>
    </div>
  );
}
