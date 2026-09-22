import type { Pillar } from "../types/quiz";

type PillarBreakdownCardProps = { pillar: Pillar; score: number };

export function PillarBreakdownCard({ pillar, score }: PillarBreakdownCardProps) {
  return (
    <div className="card-glow flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[color:var(--text-muted)]">
          {pillar.label}
        </span>
        <span className="text-[11px] text-[color:var(--text-faint)]">peso {pillar.weight}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-extrabold tracking-[-0.02em] text-[color:var(--text-primary)]">
          {score}
          <span className="text-sm font-semibold text-[color:var(--text-faint)]">/100</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[color:var(--border)]">
        <div
          className="h-1.5 rounded-full bg-[color:var(--brand-accent)] transition-[width]"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
