import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SSO POC - Organization Login',
  description: 'Single Sign-On Proof of Concept with organization-based authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
