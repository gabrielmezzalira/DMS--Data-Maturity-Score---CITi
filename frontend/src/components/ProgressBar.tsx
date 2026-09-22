import type { Pillar, PillarId } from "../types/quiz";

type ProgressBarProps = {
  pillars: Pillar[];
  currentPillarId: PillarId;
  percentComplete: number;
};

export function ProgressBar({ pillars, currentPillarId, percentComplete }: ProgressBarProps) {
  const currentIndex = pillars.findIndex((p) => p.id === currentPillarId);

  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[color:var(--text-muted)]">
        {percentComplete}%
      </span>
      <div className="flex flex-1 gap-1">
        {pillars.map((p, i) => (
          <div
            key={p.id}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: i <= currentIndex ? "var(--brand-accent)" : "var(--border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
