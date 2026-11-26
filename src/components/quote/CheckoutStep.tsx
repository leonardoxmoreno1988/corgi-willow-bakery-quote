import { ArrowLeft, Check, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { POLICY_REFERENCE, REASSURANCE, formatCompact, pluralEmployees } from "../../data/mockInsurance";
import type { QuestionnaireAnswers } from "../../types/insurance";
import { formatCurrency } from "../../utils/formatters";

interface CheckoutStepProps {
  answers: QuestionnaireAnswers;
  monthlyPrice: number;
  onBack: () => void;
  onReset: () => void;
  onActivated: () => void;
}

type Phase = "idle" | "paying" | "active";

export function CheckoutStep({ answers, monthlyPrice, onBack, onReset, onActivated }: CheckoutStepProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const price = `${formatCurrency(monthlyPrice)}/month`;
  const meta: { label: string; value: string }[] = [
    { label: "Policyholder", value: answers.businessName },
    { label: "Start date", value: "Immediate upon payment" },
    { label: "Billing", value: "Monthly, cancel anytime" },
  ];
  const policy: { label: string; value: string }[] = [
    { label: "Monthly price", value: price },
    { label: "Business", value: answers.businessName },
    { label: "Team size", value: pluralEmployees(answers.employees) },
    { label: "Public Liability", value: "Up to £1m · £0 excess" },
    { label: "Equipment Cover", value: `Up to ${formatCurrency(answers.equipmentValue)} · £250 excess` },
    { label: "Not covered", value: "Stock spoilage" },
  ];

  const pay = () => {
    setPhase("paying");
    timer.current = window.setTimeout(() => {
      setPhase("active");
      onActivated();
    }, 900);
  };

  if (phase === "active") {
    return (
      <div className="animate-fade-up mx-auto max-w-xl py-6 sm:py-12">
        <div className="rounded-lg border border-hairline bg-surface p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="animate-ripple relative size-16 shrink-0 rounded-full">
              <div className="animate-pop rounded-full">
                <img
                  src="/logos/app-icon-512.png"
                  alt="Corgi"
                  width={64}
                  height={64}
                  className="animate-float h-16 w-16 rounded-full object-contain"
                />
              </div>
              <span
                className="animate-pop absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-[#16A34A] text-white ring-2 ring-surface"
                style={{ animationDelay: "250ms", animationFillMode: "both" }}
              >
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </span>
            </div>
            <span
              className="animate-fade-up rounded-lg border border-hairline bg-fog px-2.5 py-1 text-xs font-semibold text-ink"
              style={{ animationDelay: "150ms" }}
            >
              Policy #{POLICY_REFERENCE} · Active
            </span>
          </div>
          <h1 className="animate-fade-up mt-5 text-3xl sm:text-4xl" style={{ animationDelay: "200ms" }}>
            Cover Activated
          </h1>
          <p className="animate-fade-up mt-3" style={{ animationDelay: "260ms" }}>
            {answers.businessName} is covered from now. We've emailed your policy documents.
          </p>
          <dl className="mt-6 space-y-3 border-t border-hairline pt-5 text-sm">
            {policy.map((row, i) => (
              <div
                key={row.label}
                className="animate-fade-up flex justify-between gap-4"
                style={{ animationDelay: `${340 + i * 60}ms` }}
              >
                <dt className="text-muted">{row.label}</dt>
                <dd className="text-right font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={onReset}
            className="animate-fade-up mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-hairline px-5 py-3 text-sm font-medium transition-all duration-300 ease-spring hover:border-ink active:scale-95"
            style={{ animationDelay: `${340 + policy.length * 60}ms` }}
          >
            <RotateCcw className="size-4" aria-hidden />
            Reset prototype
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up mx-auto max-w-xl py-6 sm:py-12">
      <div className="rounded-lg border border-hairline bg-surface p-6 sm:p-8">
        <CheckCircle2 className="size-8 text-ink" aria-hidden />
        <h1 className="mt-4 text-3xl sm:text-4xl">Checkout & Bind Cover</h1>
        <p className="mt-3">You're one step from being covered. Here's exactly what you're buying.</p>

        <div className="mt-6 rounded-lg border border-hairline bg-fog p-5">
          <p className="text-4xl font-semibold tracking-[-0.04em] text-ink">
            {formatCurrency(monthlyPrice)}
            <span className="text-lg font-medium text-muted">/month</span>
          </p>
          <p className="mt-3 text-sm font-medium text-ink">
            {pluralEmployees(answers.employees)} · £1m Public Liability + {formatCompact(answers.equipmentValue)} Equipment Cover
          </p>
          <dl className="mt-4 space-y-3 border-t border-hairline pt-4 text-sm">
            {meta.map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <dt className="text-muted">{row.label}</dt>
                <dd className="text-right font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-1 text-xs text-muted">£250 excess on equipment claims. Stock spoilage isn't covered.</p>
        </div>

        <button
          type="button"
          onClick={pay}
          disabled={phase === "paying"}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-corgi px-5 py-3.5 text-base font-semibold text-white transition-all duration-300 ease-spring hover:scale-[1.02] hover:bg-[#e65200] active:scale-95 disabled:scale-100 disabled:opacity-80"
        >
          {phase === "paying" && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {phase === "paying" ? "Activating…" : "Pay & Activate Cover"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">{REASSURANCE}</p>

        <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-hairline pt-5 text-sm font-medium">
          <button type="button" onClick={onBack} className="flex items-center gap-1.5 hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden />
            Back to quote
          </button>
          <button type="button" onClick={onReset} className="flex items-center gap-1.5 text-muted hover:text-ink">
            <RotateCcw className="size-4" aria-hidden />
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}
