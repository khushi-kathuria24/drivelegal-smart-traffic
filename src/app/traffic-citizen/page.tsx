'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Radio, ExternalLink, Terminal, AlertCircle, RefreshCw, Users, ShieldAlert, BadgeInfo } from 'lucide-react'
import { Card, CardContent } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'

export default function TrafficCitizenPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Verify if the local Vite dev server is running on port 3001
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:3001/', { mode: 'no-cors' })
        setIframeError(false)
      } catch (err) {
        setIframeError(true)
      }
    }
    checkServer()
  }, [retryCount])

  const handleRetry = () => {
    setIframeLoaded(false)
    setRetryCount(prev => prev + 1)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
      {/* Premium Hero / Header */}
      <motion.div
        className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-8 text-white shadow-2xl relative"
        variants={itemVariants}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest">
                Citizen Portal
              </span>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                CIVIC ENGAGEMENT GATEWAY
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Citizen Traffic <span className="text-emerald-400">Services Hub</span>
            </h1>
            <p className="mt-2 text-slate-300 max-w-xl text-sm leading-relaxed">
              Provides citizens the ability to view real-time traffic maps, check parking spot availability, book slots natively, and file reports for road blockages or encroachments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 rounded-xl py-3 px-5 shadow-lg"
              onClick={() => window.open('http://localhost:3001/citizen', '_blank')}
            >
              Open in New Tab
              <ExternalLink size={16} />
            </Button>
            <Button
              variant="secondary"
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl p-3"
              onClick={handleRetry}
            >
              <RefreshCw size={18} className={!iframeLoaded && !iframeError ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Container */}
      <motion.div variants={itemVariants}>
        {iframeError ? (
          <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-dark-900 overflow-hidden rounded-2xl shadow-lg">
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Terminal size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Smart Traffic Servers Offline</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                The embedded Smart Traffic dashboard (port 3001) could not be reached. 
                Start the backend Express server, ML inference service, and Vite frontend using the terminal commands below.
              </p>

              {/* Startup Instructions Terminal */}
              <div className="mt-8 w-full max-w-2xl bg-slate-900 text-slate-200 font-mono text-xs text-left p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
                <div className="flex items-center gap-1.5 mb-4 border-b border-slate-800 pb-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] text-slate-500 ml-2 uppercase font-black tracking-wider">Startup Commands</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-emerald-400 font-bold"># Option 1: Start everything automatically (Monorepo dev command)</p>
                    <code className="block bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-white mt-1 cursor-pointer select-all">
                      npm run dev:all
                    </code>
                  </div>
                  <div>
                    <p className="text-emerald-400 font-bold"># Option 2: Start traffic backend & frontend in parallel</p>
                    <code className="block bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-white mt-1 cursor-pointer select-all">
                      npm run dev:traffic-all
                    </code>
                  </div>
                  <div>
                    <p className="text-emerald-400 font-bold"># Option 3: Start individual services manually</p>
                    <div className="mt-2 space-y-1 pl-2 text-slate-400">
                      <p>• Node Backend: <code className="text-white">npm run dev:traffic-backend</code> (runs on port 5001)</p>
                      <p>• Vite Frontend: <code className="text-white">npm run dev:traffic-frontend</code> (runs on port 3001)</p>
                      <p>• Python ML API: <code className="text-white">python ml_backend_api.py</code> (runs on port 8000)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-6 py-3"
                  onClick={handleRetry}
                >
                  Check Connection Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-900 z-10 p-10">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 animate-pulse" size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white">Connecting to Citizen Portal</h4>
                <p className="text-sm text-slate-500 mt-1">Establishing link with localhost:3001...</p>
              </div>
            )}
            <iframe
              src="http://localhost:3001/citizen"
              className="w-full h-[calc(100vh-220px)] border-none bg-white"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
