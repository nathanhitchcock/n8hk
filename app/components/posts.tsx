import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts() {
  const allBlogs = getBlogPosts()

  return (
    <div>
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
            className="block mb-6"
          >
            {/* Title first */}
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight font-medium">
              {post.metadata.title}
            </p>

            {/* Meta second: read time · date */}
            <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {post.metadata.readingTime
                ? post.metadata.readingTime.replace(' read', '')
                : null}
              {post.metadata.readingTime ? ' · ' : null}
              {formatDate(post.metadata.publishedAt, false)}
            </p>
          </Link>
        ))}
    </div>
  )
}
