type CTASectionProps = { score: number };

export function CTASection({ score }: CTASectionProps) {
  return (
    <div className="card-glow flex flex-col gap-2 rounded-xl border border-[color:var(--brand-border)] bg-[color:var(--brand-bg)] p-6 sm:p-8">
      <h3 className="text-xl font-extrabold tracking-[-0.02em] text-[color:var(--text-primary)] sm:text-2xl">
        A gente ajuda a sair de {score} para 80+.
      </h3>
      <p className="text-sm text-[color:var(--text-secondary)]">
        Fale com o time de Dados do CITi. Mapeamos os gargalos prioritários e desenhamos os
        próximos passos.
      </p>
    </div>
  );
}
