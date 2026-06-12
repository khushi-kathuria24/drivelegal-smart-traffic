'use client'
import React, { useEffect, useState } from 'react'

export function ServiceWorkerRegistration() {
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setSupported(true)
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          console.log('Service worker registered', reg)
        })
        .catch((err) => console.warn('SW registration failed', err))
    }
  }, [])

  if (!supported) return null
  return null
}

export default ServiceWorkerRegistration
