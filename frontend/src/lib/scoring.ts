import { PILLARS, QUESTIONS } from "../data/questions";
import type { Block, ComputedResult, PillarId } from "../types/quiz";

export function scorePillar(pillarId: PillarId, answers: Record<string, 1 | 2 | 3 | 4>): number {
  const qs = QUESTIONS.filter((q) => q.pillar === pillarId);
  const levels = qs.map((q) => answers[q.id]).filter((v): v is 1 | 2 | 3 | 4 => v !== undefined);
  if (levels.length === 0) return 0;
  const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
  return ((avg - 1) / 3) * 100;
}

export function scoreBlock(block: Block, pillarScores: Record<PillarId, number>): number {
  const pillars = PILLARS.filter((p) => p.block === block);
  const totalWeight = pillars.reduce((sum, p) => sum + p.weight, 0);
  return pillars.reduce((sum, p) => sum + (p.weight / totalWeight) * pillarScores[p.id], 0);
}

export function getFaixa(score: number): string {
  if (score <= 25) return "Fundação Ausente";
  if (score <= 50) return "Fundação em Construção";
  if (score <= 75) return "Operação Estruturada";
  return "Operação Orientada a Dados";
}

export function computeResult(answers: Record<string, 1 | 2 | 3 | 4>): ComputedResult {
  const pillarScores = Object.fromEntries(
    PILLARS.map((p) => [p.id, Math.round(scorePillar(p.id, answers))])
  ) as Record<PillarId, number>;

  const fundacao = Math.round(scoreBlock("fundacao", pillarScores));
  const prontidao = Math.round(scoreBlock("prontidao", pillarScores));
  const final = Math.min(fundacao, prontidao);

  return { pillarScores, fundacao, prontidao, final, faixa: getFaixa(final) };
}
