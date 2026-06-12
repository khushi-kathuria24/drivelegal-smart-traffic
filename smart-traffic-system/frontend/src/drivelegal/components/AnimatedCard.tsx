'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  interactive?: boolean
  elevated?: boolean
  animate?: boolean
  delay?: number
}

export function AnimatedCard({
  children,
  interactive = false,
  elevated = false,
  animate = true,
  delay = 0,
  className,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      className={cn(
        'card',
        interactive && 'card-hover',
        elevated && 'shadow-lg',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      whileHover={interactive ? { y: -4 } : {}}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
