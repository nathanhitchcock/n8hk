import Link from 'next/link'

const navItems = {
  '/writing': { name: 'Writing' },
  '/blueprints': { name: 'Blueprints' },
  '/work': { name: 'Work' },
  '/investments': { name: 'Investing' },
}

export function Navbar() {
  return (
    <div className="enter-wash lg:sticky lg:top-6">
      <nav id="nav" className="flex items-center gap-4 py-3">
        <Link href="/" className="flex items-center">
          <span className="text-strong text-sm md:text-base font-semibold tracking-tight">
            n8hk
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

      </nav>
    </div>
  )
}
