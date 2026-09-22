type FormFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "select";
  options?: string[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function FormField({ label, name, type = "text", options, value, error, onChange }: FormFieldProps) {
  const baseInputClass =
    "w-full rounded-lg border px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] bg-[color:var(--surface)] outline-none transition-colors";
  const borderClass = error ? "border-[color:var(--error-border)]" : "border-[color:var(--border-input)]";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-[11px] font-bold uppercase tracking-[0.05em] text-[color:var(--text-muted)]"
      >
        {label}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} ${borderClass}`}
        >
          <option value="" disabled>
            Selecione...
          </option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} ${borderClass}`}
        />
      )}
      {error && (
        <p className="rounded-md border border-[color:var(--error-border)] bg-[color:var(--error-bg)] px-2.5 py-1 text-[12px] text-[color:var(--error-text)]">
          {error}
        </p>
      )}
    </div>
  );
}
