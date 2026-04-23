import Link from 'next/link'
import { Container } from 'app/components/container'

export const metadata = {
  title: 'Toolbox',
  description: 'Practical operator tools for staffing, planning, and execution.',
}

export default function ToolboxPage() {
  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 rounded-3xl border px-6 py-7 shadow-sm md:mb-10 md:px-8 md:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Toolbox</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Operator Tools
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm md:text-base">
          Lightweight calculators and planning aids you can use alongside the blueprints.
          Built for quick decisions, not spreadsheet archaeology.
        </p>
      </section>

      <div className="space-y-4 md:space-y-5">
        <Link
          href="/toolbox/one-three-one-worksheet"
          className="group surface-card block rounded-3xl border px-6 py-6 shadow-sm transition-all hover:border-teal-300 hover:shadow-md md:px-7 md:py-7"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">New Tool</p>
              <h2 className="text-strong mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                1-3-1 Decision Worksheet
              </h2>
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

          <p className="text-muted mt-2 text-sm md:text-base">
            Build a complete 1-3-1 brief with quality checks: 1 clear problem, 3 real options,
            and 1 accountable recommendation you can copy into Slack or docs.
          </p>

          <p className="text-muted mt-2 text-xs md:text-sm">
            Best used when: a decision is getting fuzzy. Time: 5-8 minutes.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
              Decision Quality
            </span>
            <span className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
              Ownership Coaching
            </span>
            <span className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
              Quick Export
            </span>
          </div>
        </Link>

        <Link
          href="/toolbox/staffing-calculator"
          className="group surface-card block rounded-3xl border px-6 py-6 shadow-sm transition-all hover:border-teal-300 hover:shadow-md md:px-7 md:py-7"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Featured Tool</p>
              <h2 className="text-strong mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                Staffing Calculator
              </h2>
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

          <p className="text-muted mt-2 text-sm md:text-base">
            Estimate staffing, hiring runway, and delivery risk using demand, peak-load buffers,
            throughput, attrition, and hiring lead-time assumptions.
          </p>

          <p className="text-muted mt-2 text-xs md:text-sm">
            Best used when: opening reqs or rebalancing team capacity. Time: 3-5 minutes.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
              Team Planning
            </span>
            <span className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
              Headcount Scenarios
            </span>
            <span className="rounded-full border border-teal-200/80 bg-teal-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
              Risk Signals
            </span>
          </div>
        </Link>

        <div className="callout text-sm">
          <p className="callout-title">Blueprint Link</p>
          <p>
            Need the deeper method behind the worksheet? Open the{' '}
            <Link href="/blueprints/blueprint/1-3-1-decision-framework" className="underline underline-offset-2">
              1-3-1 Decision Blueprint
            </Link>{' '}
            for the full 3-step coaching sequence.
          </p>
        </div>
      </div>
    </Container>
  )
}