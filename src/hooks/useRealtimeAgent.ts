/**
 * useRealtimeAgent Hook
 * Manages WebSocket connections to real-time agent updates
 * Automatically handles connection, reconnection, and data updates
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface UseRealtimeAgentOptions {
  namespace?: string;
  subscribeToMetrics?: boolean;
  onMetricsUpdate?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseRealtimeAgentReturn {
  isConnected: boolean;
  socket: Socket | null;
  metrics: any;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  emit: (event: string, data: any) => void;
}

export function useRealtimeAgent(options: UseRealtimeAgentOptions = {}): UseRealtimeAgentReturn {
  const {
    namespace = '/dashboards/authority',
    subscribeToMetrics = true,
    onMetricsUpdate,
    onError
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const subscribedChannels = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Create socket connection
    const socket = io(`${SOCKET_URL}${namespace}`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      path: '/socket.io/'
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log(`✅ Connected to ${namespace}`);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Disconnected from ${namespace}`);
      setIsConnected(false);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      if (onError) onError(error);
    });

    // Metrics update listener
    socket.on('city_metrics_update', (data) => {
      setMetrics(data);
      if (onMetricsUpdate) onMetricsUpdate(data);
    });

    socket.on('zone_metrics_update', (data) => {
      setMetrics(data);
      if (onMetricsUpdate) onMetricsUpdate(data);
    });

    socket.on('junction_metrics_update', (data) => {
      setMetrics(data);
      if (onMetricsUpdate) onMetricsUpdate(data);
    });

    socket.on('authority_dashboard_data', (data) => {
      setMetrics(data);
      if (onMetricsUpdate) onMetricsUpdate(data);
    });

    // Subscribe to initial metrics if requested
    if (subscribeToMetrics) {
      socket.emit('subscribe_city_metrics');
    }

    return () => {
      socket.disconnect();
    };
  }, [namespace, subscribeToMetrics, onMetricsUpdate, onError]);

  const subscribe = useCallback((channel: string) => {
    if (socketRef.current && !subscribedChannels.current.has(channel)) {
      subscribedChannels.current.add(channel);
      if (channel.startsWith('zone_')) {
        socketRef.current.emit('subscribe_zone', channel.replace('zone_', ''));
      } else if (channel.startsWith('junction_')) {
        socketRef.current.emit('subscribe_junction', channel.replace('junction_', ''));
      } else if (channel.startsWith('authority_')) {
        socketRef.current.emit('subscribe_authority', channel.replace('authority_', ''));
      }
    }
  }, []);

  const unsubscribe = useCallback((channel: string) => {
    if (socketRef.current && subscribedChannels.current.has(channel)) {
      subscribedChannels.current.delete(channel);
    }
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  }, [isConnected]);

  return {
    isConnected,
    socket: socketRef.current,
    metrics,
    subscribe,
    unsubscribe,
    emit
  };
}

/**
 * useAgentMetrics Hook
 * Simpler hook for just getting real-time metrics
 */
export function useAgentMetrics(onUpdate?: (metrics: any) => void) {
  const { metrics, isConnected, subscribe } = useRealtimeAgent({
    subscribeToMetrics: true,
    onMetricsUpdate: onUpdate
  });

  return { metrics, isConnected };
}

/**
 * useZoneCoordinator Hook
 * For zone-specific real-time updates
 */
export function useZoneCoordinator(zoneId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const socket = io(`${SOCKET_URL}/agents/coordinator`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      path: '/socket.io/'
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe_zone', zoneId);
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('zone_metrics_update', (data) => {
      setMetrics(data);
    });

    return () => socket.disconnect();
  }, [zoneId]);

  return { metrics, isConnected, socket: socketRef.current };
}

/**
 * useJunctionAgent Hook
 * For junction-specific real-time updates
 */
export function useJunctionAgent(junctionId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const socket = io(`${SOCKET_URL}/agents/junction`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      path: '/socket.io/'
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe_junction', junctionId);
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('junction_metrics_update', (data) => {
      setMetrics(data);
    });

    return () => socket.disconnect();
  }, [junctionId]);

  return { metrics, isConnected, socket: socketRef.current };
}

/**
 * useCityGovernor Hook
 * For city-level L3 agent updates
 */
export function useCityGovernor() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    const socket = io(`${SOCKET_URL}/agents/governor`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      path: '/socket.io/'
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe_city_metrics');
      socket.emit('subscribe_emergency');
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('city_metrics', (data) => {
      setMetrics(data);
    });

    socket.on('city_metrics_update', (data) => {
      setMetrics(data.data);
    });

    socket.on('emergency_list', (data) => {
      setEmergencies(data);
    });

    socket.on('emergency_alert', (alert) => {
      setEmergencies(prev => [alert, ...prev].slice(0, 50));
    });

    return () => socket.disconnect();
  }, []);

  return { metrics, emergencies, isConnected, socket: socketRef.current };
}

export default useRealtimeAgent;
