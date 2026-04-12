import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts() {
  const allBlogs = getBlogPosts()

  return (
    <div className="space-y-4">
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="post-card surface-card enter-rise group block rounded-2xl border px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-400/50 hover:shadow-md"
          >
            <p className="text-strong text-lg tracking-tight font-semibold transition-colors group-hover:text-teal-700">
              {post.metadata.title}
            </p>

            <p className="text-muted mt-2 text-xs uppercase tracking-[0.14em]">
              {post.metadata.readingTime
                ? post.metadata.readingTime.replace(' read', '')
                : null}
              {post.metadata.readingTime ? ' · ' : null}
              {formatDate(post.metadata.publishedAt, false)}
            </p>

            {post.metadata.summary ? (
              <p className="text-muted mt-2 line-clamp-2 text-sm">
                {post.metadata.summary}
              </p>
            ) : null}
          </Link>
        ))}
    </div>
  )
}
