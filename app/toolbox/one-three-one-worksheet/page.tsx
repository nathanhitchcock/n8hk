'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Container } from 'app/components/container'

type OptionInput = {
  title: string
  upside: string
  risk: string
  cost: string
}

const blankOptions: OptionInput[] = [
  { title: '', upside: '', risk: '', cost: '' },
  { title: '', upside: '', risk: '', cost: '' },
  { title: '', upside: '', risk: '', cost: '' },
]

const STORAGE_KEY = 'one-three-one-worksheet:v1'

export default function OneThreeOneWorksheetPage() {
  const [problem, setProblem] = useState('')
  const [urgency, setUrgency] = useState('')
  const [success, setSuccess] = useState('')
  const [options, setOptions] = useState<OptionInput[]>(blankOptions)
  const [recommendedIndex, setRecommendedIndex] = useState<number | null>(null)
  const [recommendationWhy, setRecommendationWhy] = useState('')
  const [owner, setOwner] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [isHydrated, setIsHydrated] = useState(false)
  const [showExample, setShowExample] = useState(false)

  useEffect(() => {
    try {
      const savedRaw = window.localStorage.getItem(STORAGE_KEY)
      if (savedRaw) {
        const saved = JSON.parse(savedRaw) as {
          problem?: string
          urgency?: string
          success?: string
          options?: OptionInput[]
          recommendedIndex?: number | null
          recommendationWhy?: string
          owner?: string
          nextStep?: string
        }

        setProblem(saved.problem ?? '')
        setUrgency(saved.urgency ?? '')
        setSuccess(saved.success ?? '')
        setOptions(
          Array.isArray(saved.options) && saved.options.length === 3
            ? saved.options.map((opt) => ({
                title: opt?.title ?? '',
                upside: opt?.upside ?? '',
                risk: opt?.risk ?? '',
                cost: opt?.cost ?? '',
              }))
            : blankOptions
        )
        setRecommendedIndex(
          typeof saved.recommendedIndex === 'number' ? saved.recommendedIndex : null
        )
        setRecommendationWhy(saved.recommendationWhy ?? '')
        setOwner(saved.owner ?? '')
        setNextStep(saved.nextStep ?? '')
      }
    } catch {
      // Ignore malformed local state and continue with defaults.
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          problem,
          urgency,
          success,
          options,
          recommendedIndex,
          recommendationWhy,
          owner,
          nextStep,
        })
      )
    } catch {
      // Ignore storage write failures (private mode, full quota, etc).
    }
  }, [
    isHydrated,
    nextStep,
    options,
    owner,
    problem,
    recommendationWhy,
    recommendedIndex,
    success,
    urgency,
  ])

  const setOptionField = (index: number, field: keyof OptionInput, value: string) => {
    setOptions((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const checks = useMemo(() => {
    const hasProblem = problem.trim().length > 20
    const hasUrgency = urgency.trim().length > 10
    const hasSuccess = success.trim().length > 10

    const optionTitles = options.map((opt) => opt.title.trim().toLowerCase()).filter(Boolean)
    const distinctOptionTitles = new Set(optionTitles).size === 3
    const allOptionFieldsFilled = options.every((opt) =>
      opt.title.trim().length > 3 &&
      opt.upside.trim().length > 8 &&
      opt.risk.trim().length > 8 &&
      opt.cost.trim().length > 3
    )

    const hasRecommendation = recommendedIndex !== null && recommendationWhy.trim().length > 12
    const hasAccountability = owner.trim().length > 1 && nextStep.trim().length > 5

    return {
      hasProblem,
      hasUrgency,
      hasSuccess,
      distinctOptionTitles,
      allOptionFieldsFilled,
      hasRecommendation,
      hasAccountability,
      readyToShare:
        hasProblem &&
        hasUrgency &&
        hasSuccess &&
        distinctOptionTitles &&
        allOptionFieldsFilled &&
        hasRecommendation &&
        hasAccountability,
    }
  }, [nextStep, options, owner, problem, recommendationWhy, recommendedIndex, success, urgency])

  const exportText = useMemo(() => {
    const optionLines = options.map((opt, idx) => {
      return [
        `Option ${idx + 1}: ${opt.title || '[add title]'}`,
        `- Upside: ${opt.upside || '[add upside]'}`,
        `- Risk: ${opt.risk || '[add risk]'}`,
        `- Cost/Time: ${opt.cost || '[add cost/time]'}`,
      ].join('\n')
    })

    const recommendationLabel =
      recommendedIndex !== null ? `Option ${recommendedIndex + 1}` : '[choose option]'

    return [
      '1-3-1 Decision Brief',
      '',
      '1) Problem',
      `- Statement: ${problem || '[add problem statement]'}`,
      `- Why now: ${urgency || '[add urgency]'}`,
      `- Success condition: ${success || '[add success condition]'}`,
      '',
      '2) Three Options',
      optionLines.join('\n\n'),
      '',
      '3) Recommendation',
      `- Recommended option: ${recommendationLabel}`,
      `- Why: ${recommendationWhy || '[add recommendation rationale]'}`,
      `- Owner: ${owner || '[add owner]'}`,
      `- Immediate next step: ${nextStep || '[add next step]'}`,
    ].join('\n')
  }, [nextStep, options, owner, problem, recommendationWhy, recommendedIndex, success, urgency])

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(exportText)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 1800)
    } catch {
      setCopyState('failed')
      setTimeout(() => setCopyState('idle'), 2200)
    }
  }

  const exampleText = [
    '1-3-1 Decision Brief (Example)',
    '',
    '1) Problem',
    '- Statement: Sprint commitments are slipping because critical incidents are interrupting planned engineering work.',
    '- Why now: Customer escalations increased 30% this month and roadmap dates are at risk for Q2.',
    '- Success condition: Restore >85% sprint predictability while reducing incident resolution time by 20%.',
    '',
    '2) Three Options',
    'Option 1: Keep current structure and add one on-call contractor',
    '- Upside: Fastest to implement with minimal process change.',
    '- Risk: Treats symptoms and may not improve root-cause reliability.',
    '- Cost/Time: 2 weeks and contractor budget increase.',
    '',
    'Option 2: Create a rotating reliability squad from existing team',
    '- Upside: Builds internal reliability ownership and reduces interruptions to product squads.',
    '- Risk: Temporary feature velocity dip while roles stabilize.',
    '- Cost/Time: 1 sprint to launch and tune.',
    '',
    'Option 3: Pause roadmap for one sprint and execute reliability reset',
    '- Upside: Highest chance to remove incident backlog quickly.',
    '- Risk: Stakeholder frustration from visible roadmap delay.',
    '- Cost/Time: 1 full sprint of opportunity cost.',
    '',
    '3) Recommendation',
    '- Recommended option: Option 2',
    '- Why: Best long-term tradeoff between delivery continuity and reliability improvement.',
    '- Owner: Engineering Manager, Platform Team',
    '- Immediate next step: Publish squad roster and operating charter by Friday; review metrics after 2 weeks.',
  ].join('\n')

  const clearWorksheet = () => {
    setProblem('')
    setUrgency('')
    setSuccess('')
    setOptions(blankOptions)
    setRecommendedIndex(null)
    setRecommendationWhy('')
    setOwner('')
    setNextStep('')
    setCopyState('idle')

    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // No-op if storage is unavailable.
    }
  }

  const fieldShellClass = 'block rounded-2xl border bg-[var(--surface)]/50 p-3'
  const fieldLabelClass = 'text-muted text-xs font-semibold uppercase tracking-[0.12em]'
  const fieldInputClass = 'mt-2 w-full rounded-xl border bg-[var(--surface)] px-3 py-2 text-sm text-strong focus:outline-none focus:ring-2 focus:ring-teal-300/60'

  return (
    <Container size="narrow" className="pb-4 md:pb-8">
      <section className="surface-card enter-rise mb-8 rounded-3xl border px-6 py-7 shadow-sm md:mb-10 md:px-8 md:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Toolbox</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          1-3-1 Decision Worksheet
        </h1>
        <p className="text-muted mt-3 max-w-3xl text-sm md:text-base">
          Turn the framework into a working brief: define one clear problem, evaluate three real options,
          and commit to one recommendation with an owner and next step.
        </p>
        <p className="mt-3 text-sm">
          <span className="text-muted">Need framework context? </span>
          <Link href="/frameworks/framework/1-3-1-decision-framework" className="text-teal-700 underline underline-offset-2 hover:text-teal-900">
            Open the 3-step framework →
          </Link>
        </p>
      </section>

      <section className="surface-card mb-6 rounded-3xl border px-6 py-6 shadow-sm md:px-7 md:py-7">
        <h2 className="text-strong text-lg font-semibold tracking-tight md:text-xl">1) Problem</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Problem Statement</span>
            <textarea
              className={`${fieldInputClass} min-h-20 resize-y`}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="What is happening, specifically?"
            />
          </label>

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Why It Matters Now</span>
            <textarea
              className={`${fieldInputClass} min-h-16 resize-y`}
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              placeholder="Why is this urgent right now?"
            />
          </label>

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Success Condition</span>
            <textarea
              className={`${fieldInputClass} min-h-16 resize-y`}
              value={success}
              onChange={(e) => setSuccess(e.target.value)}
              placeholder="What does solved look like?"
            />
          </label>
        </div>
      </section>

      <section className="surface-card mb-6 rounded-3xl border px-6 py-6 shadow-sm md:px-7 md:py-7">
        <h2 className="text-strong text-lg font-semibold tracking-tight md:text-xl">2) Three Options</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {options.map((opt, idx) => (
            <div key={`option-${idx}`} className="rounded-2xl border p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">Option {idx + 1}</p>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className={fieldShellClass}>
                  <span className={fieldLabelClass}>Option Title</span>
                  <input
                    type="text"
                    className={fieldInputClass}
                    value={opt.title}
                    onChange={(e) => setOptionField(idx, 'title', e.target.value)}
                    placeholder="Name this option"
                  />
                </label>
                <label className={fieldShellClass}>
                  <span className={fieldLabelClass}>Cost / Time</span>
                  <input
                    type="text"
                    className={fieldInputClass}
                    value={opt.cost}
                    onChange={(e) => setOptionField(idx, 'cost', e.target.value)}
                    placeholder="What does it cost in time/effort?"
                  />
                </label>
                <label className={fieldShellClass}>
                  <span className={fieldLabelClass}>Upside</span>
                  <textarea
                    className={`${fieldInputClass} min-h-16 resize-y`}
                    value={opt.upside}
                    onChange={(e) => setOptionField(idx, 'upside', e.target.value)}
                    placeholder="Primary benefit"
                  />
                </label>
                <label className={fieldShellClass}>
                  <span className={fieldLabelClass}>Risk</span>
                  <textarea
                    className={`${fieldInputClass} min-h-16 resize-y`}
                    value={opt.risk}
                    onChange={(e) => setOptionField(idx, 'risk', e.target.value)}
                    placeholder="Main downside or failure mode"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card mb-6 rounded-3xl border px-6 py-6 shadow-sm md:px-7 md:py-7">
        <h2 className="text-strong text-lg font-semibold tracking-tight md:text-xl">3) Recommendation</h2>

        <div className="mt-4 rounded-2xl border p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">Pick One Option</p>
          <div className="mt-3 flex gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={`recommend-${idx}`}
                type="button"
                onClick={() => setRecommendedIndex(idx)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  recommendedIndex === idx
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-[var(--border)] bg-[var(--surface)] text-strong hover:border-teal-400'
                }`}
              >
                Recommend Option {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Why This Option</span>
            <textarea
              className={`${fieldInputClass} min-h-20 resize-y`}
              value={recommendationWhy}
              onChange={(e) => setRecommendationWhy(e.target.value)}
              placeholder="Why is this the best tradeoff now?"
            />
          </label>

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Owner</span>
            <input
              type="text"
              className={fieldInputClass}
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Who owns execution?"
            />
          </label>

          <label className={`${fieldShellClass} md:col-span-2`}>
            <span className={fieldLabelClass}>Immediate Next Step</span>
            <textarea
              className={`${fieldInputClass} min-h-16 resize-y`}
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="What happens next, by when?"
            />
          </label>
        </div>
      </section>

      <section className="surface-card rounded-3xl border px-6 py-6 shadow-sm md:px-7 md:py-7">
        <h2 className="text-strong text-lg font-semibold tracking-tight md:text-xl">Quality Checks</h2>
        <ul className="mt-4 space-y-2">
          <li className={`rounded-xl border px-3 py-2 text-sm ${checks.hasProblem && checks.hasUrgency && checks.hasSuccess ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-amber-300 bg-amber-50 text-amber-900'}`}>
            Problem is specific, urgent, and has a clear success condition.
          </li>
          <li className={`rounded-xl border px-3 py-2 text-sm ${checks.allOptionFieldsFilled && checks.distinctOptionTitles ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-amber-300 bg-amber-50 text-amber-900'}`}>
            Three options are complete and materially different.
          </li>
          <li className={`rounded-xl border px-3 py-2 text-sm ${checks.hasRecommendation && checks.hasAccountability ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-amber-300 bg-amber-50 text-amber-900'}`}>
            One recommendation is selected with owner and next step.
          </li>
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyBrief}
            className="inline-flex rounded-xl border border-teal-600 bg-teal-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
          >
            Copy 1-3-1 Brief
          </button>
          <button
            type="button"
            onClick={() => setShowExample((prev) => !prev)}
            className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-strong transition-colors hover:border-teal-300"
          >
            {showExample ? 'Hide Example Output' : 'Show Example Output'}
          </button>
          <button
            type="button"
            onClick={clearWorksheet}
            className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-strong transition-colors hover:border-red-300 hover:text-red-700"
          >
            Clear Worksheet
          </button>
          <span className="inline-flex items-center rounded-xl border px-3 py-2 text-sm text-muted">
            {copyState === 'copied' && 'Copied to clipboard.'}
            {copyState === 'failed' && 'Copy failed. Please copy from preview below.'}
            {copyState === 'idle' && (checks.readyToShare ? 'Ready to share.' : 'Finish the checks above to strengthen decision quality.')}
          </span>
          <span className="inline-flex items-center rounded-xl border px-3 py-2 text-sm text-muted">
            Draft autosaves locally in this browser.
          </span>
        </div>

        <div className="mt-5 callout text-xs">
          <p className="callout-title">Preview</p>
          <pre className="whitespace-pre-wrap text-xs leading-relaxed">{exportText}</pre>
        </div>

        {showExample && (
          <div className="mt-4 callout text-xs">
            <p className="callout-title">Example Filled Output</p>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed">{exampleText}</pre>
          </div>
        )}
      </section>
    </Container>
  )
}
