import { Container } from 'app/components/container'
import Link from 'next/link'

export const metadata = {
  title: 'n8hk.dev',
  description: 'Writing about building systems and leading teams.',
}

export default function Page() {
  return (
    <Container size="narrow" className="pb-4 md:pb-12">
      <section className="surface-card enter-rise mb-12 md:mb-16 rounded-3xl border px-6 py-8 md:px-8 md:py-12 shadow-sm">
        <h1 className="text-strong text-4xl md:text-5xl font-semibold tracking-tight">
          Building Better Systems
        </h1>
        <p className="text-muted mt-4 text-base md:text-lg max-w-3xl">
          I write about operations, leadership, team dynamics, and the practical decisions that compound.
          This site is a space to develop ideas about what makes organizations effective.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
        {/* Blog Section */}
        <Link href="/blog" className="group">
          <div className="surface-card rounded-3xl border px-6 py-8 md:px-7 md:py-9 shadow-sm transition-all hover:border-teal-300 hover:shadow-md h-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Deep Dives
                </p>
                <h2 className="text-strong mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                  Blog
                </h2>
              </div>
              <svg className="w-6 h-6 text-teal-600 mt-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Long-form essays on systems thinking, AI-enabled workflows, and decisions that move the needle.
            </p>
          </div>
        </Link>

        {/* Field Notes Section */}
        <Link href="/field-notes" className="group">
          <div className="surface-card rounded-3xl border px-6 py-8 md:px-7 md:py-9 shadow-sm transition-all hover:border-teal-300 hover:shadow-md h-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Observations
                </p>
                <h2 className="text-strong mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                  Field Notes
                </h2>
              </div>
              <svg className="w-6 h-6 text-teal-600 mt-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Practical patterns and lessons from building and scaling teams. Short-form reflections on what actually works.
            </p>
          </div>
        </Link>

        {/* Frameworks Section */}
        <div className="group md:col-span-2 xl:col-span-1">
          <div className="surface-card rounded-3xl border px-6 py-8 md:px-7 md:py-9 shadow-sm transition-all hover:border-teal-300 hover:shadow-md h-full">
            <Link href="/playbook" className="block rounded-lg -m-1 p-1 hover:bg-teal-50/60 dark:hover:bg-teal-950/25 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                    Frameworks
                  </p>
                  <h2 className="text-strong mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                    Framework Library
                  </h2>
                </div>
                <svg className="w-6 h-6 text-teal-600 mt-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Start at the high-level framework overviews, then drill into each framework for the full step-by-step execution details.
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                Available Frameworks
              </p>
              <ul className="text-muted text-sm space-y-1.5">
                <li>
                  <Link href="/playbook/framework/how-to-grow-a-high-performing-team" className="hover:text-teal-700">
                    How to Grow a High-Performing Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playbook/framework/how-to-grow-a-junior-engineer-into-a-principal-engineer"
                    className="hover:text-teal-700"
                  >
                    How to Grow a Junior Engineer into a Principal Engineer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
