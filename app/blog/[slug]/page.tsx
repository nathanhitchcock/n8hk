import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { TableOfContents } from 'app/components/toc'
import { Container } from 'app/components/container'
// no React.use needed; prefer async/await for Promise params

type Params = { slug: string }


export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Params | Promise<Params> }) {
  // In Next 15+, dynamic params may be a Promise; unwrap before use
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }: { params: Params | Promise<Params> }) {
  // In Next 15+, dynamic params may be a Promise; unwrap before use
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  const tocItems = getTocItems(post.content)

  return (
    <Container size="wide">
      {/* ... JSON-LD script stays as-is... */}

      <h1 className="title font-semibold text-3xl tracking-tight">
        {post.metadata.title}
      </h1>

      <div className="mt-3 mb-8 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {post.metadata.readingTime
          ? `${post.metadata.readingTime.replace(' read', '')}`
          : null}
        {post.metadata.readingTime ? ' · ' : null}
        {formatDate(post.metadata.publishedAt)}
      </div>


      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <article className="prose lg:prose-lg xl:prose-xl lg:col-span-9">
          <CustomMDX source={post.content} />
        </article>

        <aside className="hidden md:block md:col-span-3 md:pl-6 lg:pl-8">
          <div className="sticky top-24 border-l border-neutral-200 dark:border-neutral-800 pl-4">
            <TableOfContents items={tocItems} />
          </div>
        </aside>
      </div>

    </Container>
  )
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

// Very small “good enough” markdown heading parser for MDX text.
// Extracts ## and ###, ignores code fences.
function getTocItems(mdx: string) {
  const lines = mdx.split('\n')
  const items: { id: string; text: string }[] = []

  let inCodeBlock = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    // Match ONLY ## Heading
    const match = /^(#{2})\s+(.+)$/.exec(trimmed)
    if (!match) continue

    let text = match[2]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim()

    if (!text) continue

    items.push({
      id: slugify(text),
      text,
    })
  }

  return items
}
