import { Check, RotateCcw, Store } from "lucide-react";
import { business } from "../../data/mockInsurance";
import { cn } from "../../utils/formatters";

export type Step = "review" | "checkout";

interface QuoteHeaderProps {
  step: Step;
  canReset: boolean;
  onReset: () => void;
  onEditAnswers: () => void;
}

const STEPS = ["Questionnaire", "Review Quote", "Activate Cover"] as const;

export function QuoteHeader({ step, canReset, onReset, onEditAnswers }: QuoteHeaderProps) {
  const activeIndex = step === "review" ? 1 : 2;

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <img src="/logos/corgi-logo-orange.svg" alt="Corgi" className="h-6 w-auto" />

        <ol className="hidden items-center gap-2 md:flex" aria-label="Progress">
          {STEPS.map((label, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            return (
              <li
                key={label}
                aria-current={active ? "step" : undefined}
                className="flex items-center gap-2"
              >
                {i > 0 && <span className="h-px w-6 bg-hairline" aria-hidden />}
                {(() => {
                  const clickable = i === 0 && step === "review";
                  const Tag = clickable ? "button" : "span";
                  return (
                    <Tag
                      {...(clickable
                        ? { type: "button" as const, onClick: onEditAnswers, title: "Edit your answers" }
                        : {})}
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        active ? "font-bold text-heading" : "text-muted",
                        clickable && "cursor-pointer transition-colors hover:text-heading",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-300",
                          active && "bg-heading text-white",
                          done && "bg-[#16A34A] text-white",
                          !active && !done && "border border-hairline",
                        )}
                      >
                        {done ? <Check className="size-3" strokeWidth={3} aria-hidden /> : i + 1}
                      </span>
                      {label}
                    </Tag>
                  );
                })()}
              </li>
            );
          })}
        </ol>

        <div className="flex items-center gap-3">
          {canReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Reset prototype</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Store className="size-4 text-muted" aria-hidden />
            {business.name}
          </div>
        </div>
      </div>
      <p className="border-t border-hairline px-4 py-1.5 text-center text-xs font-medium text-ink md:hidden">
        Step {activeIndex + 1} of 3 · {STEPS[activeIndex]}
      </p>
    </header>
  );
}
