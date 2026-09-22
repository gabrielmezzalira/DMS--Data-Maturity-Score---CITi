import { createClient } from "@supabase/supabase-js";
import type { IntakeData, PillarId } from "../types/quiz";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type SubmissionRecord = IntakeData & {
  respostas: Record<string, 1 | 2 | 3 | 4>;
  scorePorPilar: Record<PillarId, number>;
  scoreFundacao: number;
  scoreProntidao: number;
  scoreFinal: number;
  faixa: string;
};

export async function submitToSupabase(record: SubmissionRecord, retries = 2): Promise<boolean> {
  const { error } = await supabase.from("dms_submissions").insert({
    nome: record.nome,
    email: record.email,
    empresa: record.empresa,
    cargo: record.cargo,
    setor: record.setor,
    porte: record.porte,
    respostas: record.respostas,
    score_por_pilar: record.scorePorPilar,
    score_fundacao: record.scoreFundacao,
    score_prontidao: record.scoreProntidao,
    score_final: record.scoreFinal,
    faixa: record.faixa,
  });

  if (error) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 800));
      return submitToSupabase(record, retries - 1);
    }
    console.error("Falha ao gravar submissão no Supabase:", error.message);
    return false;
  }
  return true;
}
