import { BlogPosts } from 'app/components/posts'
import { Container } from 'app/components/container'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 md:mb-10 rounded-3xl border px-6 py-7 md:px-8 md:py-9 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Insights
        </p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Writing About Better Systems
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
          A living notebook on operations, AI-enabled workflows, and practical
          decisions that make teams faster without adding chaos.
        </p>
      </section>

      <BlogPosts />
    </Container>
  )
}
