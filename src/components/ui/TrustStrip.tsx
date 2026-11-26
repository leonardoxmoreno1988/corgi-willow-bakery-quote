import { BadgeCheck, RotateCcw, Zap, type LucideIcon } from "lucide-react";

const SIGNALS: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: "Instant cover" },
  { icon: BadgeCheck, label: "£0 broker fees" },
  { icon: RotateCcw, label: "Cancel anytime" },
];

export function TrustStrip() {
  return (
    <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
      {SIGNALS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-body"
        >
          <Icon className="size-[15px] shrink-0 text-body" strokeWidth={1.75} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}
