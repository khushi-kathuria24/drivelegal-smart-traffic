'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, CheckCircle, AlertCircle, RotateCcw, Download } from 'lucide-react';
import Link from 'next/link';
import AuthorityHeader from '@/components/AuthorityHeader';
import { driveLegalService, initializeAuth } from '@/services/api';

export default function DriveLegalPartnerPortal() {
  const [userData, setUserData] = useState(null);
  const [metrics, setMetrics] = useState({
    totalFinesInSystem: 0,
    revenue: 0,
    collectionRate: 0,
    topViolations: []
  });
  const [fines, setFines] = useState([]);
  const [paymentReadyFines, setPaymentReadyFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterPeriod, setFilterPeriod] = useState('month');

  useEffect(() => {
    initializeAuth();
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
    fetchPartnerData();
  }, [filterStatus, filterPeriod]);

  const fetchPartnerData = async () => {
    try {
      setError('');
      setLoading(true);

      // Fetch metrics
      const metricsData = await driveLegalService.getMetrics();
      setMetrics(metricsData);

      // Fetch fines
      const finesData = await driveLegalService.getFineSummary({
        status: filterStatus,
        period: filterPeriod
      });
      setFines(finesData.data || []);

      // Fetch payment-ready fines
      const paymentReadyData = await driveLegalService.getPaymentReadyFines();
      setPaymentReadyFines(paymentReadyData || []);
    } catch (err) {
      console.error('Failed to fetch partner data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPartnerData();
    setRefreshing(false);
  };

  const handleDownloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      fines,
      period: filterPeriod
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2)));
    element.setAttribute('download', `driveLegal_report_${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) return <div className="text-center p-8">Loading partner portal...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorityHeader
        authority="drivelegal"
        title="DriveLegal Partner Portal"
        description="📊 Fine Management & Revenue Analytics (Read-Only)"
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">⚠️ {error}</p>
          </div>
        )}

        {/* Header with Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Fine Analytics Dashboard</h2>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={18} />
              Download Report
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              <RotateCcw size={18} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Fines in System',
              value: metrics.totalFinesInSystem,
              icon: BarChart3,
              color: 'bg-blue-500'
            },
            {
              label: 'Total Revenue Collected',
              value: `₹${(metrics.revenue || 0).toLocaleString('en-IN')}`,
              icon: DollarSign,
              color: 'bg-green-500'
            },
            {
              label: 'Collection Rate',
              value: `${metrics.collectionRate || 0}%`,
              icon: TrendingUp,
              color: 'bg-purple-500'
            },
            {
              label: 'Payment Ready',
              value: paymentReadyFines.length,
              icon: CheckCircle,
              color: 'bg-orange-500'
            }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className={`${metric.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <metric.icon size={24} />
              </div>
              <p className="text-gray-600 text-sm">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fine Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="dispute">Dispute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time Period</label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment-Ready Fines */}
        {paymentReadyFines.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-blue-800">
                {paymentReadyFines.length} Fines Ready for Payment Collection
              </h3>
            </div>
            <p className="text-blue-700 text-sm">
              These fines are pending payment and can be collected through our portal integration.
            </p>
          </div>
        )}

        {/* Top Violations */}
        {metrics.topViolations && metrics.topViolations.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Violation Types</h3>
            <div className="space-y-3">
              {metrics.topViolations.map((violation: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-700">{violation._id || `Violation ${idx + 1}`}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((violation.count / 50) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <span className="font-bold text-gray-800 min-w-12">{violation.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fines List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Fine Details</h3>
          <div className="overflow-x-auto">
            {fines.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Vehicle</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Violation</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {fines.map((fine: any, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-blue-600">{fine.vehicleNumber}</td>
                      <td className="px-4 py-3">{fine.violationType}</td>
                      <td className="px-4 py-3">{fine.location}</td>
                      <td className="px-4 py-3 font-semibold">₹{fine.fineAmount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            fine.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : fine.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(fine.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No fines found for selected criteria</p>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> This is a read-only partner portal. DriveLegal partners can view fine data and
            analytics. For payment processing and dispute management, please contact the respective authorities directly.
          </p>
        </div>
      </div>
    </div>
  );
}
