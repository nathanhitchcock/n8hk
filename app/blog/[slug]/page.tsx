import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { TableOfContents } from 'app/components/toc'
import { getTocItems } from 'app/components/toc-utils'
import { Container } from 'app/components/container'
// no React.use needed; prefer async/await for Promise params

type Params = { slug: string }


export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
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

export default async function Blog({ params }: { params: Promise<Params> }) {
  // In Next 15+, dynamic params may be a Promise; unwrap before use
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  const tocItems = getTocItems(post.content)

  return (
    <Container size="wide" className="pb-4 md:pb-8">
      <section className="surface-card enter-rise mb-8 md:mb-10 rounded-3xl border px-6 py-8 md:px-8 md:py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-teal-700">Article</p>
        <h1 className="title text-strong mt-3 font-semibold text-3xl tracking-tight md:text-4xl">
          {post.metadata.title}
        </h1>
        <div className="text-muted mt-4 text-xs uppercase tracking-[0.14em]">
          {post.metadata.readingTime
            ? `${post.metadata.readingTime.replace(' read', '')}`
            : null}
          {post.metadata.readingTime ? ' · ' : null}
          {formatDate(post.metadata.publishedAt)}
        </div>
      </section>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="order-1 mb-5 lg:mb-0 lg:order-2 lg:col-span-4 lg:pl-3">
          <TableOfContents items={tocItems} />
        </div>

        <article className="order-2 surface-card prose enter-wash lg:prose-lg lg:order-1 lg:col-span-8 rounded-3xl border px-6 py-7 shadow-sm md:px-10 md:py-10">
          <CustomMDX source={post.content} />
        </article>
      </div>
    </Container>
  )
}
