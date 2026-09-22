export interface QuestionOption {
  valor: number
  label: string
}

export interface Question {
  id: string
  bloco: string
  ordem: number
  pergunta: string
  subtexto?: string
  opcoes: QuestionOption[]
  versao: number
}

export interface Identification {
  empresa: string
  contato_nome: string
  contato_email: string
  contato_cargo: string
}

export interface DimensionProfile {
  infraestrutura: number
  governanca: number
  cultura: number
  ia: number
}

export interface SubmissionResult {
  id: string
  nivel_final: number
  nivel_fundacao: number
  nivel_prontidao: number
  perfil: DimensionProfile
  created_at: string
}
