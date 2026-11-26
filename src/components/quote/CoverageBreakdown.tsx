import {
  Coffee,
  Cog,
  Flame,
  Footprints,
  Snowflake,
  Store,
  ThermometerSnowflake,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { exclusions, getCoverages } from "../../data/mockInsurance";
import type { Coverage, ScenarioIcon } from "../../types/insurance";
import { cn, formatCurrency } from "../../utils/formatters";

const SCENARIO_ICONS: Record<ScenarioIcon, LucideIcon> = {
  footprints: Footprints,
  coffee: Coffee,
  store: Store,
  flame: Flame,
  cog: Cog,
  zap: Zap,
  snowflake: Snowflake,
  "thermometer-snowflake": ThermometerSnowflake,
};

function ScenarioGlyph({ icon, className }: { icon: ScenarioIcon; className?: string }) {
  const Icon = SCENARIO_ICONS[icon];
  return (
    <Icon
      className={cn("h-[22px] w-[22px] shrink-0 text-body", className)}
      strokeWidth={1.75}
      aria-hidden
    />
  );
}

function CoverageCard({ coverage }: { coverage: Coverage }) {
  const hasExcess = coverage.excess > 0;

  return (
    <article className="rounded-lg border border-hairline bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg">{coverage.name}</h3>
        <div className="text-right">
          <span className="mb-1 inline-block rounded-[6px] bg-[#FFE4D4] px-2 py-0.5 text-[11px] font-semibold tracking-wider text-corgi uppercase">
            Limit
          </span>
          <p className="text-xl font-semibold tracking-tight text-ink">{coverage.limitShort}</p>
        </div>
      </div>

      <p className="mt-4 text-sm">{coverage.summary}</p>

      <ul className="mt-4 grid gap-x-4 gap-y-4 text-sm sm:grid-cols-2">
        {coverage.examples.map((example) => (
          <li key={example.text} className="flex items-start gap-3 text-body">
            <ScenarioGlyph icon={example.icon} />
            {example.text}
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
        className="rounded-lg border border-hairline bg-[#FAFAFA] p-5 sm:p-6"
      >
        <h2 id="exclusions-title" className="text-xl">What's Not Covered</h2>
        <ul className="mt-4 space-y-4">
          {exclusions.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <ScenarioGlyph icon={item.icon} className="text-ink" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Not covered
                  </span>
                </div>
                <p className="mt-1 text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
