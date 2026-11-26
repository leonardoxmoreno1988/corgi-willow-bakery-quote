import { Ban, Check, Shield, Wrench } from "lucide-react";
import { exclusions, getCoverages } from "../../data/mockInsurance";
import type { Coverage } from "../../types/insurance";
import { formatCurrency } from "../../utils/formatters";

const ICONS = { shield: Shield, wrench: Wrench } as const;

function CoverageCard({ coverage }: { coverage: Coverage }) {
  const Icon = ICONS[coverage.icon];
  const hasExcess = coverage.excess > 0;

  return (
    <article className="rounded-lg border border-hairline bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-fog">
            <Icon className="size-5 text-ink" aria-hidden />
          </span>
          <h3 className="text-lg">{coverage.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Limit</p>
          <p className="text-xl font-semibold tracking-tight text-ink">{coverage.limitShort}</p>
        </div>
      </div>

      <p className="mt-4 text-sm">{coverage.summary}</p>

      <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        {coverage.examples.map((example) => (
          <li key={example} className="flex items-start gap-2 text-body">
            <Check className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
            {example}
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-lg border border-hairline bg-fog p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-ink">
            {hasExcess ? `${formatCurrency(coverage.excess)} excess` : "£0 excess"}
          </p>
          <p className="text-xs text-muted">{hasExcess ? "On equipment claims" : "On any claim"}</p>
        </div>
        <p className="mt-1 text-sm">{coverage.excessExplainer}</p>
      </div>
    </article>
  );
}

export function CoverageBreakdown({ equipmentValue }: { equipmentValue: number }) {
  return (
    <>
      <section aria-labelledby="coverage-title" className="space-y-4">
        <h2 id="coverage-title" className="text-xl">What You're Covered For</h2>
        {getCoverages(equipmentValue).map((coverage) => (
          <CoverageCard key={coverage.id} coverage={coverage} />
        ))}
      </section>

      <section
        aria-labelledby="exclusions-title"
        className="rounded-lg border border-hairline border-l-[3px] border-l-ink bg-[#FAFAFA] p-5 sm:p-6"
      >
        <h2 id="exclusions-title" className="flex items-center gap-2 text-xl">
          <Ban className="size-5" aria-hidden />
          What's Not Covered
        </h2>
        <ul className="mt-4 space-y-4">
          {exclusions.map((item) => (
            <li key={item.id}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink">{item.title}</p>
                <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Not covered
                </span>
              </div>
              <p className="mt-1 text-sm">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
