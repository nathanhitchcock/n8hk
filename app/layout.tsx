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
    'Exploring the intersection of humans, automation, and AI — building systems that work smarter, not just harder.',
  openGraph: {
    title: 'n8hk.dev — Nathan Hitchcock',
    description:
      'Reflections and writing on the future of work, automation, and the human side of technology.',
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
      suppressHydrationWarning
      className={cx('bg-app text-app-fg', manrope.variable, plexMono.variable)}
    >
      <body className="app-surface antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const key = 'theme-preference'
    const saved = localStorage.getItem(key) || 'system'
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = saved === 'dark' || saved === 'light'
      ? saved
      : (systemDark ? 'dark' : 'light')
    const root = document.documentElement
    root.classList.toggle('theme-dark', theme === 'dark')
    root.classList.toggle('theme-light', theme === 'light')
  } catch (_) {}
})()`,
          }}
        />
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
