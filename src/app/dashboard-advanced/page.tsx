'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Activity, TrendingUp, AlertCircle, MapPin, Clock, Zap,
  Brain, Target, Shield, Lightbulb, CheckCircle, AlertTriangle,
  Users, Gauge, Database, Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function AdvancedDashboard() {
  const [userData, setUserData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [activeTab, setActiveTab] = useState('analytics');
  const [darkMode, setDarkMode] = useState(false);

  // Mock advanced data
  const [dashboardData] = useState({
    realTimeMetrics: {
      congestionIndex: 62,
      avgSpeed: 28,
      activeViolations: 145,
      emergencies: 3,
      efficiency: 78
    },
    trafficTrends: [
      { time: '00:00', congestion: 15, speed: 55, vehicles: 120 },
      { time: '04:00', congestion: 8, speed: 60, vehicles: 50 },
      { time: '08:00', congestion: 85, speed: 12, vehicles: 890 },
      { time: '12:00', congestion: 42, speed: 35, vehicles: 450 },
      { time: '16:00', congestion: 55, speed: 28, vehicles: 620 },
      { time: '20:00', congestion: 72, speed: 18, vehicles: 780 },
      { time: '00:00', congestion: 15, speed: 55, vehicles: 120 }
    ],
    violationByType: [
      { name: 'Speeding', value: 45, color: '#ef4444' },
      { name: 'Parking', value: 32, color: '#f97316' },
      { name: 'Signal Jump', value: 28, color: '#eab308' },
      { name: 'Other', value: 40, color: '#06b6d4' }
    ],
    zonePerformance: [
      { zone: 'Central', congestion: 72, violations: 34, efficiency: 68, trend: '↑' },
      { zone: 'North', congestion: 45, violations: 18, efficiency: 82, trend: '↓' },
      { zone: 'South', congestion: 38, violations: 14, efficiency: 85, trend: '↓' },
      { zone: 'East', congestion: 55, violations: 28, efficiency: 75, trend: '→' },
      { zone: 'West', congestion: 42, violations: 20, efficiency: 80, trend: '↓' }
    ],
    aiRecommendations: [
      {
        id: 1,
        title: 'Optimize Signal Timing at Central Junction',
        description: 'ML model predicts 18-22% congestion reduction',
        confidence: 92,
        priority: 'high',
        impact: 'High',
        status: 'pending'
      },
      {
        id: 2,
        title: 'Deploy Extra Patrols on North Corridor',
        description: 'Anomaly detection: 35% increase in violations',
        confidence: 88,
        priority: 'high',
        impact: 'High',
        status: 'pending'
      },
      {
        id: 3,
        title: 'Implement Route Diversions During Peak Hours',
        description: 'Predictive model: 8-12% time saving possible',
        confidence: 85,
        priority: 'medium',
        impact: 'Medium',
        status: 'pending'
      }
    ],
    predictedCongestion: [
      { hour: '8:00', predicted: 82, actual: 85, confidence: 94 },
      { hour: '9:00', predicted: 78, actual: 76, confidence: 91 },
      { hour: '17:00', predicted: 88, actual: 90, confidence: 96 },
      { hour: '18:00', predicted: 85, actual: 84, confidence: 93 },
      { hour: '19:00', predicted: 72, actual: 70, confidence: 89 }
    ],
    systemHealth: {
      apiUptime: 99.8,
      dbPerformance: 98.5,
      agentEfficiency: 96.2,
      dataAccuracy: 94.1
    }
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Cpu className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">DriveLegal Advanced Analytics</h1>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  AI-Powered Smart Traffic Intelligence System
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Real-time Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Congestion Index', value: dashboardData.realTimeMetrics.congestionIndex, unit: '%', icon: AlertCircle, color: 'from-red-500 to-orange-500' },
            { label: 'Avg Speed', value: dashboardData.realTimeMetrics.avgSpeed, unit: 'km/h', icon: Zap, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active Violations', value: dashboardData.realTimeMetrics.activeViolations, unit: '', icon: Shield, color: 'from-orange-500 to-red-500' },
            { label: 'Emergencies', value: dashboardData.realTimeMetrics.emergencies, unit: '', icon: AlertTriangle, color: 'from-red-600 to-pink-600' },
            { label: 'System Efficiency', value: dashboardData.realTimeMetrics.efficiency, unit: '%', icon: Activity, color: 'from-green-500 to-emerald-500' }
          ].map((metric, idx) => (
            <div
              key={idx}
              className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:shadow-lg'} rounded-xl p-6 transition cursor-pointer border ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}
              onClick={() => setSelectedMetric(metric.label)}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4`}>
                <metric.icon className="text-white" size={24} />
              </div>
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{metric.label}</p>
              <p className="text-3xl font-bold mt-2">
                {metric.value}{metric.unit}
              </p>
              <p className="text-xs text-green-500 mt-2">↓ 5% from yesterday</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          {['analytics', 'predictions', 'recommendations', 'insights'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition border-b-2 ${
                activeTab === tab
                  ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                  : `border-transparent ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Traffic Trends */}
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-500" size={24} />
                24-Hour Traffic Trends
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.trafficTrends}>
                  <defs>
                    <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
                  <XAxis dataKey="time" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                  <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}` }} />
                  <Area type="monotone" dataKey="congestion" stroke="#ef4444" fillOpacity={1} fill="url(#colorCongestion)" name="Congestion (%)" />
                  <Area type="monotone" dataKey="speed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpeed)" name="Avg Speed (km/h)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Violation Types and Zone Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Violation Pie Chart */}
              <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className="text-lg font-bold mb-4">Violations by Type</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={dashboardData.violationByType} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {dashboardData.violationByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {dashboardData.violationByType.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone Performance */}
              <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className="text-lg font-bold mb-4">Zone Performance</h3>
                <div className="space-y-3">
                  {dashboardData.zonePerformance.map((zone, idx) => (
                    <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{zone.zone}</span>
                        <span className="text-lg">{zone.trend}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Congestion</p>
                          <p className="font-bold">{zone.congestion}%</p>
                        </div>
                        <div>
                          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Violations</p>
                          <p className="font-bold">{zone.violations}</p>
                        </div>
                        <div>
                          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Efficiency</p>
                          <p className="font-bold text-green-500">{zone.efficiency}%</p>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-300 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: `${zone.efficiency}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Brain className="text-purple-500" size={24} />
              ML-Based Traffic Predictions (Next 24 Hours)
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dashboardData.predictedCongestion}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="hour" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="Predicted Congestion" />
                <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} name="Actual Congestion" />
                <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeDasharray="5 5" name="Confidence %" />
              </LineChart>
            </ResponsiveContainer>
            <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-blue-50'} border border-blue-200`}>
              <p className="flex items-center gap-2 text-sm">
                <Lightbulb className="text-blue-500" size={20} />
                <span><strong>AI Insight:</strong> Model predicts peak congestion at 17:00-18:00 with 96% confidence. Recommend signal optimization.</span>
              </p>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {dashboardData.aiRecommendations.map((rec) => (
              <div key={rec.id} className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border hover:shadow-lg transition`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <Target size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{rec.title}</h3>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{rec.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Confidence</p>
                    <p className="font-bold">{rec.confidence}%</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Potential Impact</p>
                    <p className="font-bold text-green-500">{rec.impact}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>AI Model</p>
                    <p className="font-bold text-blue-500">Decision Forest</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold">
                  Implement Recommendation
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {[
              { type: 'trend', title: 'Increasing Violations Trend', desc: 'Violations increased 25% week-over-week', confidence: 91 },
              { type: 'anomaly', title: 'Unusual Traffic Pattern', desc: 'Unexpected congestion at 14:00 detected', confidence: 87 },
              { type: 'opportunity', title: 'Optimization Opportunity', desc: 'Green wave coordination can reduce delays by 18%', confidence: 85 }
            ].map((insight, idx) => (
              <div key={idx} className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {insight.type === 'trend' && <TrendingUp className="text-blue-500" size={24} />}
                    {insight.type === 'anomaly' && <AlertCircle className="text-red-500" size={24} />}
                    {insight.type === 'opportunity' && <Lightbulb className="text-green-500" size={24} />}
                    <div>
                      <h3 className="font-bold">{insight.title}</h3>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{insight.desc}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{insight.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* System Health */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
          <h2 className="text-xl font-bold mb-6">System Health & Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { metric: 'API Uptime', value: dashboardData.systemHealth.apiUptime },
              { metric: 'DB Performance', value: dashboardData.systemHealth.dbPerformance },
              { metric: 'Agent Efficiency', value: dashboardData.systemHealth.agentEfficiency },
              { metric: 'Data Accuracy', value: dashboardData.systemHealth.dataAccuracy }
            ].map((health, idx) => (
              <div key={idx}>
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{health.metric}</p>
                <div className="relative w-full h-8 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                    style={{ width: `${health.value}%` }}
                  ></div>
                </div>
                <p className="text-lg font-bold mt-2">{health.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
