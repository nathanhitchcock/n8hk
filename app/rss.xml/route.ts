import { getBlogPosts } from "app/blog/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://n8hk.vercel.app";
const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || "n8hk blog";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Personal blog posts and updates";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getBlogPosts()
    .sort((a, b) => (a.metadata.publishedAt < b.metadata.publishedAt ? 1 : -1));

  const items = posts
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(
        post.metadata.publishedAt.includes("T")
          ? post.metadata.publishedAt
          : `${post.metadata.publishedAt}T00:00:00`
      ).toUTCString();
      const title = escapeXml(post.metadata.title || post.slug);
      const description = escapeXml(post.metadata.summary || "");
      return `
        <item>
          <title>${title}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${pubDate}</pubDate>
          <description>${description}</description>
        </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(siteTitle)}</title>
      <link>${siteUrl}</link>
      <description>${escapeXml(siteDescription)}</description>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <language>en-us</language>
      ${items}
    </channel>
  </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
