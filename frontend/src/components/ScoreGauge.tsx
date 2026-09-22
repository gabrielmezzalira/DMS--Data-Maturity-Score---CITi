type ScoreGaugeProps = { score: number; faixa: string };

const SIZE = 200;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Hex literals (not CSS vars) because the alpha suffix below needs a real hex string.
// Keep in sync with --band-low/--band-mid/--band-high/--band-top in index.css.
function bandColor(score: number): string {
  if (score <= 25) return "#ef4444";
  if (score <= 50) return "#f59e0b";
  if (score <= 75) return "#4ade80";
  return "#46f08c";
}

export function ScoreGauge({ score, faixa }: ScoreGaugeProps) {
  const offset = CIRCUMFERENCE * (1 - score / 100);
  const color = bandColor(score);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[44px] font-extrabold leading-none tracking-[-0.02em] text-[color:var(--text-primary)]">
            {score}
          </span>
          <span className="text-[12px] text-[color:var(--text-muted)]">/100</span>
        </div>
      </div>
      <span
        className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.05em]"
        style={{ backgroundColor: `${color}1f`, color }}
      >
        {faixa}
      </span>
    </div>
  );
}
