import { Container } from 'app/components/container'
import Link from 'next/link'

export const metadata = {
  title: 'n8hk.dev',
  description: '20 years growing teams, scaling service organizations, and solving the operational problems that show up when ambition outpaces infrastructure.',
}

export default function Page() {
  return (
    <Container size="narrow" className="pb-4 md:pb-12">
      <section className="surface-card enter-rise mb-12 md:mb-16 rounded-3xl border px-6 py-8 md:px-8 md:py-12 shadow-sm">
        <h1 className="text-strong text-4xl md:text-5xl font-semibold tracking-tight">
          Build things that last.
        </h1>
        <p className="text-muted mt-4 text-base md:text-lg max-w-3xl">
          I've spent 20 years growing teams, scaling service organizations, and solving the operational
          problems that show up when ambition outpaces infrastructure. This is where I write it all
          down — for operators who want to build something that's still standing in 10 years.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        <Link href="/writing" className="group">
          <div className="surface-card rounded-3xl border px-6 py-8 md:px-7 md:py-9 shadow-sm transition-all hover:border-teal-300 hover:shadow-md h-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Writing
                </p>
                <h2 className="text-strong mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                  Essays & Notes
                </h2>
              </div>
              <svg className="w-6 h-6 text-teal-600 mt-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Long-form essays and short field observations on building teams, scaling operations, and the decisions that compound.
            </p>
          </div>
        </Link>

        <Link href="/blueprints" className="group">
          <div className="surface-card rounded-3xl border px-6 py-8 md:px-7 md:py-9 shadow-sm transition-all hover:border-teal-300 hover:shadow-md h-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Blueprints
                </p>
                <h2 className="text-strong mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                  Operator Blueprints
                </h2>
              </div>
              <svg className="w-6 h-6 text-teal-600 mt-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Step-by-step playbooks for building high-performing teams. Start at the overview, drill into each step for full execution detail.
            </p>
          </div>
        </Link>

        <Link href="/work" className="group">
          <div className="surface-card rounded-3xl border px-6 py-8 md:px-7 md:py-9 shadow-sm transition-all hover:border-teal-300 hover:shadow-md h-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Work
                </p>
                <h2 className="text-strong mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                  Things I've Built
                </h2>
              </div>
              <svg className="w-6 h-6 text-teal-600 mt-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Products, programs, and service lines from across my career. What got built, what went wrong, and what I'd do differently.
            </p>
          </div>
        </Link>

        <Link href="/investments" className="group">
          <div className="surface-card rounded-3xl border px-6 py-8 md:px-7 md:py-9 shadow-sm transition-all hover:border-teal-300 hover:shadow-md h-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Investing
                </p>
                <h2 className="text-strong mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                  Investments
                </h2>
              </div>
              <svg className="w-6 h-6 text-teal-600 mt-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Where I'm deploying capital. Running disclosure for transparency — if I have skin in the game, you'll know.
            </p>
          </div>
        </Link>
      </div>
    </Container>
  )
}
