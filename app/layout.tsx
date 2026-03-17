import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jobulary 360',
  description: 'Enterprise 360° Assessment Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}