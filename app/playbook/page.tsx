import Link from 'next/link'
import { Container } from 'app/components/container'
import { formatDate, getPlaybookEntries } from './utils'

export const metadata = {
  title: 'Frameworks',
  description: 'How to Grow a High-Performing Team: a tactical operator framework.',
}

export default function PlaybookPage() {
  const entries = getPlaybookEntries().sort((a, b) => a.metadata.step - b.metadata.step)

  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 md:mb-10 rounded-3xl border px-6 py-7 md:px-8 md:py-9 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Frameworks</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          How to Grow a High-Performing Team
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
          A tactical, step-by-step system for managers entering a team and building durable
          execution quality. This is Framework 1, with more frameworks coming for individual growth,
          principal-level impact, and beyond.
        </p>
      </section>

      <div className="space-y-3">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/playbook/${entry.slug}`}
            className="post-card surface-card block rounded-2xl border px-5 py-4 md:px-6 md:py-5 shadow-sm transition-all hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                  Step {entry.metadata.step}
                  {entry.metadata.phase ? ` · ${entry.metadata.phase}` : ''}
                </p>
                <h2 className="text-strong mt-1 font-medium text-base md:text-lg truncate">
                  {entry.metadata.title}
                </h2>
                <p className="text-muted text-xs md:text-sm mt-1.5 line-clamp-2">
                  {entry.metadata.summary}
                </p>
                {entry.metadata.tags && entry.metadata.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-muted text-xs mt-3 flex items-center gap-2">
              <time dateTime={entry.metadata.publishedAt}>{formatDate(entry.metadata.publishedAt)}</time>
              {entry.metadata.readingTime && (
                <>
                  <span>·</span>
                  <span>{entry.metadata.readingTime}</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
