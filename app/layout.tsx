import './global.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { Container } from 'app/components/container'

/* Fonts */
const inter = Inter({
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
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        inter.variable,
        plexMono.variable
      )}
    >
      <body className="antialiased mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col">
          {/* Nav (always wide) */}
          <Container size="wide" className="w-full">
            <div className="border-b border-neutral-200/80 dark:border-neutral-700/70 pb-4 mb-8">
              <Navbar />
            </div>
          </Container>

          {/* Page content (each page decides narrow/wide) */}
          {children}

          {/* Footer (always wide) */}
          <Container size="wide" className="w-full">
            <div className="mt-12">
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
