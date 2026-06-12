'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, MapPin, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import AuthorityHeader from '@/components/AuthorityHeader';
import { municipalCorpService, initializeAuth } from '@/services/api';

export default function MunicipalCorpDashboard() {
  const [userData, setUserData] = useState(null);
  const [metrics, setMetrics] = useState({
    avgCongestion: 0,
    activeZones: 0,
    signalsOptimized: 0,
    emergencyAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeAuth();
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const analytics = await municipalCorpService.getAnalytics();
      const zones = await municipalCorpService.getZones();
      
      setMetrics({
        avgCongestion: analytics.avgCongestion || 0,
        activeZones: zones.length || 0,
        signalsOptimized: analytics.signalsOptimized || 0,
        emergencyAlerts: analytics.emergencyAlerts || 0
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      // Fallback to sample data
      setMetrics({
        avgCongestion: 65,
        activeZones: 12,
        signalsOptimized: 87,
        emergencyAlerts: 5
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorityHeader
        authority="municipal_corp"
        title="Municipal Corporation Dashboard"
        description="🚦 Real-time Traffic Monitoring & Optimization"
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">⚠️ {error}</p>
          </div>
        )}

        {/* Header with Refresh */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Real-time Monitoring</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            <RotateCcw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Congestion', value: metrics.avgCongestion + '%', icon: Activity, color: 'bg-red-500', trend: '↓ 5%' },
            { label: 'Active Zones', value: metrics.activeZones, icon: MapPin, color: 'bg-blue-500', trend: 'All Normal' },
            { label: 'Signals Optimized', value: metrics.signalsOptimized, icon: Zap, color: 'bg-yellow-500', trend: '↑ 3' },
            { label: 'Active Alerts', value: metrics.emergencyAlerts, icon: AlertTriangle, color: 'bg-orange-500', trend: '⚠️ Action' }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className={`${metric.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <metric.icon size={24} />
              </div>
              <p className="text-gray-600 text-sm">{metric.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-2">{metric.trend}</p>
            </div>
          ))}
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Live Traffic Map */}
          <Link href="/authority/municipal-corp/traffic-map">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Live Traffic Map</h2>
                <MapPin className="text-red-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Real-time traffic visualization across Solapur city</p>
              <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded text-sm text-red-700">
                🚦 {metrics.activeZones} zones monitored • {metrics.avgCongestion}% avg congestion
              </div>
            </div>
          </Link>

          {/* Signal Control */}
          <Link href="/authority/municipal-corp/signals">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Signal Control</h2>
                <Zap className="text-yellow-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Optimize traffic signal timings and manage green waves</p>
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-3 rounded text-sm text-yellow-700">
                ⚡ {metrics.signalsOptimized} signals optimized • Adaptive mode active
              </div>
            </div>
          </Link>

          {/* Zone Management */}
          <Link href="/authority/municipal-corp/zones">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Zone Management</h2>
                <Activity className="text-blue-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Manage traffic zones and coordinate regional services</p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded text-sm text-blue-700">
                📍 Central Zone • North Zone • South Zone • East Zone • West Zone
              </div>
            </div>
          </Link>

          {/* Analytics Dashboard */}
          <Link href="/authority/municipal-corp/analytics">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
                <TrendingUp className="text-green-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Traffic patterns, peak hours, and historical trends</p>
              <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded text-sm text-green-700">
                📊 Daily report • Peak hours: 8-9 AM, 5-6 PM
              </div>
            </div>
          </Link>
        </div>

        {/* Current Traffic Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Traffic Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                zone: 'Central Zone',
                status: 'Moderate',
                vehicles: 234,
                avgSpeed: 32,
                color: 'yellow',
                icon: '🟡'
              },
              {
                zone: 'North Zone',
                status: 'Heavy',
                vehicles: 456,
                avgSpeed: 18,
                color: 'red',
                icon: '🔴'
              },
              {
                zone: 'South Zone',
                status: 'Light',
                vehicles: 123,
                avgSpeed: 45,
                color: 'green',
                icon: '🟢'
              }
            ].map((zone, idx) => (
              <div key={idx} className={`bg-${zone.color}-50 border-l-4 border-${zone.color}-600 p-4 rounded`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">{zone.icon} {zone.zone}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${zone.color}-600`}>
                    {zone.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>🚗 {zone.vehicles} vehicles</p>
                  <p>⚡ Avg Speed: {zone.avgSpeed} km/h</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Alerts */}
        {metrics.emergencyAlerts > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded">
            <h2 className="text-xl font-bold text-orange-800 mb-4">⚠️ Active Emergency Alerts ({metrics.emergencyAlerts})</h2>
            <div className="space-y-2">
              <p className="text-orange-700">Ambulance detected on Zillah Road - Green wave activated</p>
              <p className="text-orange-700">Fire truck en route to Railway Station - All-red protocol initiated</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
