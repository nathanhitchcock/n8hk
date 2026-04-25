import { getBlogPosts, formatDate } from 'app/blog/utils'
import { getFieldNotes } from 'app/field-notes/utils'
import { Container } from 'app/components/container'
import Link from 'next/link'

export const metadata = {
  title: 'Writing',
  description: 'Essays and field notes on building teams, scaling operations, and the decisions that compound.',
}

type Post = {
  slug: string
  type: 'Essay' | 'Note'
  href: string
  metadata: {
    title: string
    publishedAt: string
    summary: string
    tags?: string[]
    readingTime?: string
  }
}

export default function WritingPage() {
  const essays: Post[] = getBlogPosts().map((p) => ({
    slug: p.slug,
    type: 'Essay',
    href: `/blog/${p.slug}`,
    metadata: p.metadata,
  }))

  const notes: Post[] = getFieldNotes().map((p) => ({
    slug: p.slug,
    type: 'Note',
    href: `/field-notes/${p.slug}`,
    metadata: p.metadata,
  }))

  const all = [...essays, ...notes].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  )

  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 md:mb-10 rounded-3xl border px-6 py-7 md:px-8 md:py-9 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Writing</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Essays & Field Notes
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
          Long-form essays and short field observations on building teams, scaling operations, and the decisions that compound.
        </p>
      </section>

      <div className="space-y-3">
        {all.map((post) => (
          <Link
            key={`${post.type}-${post.slug}`}
            href={post.href}
            className="post-card surface-card block rounded-2xl border px-5 py-4 shadow-sm transition-all hover:border-teal-300 hover:shadow-md md:px-6 md:py-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded-full border border-teal-200/80 bg-teal-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
                    {post.type}
                  </span>
                </div>
                <h2 className="text-strong truncate text-base font-medium md:text-lg">
                  {post.metadata.title}
                </h2>
                <p className="text-muted mt-1.5 line-clamp-2 text-xs md:text-sm">
                  {post.metadata.summary}
                </p>
                {post.metadata.tags && post.metadata.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/40 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-muted mt-3 flex items-center gap-2 text-xs">
              <time dateTime={post.metadata.publishedAt}>
                {formatDate(post.metadata.publishedAt)}
              </time>
              {post.metadata.readingTime && (
                <>
                  <span>·</span>
                  <span>{post.metadata.readingTime}</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
