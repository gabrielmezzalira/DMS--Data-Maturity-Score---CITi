export type PillarId =
  | "infra" | "integracao" | "governanca"
  | "bi" | "automacao" | "ia_preditiva" | "agentes_ia";

export type Block = "fundacao" | "prontidao";

export type Pillar = { id: PillarId; label: string; weight: number; block: Block };

export type Question = {
  id: string;
  pillar: PillarId;
  order: number;
  title: string;
  subtitle?: string;
  options: [string, string, string, string];
};

export type IntakeData = {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
  setor: string;
  porte: string;
};

export type ComputedResult = {
  pillarScores: Record<PillarId, number>;
  fundacao: number;
  prontidao: number;
  final: number;
  faixa: string;
};
