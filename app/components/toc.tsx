'use client'

import { useEffect, useRef, useState } from 'react'

export function TableOfContents({
  items,
}: {
  items: { id: string; text: string }[]
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const [isMinimized, setIsMinimized] = useState(true)
  const tocListRef = useRef<HTMLUListElement | null>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    if (!items.length) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading))

    if (!headings.length) return

    const updateActiveHeading = () => {
      const nearBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8

      if (nearBottom) {
        setActiveId(headings[headings.length - 1].id)
        return
      }

      let current = headings[0].id

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 140) {
          current = heading.id
        } else {
          break
        }
      }

      setActiveId(current)
    }

    updateActiveHeading()

    window.addEventListener('scroll', updateActiveHeading, { passive: true })
    window.addEventListener('resize', updateActiveHeading)

    return () => {
      window.removeEventListener('scroll', updateActiveHeading)
      window.removeEventListener('resize', updateActiveHeading)
    }
  }, [items])

  useEffect(() => {
    if (!activeId) return

    const activeLink = linkRefs.current[activeId]
    const list = tocListRef.current

    if (!activeLink || !list) return

    const linkTop = activeLink.offsetTop
    const linkBottom = linkTop + activeLink.offsetHeight
    const viewTop = list.scrollTop
    const viewBottom = viewTop + list.clientHeight

    if (linkTop < viewTop || linkBottom > viewBottom) {
      activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeId])

  if (!items?.length) return null

  return (
    <aside className={`fixed right-0 top-24 z-30 transition-transform duration-300 ease-out lg:static lg:sticky lg:top-16 lg:translate-x-0 ${
      isMinimized ? 'translate-x-[calc(100%-2.5rem)]' : 'translate-x-0'
    }`}>
      <div className={`surface-card rounded-l-2xl border-l border-y px-4 py-4 shadow-sm w-56 max-w-[45vw] lg:border lg:border-l lg:rounded-2xl lg:overflow-visible ${
        isMinimized ? '' : ''
      }`}>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -left-10 top-4 lg:hidden w-10 h-10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-lg transition-colors"
          title={isMinimized ? 'Show' : 'Hide'}
        >
          <svg className={`w-5 h-5 transition-transform ${isMinimized ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={isMinimized ? 'hidden lg:block' : 'block'}>
          <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-[0.16em]">
            On this page
          </p>

          <nav aria-label="Table of contents">
            <ul
              ref={tocListRef}
              className="space-y-2 text-xs leading-relaxed max-h-[calc(100vh-8rem)] overflow-auto pr-1"
            >
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    ref={(el) => {
                      linkRefs.current[item.id] = el
                    }}
                    href={`#${item.id}`}
                    onClick={() => setActiveId(item.id)}
                    className={`toc-link text-muted transition-colors hover:text-teal-700 ${
                      activeId === item.id ? 'toc-link-active text-strong' : ''
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  )
}
