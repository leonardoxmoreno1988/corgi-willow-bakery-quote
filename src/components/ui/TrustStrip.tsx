import { BadgeCheck, RotateCcw, Zap } from "lucide-react";

export function TrustStrip() {
  return (
    <ul className="mt-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-body">
      <li className="flex items-center gap-1.5">
        <Zap className="size-3.5 shrink-0 text-corgi" aria-hidden />
        Instant cover
      </li>
      <li className="flex items-center gap-1.5">
        <BadgeCheck className="size-3.5 shrink-0 text-heading" aria-hidden />
        £0 broker fees
      </li>
      <li className="flex items-center gap-1.5">
        <RotateCcw className="size-3.5 shrink-0 text-heading" aria-hidden />
        Cancel anytime
      </li>
    </ul>
  );
}
