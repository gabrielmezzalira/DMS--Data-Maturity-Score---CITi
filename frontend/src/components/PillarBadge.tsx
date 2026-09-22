export function PillarBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[color:var(--brand-bg)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-[color:var(--brand-accent)]">
      {label}
    </span>
  );
}
