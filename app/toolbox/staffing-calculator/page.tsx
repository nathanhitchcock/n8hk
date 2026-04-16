'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Container } from 'app/components/container'

type Scenario = 'conservative' | 'expected' | 'aggressive'
type StaffingModel = 'operational' | 'support'

const scenarioFactor: Record<Scenario, number> = {
  conservative: 1.25,
  expected: 1,
  aggressive: 0.85,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function parseNumberInput(value: string, fallback: number, min: number, max: number) {
  const trimmed = value.trim()
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return fallback
  }

  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return clamp(parsed, min, max)
}

export default function StaffingCalculatorPage() {
  const [staffingModel, setStaffingModel] = useState<StaffingModel>('operational')
  const [currentHeadcountInput, setCurrentHeadcountInput] = useState('8')
  const [targetWorkloadsPerMonthInput, setTargetWorkloadsPerMonthInput] = useState('18')
  const [peakLoadBufferPercentInput, setPeakLoadBufferPercentInput] = useState('20')
  const [throughputPerEngineerPerMonthInput, setThroughputPerEngineerPerMonthInput] = useState('2')
  const [supportEscalationPercentInput, setSupportEscalationPercentInput] = useState('20')
  const [attritionPercentInput, setAttritionPercentInput] = useState('12')
  const [hiringLeadTimeMonthsInput, setHiringLeadTimeMonthsInput] = useState('3')
  const [scenario, setScenario] = useState<Scenario>('expected')

  const results = useMemo(() => {
    const currentHeadcount = Math.round(parseNumberInput(currentHeadcountInput, 8, 1, 500))
    const targetWorkloadsPerMonth = Math.round(parseNumberInput(targetWorkloadsPerMonthInput, 18, 1, 1000))
    const peakLoadBufferPercent = Math.round(parseNumberInput(peakLoadBufferPercentInput, 20, 0, 100))
    const throughputPerEngineerPerMonth = parseNumberInput(throughputPerEngineerPerMonthInput, 2, 0.1, 100)
    const supportEscalationPercent = Math.round(parseNumberInput(supportEscalationPercentInput, 20, 0, 100))
    const attritionPercent = Math.round(parseNumberInput(attritionPercentInput, 12, 0, 40))
    const hiringLeadTimeMonths = Math.round(parseNumberInput(hiringLeadTimeMonthsInput, 3, 0, 24))

    const effectiveThroughput = throughputPerEngineerPerMonth * scenarioFactor[scenario]
    const supportEscalationMultiplier = staffingModel === 'support'
      ? 1 + (supportEscalationPercent / 100)
      : 1
    const peakLoadMultiplier = 1 + (peakLoadBufferPercent / 100)
    const effectiveDemand = Math.ceil(targetWorkloadsPerMonth * supportEscalationMultiplier * peakLoadMultiplier)

    const requiredHeadcount = Math.ceil(effectiveDemand / Math.max(effectiveThroughput, 0.1))
    const attritionBuffer = Math.ceil(requiredHeadcount * (attritionPercent / 100))
    const supportCoverageBuffer = staffingModel === 'support'
      ? Math.ceil((requiredHeadcount + attritionBuffer) * 0.15)
      : 0

    const recommendedHeadcount = requiredHeadcount + attritionBuffer + supportCoverageBuffer
    const hiringGap = Math.max(0, recommendedHeadcount - currentHeadcount)
    const hiresPerMonth = hiringLeadTimeMonths > 0
      ? Math.ceil(hiringGap / hiringLeadTimeMonths)
      : hiringGap

    const lowerBound = Math.max(requiredHeadcount, Math.floor(recommendedHeadcount * 0.9))
    const upperBound = Math.ceil(recommendedHeadcount * 1.1)

    const coverageRatio = currentHeadcount / Math.max(recommendedHeadcount, 1)
    const riskFlags: string[] = []

    if (coverageRatio < 0.8) {
      riskFlags.push('Your current team is at least 20% below what this model suggests you need. That gap will likely show up as delivery delays or team strain before you can close it.')
    }
    if (attritionPercent >= 15) {
      riskFlags.push('High turnover (15%+/year) means a meaningful share of your capacity is spent replacing people, not growing output. Retention may matter more than hiring right now.')
    }
    if (hiringLeadTimeMonths >= 4 && hiringGap > 0) {
      riskFlags.push('With a 4+ month hiring cycle, new hires won\'t be productive for a long time. The gap may hurt delivery well before it\'s closed — consider interim capacity options.')
    }
    if (peakLoadBufferPercent < 10) {
      riskFlags.push('A very low peak buffer means there\'s no slack for busy periods. Even a normal surge month could overwhelm the team — consider whether this scenario is realistic.')
    }
    if (staffingModel === 'support' && supportEscalationPercent >= 30) {
      riskFlags.push('More than 30% of tickets coming back as escalations or reopens is a signal the support system itself needs attention — a dedicated escalation tier or better triage may help more than headcount.')
    }
    if (staffingModel === 'support' && requiredHeadcount <= 2) {
      riskFlags.push('A team this small has almost no buffer for absences, on-call rotation, or handoffs. One person being out can materially affect the queue.')
    }
    if (riskFlags.length === 0) {
      riskFlags.push('No significant risks flagged for this scenario. Focus on execution quality and process improvement before adding headcount.')
    }

    return {
      effectiveDemand,
      targetWorkloadsPerMonth,
      peakLoadBufferPercent,
      supportEscalationPercent,
      requiredHeadcount,
      attritionBuffer,
      supportCoverageBuffer,
      recommendedHeadcount,
      hiringGap,
      hiresPerMonth,
      lowerBound,
      upperBound,
      riskFlags,
    }
  }, [
    attritionPercentInput,
    currentHeadcountInput,
    hiringLeadTimeMonthsInput,
    peakLoadBufferPercentInput,
    scenario,
    staffingModel,
    supportEscalationPercentInput,
    targetWorkloadsPerMonthInput,
    throughputPerEngineerPerMonthInput,
  ])

  const demandLabel = staffingModel === 'support'
    ? 'Support Tickets / Month'
    : 'Target Workloads / Month'

  const throughputLabel = staffingModel === 'support'
    ? 'Tickets Resolved / Support FTE / Month'
    : 'Throughput / Engineer / Month'

  const baselineLabel = staffingModel === 'support'
    ? 'Support Baseline Need'
    : 'Delivery Baseline Need'

  const demandHelpText = staffingModel === 'support'
    ? 'How many new support tickets come in during a normal month. Use a typical recent month, not your busiest one — peak load is handled separately.'
    : 'How many pieces of work the team needs to finish in a typical month. Think sprint deliverables, projects shipped, or similar units.'

  const throughputHelpText = staffingModel === 'support'
    ? 'How many tickets one person can fully resolve in a month — not just touch, but close. If someone handles about 45 tickets/month, enter 45.'
    : 'How many work items one person can fully complete in a month at a sustainable pace. If an engineer ships about 3 scoped deliverables/month, enter 3.'

  const fieldShellClass = 'block rounded-2xl border bg-[var(--surface)]/50 p-3'
  const fieldLabelClass = 'text-muted text-xs font-semibold uppercase tracking-[0.12em]'
  const fieldInputClass = 'mt-2 w-full rounded-xl border bg-[var(--surface)] px-3 py-2 text-sm text-strong tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-300/60'

  const hiringLeadTimeMonths = Math.round(parseNumberInput(hiringLeadTimeMonthsInput, 3, 0, 24))

  return (
    <Container size="narrow" className="pb-4 md:pb-8">
      <section className="surface-card enter-rise mb-8 rounded-3xl border px-6 py-7 shadow-sm md:mb-10 md:px-8 md:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Toolbox</p>
        <h1 className="text-strong mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Staffing Calculator
        </h1>
        <p className="text-muted mt-3 max-w-3xl text-sm md:text-base">
          Most staffing conversations focus on average utilization. This tool helps you think about flow and risk: where demand spikes, how long it takes to hire, and what breaks when the team is stretched.
        </p>
        <p className="mt-3 text-sm">
          <span className="text-muted">New to this framing? </span>
          <Link href="/blog/operational-risk" className="text-teal-700 underline underline-offset-2 hover:text-teal-900">
            Read the post first →
          </Link>
        </p>
      </section>

      <section className="surface-card mb-6 rounded-3xl border px-6 py-6 shadow-sm md:px-7 md:py-7">
        <h2 className="text-strong text-lg font-semibold tracking-tight md:text-xl">Inputs</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={fieldShellClass}>
            <span className={fieldLabelClass}>Staffing Model</span>
            <div className="mt-2 flex gap-2">
              {(['operational', 'support'] as StaffingModel[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setStaffingModel(m)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                    staffingModel === m
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-[var(--border)] bg-[var(--surface)] text-strong hover:border-teal-400'
                  }`}
                >
                  {m === 'operational' ? 'Operational' : 'Support'}
                </button>
              ))}
            </div>
          </div>

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Current Team Size</span>
            <input
              type="text"
              inputMode="numeric"
              className={fieldInputClass}
              value={currentHeadcountInput}
              onChange={(e) => setCurrentHeadcountInput(e.target.value)}
            />
            <p className="text-muted mt-2 text-xs">How many people currently do this work.</p>
          </label>

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>{demandLabel}</span>
            <input
              type="text"
              inputMode="numeric"
              className={fieldInputClass}
              value={targetWorkloadsPerMonthInput}
              onChange={(e) => setTargetWorkloadsPerMonthInput(e.target.value)}
            />
            <p className="text-muted mt-2 text-xs">{demandHelpText}</p>
          </label>

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>
              {throughputLabel}
            </span>
            <input
              type="text"
              inputMode="decimal"
              className={fieldInputClass}
              value={throughputPerEngineerPerMonthInput}
              onChange={(e) => setThroughputPerEngineerPerMonthInput(e.target.value)}
            />
            <p className="text-muted mt-2 text-xs">{throughputHelpText}</p>
          </label>

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Peak Load Buffer (%)</span>
            <input
              type="text"
              inputMode="numeric"
              className={fieldInputClass}
              value={peakLoadBufferPercentInput}
              onChange={(e) => setPeakLoadBufferPercentInput(e.target.value)}
            />
            <p className="text-muted mt-2 text-xs">How much extra demand to plan for during busy periods. If you don't know, 15–25% is a reasonable starting point.</p>
          </label>

          {staffingModel === 'support' && (
            <label className={fieldShellClass}>
              <span className={fieldLabelClass}>Escalation / Reopen Load (%)</span>
              <input
                type="text"
                inputMode="numeric"
                className={fieldInputClass}
                value={supportEscalationPercentInput}
                onChange={(e) => setSupportEscalationPercentInput(e.target.value)}
              />
              <p className="text-muted mt-2 text-xs">What percentage of ticket volume comes back as escalations or reopens. This adds to the real workload.</p>
            </label>
          )}

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Annual Attrition (%)</span>
            <input
              type="text"
              inputMode="numeric"
              className={fieldInputClass}
              value={attritionPercentInput}
              onChange={(e) => setAttritionPercentInput(e.target.value)}
            />
            <p className="text-muted mt-2 text-xs">What percentage of the team typically leaves in a year. 10–15% is a reasonable default.</p>
          </label>

          <label className={fieldShellClass}>
            <span className={fieldLabelClass}>Hiring Lead Time (Months)</span>
            <input
              type="text"
              inputMode="numeric"
              className={fieldInputClass}
              value={hiringLeadTimeMonthsInput}
              onChange={(e) => setHiringLeadTimeMonthsInput(e.target.value)}
            />
            <p className="text-muted mt-2 text-xs">How long it takes from opening a role to having someone fully productive.</p>
          </label>

          <div className={fieldShellClass}>
            <span className={fieldLabelClass}>Scenario</span>
            <div className="mt-2 flex gap-2">
              {(['conservative', 'expected', 'aggressive'] as Scenario[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScenario(s)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                    scenario === s
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-[var(--border)] bg-[var(--surface)] text-strong hover:border-teal-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-muted mt-2 text-xs">Expected is your honest baseline. Conservative adjusts for things going slower than planned — use it when the team is new or the work is complex. Aggressive is only realistic if throughput is already proven and stable.</p>
          </div>
        </div>

        <div className="callout mt-5 text-xs">
          <p className="callout-title">Quick Glossary</p>
          <p>FTE means one full-time person. Throughput is how much completed work one person produces in a month — not started, not in-progress, but done.</p>
        </div>
      </section>

      <section className="surface-card mb-6 rounded-3xl border px-6 py-6 shadow-sm md:px-7 md:py-7">
        <h2 className="text-strong text-lg font-semibold tracking-tight md:text-xl">Outputs</h2>
        <p className="text-muted mt-2 text-sm">
          These numbers are planning signals, not precise targets. Use them to spot gaps and pressure-test decisions — then apply your own judgment about timing, context, and what you know about your team.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border px-4 py-3">
            <p className="text-muted text-[11px] font-semibold uppercase tracking-[0.12em]">Recommended Headcount</p>
            <p className="text-strong mt-1 text-2xl font-semibold">{results.recommendedHeadcount}</p>
            <p className="text-muted mt-1 text-xs">Range: {results.lowerBound} to {results.upperBound}</p>
            <p className="text-muted mt-1 text-xs">The team size this model suggests you should be working toward, including buffers for turnover and busy periods.</p>
          </div>

          <div className="rounded-2xl border px-4 py-3">
            <p className="text-muted text-[11px] font-semibold uppercase tracking-[0.12em]">Hiring Gap</p>
            <p className="text-strong mt-1 text-2xl font-semibold">{results.hiringGap}</p>
            <p className="text-muted mt-1 text-xs">Approx. {results.hiresPerMonth}/month over {hiringLeadTimeMonths} months</p>
            <p className="text-muted mt-1 text-xs">How many additional people you need to hire to reach the recommended team size. Zero means your current team is sufficient for this scenario.</p>
          </div>

          <div className="rounded-2xl border px-4 py-3">
            <p className="text-muted text-[11px] font-semibold uppercase tracking-[0.12em]">{baselineLabel}</p>
            <p className="text-strong mt-1 text-2xl font-semibold">{results.requiredHeadcount}</p>
            <p className="text-muted mt-1 text-xs">The bare minimum to keep up with demand — before accounting for anyone leaving. Think of this as the floor, not the target.</p>
          </div>

          <div className="rounded-2xl border px-4 py-3">
            <p className="text-muted text-[11px] font-semibold uppercase tracking-[0.12em]">Attrition Buffer</p>
            <p className="text-strong mt-1 text-2xl font-semibold">{results.attritionBuffer}</p>
            <p className="text-muted mt-1 text-xs">Extra headcount to cover the gap between someone leaving and their replacement being fully up to speed.</p>
          </div>

          <div className="rounded-2xl border px-4 py-3">
            <p className="text-muted text-[11px] font-semibold uppercase tracking-[0.12em]">Effective Demand</p>
            <p className="text-strong mt-1 text-2xl font-semibold">{results.effectiveDemand}</p>
            <p className="text-muted mt-1 text-xs">
              {results.targetWorkloadsPerMonth} base
              {results.peakLoadBufferPercent > 0 && ` + ${results.peakLoadBufferPercent}% peak buffer`}
              {staffingModel === 'support' && results.supportEscalationPercent > 0 && ` + ${results.supportEscalationPercent}% escalation load`}
              {' = what this model actually staffs against.'}
            </p>
          </div>

          {staffingModel === 'support' && (
            <div className="rounded-2xl border px-4 py-3">
              <p className="text-muted text-[11px] font-semibold uppercase tracking-[0.12em]">Coverage Buffer</p>
              <p className="text-strong mt-1 text-2xl font-semibold">{results.supportCoverageBuffer}</p>
              <p className="text-muted mt-1 text-xs">Extra people to keep the queue moving when someone is out, in a handoff, or unavailable. Without this, small teams frequently bottleneck on coverage.</p>
            </div>
          )}
        </div>

        <div className="callout mt-5 text-xs">
          <p className="callout-title">How To Read Results</p>
          <ul className="mt-2 space-y-1">
            <li>If the hiring gap is 0, your current team size is sufficient for this scenario.</li>
            <li>If there is a hiring gap, check whether your recruiting pace can actually hit the hires/month figure.</li>
            <li>If recommended headcount seems too high, don't just raise the throughput number — that only works if the process has actually improved.</li>
            <li>If risk flags appear, more people usually helps, but fixing how the work flows often helps more.</li>
          </ul>
        </div>
      </section>

      <section className="surface-card mb-6 rounded-3xl border px-6 py-6 shadow-sm md:px-7 md:py-7">
        <h2 className="text-strong text-lg font-semibold tracking-tight md:text-xl">Risk Flags</h2>
        <ul className="mt-4 space-y-2">
          {results.riskFlags.map((risk) => (
            <li key={risk} className="callout callout-warning text-sm">
              {risk}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card rounded-3xl border px-6 py-6 shadow-sm md:px-7 md:py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">How To Use This</p>
        <p className="text-muted mt-3 text-sm md:text-base">
          Start with your monthly average demand and current team size. Adjust the buffers to reflect realistic busy periods and turnover. The outputs will show you where the model breaks. Use that to start the headcount conversation — not to end it.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/frameworks/framework/how-to-grow-a-high-performing-team"
            className="inline-flex rounded-xl border px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30"
          >
            Open the High-Performing Team Framework
          </Link>
          <Link
            href="/blog/operational-risk"
            className="inline-flex rounded-xl border px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30"
          >
            Read: Staffing Isn't About Headcount
          </Link>
        </div>
      </section>
    </Container>
  )
}