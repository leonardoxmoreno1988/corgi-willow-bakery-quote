import { ChevronDown, Loader2, Minus, Plus, TrendingDown, TrendingUp, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  CLAIMS_OPTIONS,
  MAX_EMPLOYEES,
  MIN_EMPLOYEES,
  MAX_EQUIPMENT_VALUE,
  MIN_EQUIPMENT_VALUE,
  priceChangeReason,
  priceFor,
  pluralEmployees,
} from "../../data/mockInsurance";
import type { ClaimsHistory, QuestionnaireAnswers } from "../../types/insurance";
import { cn, formatCurrency } from "../../utils/formatters";

export type FocusTarget = "business" | "location" | "team" | "equipment";

interface EditDrawerProps {
  open: boolean;
  answers: QuestionnaireAnswers;
  originalEmployees: number;
  currentPrice: number;
  focus: FocusTarget;
  onClose: () => void;
  onSave: (next: QuestionnaireAnswers) => void;
}

const inputClass =
  "w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-muted hover:border-muted focus:border-ink focus:outline-none";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 border-b border-hairline pb-6 last:border-0">
      <legend className="mb-4 text-base font-semibold tracking-tight text-heading">{title}</legend>
      {children}
    </fieldset>
  );
}

function clampEmployees(n: number): number {
  if (Number.isNaN(n)) return MIN_EMPLOYEES;
  return Math.min(MAX_EMPLOYEES, Math.max(MIN_EMPLOYEES, Math.round(n)));
}

