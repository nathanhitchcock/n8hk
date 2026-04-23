import { Container } from 'app/components/container'

export const metadata = {
  title: 'Investments',
  description: 'A running disclosure of my community investments — startups, real estate, and creative projects.',
}

type Investment = {
  name: string
  url: string
  logo: string | null
  logoDark: string | null
  category: string
  description: string
}

const investments: Investment[] = [
  {
    name: 'Openlane',
    url: 'https://www.theopenlane.io',
    logo: '/logos/openlane.png',
    logoDark: '/logos/openlane.png',
    category: 'Startup',
    description: 'Open source compliance automation — SOC 2, GDPR, ISO 27001, and more — built for teams who want continuous compliance without the enterprise price tag.',
  },
]

export default function InvestmentsPage() {
  return (
    <Container size="narrow" className="pb-4 md:pb-6">
      <section className="surface-card enter-rise mb-8 rounded-3xl border px-6 py-7 shadow-sm md:mb-10 md:px-8 md:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Investments</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Community Investments
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
          I invest in local startups, real estate, and creative projects. This page exists as a
          running disclosure — if I'm in a conversation about a company or space where I have skin
          in the game, you should know that upfront.
        </p>
      </section>

      <div className="space-y-3">
        {investments.map((investment) => (
          <a
            key={investment.name}
            href={investment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="surface-card group flex items-center gap-5 rounded-2xl border px-5 py-5 shadow-sm transition-all hover:border-teal-300 hover:shadow-md md:px-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-white dark:border-neutral-700 dark:bg-neutral-900">
              {investment.logo ? (
                <>
                  <img
                    src={investment.logo}
                    alt={`${investment.name} logo`}
                    className="h-full w-full rounded-xl object-contain p-2 dark:hidden"
                  />
                  <img
                    src={investment.logoDark ?? investment.logo}
                    alt={`${investment.name} logo`}
                    className="hidden h-full w-full rounded-xl object-contain p-2 dark:block"
                  />
                </>
              ) : (
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">
                  {investment.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-strong font-semibold">{investment.name}</p>
                <span className="rounded-full border border-teal-200/80 bg-teal-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
                  {investment.category}
                </span>
              </div>
              <p className="text-muted mt-0.5 text-sm">{investment.description}</p>
            </div>

            <svg
              className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Updated as investments are made.
      </p>
    </Container>
  )
}
