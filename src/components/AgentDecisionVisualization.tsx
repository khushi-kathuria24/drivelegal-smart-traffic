'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap, GitBranch } from 'lucide-react';

/**
 * Agent Decision Visualization Component
 * Shows real-time agent decisions, coordination, and impact metrics
 */
export default function AgentDecisionVisualization() {
  const [decisions, setDecisions] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('L3-GOVERNOR');
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Fetch agent decisions and metrics
    const interval = setInterval(fetchAgentData, 5000);
    fetchAgentData();
    return () => clearInterval(interval);
  }, [selectedAgent]);

  const fetchAgentData = async () => {
    try {
      // Simulate real-time agent decisions
      const mockDecisions = generateMockDecisions();
      setDecisions(mockDecisions);
      setMetrics(generateMockMetrics());
    } catch (error) {
      console.error('Error fetching agent data:', error);
    }
  };

  const generateMockDecisions = () => [
    {
      id: 1,
      agent: 'L3-GOVERNOR',
      level: 'L3',
      action: 'Coordinated city-wide signal optimization',
      timestamp: new Date(Date.now() - 2000),
      impact: { congestionReduction: -8, timesSaved: 120, efficiency: +5 },
      status: 'active'
    },
    {
      id: 2,
      agent: 'L2-TEXTILE-CORRIDOR',
      level: 'L2',
      action: 'Increased green time for north-bound traffic',
      timestamp: new Date(Date.now() - 25000),
      impact: { congestionReduction: -12, timesSaved: 450, efficiency: +8 },
      status: 'completed'
    },
    {
      id: 3,
      agent: 'L1-ZILLAH-ROAD',
      level: 'L1',
      action: 'Applied Webster algorithm - optimal phase timing',
      timestamp: new Date(Date.now() - 120000),
      impact: { congestionReduction: -15, timesSaved: 280, efficiency: +12 },
      status: 'completed'
    },
    {
      id: 4,
      agent: 'L2-RAILWAY-HUB',
      level: 'L2',
      action: 'Activated emergency route diversion',
      timestamp: new Date(Date.now() - 300000),
      impact: { congestionReduction: -20, timesSaved: 600, efficiency: +15 },
      status: 'completed'
    }
  ];

  const generateMockMetrics = () => ({
    currentDecisions: 12,
    averageImpact: 8.75,
    systemEfficiency: 87,
    agentsActive: 11,
    agentCoordination: 92,
    L1Performance: { active: 5, effective: 5, efficiency: 88 },
    L2Performance: { active: 5, effective: 4, efficiency: 86 },
    L3Performance: { active: 1, effective: 1, efficiency: 91 }
  });

  const formatTime = (date) => {
    const diff = Date.now() - date;
    if (diff < 60000) return `${Math.round(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
    return `${Math.round(diff / 3600000)}h ago`;
  };

  const getAgentColor = (level) => {
    switch (level) {
      case 'L1': return 'from-blue-500 to-blue-600';
      case 'L2': return 'from-purple-500 to-purple-600';
      case 'L3': return 'from-emerald-500 to-emerald-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'border-amber-500 bg-amber-500/10';
      case 'completed': return 'border-emerald-500 bg-emerald-500/10';
      case 'error': return 'border-red-500 bg-red-500/10';
      default: return 'border-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Brain className="text-purple-400" size={32} />
          AI Agent Decision Center
        </h1>
        <p className="text-slate-300">Real-time monitoring of all 11 agents and their optimization decisions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Agent Performance Overview */}
        <div className="lg:col-span-1 p-6 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">Agent Status</h2>
          
          <div className="space-y-4">
            {/* L1 Agents */}
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg hover:border-blue-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-200">L1 Junction Agents</span>
                <span className="text-2xl font-bold text-blue-400">{metrics?.L1Performance.active}/{metrics?.L1Performance.active}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-blue-900/50 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${metrics?.L1Performance.efficiency}%` }} />
                </div>
                <span className="text-xs text-blue-300">{metrics?.L1Performance.efficiency}%</span>
              </div>
              <p className="text-xs text-blue-300">5 junctions optimized</p>
            </div>

            {/* L2 Agents */}
            <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-purple-200">L2 Zone Coordinators</span>
                <span className="text-2xl font-bold text-purple-400">{metrics?.L2Performance.active}/{metrics?.L2Performance.active}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-purple-900/50 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${metrics?.L2Performance.efficiency}%` }} />
                </div>
                <span className="text-xs text-purple-300">{metrics?.L2Performance.efficiency}%</span>
              </div>
              <p className="text-xs text-purple-300">5 zones coordinated</p>
            </div>

            {/* L3 Agent */}
            <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg hover:border-emerald-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-emerald-200">L3 City Governor</span>
                <span className="text-2xl font-bold text-emerald-400">{metrics?.L3Performance.active}/{metrics?.L3Performance.active}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-emerald-900/50 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${metrics?.L3Performance.efficiency}%` }} />
                </div>
                <span className="text-xs text-emerald-300">{metrics?.L3Performance.efficiency}%</span>
              </div>
              <p className="text-xs text-emerald-300">City-wide coordination</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-6 space-y-3 pt-6 border-t border-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">System Efficiency</span>
              <span className="font-bold text-lg text-cyan-400">{metrics?.systemEfficiency}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">Agent Coordination</span>
              <span className="font-bold text-lg text-purple-400">{metrics?.agentCoordination}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">Decisions/Min</span>
              <span className="font-bold text-lg text-emerald-400">{metrics?.currentDecisions}</span>
            </div>
          </div>
        </div>

        {/* Decision Timeline */}
        <div className="lg:col-span-2 p-6 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">Recent Agent Decisions</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            <AnimatePresence>
              {decisions.map((decision, idx) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 transition-all ${getStatusColor(decision.status)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getAgentColor(decision.level)}`}>
                        {decision.level}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{decision.agent}</p>
                        <p className="text-xs text-slate-400">{decision.action}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {decision.status === 'active' && (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                          <Zap className="text-amber-400" size={18} />
                        </motion.div>
                      )}
                      {decision.status === 'completed' && <CheckCircle className="text-emerald-400" size={18} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-900/50 p-2 rounded">
                      <p className="text-slate-400">Congestion</p>
                      <p className="font-bold text-red-400">{decision.impact.congestionReduction}%</p>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                      <p className="text-slate-400">Time Saved</p>
                      <p className="font-bold text-emerald-400">{decision.impact.timesSaved}s</p>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                      <p className="text-slate-400">Efficiency</p>
                      <p className="font-bold text-blue-400">+{decision.impact.efficiency}%</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">{formatTime(decision.timestamp)}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Agent Coordination Network */}
      <div className="p-6 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <GitBranch className="text-cyan-400" size={20} />
          Multi-Level Agent Coordination
        </h2>

        <div className="relative h-96 bg-slate-900/30 rounded-lg overflow-hidden border border-slate-700 p-6">
          {/* L3 - City Governor */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 text-center min-w-max"
            >
              🏛️ L3: City Governor
            </motion.div>
          </div>

          {/* Connection Line */}
          <div className="absolute left-1/2 top-20 bottom-1/2 w-1 bg-gradient-to-b from-emerald-500 to-purple-500 transform -translate-x-1/2" />

          {/* L2 - Zone Coordinators */}
          <div className="flex justify-around mb-8 px-4">
            {Array(5).fill(0).map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 text-center"
              >
                L2-Zone{i + 1}
              </motion.div>
            ))}
          </div>

          {/* Connection Lines */}
          <div className="absolute left-1/2 top-1/2 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 transform -translate-x-1/2" />

          {/* L1 - Junction Agents */}
          <div className="grid grid-cols-5 gap-2 px-4">
            {Array(5).fill(0).map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 text-center"
              >
                L1-J{i + 1}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300">L3 - City Governor (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-slate-300">L2 - Zone Coordinators (5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-300">L1 - Junction Agents (5)</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 rounded-lg backdrop-blur-md bg-slate-800/40 border border-slate-700/50 text-center">
        <p className="text-slate-300 text-sm">
          All agents operating in <span className="font-semibold text-cyan-400">real-time synchronization</span> | 
          Average decision latency: <span className="font-semibold text-emerald-400">120ms</span> | 
          System uptime: <span className="font-semibold text-purple-400">99.7%</span>
        </p>
      </div>
    </div>
  );
}
