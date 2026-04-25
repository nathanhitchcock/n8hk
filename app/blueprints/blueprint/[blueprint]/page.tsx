import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from 'app/components/container'
import {
  formatDate,
  getBlueprintGroupBySlug,
  getBlueprintGroups,
} from 'app/playbook/utils'

type BlueprintPageProps = {
  params: Promise<{
    blueprint: string
  }>
}

export async function generateStaticParams() {
  return getBlueprintGroups().map((blueprint) => ({
    blueprint: blueprint.slug,
  }))
}

export async function generateMetadata({ params }: BlueprintPageProps) {
  const { blueprint } = await params
  const group = getBlueprintGroupBySlug(blueprint)

  if (!group) {
    return {
      title: 'Blueprint Not Found',
    }
  }

  return {
    title: group.name,
    description: `Step-by-step details for ${group.name}.`,
  }
}

export default async function BlueprintDetailPage({ params }: BlueprintPageProps) {
  const { blueprint } = await params
  const group = getBlueprintGroupBySlug(blueprint)

  if (!group) {
    notFound()
  }

  const showStaffingTool = group.slug === 'how-to-grow-a-high-performing-team'

  const progressionGridClass =
    group.entries.length <= 3 ? 'grid-cols-3' : group.entries.length === 8 ? 'grid-cols-8' : 'grid-cols-6'

  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 rounded-3xl border px-6 py-7 shadow-sm md:mb-10 md:px-8 md:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Blueprint {group.order}
        </p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {group.name}
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
          Choose a step to dive into the full execution details.
        </p>
      </section>

      <section className="surface-card mb-6 rounded-3xl border px-5 py-6 shadow-sm md:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Progression Map</p>

        <div className="mt-5 hidden md:block">
          <div className={`relative grid gap-3 ${progressionGridClass}`}>
            <div className="pointer-events-none absolute left-6 right-6 top-4 h-px bg-teal-200/80 dark:bg-teal-900/80" />
            {group.entries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/blueprints/${entry.slug}`}
                className="relative rounded-xl px-2 py-1 text-center transition-colors hover:bg-teal-50/70 dark:hover:bg-teal-950/25"
              >
                <div className="mx-auto h-3.5 w-3.5 rounded-full border-2 border-teal-600 bg-[var(--surface)]" />
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-teal-700">
                  Step {entry.metadata.step}
                </p>
                <p className="text-strong mt-1 text-xs font-medium leading-tight">{entry.metadata.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3 md:hidden">
          {group.entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/blueprints/${entry.slug}`}
              className="group flex items-start gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-teal-50/70 dark:hover:bg-teal-950/25"
            >
              <div className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-teal-600 bg-[var(--surface)]" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-teal-700">
                  Step {entry.metadata.step}
                </p>
                <p className="text-strong text-sm font-medium leading-tight">{entry.metadata.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {showStaffingTool && (
        <div className="surface-card mb-6 rounded-2xl border px-5 py-5 shadow-sm md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Related Tool</p>
          <p className="text-strong mt-2 text-sm font-medium">Staffing Calculator</p>
          <p className="text-muted mt-1 text-sm">
            Pressure-test headcount plans before opening reqs. Models flow, burst capacity, and operational risk.
          </p>
          <Link
            href="/toolbox/staffing-calculator"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            Open the calculator
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {group.entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/blueprints/${entry.slug}`}
            className="post-card surface-card block rounded-2xl border px-5 py-4 shadow-sm transition-all hover:border-teal-300 hover:shadow-md md:px-6 md:py-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                  Step {entry.metadata.step}
                  {entry.metadata.phase ? ` · ${entry.metadata.phase}` : ''}
                </p>
                <h2 className="text-strong mt-1 truncate text-base font-medium md:text-lg">
                  {entry.metadata.title}
                </h2>
                <p className="text-muted mt-1.5 line-clamp-2 text-xs md:text-sm">
                  {entry.metadata.summary}
                </p>
              </div>
            </div>
            <div className="text-muted mt-3 flex items-center gap-2 text-xs">
              <time dateTime={entry.metadata.publishedAt}>{formatDate(entry.metadata.publishedAt)}</time>
              {entry.metadata.readingTime && (
                <>
                  <span>·</span>
                  <span>{entry.metadata.readingTime}</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
