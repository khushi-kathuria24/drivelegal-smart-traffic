/**
 * API Client for backend communication
 * Supports both mock data and real API endpoints
 */

const API_BASE_URL = '/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export const apiClient = {
  /**
   * Dashboard endpoints
   */
  dashboard: {
    getSummary: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        return response.json()
      } catch (_error) {
        console.error('Dashboard API error:', _error)
        throw _error
      }
    },
  },

  /**
   * Violations endpoints
   */
  violations: {
    list: async (filters?: { status?: string; severity?: string }): Promise<ApiResponse<any>> => {
      try {
        const params = new URLSearchParams()
        if (filters?.status) params.append('status', filters.status)
        if (filters?.severity) params.append('severity', filters.severity)

        const queryString = params.toString()
        const url = `${API_BASE_URL}/violations${queryString ? `?${queryString}` : ''}`

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        return response.json()
      } catch (_error) {
        console.error('Violations API error:', _error)
        throw _error
      }
    },

    create: async (violation: any): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/violations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(violation),
        })
        return response.json()
      } catch (_error) {
        console.error('Create violation API error:', _error)
        throw _error
      }
    },
  },

  /**
   * Vehicles endpoints
   */
  vehicles: {
    list: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        return response.json()
      } catch (_error) {
        console.error('Vehicles API error:', _error)
        throw _error
      }
    },

    register: async (vehicle: any): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicle),
        })
        return response.json()
      } catch (_error) {
        console.error('Register vehicle API error:', _error)
        throw _error
      }
    },
  },

  /**
   * Alerts endpoints
   */
  alerts: {
    list: async (filters?: { type?: string; state?: string }): Promise<ApiResponse<any>> => {
      try {
        const params = new URLSearchParams()
        if (filters?.type) params.append('type', filters.type)
        if (filters?.state) params.append('state', filters.state)

        const queryString = params.toString()
        const url = `${API_BASE_URL}/alerts${queryString ? `?${queryString}` : ''}`

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        return response.json()
      } catch (_error) {
        console.error('Alerts API error:', _error)
        throw _error
      }
    },
  },

  /**
   * Laws endpoints
   */
  laws: {
    list: async (filters?: { state?: string; violationType?: string }): Promise<ApiResponse<any>> => {
      try {
        const params = new URLSearchParams()
        if (filters?.state) params.append('state', filters.state)
        if (filters?.violationType) params.append('violationType', filters.violationType)

        const queryString = params.toString()
        const url = `${API_BASE_URL}/laws${queryString ? `?${queryString}` : ''}`

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        return response.json()
      } catch (_error) {
        console.error('Laws API error:', _error)
        throw _error
      }
    },
  },
}
