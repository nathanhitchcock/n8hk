export function TableOfContents({
  items,
}: {
  items: { id: string; text: string }[]
}) {
  if (!items?.length) return null

  return (
    <aside className="hidden lg:block lg:col-span-3 lg:pl-8">
      <div className="sticky top-24">
        <p className="text-xs font-medium tracking-wide text-neutral-600 dark:text-neutral-400 uppercase mb-3">
          On this page
        </p>

        <nav aria-label="Table of contents">
          <ul className="space-y-1 text-[0.75rem] leading-relaxed">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
