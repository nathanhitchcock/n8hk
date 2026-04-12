import { getFieldNotes } from './utils'
import { Container } from 'app/components/container'
import Link from 'next/link'
import { formatDate } from './utils'

export const metadata = {
  title: 'Field Notes',
  description: 'Field notes on building and growing teams.',
}

export default function FieldNotesPage() {
  const notes = getFieldNotes().sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  })

  // Group by category if available
  const byCategory: Record<string, typeof notes> = {}
  const uncategorized: typeof notes = []

  notes.forEach(note => {
    const category = note.metadata.category || 'Observations'
    if (!byCategory[category]) {
      byCategory[category] = []
    }
    byCategory[category].push(note)
  })

  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 md:mb-10 rounded-3xl border px-6 py-7 md:px-8 md:py-9 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Field Notes
        </p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Building Better Teams
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
          Practical observations and lessons learned from building, scaling, and leading teams.
          These field notes capture what works, what doesn't, and the patterns that matter.
        </p>
      </section>

      {notes.length === 0 ? (
        <div className="text-muted text-center py-12">
          <p>Field notes coming soon...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byCategory).map(([category, categoryNotes]) => (
            <div key={category}>
              <h2 className="text-strong text-lg font-semibold mb-4 uppercase tracking-[0.1em] text-sm opacity-60">
                {category}
              </h2>
              <div className="space-y-3">
                {categoryNotes.map(note => (
                  <Link
                    key={note.slug}
                    href={`/field-notes/${note.slug}`}
                    className="post-card surface-card block rounded-2xl border px-5 py-4 md:px-6 md:py-5 shadow-sm transition-all hover:border-teal-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-strong font-medium text-base md:text-lg truncate">
                          {note.metadata.title}
                        </h3>
                        <p className="text-muted text-xs md:text-sm mt-1.5 line-clamp-2">
                          {note.metadata.summary}
                        </p>
                        {note.metadata.tags && note.metadata.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {note.metadata.tags.map((tag) => (
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
                      <time dateTime={note.metadata.publishedAt}>
                        {formatDate(note.metadata.publishedAt)}
                      </time>
                      {note.metadata.readingTime && (
                        <>
                          <span>·</span>
                          <span>{note.metadata.readingTime}</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
