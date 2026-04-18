import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getFieldNotes } from 'app/field-notes/utils'
import { baseUrl } from 'app/sitemap'
import { Container } from 'app/components/container'
import { TableOfContents } from 'app/components/toc'
import { getTocItems } from 'app/components/toc-utils'
import { getPlaybookEntries } from 'app/playbook/utils'
import Link from 'next/link'

type Params = { slug: string }

export async function generateStaticParams() {
  let notes = getFieldNotes()

  return notes.map((note) => ({
    slug: note.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  let note = getFieldNotes().find((note) => note.slug === slug)
  if (!note) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
  } = note.metadata

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/field-notes/${note.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function FieldNotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  let note = getFieldNotes().find((note) => note.slug === slug)

  if (!note) {
    notFound()
  }

  const tocItems = getTocItems(note.content)

  const frameworkStepSlug = note.metadata.frameworkStep
  const linkedStep = frameworkStepSlug
    ? getPlaybookEntries().find((e) => e.slug === frameworkStepSlug)
    : null

  return (
    <Container size="wide" className="pb-4 md:pb-8">
      <section className="surface-card enter-rise mb-8 md:mb-10 rounded-3xl border px-6 py-8 md:px-8 md:py-10 shadow-sm">
        {note.metadata.category && (
          <p className="text-xs uppercase tracking-[0.18em] text-teal-700">
            {note.metadata.category}
          </p>
        )}
        <h1 className="title text-strong mt-3 font-semibold text-3xl tracking-tight md:text-4xl">
          {note.metadata.title}
        </h1>
        <div className="text-muted mt-4 text-xs uppercase tracking-[0.14em]">
          {note.metadata.readingTime
            ? `${note.metadata.readingTime.replace(' read', '')}`
            : null}
          {note.metadata.readingTime ? ' · ' : null}
          {formatDate(note.metadata.publishedAt)}
        </div>
        {note.metadata.tags && note.metadata.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {note.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {linkedStep && (
          <p className="mt-5 text-xs text-muted">
            Filed under{' '}
            <Link
              href={`/frameworks/${linkedStep.slug}`}
              className="text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Step {linkedStep.metadata.step}: {linkedStep.metadata.title}
            </Link>
          </p>
        )}
      </section>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="order-1 mb-5 lg:mb-0 lg:order-2 lg:col-span-4 lg:pl-3">
          <TableOfContents items={tocItems} />
        </div>

        <article className="order-2 surface-card prose lg:prose-lg lg:order-1 lg:col-span-8 rounded-3xl border px-6 py-7 shadow-sm md:px-10 md:py-10">
          <CustomMDX source={note.content} />
        </article>
      </div>
    </Container>
  )
}
