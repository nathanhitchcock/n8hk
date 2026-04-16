import { getBlogPosts } from 'app/blog/utils'
import { getFieldNotes } from 'app/field-notes/utils'
import { getPlaybookEntries } from 'app/playbook/utils'

export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://n8hk.vercel.app'

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let fieldNotes = getFieldNotes().map((note) => ({
    url: `${baseUrl}/field-notes/${note.slug}`,
    lastModified: note.metadata.publishedAt,
  }))

  let playbook = getPlaybookEntries().map((entry) => ({
    url: `${baseUrl}/frameworks/${entry.slug}`,
    lastModified: entry.metadata.publishedAt,
  }))

  let routes = ['', '/blog', '/field-notes', '/frameworks', '/toolbox', '/toolbox/staffing-calculator'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs, ...fieldNotes, ...playbook]
}
