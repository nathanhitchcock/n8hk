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
          Lightweight calculators and planning aids you can use alongside the frameworks.
          Built for quick decisions, not spreadsheet archaeology.
        </p>
      </section>

      <div className="space-y-4 md:space-y-5">
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
      </div>
    </Container>
  )
}