import { Pencil } from "lucide-react";
import { pluralEmployees } from "../../data/mockInsurance";
import type { QuestionnaireAnswers } from "../../types/insurance";
import { formatCurrency } from "../../utils/formatters";
import type { FocusTarget } from "./EditDrawer";

interface AnswersCardProps {
  answers: QuestionnaireAnswers;
  originalEmployees: number;
  originalEquipmentValue: number;
  onEdit: (target: FocusTarget) => void;
}

export function AnswersCard({ answers, originalEmployees, originalEquipmentValue, onEdit }: AnswersCardProps) {
  const teamUpdated = answers.employees !== originalEmployees;

  const rows: { label: string; value: string; target: FocusTarget; updated?: boolean }[] = [
    { label: "Business", value: answers.businessName, target: "business" },
    { label: "Trade", value: answers.trade, target: "business" },
    { label: "Location", value: answers.location, target: "location" },
    { label: "Team size", value: pluralEmployees(answers.employees), target: "team", updated: teamUpdated },
    {
      label: "Equipment value",
      value: formatCurrency(answers.equipmentValue),
      target: "equipment",
      updated: answers.equipmentValue !== originalEquipmentValue,
    },
    { label: "Claims (last 3 years)", value: answers.claimsLast3Years, target: "equipment" },
  ];

  return (
    <section className="rounded-lg border border-hairline bg-surface p-5 sm:p-6" aria-labelledby="answers-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="answers-title" className="text-xl">Based on Your Answers</h2>
          <p className="mt-1.5 text-sm">
            Spot something off? Fix it and your price updates instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onEdit("business")}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-2 text-sm font-medium transition-all duration-300 ease-spring hover:border-ink active:scale-95"
        >
          <Pencil className="size-3.5" aria-hidden />
          Edit Answers
        </button>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="bg-surface">
            <button
              type="button"
              onClick={() => onEdit(row.target)}
              aria-label={`Edit ${row.label}: ${row.value}`}
              className="group flex h-full w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-fog focus-visible:bg-fog"
            >
              <span>
                <dt className="text-xs text-muted">{row.label}</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-ink">
                  {row.value}
                  {row.updated && (
                    <span className="animate-pop rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Updated
                    </span>
                  )}
                </dd>
              </span>
              <Pencil
                className="size-3.5 shrink-0 text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden
              />
            </button>
          </div>
        ))}
      </dl>
    </section>
  );
}
