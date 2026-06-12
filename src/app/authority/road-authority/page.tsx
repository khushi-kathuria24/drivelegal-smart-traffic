'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, FileText, MapPin, Clock, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import AuthorityHeader from '@/components/AuthorityHeader';
import { roadAuthorityService, initializeAuth } from '@/services/api';

export default function RoadAuthorityDashboard() {
  const [userData, setUserData] = useState(null);
  const [statistics, setStatistics] = useState({
    challanIssued: 0,
    violationsDocumented: 0,
    pendingChallan: 0,
    revenue: '₹0'
  });
  const [recentChallans, setRecentChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load user and fetch statistics
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
      
      // Fetch statistics
      const statsData = await roadAuthorityService.getStatistics();
      setStatistics({
        challanIssued: statsData.totalIssued || 0,
        violationsDocumented: statsData.totalViolations || 0,
        pendingChallan: statsData.pending || 0,
        revenue: `₹${statsData.totalRevenue?.toLocaleString('en-IN') || 0}`
      });

      // Fetch recent challans
      const challansData = await roadAuthorityService.getChallans({ page: 1 });
      setRecentChallans(challansData.data?.slice(0, 5) || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      // Fallback to sample data
      setStatistics({
        challanIssued: 245,
        violationsDocumented: 389,
        pendingChallan: 42,
        revenue: '₹2,45,000'
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
        authority="road_authority"
        title="Road Authority Dashboard"
        description="🛣️ Challan Management & Violation Control"
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">⚠️ {error}</p>
          </div>
        )}

        {/* Header with Refresh */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <RotateCcw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Challan Issued', value: statistics.challanIssued, icon: FileText, color: 'bg-blue-500' },
            { label: 'Violations Documented', value: statistics.violationsDocumented, icon: AlertCircle, color: 'bg-red-500' },
            { label: 'Pending Review', value: statistics.pendingChallan, icon: Clock, color: 'bg-yellow-500' },
            { label: 'Revenue Generated', value: statistics.revenue, icon: TrendingUp, color: 'bg-green-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className={`${stat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issue Challan */}
          <Link href="/authority/road-authority/issue-challan">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Issue Challan</h2>
                <FileText className="text-red-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Create and issue traffic violation challan with photo evidence</p>
              <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded text-sm text-red-700">
                ⚠️ Requires: Vehicle number, violation type, photo evidence
              </div>
            </div>
          </Link>

          {/* Manage Violations */}
          <Link href="/authority/road-authority/violations">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Manage Violations</h2>
                <AlertCircle className="text-orange-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Review, update, and track all documented violations</p>
              <div className="bg-orange-50 border-l-4 border-orange-600 p-3 rounded text-sm text-orange-700">
                📊 {statistics.violationsDocumented} violations in system
              </div>
            </div>
          </Link>

          {/* Challan Status */}
          <Link href="/authority/road-authority/challan-status">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Challan Status</h2>
                <Clock className="text-blue-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">Track issued challan status and payment history</p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded text-sm text-blue-700">
                ⏳ {statistics.pendingChallan} pending challan awaiting payment
              </div>
            </div>
          </Link>

          {/* Reports & Analytics */}
          <Link href="/authority/road-authority/reports">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Reports & Analytics</h2>
                <TrendingUp className="text-green-600" size={28} />
              </div>
              <p className="text-gray-600 mb-4">View revenue, violation trends, and compliance reports</p>
              <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded text-sm text-green-700">
                📈 Revenue: {statistics.revenue}
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Violations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Challans</h2>
          <div className="overflow-x-auto">
            {recentChallans.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Vehicle Number</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Violation Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Fine Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentChallans.map((item: any, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-blue-600">{item.vehicleNumber}</td>
                      <td className="px-4 py-3">{item.violationType}</td>
                      <td className="px-4 py-3 flex items-center gap-2"><MapPin size={16} /> {item.location}</td>
                      <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-semibold">₹{item.fineAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'paid' ? 'bg-green-100 text-green-700' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent challans found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
