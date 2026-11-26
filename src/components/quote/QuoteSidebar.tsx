import { ArrowRight, TrendingDown, TrendingUp, Undo2 } from "lucide-react";
import { REASSURANCE, priceFor } from "../../data/mockInsurance";
import type { QuestionnaireAnswers } from "../../types/insurance";
import { cn, formatCurrency } from "../../utils/formatters";

interface QuoteSidebarProps {
  answers: QuestionnaireAnswers;
  original: QuestionnaireAnswers;
  /** Increments each time the quote is recalculated, to re-trigger the pulse. */
  pulseKey: number;
  onContinue: () => void;
  onReview: () => void;
  onUndo: () => void;
}

function PriceChange({
  answers,
  original,
  onReview,
  onUndo,
}: Pick<QuoteSidebarProps, "answers" | "original" | "onReview" | "onUndo">) {
  const monthlyPrice = priceFor(answers);
  const originalPrice = priceFor(original);
  const delta = monthlyPrice - originalPrice;
  const teamChanged = answers.employees !== original.employees;
  const kitChanged = answers.equipmentValue !== original.equipmentValue;
  if (!teamChanged && !kitChanged) return null;

  const up = delta > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  const sign = up ? "+" : "−";

  const changes: string[] = [];
  const reasons: string[] = [];
  if (teamChanged) {
    changes.push(`employees from ${original.employees} to ${answers.employees}`);
    reasons.push(
      answers.employees > original.employees
        ? "more staff increases public liability exposure"
        : "fewer staff reduces public liability exposure",
    );
  }
  if (kitChanged) {
    changes.push(
      `equipment value from ${formatCurrency(original.equipmentValue)} to ${formatCurrency(answers.equipmentValue)}`,
    );
    reasons.push(
      answers.equipmentValue > original.equipmentValue
        ? "a higher equipment limit costs more to insure"
        : "a lower equipment limit costs less to insure",
    );
  }

  return (
    <div className="animate-fade-up mt-5 rounded-lg border border-hairline bg-fog p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        {delta !== 0 && <Icon className="size-4" aria-hidden />}
        Why your price changed
      </p>
      <p className="mt-2 text-sm">
        <span className="font-semibold text-ink">
          {delta === 0 ? "No change" : `${sign}${formatCurrency(Math.abs(delta))}/month`}
        </span>{" "}
        · Updated from {formatCurrency(originalPrice)}/mo after changing {changes.join(" and ")} —{" "}
        {reasons.join(" and ")}
      </p>
      <div className="mt-3 flex gap-4 text-sm font-medium">
        <button type="button" onClick={onReview} className="underline underline-offset-4 hover:text-ink">
          Review answers
        </button>
        <button type="button" onClick={onUndo} className="flex items-center gap-1 underline underline-offset-4 hover:text-ink">
          <Undo2 className="size-3.5" aria-hidden />
          Undo
        </button>
      </div>
    </div>
  );
}

export function QuoteSidebar(props: QuoteSidebarProps) {
  const { answers, pulseKey, onContinue } = props;
  const monthlyPrice = priceFor(answers);
  const annual = monthlyPrice * 12;

  return (
    <>
      <aside
        aria-label="Quote summary"
        className="rounded-lg border border-hairline bg-surface p-5 sm:p-6 lg:sticky lg:top-24"
      >
        <p className="text-sm font-medium text-muted">Your quote</p>
        <div
          key={pulseKey}
          className={cn(
            "mt-2 inline-block rounded-lg",
            pulseKey > 0 && "animate-pulse-orange",
          )}
        >
          <p className="flex items-baseline gap-1 text-ink">
            <span
              key={monthlyPrice}
              className={cn(
                "inline-block text-5xl font-semibold tracking-[-0.04em]",
                pulseKey > 0 && "animate-pop",
              )}
            >
              {formatCurrency(monthlyPrice)}
            </span>
            <span className="text-lg font-medium text-muted">/month</span>
          </p>
        </div>
        <p className="mt-1 text-sm text-muted">{formatCurrency(annual)} a year</p>

        <ul className="mt-5 space-y-3 border-t border-hairline pt-5 text-sm">
          <li className="flex justify-between gap-4">
            <span className="text-muted">Public Liability</span>
            <span className="font-medium text-ink">Up to £1m</span>
          </li>
          <li className="flex justify-between gap-4">
            <span className="text-muted">Equipment Cover</span>
            <span className="font-medium text-ink">Up to {formatCurrency(answers.equipmentValue)}</span>
          </li>
          <li className="flex justify-between gap-4">
            <span className="text-muted">Equipment excess</span>
            <span className="font-medium text-ink">£250</span>
          </li>
          <li className="flex justify-between gap-4">
            <span className="text-muted">Excludes</span>
            <span className="font-medium text-ink">Stock spoilage</span>
          </li>
        </ul>

        <PriceChange {...props} />

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 hidden w-full items-center justify-center gap-2 rounded-lg bg-corgi px-5 py-3.5 text-base font-semibold text-white transition-all duration-300 ease-spring hover:scale-[1.02] hover:bg-[#e65200] active:scale-95 lg:flex"
        >
          Continue to Payment
          <ArrowRight className="size-4" aria-hidden />
        </button>
        <p className="mt-3 text-center text-xs text-muted">{REASSURANCE}</p>
      </aside>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div>
            <p className="text-xl font-semibold leading-none tracking-tight text-ink">
              {formatCurrency(monthlyPrice)}
              <span className="text-sm font-medium text-muted">/month</span>
            </p>
            <p className="mt-1 text-[11px] text-muted">No broker fees · Cancel anytime</p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="ml-auto flex items-center gap-2 rounded-lg bg-corgi px-4 py-3 text-sm font-semibold text-white transition-transform duration-300 ease-spring active:scale-95"
          >
            Continue to Payment
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </>
  );
}
