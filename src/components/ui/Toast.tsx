import { Check } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-8"
    >
      {message && (
        <div
          key={message}
          className="animate-toast flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          <Check className="size-4" aria-hidden />
          {message}
        </div>
      )}
    </div>
  );
}
