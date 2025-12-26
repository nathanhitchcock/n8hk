import { baseUrl } from 'app/sitemap'
import { getBlogPosts } from 'app/blog/utils'

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'n8hk blog'
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Personal blog posts and updates'

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  let allBlogs = await getBlogPosts()

  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })
    .map(
      (post) =>
        `<item>
          <title>${escapeXml(post.metadata.title || post.slug)}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <guid>${baseUrl}/blog/${post.slug}</guid>
          <description>${escapeXml(post.metadata.summary || '')}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt.includes('T')
              ? post.metadata.publishedAt
              : `${post.metadata.publishedAt}T00:00:00`
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(siteTitle)}</title>
      <link>${baseUrl}</link>
      <description>${escapeXml(siteDescription)}</description>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <language>en-us</language>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
