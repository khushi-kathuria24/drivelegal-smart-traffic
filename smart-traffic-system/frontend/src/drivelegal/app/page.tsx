'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, AlertCircle, TrendingDown, Users, Shield, AlertTriangle, MapPin, Database, BookCheck, WifiOff, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { AnimatedCard } from '@/components/AnimatedCard'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { dashboardData, currentUser, violations, trafficAlerts } from '@/lib/mockData'
import { formatNumber, formatCurrency, formatDate, getRiskLevel } from '@/lib/utils'

export default function OverviewPage({ onNavigate }: { onNavigate?: (href: string) => void }) {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Premium Hero Section */}
      <motion.div
        className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800 p-8 text-white shadow-2xl"
        variants={itemVariants}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <motion.h1
                className="text-4xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Welcome, {currentUser.name}
              </motion.h1>
              <motion.p
                className="mt-2 text-primary-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Your AI-powered traffic compliance & legal assistant
              </motion.p>
            </div>
            <motion.div
              className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-sm text-primary-100">📍 Current Location</p>
              <p className="font-semibold">{currentUser.location}</p>
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <motion.div
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                label: "Today's Risk Score",
                value: '42%',
                subtitle: 'Low Risk',
                icon: Shield,
                color: 'success',
              },
              {
                label: 'Compliance Score',
                value: `${dashboardData.complianceScore}%`,
                subtitle: 'Good Standing',
                icon: AlertTriangle,
                color: 'primary',
              },
              {
                label: 'Pending Fines',
                value: `₹${formatNumber(dashboardData.totalFines)}`,
                subtitle: `${dashboardData.pendingChallan} violations`,
                icon: MapPin,
                color: 'warning',
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="rounded-xl bg-white/10 p-4 backdrop-blur transition-all duration-300 hover:bg-white/20"
                variants={itemVariants}
                whileHover={{ scale: 1.05, translateY: -5 }}
              >
                <p className="text-sm text-primary-100">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-primary-100">{stat.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Action Cards */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { href: '/laws', icon: '⚖️', label: 'Check Traffic Law' },
            { href: '/calculator', icon: '🧮', label: 'Calculate Challan' },
            { href: '/assistant', icon: '🤖', label: 'AI Legal Chat' },
            { href: '/documents', icon: '📄', label: 'Upload Document' },
            { href: '/geo-zones', icon: '📍', label: 'Safe Routes' },
          ].map((action, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate && onNavigate(action.href)}
              className="cursor-pointer"
            >
              <motion.div
                className="btn-secondary h-auto w-full flex-col gap-2 px-4 py-6 flex items-center justify-center pointer-events-auto"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-3xl">{action.icon}</span>
                <span className="font-semibold">{action.label}</span>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Platform Capabilities */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-2xl font-bold">Platform Capabilities</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnimatedCard interactive elevated>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                <Database size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Offline Functionality</h3>
                <p className="mt-1 text-sm text-dark-600 dark:text-dark-300">
                  Full offline access with cached law data and automatic sync when connectivity is restored.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="primary">Cached laws</Badge>
                  <Badge variant="neutral">Auto-sync</Badge>
                  <Badge variant="success">Offline ready</Badge>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard interactive elevated>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-200">
                <BookCheck size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Legal Accuracy</h3>
                <p className="mt-1 text-sm text-dark-600 dark:text-dark-300">
                  AI-cited responses are tied to Motor Vehicles Act sections and state amendments for traceable answers.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="primary">Section citations</Badge>
                  <Badge variant="warning">State amendments</Badge>
                  <Badge variant="neutral">Traceable responses</Badge>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </motion.div>

      {/* Live Metrics Section */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-2xl font-bold">Live Metrics</h2>
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              label: 'Violations Nearby',
              value: '24',
              subtitle: 'Within 10 km',
              icon: AlertCircle,
              color: 'warning',
            },
            {
              label: 'Active Zones',
              value: '7',
              subtitle: 'Enforcement zones',
              icon: BarChart3,
              color: 'primary',
            },
            {
              label: 'Accident Hotspots',
              value: '3',
              subtitle: 'High risk areas',
              icon: AlertCircle,
              color: 'danger',
            },
            {
              label: 'Community Score',
              value: '78%',
              subtitle: 'Above average',
              icon: Users,
              color: 'success',
            },
          ].map((metric, idx) => {
            const Icon = metric.icon
            return (
              <AnimatedCard key={idx} interactive elevated delay={idx * 0.1}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-dark-600 dark:text-dark-400">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold">{metric.value}</p>
                    <p className={`mt-1 text-xs text-${metric.color}-600`}>{metric.subtitle}</p>
                  </div>
                  <Icon className={`text-${metric.color}-600`} size={28} />
                </div>
              </AnimatedCard>
            )
          })}
        </motion.div>
      </motion.div>

      {/* AI Insights Section */}
      <motion.div variants={itemVariants}>
        <AnimatedCard elevated>
          <CardHeader title="AI-Powered Insights" subtitle="Personalized recommendations based on your driving pattern" />
          <CardContent>
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              {dashboardData.aiInsights.map((insight, idx) => (
                <motion.div
                  key={insight.id}
                  className="rounded-lg border border-dark-200 bg-gradient-to-r from-dark-50 to-dark-50/50 p-4 transition-all duration-300 hover:shadow-md dark:border-dark-700 dark:from-dark-700/50 dark:to-dark-700/20"
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge
                          variant={
                            insight.type === 'warning'
                              ? 'warning'
                              : insight.type === 'recommendation'
                              ? 'primary'
                              : 'neutral'
                          }
                        >
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-dark-600 dark:text-dark-400">
                        {insight.description}
                      </p>
                      {insight.actionItems && insight.actionItems.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {insight.actionItems.map((item, i) => (
                            <Button key={i} size="sm" variant="secondary">
                              {item}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xs text-dark-600 dark:text-dark-400">Confidence</p>
                      <motion.p
                        className="text-lg font-bold text-primary-600"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        {Math.round(insight.confidence * 100)}%
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </AnimatedCard>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Violations */}
          <AnimatedCard interactive elevated delay={0}>
            <CardHeader
              title="Recent Violations"
              subtitle="Your traffic history"
            />
            <CardContent>
              <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                {violations.slice(0, 4).map((v, idx) => {
                  const risk = getRiskLevel(v.severity === 'critical' ? 90 : v.severity === 'high' ? 70 : v.severity === 'medium' ? 50 : 20)
                  return (
                    <motion.div
                      key={v.id}
                      className="flex items-start justify-between border-b border-dark-200 pb-3 transition-all duration-200 dark:border-dark-700 last:border-0 hover:pl-2"
                      variants={itemVariants}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    >
                      <div>
                        <p className="font-medium">{v.type}</p>
                        <p className="text-xs text-dark-600 dark:text-dark-400">
                          {v.location} • {formatDate(v.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={risk.color as any}>{risk.label}</Badge>
                        <p className="mt-1 font-semibold text-danger-600">
                          ₹{formatNumber(v.fineAmount)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </CardContent>
          </AnimatedCard>

          {/* Traffic Alerts */}
          <AnimatedCard interactive elevated delay={0.1}>
            <CardHeader
              title="Active Traffic Alerts"
              subtitle="Live alerts in your area"
            />
            <CardContent>
              <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                {trafficAlerts.slice(0, 4).map((alert, idx) => (
                  <motion.div
                    key={alert.id}
                    className="rounded-lg bg-dark-50 p-3 transition-all duration-200 dark:bg-dark-700 hover:shadow-md"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {alert.type === 'enforcement'
                              ? '🚨'
                              : alert.type === 'accident'
                              ? '⚠️'
                              : alert.type === 'congestion'
                              ? '🚗'
                              : alert.type === 'roadwork'
                              ? '🚧'
                              : '☔'}
                          </span>
                          <h4 className="font-medium capitalize">{alert.type}</h4>
                        </div>
                        <p className="mt-1 text-sm text-dark-600 dark:text-dark-400">
                          {alert.message}
                        </p>
                        <p className="mt-1 text-xs text-dark-500">{alert.location}</p>
                      </div>
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'danger'
                            : alert.severity === 'high'
                            ? 'warning'
                            : 'primary'
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </AnimatedCard>
        </div>
      </motion.div>
    </motion.div>
  )
}
