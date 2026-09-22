import { useEffect } from "react";

export function useKeyboardNav({
  onNext,
  onPrev,
  onSelect,
  canGoNext,
}: {
  onNext: () => void;
  onPrev: () => void;
  onSelect: (level: 1 | 2 | 3 | 4) => void;
  canGoNext: boolean;
}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") onPrev();
      if ((e.key === "ArrowRight" || e.key === "Enter") && canGoNext) onNext();
      if (["1", "2", "3", "4"].includes(e.key)) onSelect(Number(e.key) as 1 | 2 | 3 | 4);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNext, onPrev, onSelect, canGoNext]);
}
