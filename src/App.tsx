import { useCallback, useEffect, useRef, useState } from "react";
import { AnswersCard } from "./components/quote/AnswersCard";
import { CheckoutStep } from "./components/quote/CheckoutStep";
import { CoverageBreakdown } from "./components/quote/CoverageBreakdown";
import { EditDrawer, type FocusTarget } from "./components/quote/EditDrawer";
import { QuoteHeader, type Step } from "./components/quote/QuoteHeader";
import { QuoteSidebar } from "./components/quote/QuoteSidebar";
import { Toast } from "./components/ui/Toast";
import { ORIGINAL_ANSWERS, business, priceFor } from "./data/mockInsurance";
import type { QuestionnaireAnswers } from "./types/insurance";

const ORIGINAL_PRICE = priceFor(ORIGINAL_ANSWERS);

function App() {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(ORIGINAL_ANSWERS);
  const [step, setStep] = useState<Step>("review");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [focus, setFocus] = useState<FocusTarget>("business");
  const [drawerSession, setDrawerSession] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>(undefined);

  const monthlyPrice = priceFor(answers);
  const changed = (Object.keys(answers) as (keyof QuestionnaireAnswers)[]).some(
    (k) => answers[k] !== ORIGINAL_ANSWERS[k],
  );

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const openDrawer = (target: FocusTarget) => {
    setFocus(target);
    setDrawerSession((n) => n + 1);
    // Mount closed first, then open on the next frame so the slide-in animates.
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const save = (next: QuestionnaireAnswers) => {
    const newPrice = priceFor(next);
    setAnswers(next);
    setDrawerOpen(false);
    if (newPrice !== monthlyPrice) setPulseKey((n) => n + 1);
    showToast(
      newPrice !== monthlyPrice
        ? `Quote updated · now £${newPrice}/month`
        : "Answers updated · your price is unchanged",
    );
  };

  const undo = () => {
    setAnswers(ORIGINAL_ANSWERS);
    setPulseKey((n) => n + 1);
    showToast(`Changes undone · back to £${ORIGINAL_PRICE}/month`);
  };

  const reset = () => {
    setAnswers(ORIGINAL_ANSWERS);
    setStep("review");
    setDrawerOpen(false);
    setPulseKey(0);
    showToast("Prototype reset");
  };

  const goTo = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <QuoteHeader
        step={step}
        canReset={changed || step === "checkout"}
        onReset={reset}
        onEditAnswers={() => openDrawer("business")}
      />

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-32 sm:px-6 sm:pt-10 lg:pb-16">
        {step === "review" ? (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-5xl">Review Your Quote</h1>
              <p className="mt-3 max-w-xl text-base">
                {business.name}, here's what you're covered for, what you'd pay if something goes wrong, and what we don't cover.
              </p>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-6">
                <AnswersCard
                  answers={answers}
                  originalEmployees={ORIGINAL_ANSWERS.employees}
                  originalEquipmentValue={ORIGINAL_ANSWERS.equipmentValue}
                  onEdit={openDrawer}
                />
                <CoverageBreakdown equipmentValue={answers.equipmentValue} />
              </div>
              <QuoteSidebar
                answers={answers}
                original={ORIGINAL_ANSWERS}
                pulseKey={pulseKey}
                onContinue={() => goTo("checkout")}
                onReview={() => openDrawer("team")}
                onUndo={undo}
              />
            </div>
          </>
        ) : (
          <CheckoutStep
            answers={answers}
            monthlyPrice={monthlyPrice}
            onBack={() => goTo("review")}
            onReset={reset}
            onActivated={() => showToast("Cover activated")}
          />
        )}
      </main>

      <EditDrawer
        key={drawerSession}
        open={drawerOpen}
        answers={answers}
        originalEmployees={ORIGINAL_ANSWERS.employees}
        currentPrice={monthlyPrice}
        focus={focus}
        onClose={closeDrawer}
        onSave={save}
      />
      <Toast message={toast} />
    </div>
  );
}

export default App;
