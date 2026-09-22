import { useEffect, useMemo, useRef } from "react";
import { CTASection } from "../components/CTASection";
import { GapsAndStrengths } from "../components/GapsAndStrengths";
import { PillarBreakdownCard } from "../components/PillarBreakdownCard";
import { ResultRadar } from "../components/ResultRadar";
import { ScoreGauge } from "../components/ScoreGauge";
import { PILLARS } from "../data/questions";
import { computeResult } from "../lib/scoring";
import { submitResultToSheets, submitToSheets } from "../lib/sheets";
import { submitToSupabase } from "../lib/supabase";
import { useQuiz } from "../state/QuizContext";
import type { PillarId } from "../types/quiz";

function buildGapText(pillarScores: Record<PillarId, number>): string {
  const sorted = [...PILLARS].sort((a, b) => pillarScores[a.id] - pillarScores[b.id]);
  const [weak1, weak2] = sorted;
  const strong = sorted[sorted.length - 1];
  return `Seus maiores gargalos estão em ${weak1.label} e ${weak2.label}. ${strong.label} já está em nível avançado.`;
}

export function ResultScreen() {
  const { state, dispatch } = useQuiz();
  const { answers, intake, submissionStatus } = state;

  const result = useMemo(() => computeResult(answers as Record<string, 1 | 2 | 3 | 4>), [answers]);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!intake || hasSubmitted.current) return;
    hasSubmitted.current = true;
    dispatch({ type: "SUBMIT_START" });

    // Captação de lead: só os dados de identificação, pro time comercial acompanhar na planilha.
    submitToSheets(intake);

    // Registro completo (respostas + score). Supabase é a fonte de verdade
    // pretendida, mas grava também na aba DMS_Resultados do Sheets — enquanto
    // o Supabase estiver indisponível, essa é a única cópia persistida.
    const record = {
      ...intake,
      respostas: answers as Record<string, 1 | 2 | 3 | 4>,
      scorePorPilar: result.pillarScores,
      scoreFundacao: result.fundacao,
      scoreProntidao: result.prontidao,
      scoreFinal: result.final,
      faixa: result.faixa,
    };

    Promise.all([submitResultToSheets(record), submitToSupabase(record)]).then(
      ([sheetsOk, supabaseOk]) => {
        const ok = sheetsOk || supabaseOk;
        dispatch(ok ? { type: "SUBMIT_SUCCESS", result } : { type: "SUBMIT_ERROR", result });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gapText = buildGapText(result.pillarScores);

  return (
    <div className="ambient-glow screen-fade mx-auto flex max-w-[980px] flex-col gap-10 px-6 py-14">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[color:var(--brand-accent)]">
          {intake?.setor} · {intake?.porte} · {intake?.nome}
        </span>
        <h1 className="text-[32px] font-extrabold tracking-[-0.03em] text-[color:var(--text-primary)] sm:text-[40px]">
          Seu Data & IA Score
        </h1>
        <p className="max-w-[560px] text-sm text-[color:var(--text-secondary)]">
          Score consolidado dos 7 pilares de maturidade em dados e IA, calculado como o menor entre
          Fundação técnica e Prontidão de valor.
        </p>
      </div>

      <div className="flex justify-center">
        <ScoreGauge score={result.final} faixa={result.faixa} />
      </div>

      {submissionStatus === "error" && (
        <div className="no-print rounded-lg border border-[color:var(--warn-border)] bg-[color:var(--warn-bg)] px-4 py-3 text-sm text-[color:var(--warn-text)]">
          Não conseguimos registrar sua resposta automaticamente, mas seu diagnóstico está completo abaixo.
        </div>
      )}

      <ResultRadar pillars={PILLARS} pillarScores={result.pillarScores} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((p) => (
          <PillarBreakdownCard key={p.id} pillar={p} score={result.pillarScores[p.id]} />
        ))}
      </div>

      <GapsAndStrengths pillars={PILLARS} pillarScores={result.pillarScores} />

      <p className="text-center text-sm text-[color:var(--text-secondary)]">{gapText}</p>

      <CTASection score={result.final} />
    </div>
  );
}
