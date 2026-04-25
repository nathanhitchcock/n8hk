import './global.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Manrope, IBM_Plex_Mono } from 'next/font/google'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { Container } from 'app/components/container'

/* Fonts */
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Nathan Hitchcock',
    template: '%s | n8hk.dev',
  },
  description:
    '20 years growing teams, scaling service organizations, and solving the operational problems that show up when ambition outpaces infrastructure.',
  openGraph: {
    title: 'n8hk.dev — Nathan Hitchcock',
    description:
      'Writing about operations, leadership, and the systems thinking that separates teams that scale from teams that stall.',
    url: baseUrl,
    siteName: 'n8hk.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    types: {
      'application/rss+xml': `${baseUrl}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cx('bg-app text-app-fg theme-dark', manrope.variable, plexMono.variable)}
    >
      <body className="app-surface antialiased">
        <main className="flex-auto min-w-0 pt-6 pb-12 flex flex-col">
          <Container size="wide" className="w-full">
            <div className="glass-panel border-b pb-4 mb-10 px-3 md:px-5 rounded-2xl">
              <Navbar />
            </div>
          </Container>

          {children}

          <Container size="wide" className="w-full">
            <div className="mt-16 glass-panel rounded-2xl px-4 md:px-6 py-2">
              <Footer />
            </div>
          </Container>

          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