/** Mounted fresh (via key) each time the drawer opens so the draft starts from committed answers. */
export function EditDrawer({
  open,
  answers,
  originalEmployees,
  currentPrice,
  focus,
  onClose,
  onSave,
}: EditDrawerProps) {
  const uid = useId();
  const [draft, setDraft] = useState<QuestionnaireAnswers>(answers);
  const [recalculating, setRecalculating] = useState(false);
  const employeeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const equipmentRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number>(undefined);

  const draftPrice = priceFor(draft);
  const delta = draftPrice - currentPrice;
  const dirty = (Object.keys(answers) as (keyof QuestionnaireAnswers)[]).some(
    (k) => answers[k] !== draft[k],
  );

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      const el = { business: nameRef, location: locationRef, team: employeeRef, equipment: equipmentRef }[focus].current;
      el?.focus();
      el?.select();
    }, 320);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, focus, onClose]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const set = <K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const setNumber = (key: "annualTurnover" | "equipmentValue", raw: string) =>
    set(key, Math.max(0, Number(raw.replace(/[^\d]/g, "")) || 0));

  const submit = () => {
    if (!dirty || recalculating) return;
    setRecalculating(true);
    timer.current = window.setTimeout(() => {
      setRecalculating(false);
      onSave({
        ...draft,
        equipmentValue: Math.min(
          MAX_EQUIPMENT_VALUE,
          Math.max(MIN_EQUIPMENT_VALUE, draft.equipmentValue),
        ),
      });
    }, 350);
  };

  const employeesChanged = draft.employees !== answers.employees;

  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-500 ease-spring",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-hairline p-5">
          <div>
            <h2 id={`${uid}-title`} className="text-xl">Edit Questionnaire Answers</h2>
            <p className="mt-1.5 text-sm">Change anything below. Nothing is saved until you update your quote.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-fog hover:text-ink"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <form
          className="flex-1 space-y-6 overflow-y-auto p-5 pb-10"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Section title="Business Details">
            <Field label="Business name" htmlFor={`${uid}-name`}>
              <input
                ref={nameRef}
                id={`${uid}-name`}
                className={inputClass}
                value={draft.businessName}
                onChange={(e) => set("businessName", e.target.value)}
              />
            </Field>
            <Field label="Trade" htmlFor={`${uid}-trade`}>
              <input
                id={`${uid}-trade`}
                className={inputClass}
                value={draft.trade}
                onChange={(e) => set("trade", e.target.value)}
              />
            </Field>
            <Field label="Location" htmlFor={`${uid}-location`}>
              <input
                ref={locationRef}
                id={`${uid}-location`}
                className={inputClass}
                value={draft.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </Field>
            <Field label="Annual turnover (£)" htmlFor={`${uid}-turnover`}>
              <input
                id={`${uid}-turnover`}
                inputMode="numeric"
                className={inputClass}
                value={draft.annualTurnover.toLocaleString("en-GB")}
                onChange={(e) => setNumber("annualTurnover", e.target.value)}
              />
            </Field>
          </Section>

          <Section title="Team Size">
            <Field label="Number of employees" htmlFor={`${uid}-employees`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-hairline transition-colors focus-within:border-muted">
                  <button
                    type="button"
                    aria-label="Remove one employee"
                    disabled={draft.employees <= MIN_EMPLOYEES}
                    onClick={() => set("employees", clampEmployees(draft.employees - 1))}
                    className="flex size-10 items-center justify-center rounded-l-lg focus:outline-none transition-colors duration-200 hover:bg-fog focus-visible:bg-fog focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-inset active:bg-hairline disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <input
                    ref={employeeRef}
                    id={`${uid}-employees`}
                    type="number"
                    min={MIN_EMPLOYEES}
                    max={MAX_EMPLOYEES}
                    value={draft.employees}
                    onChange={(e) => set("employees", clampEmployees(e.target.valueAsNumber))}
                    className="h-10 w-14 [appearance:textfield] border-x border-hairline text-center text-base font-semibold tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    aria-label="Add one employee"
                    disabled={draft.employees >= MAX_EMPLOYEES}
                    onClick={() => set("employees", clampEmployees(draft.employees + 1))}
                    className="flex size-10 items-center justify-center rounded-r-lg focus:outline-none transition-colors duration-200 hover:bg-fog focus-visible:bg-fog focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-inset active:bg-hairline disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Plus className="size-4" aria-hidden />
                  </button>
                </div>
                {employeesChanged && (
                  <span key={draft.employees} className="animate-pop rounded-lg border border-hairline bg-fog px-2.5 py-1 text-xs font-semibold text-ink">
                    {answers.employees} → {draft.employees}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-muted">
                Include full-time, part-time and casual staff. Original answer: {pluralEmployees(originalEmployees)}.
              </p>
            </Field>
          </Section>

          <Section title="Equipment & History">
            <Field label="Equipment replacement value (£)" htmlFor={`${uid}-equipment`}>
              <input
                ref={equipmentRef}
                id={`${uid}-equipment`}
                inputMode="numeric"
                className={inputClass}
                value={draft.equipmentValue.toLocaleString("en-GB")}
                onChange={(e) => setNumber("equipmentValue", e.target.value)}
              />
            </Field>
            <Field label="Claims in last 3 years" htmlFor={`${uid}-claims`}>
              <div className="relative">
              <select
                id={`${uid}-claims`}
                className={`${inputClass} cursor-pointer appearance-none pr-10`}
                value={draft.claimsLast3Years}
                onChange={(e) => set("claimsLast3Years", e.target.value as ClaimsHistory)}
              >
                {CLAIMS_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
              </div>
            </Field>
          </Section>
        </form>

        <div className="space-y-3 border-t border-hairline bg-surface p-5">
          {delta !== 0 && (
            <div
              key={draftPrice}
              className="animate-fade-up flex items-start gap-3 rounded-lg border border-[#FBBF24]/70 bg-[#FFFBEB] px-4 py-3 text-sm"
            >
              {delta > 0 ? (
                <TrendingUp className="mt-0.5 size-4 shrink-0 text-[#D97706]" aria-hidden />
              ) : (
                <TrendingDown className="mt-0.5 size-4 shrink-0 text-[#D97706]" aria-hidden />
              )}
              <div>
                <p className="text-[#78350F]">
                  New estimated price:{" "}
                  <span className="font-semibold">
                    {formatCurrency(draftPrice)}/month ({delta > 0 ? "+" : "−"}
                    {formatCurrency(Math.abs(delta))}/mo)
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#92400E]">{priceChangeReason(answers, draft)}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-hairline px-4 py-3 text-sm font-medium transition-colors hover:border-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!dirty || recalculating}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-corgi px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-[#e65200] active:scale-95 disabled:bg-hairline disabled:text-muted"
            >
              {recalculating && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {recalculating ? "Recalculating…" : "Update Quote"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
