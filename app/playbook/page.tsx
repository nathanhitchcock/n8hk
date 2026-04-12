import Link from 'next/link'
import { Container } from 'app/components/container'
import { getFrameworkGroups } from './utils'

export const metadata = {
  title: 'Frameworks',
  description: 'Step-by-step operator frameworks for managers and engineering leaders.',
}

export default function PlaybookPage() {
  const frameworks = getFrameworkGroups()

  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 md:mb-10 rounded-3xl border px-6 py-7 md:px-8 md:py-9 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Frameworks</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Operator Frameworks
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
          Tactical, step-by-step systems for building better teams and stronger engineering leaders.
          Each framework is designed as a progression map with concrete execution steps.
        </p>
      </section>

      <div className="space-y-4 md:space-y-5">
        {frameworks.map((framework) => (
          <Link
            key={framework.name}
            href={`/playbook/framework/${framework.slug}`}
            className="group surface-card block rounded-3xl border px-6 py-6 shadow-sm transition-all hover:border-teal-300 hover:shadow-md md:px-7 md:py-7"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Framework {framework.order}</p>
              <svg
                className="mt-1 h-6 w-6 text-teal-600 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            <h2 className="text-strong mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              {framework.name}
            </h2>
            <p className="text-muted mt-2 text-sm md:text-base">
              {framework.entries.length} steps. Open the framework to view the progression map and full step details.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {framework.entries.slice(0, 3).map((entry) => (
                <span
                  key={entry.slug}
                  className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
                >
                  Step {entry.metadata.step}: {entry.metadata.title}
                </span>
              ))}
              {framework.entries.length > 3 && (
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  +{framework.entries.length - 3} more steps
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
