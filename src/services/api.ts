// Unified API Service for all authority endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

let authTokens: AuthTokens | null = null;

// Initialize tokens from localStorage (client-side only)
export function initializeAuth() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      authTokens = JSON.parse(stored);
    }
  }
}

// Store tokens
export function setAuthTokens(tokens: AuthTokens) {
  authTokens = tokens;
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }
}

// Get authorization header
function getAuthHeader() {
  if (!authTokens?.accessToken) {
    initializeAuth();
  }
  return authTokens?.accessToken
    ? { Authorization: `Bearer ${authTokens.accessToken}` }
    : {};
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('user');
        window.location.href = '/authority-login';
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============= AUTH SERVICES =============
export const authService = {
  login: (email: string, password: string, authority?: string) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, authority }),
    }),

  logout: () => {
    setAuthTokens({ accessToken: '' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },
};

// ============= ROAD AUTHORITY SERVICES =============
export const roadAuthorityService = {
  // Get all challans issued by this authority
  getChallans: (filters?: { status?: string; vehicleNumber?: string; page?: number }) =>
    apiCall(`/api/authority/road/challans?${new URLSearchParams(filters as any)}`, {
      method: 'GET',
    }),

  // Get challan statistics
  getStatistics: () =>
    apiCall('/api/authority/road/statistics', { method: 'GET' }),

  // Issue a new challan
  issueChallan: (data: {
    vehicleNumber: string;
    violationType: string;
    fineAmount: number;
    location: string;
    photoUrl?: string;
    description?: string;
  }) =>
    apiCall('/api/authority/road/challan/issue', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get violation details
  getViolations: (filters?: { status?: string; page?: number }) =>
    apiCall(`/api/authority/road/violations?${new URLSearchParams(filters as any)}`, {
      method: 'GET',
    }),

  // Generate reports
  getReports: (dateRange?: { startDate: string; endDate: string }) =>
    apiCall(`/api/authority/road/reports?${new URLSearchParams(dateRange as any)}`, {
      method: 'GET',
    }),
};

// ============= MUNICIPAL CORPORATION SERVICES =============
export const municipalCorpService = {
  // Get traffic monitoring data
  getTrafficMetrics: (zoneId?: string) =>
    apiCall(`/api/authority/municipal/traffic-metrics${zoneId ? `?zoneId=${zoneId}` : ''}`, {
      method: 'GET',
    }),

  // Get zone data
  getZones: () =>
    apiCall('/api/authority/municipal/zones', { method: 'GET' }),

  // Get signal status
  getSignalStatus: () =>
    apiCall('/api/authority/municipal/signals', { method: 'GET' }),

  // Update signal timing
  updateSignalTiming: (signalId: string, greenTime: number, redTime: number) =>
    apiCall('/api/authority/municipal/signals/update', {
      method: 'POST',
      body: JSON.stringify({ signalId, greenTime, redTime }),
    }),

  // Get analytics
  getAnalytics: (metric?: 'peak_hours' | 'congestion' | 'efficiency') =>
    apiCall(`/api/authority/municipal/analytics${metric ? `?metric=${metric}` : ''}`, {
      method: 'GET',
    }),

  // Get zone-specific coordinator metrics (L2 agent)
  getZoneCoordinatorMetrics: (zoneId: string) =>
    apiCall(`/api/agents/zones/${zoneId}/coordinator/metrics`, {
      method: 'GET',
    }),
};

// ============= TRAFFIC POLICE SERVICES =============
export const trafficPoliceService = {
  // Get emergency incidents
  getIncidents: (filters?: { status?: string; type?: string; page?: number }) =>
    apiCall(`/api/authority/police/incidents?${new URLSearchParams(filters as any)}`, {
      method: 'GET',
    }),

  // Get emergency vehicle status
  getEmergencyVehicles: () =>
    apiCall('/api/authority/police/emergency-vehicles', { method: 'GET' }),

  // Dispatch emergency vehicle
  dispatchEmergency: (data: { type: 'ambulance' | 'fire' | 'police'; location: string }) =>
    apiCall('/api/authority/police/emergency/dispatch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get active patrols
  getPatrols: () =>
    apiCall('/api/authority/police/patrols', { method: 'GET' }),

  // Update patrol status
  updatePatrolStatus: (patrolId: string, status: string, location: string) =>
    apiCall('/api/authority/police/patrol/update', {
      method: 'POST',
      body: JSON.stringify({ patrolId, status, location }),
    }),

  // Get enforcement reports
  getEnforcementReports: () =>
    apiCall('/api/authority/police/enforcement-reports', { method: 'GET' }),
};

// ============= DRIVELEGAL PARTNER SERVICES =============
export const driveLegalService = {
  // Get fine summary (read-only, limited data)
  getFineSummary: (filters?: { status?: string; period?: 'today' | 'week' | 'month' }) =>
    apiCall(`/api/partner/driveLegal/fines?${new URLSearchParams(filters as any)}`, {
      method: 'GET',
    }),

  // Get partner dashboard metrics
  getMetrics: () =>
    apiCall('/api/partner/driveLegal/metrics', { method: 'GET' }),

  // Get payment-ready fines
  getPaymentReadyFines: () =>
    apiCall('/api/partner/driveLegal/fines/payment-ready', { method: 'GET' }),
};

// ============= AGENT SERVICES =============
export const agentService = {
  // Initialize city governor (L3)
  initializeCityGovernor: () =>
    apiCall('/api/agents/initialize-city-governor', { method: 'POST' }),

  // Create junction agent (L1)
  createJunctionAgent: (junctionId: string) =>
    apiCall(`/api/agents/junctions/${junctionId}/agent`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  // Get junction agent status
  getJunctionAgentStatus: (junctionId: string) =>
    apiCall(`/api/agents/junctions/${junctionId}/agent/status`, { method: 'GET' }),

  // Create zone coordinator (L2)
  createZoneCoordinator: (zoneId: string) =>
    apiCall(`/api/agents/zones/${zoneId}/coordinator`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  // Get zone coordinator metrics
  getZoneCoordinatorMetrics: (zoneId: string) =>
    apiCall(`/api/agents/zones/${zoneId}/coordinator/metrics`, { method: 'GET' }),

  // Get city governor status
  getCityGovernorStatus: () =>
    apiCall('/api/agents/city-governor/status', { method: 'GET' }),

  // Get city governor analytics
  getCityGovernorAnalytics: () =>
    apiCall('/api/agents/city-governor/analytics', { method: 'GET' }),

  // Get all agents status
  getAllAgentsStatus: () =>
    apiCall('/api/agents/all-agents/status', { method: 'GET' }),

  // Trigger emergency response
  triggerEmergency: (data: { type: string; location: string; priority: 'high' | 'critical' }) =>
    apiCall('/api/agents/city-governor/emergency', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============= CITIZEN SERVICES =============
export const citizenService = {
  // Get my challans
  getMyChallans: () =>
    apiCall('/api/citizen/my-challans', { method: 'GET' }),

  // Pay challan
  payChallan: (challanId: string, amount: number) =>
    apiCall('/api/citizen/challan/pay', {
      method: 'POST',
      body: JSON.stringify({ challanId, amount }),
    }),

  // Dispute challan
  disputeChallan: (challanId: string, reason: string) =>
    apiCall('/api/citizen/challan/dispute', {
      method: 'POST',
      body: JSON.stringify({ challanId, reason }),
    }),

  // Get traffic info
  getTrafficInfo: () =>
    apiCall('/api/citizen/traffic-info', { method: 'GET' }),
};

// Helper to determine which service to use based on role
export function getServiceByRole(role: string) {
  switch (role) {
    case 'road_authority':
      return roadAuthorityService;
    case 'municipal_corp':
      return municipalCorpService;
    case 'traffic_police':
      return trafficPoliceService;
    case 'driveLegal_partner':
      return driveLegalService;
    case 'citizen':
      return citizenService;
    default:
      return null;
  }
}
