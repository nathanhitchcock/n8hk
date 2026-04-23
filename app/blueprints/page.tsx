import Link from 'next/link'
import { Container } from 'app/components/container'
import { DEFAULT_BLUEPRINT, getBlueprintGroups } from 'app/playbook/utils'

export const metadata = {
  title: 'Blueprints',
  description: 'Step-by-step operator blueprints for managers and engineering leaders.',
}

export default function BlueprintsPage() {
  const blueprints = getBlueprintGroups()
  const featuredBlueprint =
    blueprints.find((blueprint) => blueprint.name === DEFAULT_BLUEPRINT) ?? blueprints[0]

  if (!featuredBlueprint) {
    return (
      <Container size="narrow" className="pb-4 md:pb-6">
        <section className="surface-card enter-rise rounded-3xl border px-6 py-7 shadow-sm md:px-8 md:py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Blueprints</p>
          <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Operator Blueprints
          </h1>
          <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
            Blueprints will appear here as they are published.
          </p>
        </section>
      </Container>
    )
  }

  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 rounded-3xl border px-6 py-7 shadow-sm md:mb-10 md:px-8 md:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Blueprints</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Operator Blueprints
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
          Tactical, step-by-step systems for building better teams and stronger engineering leaders.
          Start with the featured blueprint, then explore the full library.
        </p>
      </section>

      <Link
        href={`/blueprints/blueprint/${featuredBlueprint.slug}`}
        className="group surface-card block rounded-3xl border-2 border-teal-300/70 px-6 py-6 shadow-sm transition-all hover:border-teal-400 hover:shadow-md md:px-7 md:py-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Recommended Start
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Blueprint {featuredBlueprint.order}
            </p>
          </div>
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
          {featuredBlueprint.name}
        </h2>
        <p className="text-muted mt-2 text-sm md:text-base">
          {featuredBlueprint.entries.length} steps. Open the blueprint to view the progression map and full step details.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {featuredBlueprint.entries.slice(0, 3).map((entry) => (
            <span
              key={entry.slug}
              className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
            >
              Step {entry.metadata.step}: {entry.metadata.title}
            </span>
          ))}
          {featuredBlueprint.entries.length > 3 && (
            <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              +{featuredBlueprint.entries.length - 3} more steps
            </span>
          )}
        </div>
      </Link>

      <section className="mt-6 space-y-3 md:mt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">All Blueprints</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {blueprints.map((blueprint) => (
            <Link
              key={blueprint.slug}
              href={`/blueprints/blueprint/${blueprint.slug}`}
              className="surface-card block rounded-2xl border px-5 py-4 shadow-sm transition-all hover:border-teal-300 hover:shadow-md"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                Blueprint {blueprint.order}
              </p>
              <h2 className="text-strong mt-1 text-base font-semibold tracking-tight md:text-lg">
                {blueprint.name}
              </h2>
              <p className="text-muted mt-1.5 text-xs md:text-sm">
                {blueprint.entries.length} {blueprint.entries.length === 1 ? 'step' : 'steps'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  )
}
