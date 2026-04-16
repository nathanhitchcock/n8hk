import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { baseUrl } from 'app/sitemap'
import { Container } from 'app/components/container'
import { TableOfContents } from 'app/components/toc'
import { getTocItems } from 'app/components/toc-utils'
import { formatDate, getPlaybookEntries } from 'app/playbook/utils'

type Params = { slug: string }

export async function generateStaticParams() {
  const entries = getPlaybookEntries()

  return entries.map((entry) => ({
    slug: entry.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const entry = getPlaybookEntries().find((item) => item.slug === slug)
  if (!entry) return

  const { title, publishedAt: publishedTime, summary: description } = entry.metadata

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/frameworks/${entry.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function FrameworkEntryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const allEntries = getPlaybookEntries()
  const entry = allEntries.find((item) => item.slug === slug)

  if (!entry) {
    notFound()
  }

  const frameworkName = entry.metadata.framework || 'Framework'
  const frameworkEntries = allEntries
    .filter((item) => (item.metadata.framework || 'Framework') === frameworkName)
    .sort((a, b) => a.metadata.step - b.metadata.step)

  const currentIndex = frameworkEntries.findIndex((item) => item.slug === entry.slug)
  const nextEntry = frameworkEntries[currentIndex + 1]
  const tocItems = getTocItems(entry.content)

  return (
    <Container size="wide" className="pb-4 md:pb-8">
      <section className="surface-card enter-rise mb-8 rounded-3xl border px-6 py-8 shadow-sm md:mb-10 md:px-8 md:py-10">
        <p className="text-xs uppercase tracking-[0.18em] text-teal-700">
          {frameworkName} ·
          {' '}
          Step {entry.metadata.step}
          {entry.metadata.phase ? ` · ${entry.metadata.phase}` : ''}
        </p>
        <h1 className="title text-strong mt-3 font-semibold text-3xl tracking-tight md:text-4xl">
          {entry.metadata.title}
        </h1>
        <p className="text-muted mt-3 max-w-3xl text-sm md:text-base">{entry.metadata.summary}</p>
        <div className="text-muted mt-4 text-xs uppercase tracking-[0.14em]">
          {entry.metadata.readingTime ? `${entry.metadata.readingTime.replace(' read', '')}` : null}
          {entry.metadata.readingTime ? ' · ' : null}
          {formatDate(entry.metadata.publishedAt)}
        </div>
        {entry.metadata.tags && entry.metadata.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {entry.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="order-1 mb-5 lg:mb-0 lg:order-2 lg:col-span-4 lg:pl-3">
          <TableOfContents items={tocItems} />
        </div>

        <article className="order-2 surface-card prose enter-wash lg:prose-lg lg:order-1 lg:col-span-8 rounded-3xl border px-6 py-7 shadow-sm md:px-10 md:py-10">
          <CustomMDX source={entry.content} />

          <hr className="my-8" />
          {nextEntry ? (
            <p className="text-sm">
              Next step:{' '}
              <a href={`/frameworks/${nextEntry.slug}`}>
                Step {nextEntry.metadata.step}: {nextEntry.metadata.title}
              </a>
            </p>
          ) : (
            <p className="text-sm">You are at the latest published step.</p>
          )}
        </article>
      </div>
    </Container>
  )
}