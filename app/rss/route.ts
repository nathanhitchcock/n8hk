import { baseUrl } from 'app/sitemap'
import { getBlogPosts } from 'app/blog/utils'
import { getFieldNotes } from 'app/field-notes/utils'
import { getPlaybookEntries } from 'app/playbook/utils'

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
  let allFieldNotes = await getFieldNotes()
  let allPlaybookEntries = await getPlaybookEntries()
  
  let allContent = [
    ...allBlogs.map(post => ({
      title: post.metadata.title,
      slug: post.slug,
      summary: post.metadata.summary,
      publishedAt: post.metadata.publishedAt,
      type: 'blog'
    })),
    ...allFieldNotes.map(note => ({
      title: note.metadata.title,
      slug: note.slug,
      summary: note.metadata.summary,
      publishedAt: note.metadata.publishedAt,
      type: 'field-notes'
    })),
    ...allPlaybookEntries.map(entry => ({
      title: entry.metadata.title,
      slug: entry.slug,
      summary: entry.metadata.summary,
      publishedAt: entry.metadata.publishedAt,
      type: 'playbook'
    }))
  ]

  const itemsXml = allContent
    .sort((a, b) => {
      if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
        return -1
      }
      return 1
    })
    .map(
      (item) =>
        `<item>
          <title>${escapeXml(item.title || item.slug)}</title>
          <link>${baseUrl}/${item.type}/${item.slug}</link>
          <guid>${baseUrl}/${item.type}/${item.slug}</guid>
          <description>${escapeXml(item.summary || '')}</description>
          <pubDate>${new Date(
            item.publishedAt.includes('T')
              ? item.publishedAt
              : `${item.publishedAt}T00:00:00`
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
