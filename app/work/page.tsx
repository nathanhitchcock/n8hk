import Link from 'next/link'
import { Container } from 'app/components/container'
import { getWorkEntries } from './utils'

export const metadata = {
  title: 'Work',
  description: 'Products, programs, and projects I have built or led — the decisions behind them and what I learned.',
}

export default function WorkPage() {
  const entries = getWorkEntries()

  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 rounded-3xl border px-6 py-7 shadow-sm md:mb-10 md:px-8 md:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Work</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Things I've Built
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
          Products, programs, and projects from across my career. Less about the titles and more
          about the decisions — what we built, what went wrong, and what I'd do differently.
        </p>
      </section>

      {entries.length === 0 ? (
        <p className="text-muted text-sm">Entries coming soon.</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/work/${entry.slug}`}
              className="surface-card group block rounded-2xl border px-5 py-5 shadow-sm transition-all hover:border-teal-300 hover:shadow-md md:px-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                      {entry.metadata.company} · {entry.metadata.year}
                    </p>
                  </div>
                  <h2 className="text-strong mt-1 text-base font-semibold tracking-tight md:text-lg">
                    {entry.metadata.title}
                  </h2>
                  <p className="text-muted mt-1 text-xs md:text-sm">{entry.metadata.role}</p>
                  <p className="text-muted mt-2 line-clamp-2 text-xs leading-relaxed md:text-sm">
                    {entry.metadata.summary}
                  </p>
                </div>
                <svg
                  className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              {entry.metadata.tags && entry.metadata.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </Container>
  )
}
