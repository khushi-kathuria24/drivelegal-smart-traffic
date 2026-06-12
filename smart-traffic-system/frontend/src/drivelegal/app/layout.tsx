import type { Metadata } from 'next'
import { AppProvider } from '@/providers/AppProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'DriveLegal - AI-Powered Road Safety Dashboard',
  description: 'Enterprise-grade platform for traffic laws, challans, and road safety',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
