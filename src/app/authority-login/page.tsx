'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, Mail, Briefcase, BadgeCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AuthorityLogin() {
  const [loginType, setLoginType] = useState('citizen');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    authority: '',
    department: '',
    badgeNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const authorities = [
    {
      id: 'citizen',
      name: '👤 Citizen',
      description: 'Regular user access to traffic reports and payments',
      features: ['View traffic status', 'Pay challans', 'Report violations', 'Get traffic updates']
    },
    {
      id: 'road_authority',
      name: '🛣️ Road Authority',
      description: 'Manage challans and traffic violations',
      color: 'from-red-600 to-orange-600',
      features: ['Issue challans', 'Manage violations', 'Track payments', 'Generate reports']
    },
    {
      id: 'municipal_corp',
      name: '🏢 Municipal Corporation',
      description: 'Real-time traffic monitoring and signal optimization',
      color: 'from-green-600 to-teal-600',
      features: ['Traffic monitoring', 'Signal optimization', 'Zone management', 'Analytics dashboard']
    },
    {
      id: 'traffic_police',
      name: '👮 Traffic Police',
      description: 'Emergency response and enforcement coordination',
      color: 'from-blue-600 to-indigo-600',
      features: ['Emergency dispatch', 'Patrol coordination', 'Incident response', 'Real-time updates']
    },
    {
      id: 'drivelegal',
      name: '📊 DriveLegal Partner',
      description: 'Fine management and revenue analytics (read-only)',
      color: 'from-purple-600 to-pink-600',
      features: ['View fine analytics', 'Revenue tracking', 'Collection reports', 'Download data']
    }
  ];

  const testCredentials = {
    citizen: { email: 'citizen@example.com', password: 'password123' },
    road_authority: { email: 'road@solapur.gov', password: 'password123' },
    municipal_corp: { email: 'municipal@solapur.gov', password: 'password123' },
    traffic_police: { email: 'police@solapur.gov', password: 'password123' },
    drivelegal: { email: 'driveLegal@example.com', password: 'password123' }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        ...(loginType !== 'citizen' && {
          authority: loginType,
          department: formData.department,
          badgeNumber: formData.badgeNumber
        })
      };

      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      const rolePaths = {
        road_authority: '/authority/road-authority',
        municipal_corp: '/authority/municipal-corp',
        traffic_police: '/authority/traffic-police',
        driveLegal_partner: '/authority/driveLegal',
        driveLegal: '/authority/driveLegal',
        citizen: '/dashboard',
        admin: '/admin'
      };

      const redirectPath = rolePaths[data.user.role] || '/dashboard';
      router.push(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const currentAuthority = authorities.find(a => a.id === loginType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🚦 DriveLegal Smart Traffic</h1>
          <p className="text-xl text-blue-200">Multi-Authority Portal • AI-Powered Traffic Management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Authority Selection */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {authorities.map(auth => (
                <button
                  key={auth.id}
                  onClick={() => {
                    setLoginType(auth.id);
                    setError('');
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    loginType === auth.id
                      ? `${auth.color || 'from-blue-600 to-blue-700'} bg-gradient-to-r text-white shadow-lg transform scale-105`
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{auth.name}</p>
                      <p className={`text-sm ${loginType === auth.id ? 'text-opacity-90' : 'text-gray-300'}`}>
                        {auth.description.split(' ').slice(0, 3).join(' ')}
                      </p>
                    </div>
                    {loginType === auth.id && <ArrowRight size={20} />}
                  </div>
                </button>
              ))}
            </div>

            {/* Features List */}
            {currentAuthority && (
              <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur">
                <h3 className="text-white font-bold mb-3">Portal Features:</h3>
                <ul className="space-y-2">
                  {currentAuthority.features.map((feature, idx) => (
                    <li key={idx} className="text-blue-200 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Login Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentAuthority?.name} Login
              </h2>
              <p className="text-gray-600 mb-6">{currentAuthority?.description}</p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-700 rounded flex items-center gap-2">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {loginType !== 'citizen' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Briefcase size={16} className="inline mr-2" />
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g., Traffic & Transport"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <BadgeCheck size={16} className="inline mr-2" />
                        Badge Number
                      </label>
                      <input
                        type="text"
                        name="badgeNumber"
                        value={formData.badgeNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., RA-001"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                    currentAuthority?.color
                      ? `bg-gradient-to-r ${currentAuthority.color}`
                      : 'bg-gradient-to-r from-blue-600 to-blue-700'
                  } hover:shadow-lg disabled:opacity-50`}
                >
                  {loading ? 'Logging in...' : 'Login to Portal'}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-3">📋 Demo Credentials:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Email:</strong> {testCredentials[loginType].email}</p>
                  <p><strong>Password:</strong> {testCredentials[loginType].password}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: '🔐', title: 'Secure Access', desc: 'JWT-based authentication with role-based access control' },
            { icon: '🎯', title: 'Role-Specific', desc: 'Each authority has customized dashboards and features' },
            { icon: '⚡', title: 'Real-time', desc: 'Live updates and AI-powered recommendations for all roles' }
          ].map((box, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-lg p-6 text-center text-white">
              <p className="text-4xl mb-2">{box.icon}</p>
              <h3 className="font-bold mb-2">{box.title}</h3>
              <p className="text-blue-100 text-sm">{box.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
