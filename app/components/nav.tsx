import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

const navItems = {
  '/': { name: 'Home' },
  '/blog': { name: 'Blog' },
  '/field-notes': { name: 'Field Notes' },
  '/blueprints': { name: 'Blueprints' },
  '/toolbox': { name: 'Toolbox' },
  '/rss.xml': { name: 'RSS' },
}

export function Navbar() {
  return (
    <div className="enter-wash lg:sticky lg:top-6">
      <nav id="nav" className="flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-sm" />
          <span className="text-strong text-sm md:text-base font-semibold tracking-tight">
            n8hk.dev
          </span>
        </Link>

        <div className="nav-pill flex items-center gap-1 rounded-xl border p-1 shadow-sm">
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="nav-pill-link text-muted hover:text-strong rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
            >
              {name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/nathanhitchcock"
            target="_blank"
            rel="noopener noreferrer"
            className="button-contrast hidden md:inline-flex rounded-lg px-3 py-1.5 text-sm font-medium transition"
          >
            Follow Work
          </a>
        </div>
      </nav>
    </div>
  )
}
