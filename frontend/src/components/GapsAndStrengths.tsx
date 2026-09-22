import type { Pillar, PillarId } from "../types/quiz";

type GapsAndStrengthsProps = {
  pillars: Pillar[];
  pillarScores: Record<PillarId, number>;
};

export function GapsAndStrengths({ pillars, pillarScores }: GapsAndStrengthsProps) {
  const sorted = [...pillars].sort((a, b) => pillarScores[a.id] - pillarScores[b.id]);
  const gaps = sorted.slice(0, 3);
  const strengths = [...sorted].reverse().slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[color:var(--text-muted)]">
          O que mais puxa para baixo
        </h3>
        <ul className="flex flex-col gap-2">
          {gaps.map((p) => (
            <li key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-[color:var(--text-secondary)]">{p.label}</span>
              <span className="font-bold text-[color:var(--text-primary)]">{pillarScores[p.id]}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[color:var(--text-muted)]">
          Pontos de força
        </h3>
        <ul className="flex flex-col gap-2">
          {strengths.map((p) => (
            <li key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-[color:var(--text-secondary)]">{p.label}</span>
              <span className="font-bold text-[color:var(--brand-accent)]">{pillarScores[p.id]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
