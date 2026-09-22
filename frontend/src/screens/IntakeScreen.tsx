import { useState, type FormEvent } from "react";
import { FormField } from "../components/FormField";
import { PORTES, SETORES } from "../data/questions";
import { intakeSchema, type IntakeFormErrors } from "../lib/validation";
import { useQuiz } from "../state/QuizContext";
import type { IntakeData } from "../types/quiz";

const EMPTY_FORM: IntakeData = {
  nome: "",
  email: "",
  telefone: "",
  empresa: "",
  cargo: "",
  setor: "",
  porte: "",
};

export function IntakeScreen() {
  const { dispatch } = useQuiz();
  const [form, setForm] = useState<IntakeData>(EMPTY_FORM);
  const [errors, setErrors] = useState<IntakeFormErrors>({});

  function setField<K extends keyof IntakeData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = intakeSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: IntakeFormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof IntakeData;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    dispatch({ type: "SUBMIT_INTAKE", payload: parsed.data });
  }

  return (
    <div className="ambient-glow screen-fade mx-auto flex min-h-[100svh] max-w-[680px] flex-col items-center gap-8 px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <img src="/citi-logo.png" alt="CITi" className="h-10 w-auto" />
        <span className="inline-flex items-center rounded-full bg-[color:var(--brand-bg)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[color:var(--brand-accent)]">
          CITi · Inteligência de Dados
        </span>
        <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.03em] text-[color:var(--text-primary)] sm:text-[44px]">
          Qual o nível de maturidade em dados e IA da sua empresa?
        </h1>
        <p className="max-w-[520px] text-base text-[color:var(--text-secondary)]">
          Um diagnóstico de 20 perguntas revela onde sua operação trava e o que fazer para
          destravar. Leva menos de 4 minutos.
        </p>
      </div>

      <div className="card-glow flex w-full max-w-[420px] flex-col gap-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[color:var(--text-primary)]">
            Antes de começar, conte um pouco sobre você
          </h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            Usamos isso só para personalizar seu diagnóstico.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Nome" name="nome" value={form.nome} error={errors.nome} onChange={(v) => setField("nome", v)} />
          <FormField
            label="E-mail corporativo"
            name="email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(v) => setField("email", v)}
          />
          <FormField
            label="Telefone"
            name="telefone"
            type="tel"
            value={form.telefone}
            error={errors.telefone}
            onChange={(v) => setField("telefone", v)}
          />
          <FormField label="Empresa" name="empresa" value={form.empresa} error={errors.empresa} onChange={(v) => setField("empresa", v)} />
          <FormField label="Cargo" name="cargo" value={form.cargo} error={errors.cargo} onChange={(v) => setField("cargo", v)} />
          <FormField
            label="Setor"
            name="setor"
            type="select"
            options={SETORES}
            value={form.setor}
            error={errors.setor}
            onChange={(v) => setField("setor", v)}
          />
          <FormField
            label="Nº de funcionários"
            name="porte"
            type="select"
            options={PORTES}
            value={form.porte}
            error={errors.porte}
            onChange={(v) => setField("porte", v)}
          />
          <button
            type="submit"
            className="mt-2 rounded-lg bg-[color:var(--brand-primary)] px-5 py-2.5 text-sm font-bold text-[#0a0a0a]"
          >
            Começar →
          </button>
        </form>
      </div>
      <span className="text-[12px] text-[color:var(--text-faint)]">Sem custo. Resultado na hora.</span>
    </div>
  );
}
