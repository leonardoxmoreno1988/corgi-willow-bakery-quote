import { BadgeCheck, RotateCcw, Zap, type LucideIcon } from "lucide-react";
import { cn } from "../../utils/formatters";

const SIGNALS: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: "Instant cover" },
  { icon: BadgeCheck, label: "£0 broker fees" },
  { icon: RotateCcw, label: "Cancel anytime" },
];

interface TrustStripProps {
  /** "compact" for the narrow quote sidebar, "large" for the wider checkout card. */
  size?: "compact" | "large";
}

export function TrustStrip({ size = "compact" }: TrustStripProps) {
  const large = size === "large";
  return (
    <ul className={cn("grid grid-cols-3 gap-2 text-center", large ? "mt-5" : "mt-4")}>
      {SIGNALS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className={cn(
            "flex flex-col items-center font-medium",
            large ? "gap-1.5 text-[13px] text-ink" : "gap-1 text-[11px] text-body",
          )}
        >
          <Icon
            className={cn("shrink-0 text-body", large ? "size-[18px]" : "size-[15px]")}
            strokeWidth={1.75}
            aria-hidden
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
