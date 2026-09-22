type OptionCardProps = {
  level: 1 | 2 | 3 | 4;
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function OptionCard({ level, label, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-xl border px-5 py-4 text-left text-sm transition-[colors,box-shadow]"
      style={{
        borderColor: selected ? "var(--brand-accent)" : "var(--border)",
        backgroundColor: selected ? "var(--brand-bg)" : "var(--surface)",
        boxShadow: selected ? "0 0 24px -8px var(--glow)" : "none",
      }}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors"
        style={{
          backgroundColor: selected ? "var(--brand-accent)" : "var(--bg)",
          color: selected ? "#ffffff" : "var(--text-muted)",
          border: selected ? "none" : "1px solid var(--border)",
        }}
      >
        {selected ? "✓" : level}
      </span>
      <span className="flex-1 text-[color:var(--text-secondary)]">{label}</span>
      {selected && (
        <span className="option-arrow text-[color:var(--brand-accent)]" aria-hidden="true">
          →
        </span>
      )}
    </button>
  );
}
