'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X, Home, BarChart3, AlertCircle } from 'lucide-react';

export default function AuthorityHeader({ authority, title, description }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/authority-login');
  };

  const getAuthorityColor = () => {
    switch (authority) {
      case 'road_authority':
        return 'from-red-600 to-orange-600';
      case 'municipal_corp':
        return 'from-green-600 to-teal-600';
      case 'traffic_police':
        return 'from-blue-600 to-indigo-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getAuthorityNav = () => {
    const nav = {
      road_authority: [
        { name: 'Dashboard', href: '/authority/road-authority', icon: Home },
        { name: 'Issue Challan', href: '/authority/road-authority/issue-challan', icon: FileText },
        { name: 'Violations', href: '/authority/road-authority/violations', icon: AlertCircle }
      ],
      municipal_corp: [
        { name: 'Dashboard', href: '/authority/municipal-corp', icon: Home },
        { name: 'Traffic Monitor', href: '/authority/municipal-corp/traffic-monitor', icon: BarChart3 },
        { name: 'Zone Management', href: '/authority/municipal-corp/zones', icon: MapPin }
      ],
      traffic_police: [
        { name: 'Dashboard', href: '/authority/traffic-police', icon: Home },
        { name: 'Emergency', href: '/authority/traffic-police/emergency', icon: AlertTriangle },
        { name: 'Patrols', href: '/authority/traffic-police/patrols', icon: Users }
      ]
    };
    return nav[authority] || nav.road_authority;
  };

  return (
    <div className={`bg-gradient-to-r ${getAuthorityColor()} text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="opacity-90 mt-2">{description}</p>
            {userData && (
              <p className="text-sm opacity-75 mt-2">
                👤 {userData.name} | Badge: {userData.badgeNumber} | {userData.department}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {userData && <p className="text-sm opacity-75">👤 {userData.name}</p>}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className={`bg-black/10 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {getAuthorityNav().map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition"
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </a>
            ))}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="md:hidden flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout? You will need to login again to access this portal.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FileText = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const MapPin = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const AlertTriangle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const Users = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
