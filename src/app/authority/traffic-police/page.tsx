'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Phone, MapPin, Clock, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import AuthorityHeader from '@/components/AuthorityHeader';
import { trafficPoliceService, initializeAuth } from '@/services/api';

export default function TrafficPoliceDashboard() {
  const [userData, setUserData] = useState(null);
  const [emergencies, setEmergencies] = useState({
    active: 0,
    resolved: 0,
    responseTime: '0 min',
    patrols: 0
  });
  const [activeIncidents, setActiveIncidents] = useState([]);
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
      
      const incidents = await trafficPoliceService.getIncidents({ status: 'active' });
      const vehicles = await trafficPoliceService.getEmergencyVehicles();
      const patrols = await trafficPoliceService.getPatrols();
      
      setEmergencies({
        active: incidents.data?.length || 0,
        resolved: incidents.totalResolved || 0,
        responseTime: incidents.avgResponseTime || '4.2 min',
        patrols: patrols.length || 0
      });
      
      setActiveIncidents(incidents.data?.slice(0, 3) || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      // Fallback data
      setEmergencies({
        active: 2,
        resolved: 156,
        responseTime: '4.2 min',
        patrols: 24
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
        authority="traffic_police"
        title="Traffic Police Portal"
        description="👮 Emergency Response & Enforcement"
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">⚠️ {error}</p>
          </div>
        )}

        {/* Header with Refresh */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Emergency Command Center</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          >
            <RotateCcw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {/* Critical Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Emergencies', value: emergencies.active, icon: AlertTriangle, color: 'bg-red-500', urgent: true },
            { label: 'Resolved Today', value: emergencies.resolved, icon: Shield, color: 'bg-green-500' },
            { label: 'Avg Response', value: emergencies.responseTime, icon: Clock, color: 'bg-blue-500' },
            { label: 'Active Patrols', value: emergencies.patrols, icon: MapPin, color: 'bg-purple-500' }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white rounded-lg shadow p-6 ${stat.urgent ? 'ring-2 ring-red-300' : ''}`}>
              <div className={`${stat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Active Emergencies Alert */}
        {emergencies.active > 0 && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={32} />
              <h2 className="text-2xl font-bold text-red-800">ACTIVE EMERGENCIES ({emergencies.active})</h2>
            </div>
            <div className="space-y-3">
              {activeIncidents.length > 0 ? (
                activeIncidents.map((incident: any, idx) => (
                  <div key={idx} className="bg-white border-l-4 border-red-600 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-gray-800">{incident.type}</p>
                        <p className="text-gray-600">{incident.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(incident.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          incident.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          incident.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {incident.priority?.toUpperCase()}
                        </span>
                        <p className="text-sm text-green-700 font-semibold mt-2">✓ {incident.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-700">No detailed incident information available</p>
              )}
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emergency Dispatch */}
          <Link href="/authority/traffic-police/dispatch">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Emergency Dispatch</h2>
                <AlertTriangle className="text-red-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Manage emergency vehicle routing and signal priority</p>
              <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded text-sm text-red-700">
                🚨 {emergencies.active} active emergencies • Avg response: {emergencies.responseTime}
              </div>
            </div>
          </Link>

          {/* Violation Enforcement */}
          <Link href="/authority/traffic-police/enforcement">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Violation Enforcement</h2>
                <Shield className="text-blue-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Document violations and issue challans in real-time</p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded text-sm text-blue-700">
                📱 Mobile app ready • Photo upload enabled
              </div>
            </div>
          </Link>

          {/* Patrol Management */}
          <Link href="/authority/traffic-police/patrols">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Patrol Management</h2>
                <MapPin className="text-green-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Coordinate patrol units and view real-time location</p>
              <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded text-sm text-green-700">
                🗺️ {emergencies.patrols} active patrols • Real-time GPS tracking
              </div>
            </div>
          </Link>

          {/* Communication Center */}
          <Link href="/authority/traffic-police/comm-center">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Communication Center</h2>
                <Phone className="text-purple-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Coordinate with patrols and other agencies</p>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-3 rounded text-sm text-purple-700">
                📞 Hotline: 100 • 24/7 dispatch available
              </div>
            </div>
          </Link>
        </div>

        {/* Incident Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Incident Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { category: 'Accidents', count: 8, resolved: 7, pending: 1 },
              { category: 'Traffic Violations', count: 24, resolved: 24, pending: 0 },
              { category: 'Emergency Calls', count: 12, resolved: 11, pending: 1 }
            ].map((incident, idx) => (
              <div key={idx} className="bg-gray-50 rounded p-4 border-l-4 border-indigo-600">
                <p className="font-semibold text-gray-800">{incident.category}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-gray-600">Total: <span className="font-bold">{incident.count}</span></p>
                  <p className="text-green-600">Resolved: <span className="font-bold">{incident.resolved}</span></p>
                  <p className="text-red-600">Pending: <span className="font-bold">{incident.pending}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
