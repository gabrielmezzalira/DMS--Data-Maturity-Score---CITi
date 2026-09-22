type NavFooterProps = {
  onPrev: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLast: boolean;
};

export function NavFooter({ onPrev, onNext, canGoBack, canGoNext, isLast }: NavFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-[color:var(--border)] pt-5">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoBack}
        className="text-sm font-semibold text-[color:var(--text-secondary)] disabled:opacity-30"
      >
        ← Anterior
      </button>
      <span className="hidden text-[12px] text-[color:var(--text-faint)] sm:inline">Enter · Avançar</span>
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className="rounded-lg bg-[color:var(--brand-primary)] px-5 py-2.5 text-sm font-bold text-[#0a0a0a] transition-opacity disabled:opacity-30"
      >
        {isLast ? "Ver resultado →" : "Próxima →"}
      </button>
    </div>
  );
}
