import {
  Coffee,
  Cog,
  Flame,
  Footprints,
  Snowflake,
  Store,
  ThermometerSnowflake,
  Zap,
  ZapOff,
  type LucideIcon,
} from "lucide-react";
import { exclusions, getCoverages } from "../../data/mockInsurance";
import type { Coverage, CoverageExample, ScenarioIcon } from "../../types/insurance";
import { cn, formatCurrency } from "../../utils/formatters";

const SCENARIO_ICONS: Record<ScenarioIcon, LucideIcon> = {
  footprints: Footprints,
  coffee: Coffee,
  store: Store,
  flame: Flame,
  cog: Cog,
  zap: Zap,
  "zap-off": ZapOff,
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

function ScenarioList({ items }: { items: CoverageExample[] }) {
  return (
    <ul className="mt-4 grid gap-x-4 gap-y-4 text-sm sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-3 text-body">
          <ScenarioGlyph icon={item.icon} />
          {item.text}
        </li>
      ))}
    </ul>
  );
}

function CoverageCard({ coverage }: { coverage: Coverage }) {
  const hasExcess = coverage.excess > 0;

  return (
    <article className="rounded-lg border border-hairline bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="min-w-0 text-lg">{coverage.name}</h3>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="inline-block rounded-[6px] bg-[#FFE4D4] px-2 py-0.5 text-[11px] font-semibold tracking-wider text-corgi uppercase">
            Limit
          </span>
          <p className="text-xl font-semibold tracking-tight text-ink">{coverage.limitShort}</p>
        </div>
      </div>

      <p className="mt-4 text-sm">{coverage.summary}</p>

      <ScenarioList items={coverage.examples} />

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

      <section aria-labelledby="exclusions-title" className="space-y-4">
        <h2 id="exclusions-title" className="text-xl">What's Not Covered</h2>
        {exclusions.map((item) => (
          <article key={item.id} className="rounded-lg border border-hairline bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="min-w-0 text-lg">{item.title}</h3>
              <span className="inline-block shrink-0 rounded-[6px] bg-[#191919] px-2 py-0.5 text-[11px] font-semibold tracking-wider text-white uppercase">
                Excluded
              </span>
            </div>
            <p className="mt-4 text-sm">{item.description}</p>
            <ScenarioList items={item.examples} />
          </article>
        ))}
      </section>
    </>
  );
}
