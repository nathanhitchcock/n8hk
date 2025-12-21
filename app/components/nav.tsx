import Link from 'next/link'

const navItems = {
  '/': { name: 'home' },
}

export function Navbar() {
  return (
    <div className="lg:sticky lg:top-20">
      <nav
        id="nav"
        className="flex flex-row items-start relative px-0 pb-0 md:overflow-auto md:relative"
      >
        <div className="flex flex-row space-x-0 pr-10 pl-1">
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors flex align-middle relative py-1 px-2 m-1"
            >
              {name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
