import type { Pillar, Question } from "../types/quiz";

export const SETORES = [
  "Tecnologia",
  "Indústria / Manufatura",
  "Saúde",
  "Varejo / E-commerce",
  "Serviços Financeiros",
  "Educação",
  "Agronegócio",
  "Construção Civil",
  "Logística / Transporte",
  "Outro",
];

export const PORTES = [
  "1–10 funcionários",
  "11–50 funcionários",
  "51–200 funcionários",
  "201–500 funcionários",
  "500+ funcionários",
];

export const PILLARS: Pillar[] = [
  { id: "infra", label: "INFRAESTRUTURA", weight: 20, block: "fundacao" },
  { id: "integracao", label: "INTEGRAÇÃO", weight: 10, block: "fundacao" },
  { id: "governanca", label: "GOVERNANÇA", weight: 15, block: "fundacao" },
  { id: "bi", label: "BI & DECISÃO", weight: 15, block: "prontidao" },
  { id: "automacao", label: "AUTOMAÇÃO", weight: 10, block: "prontidao" },
  { id: "ia_preditiva", label: "IA PREDITIVA", weight: 15, block: "prontidao" },
  { id: "agentes_ia", label: "AGENTES DE IA", weight: 15, block: "prontidao" },
];

export const QUESTIONS: Question[] = [
  {
    id: "q1", pillar: "infra", order: 1,
    title: "Onde os dados da operação ficam hoje?",
    options: [
      "Espalhados em várias fontes sem padrão (planilhas, sistemas isolados)",
      "Centralizados parcialmente, mas ainda com exports manuais",
      "Centralizados em um banco de dados ou Data Warehouse dedicado",
      "Arquitetura em camadas (bronze/prata/ouro) com Data Warehouse ou Lakehouse na nuvem",
    ],
  },
  {
    id: "q2", pillar: "infra", order: 2,
    title: "A empresa usa infraestrutura em nuvem para armazenar ou processar dados?",
    options: [
      "Não usa nuvem, tudo local ou não estruturado",
      "Uso pontual de nuvem, sem arquitetura definida",
      "Ambiente em nuvem configurado, mas sem dimensionamento ou políticas formais",
      "Nuvem configurada com dimensionamento, segurança e controle de acesso definidos",
    ],
  },
  {
    id: "q3", pillar: "infra", order: 3,
    title: "A capacidade de armazenamento e processamento acompanha o crescimento do volume de dados da empresa?",
    options: [
      "Não, o volume já é um problema hoje (sistemas travam, relatórios demoram)",
      "Acompanha por enquanto, mas sem plano para crescimento",
      "Escalável, mas nunca testada em picos reais",
      "Escalável e validada, cresce junto com o negócio sem fricção",
    ],
  },
  {
    id: "q4", pillar: "integracao", order: 4,
    title: "Os sistemas usados pela empresa (CRM, ERP, e-commerce etc.) trocam informação entre si?",
    options: [
      "Não, cada sistema opera isolado",
      "Trocam informação manualmente (exportar/importar planilhas)",
      "Algumas integrações automáticas via API/conector, outras ainda manuais",
      "Todos os sistemas relevantes integrados automaticamente",
    ],
  },
  {
    id: "q5", pillar: "integracao", order: 5,
    title: "Existe algum sistema legado ou muito fechado que hoje trava a comunicação entre áreas?",
    options: [
      "Sim, e isso gera retrabalho constante entre times",
      "Sim, mas o impacto é pontual",
      "Não há sistemas legados relevantes travando integração",
      "Arquitetura é aberta e integrável por padrão",
    ],
  },
  {
    id: "q6", pillar: "governanca", order: 6,
    title: "Como a empresa lida com dados duplicados, incompletos ou inconsistentes?",
    options: [
      "Não trata, os problemas aparecem direto nos relatórios",
      "Corrige manualmente quando alguém percebe o erro",
      "Existem rotinas de validação para os dados mais críticos",
      "Existe pipeline de qualidade contínuo com regras e monitoramento automático",
    ],
  },
  {
    id: "q7", pillar: "governanca", order: 7,
    title: "Existe um responsável ou processo formal para LGPD e segurança dos dados armazenados?",
    options: [
      "Não existe nenhuma política ou responsável",
      "Existe preocupação informal, mas nada documentado",
      "Existe política documentada, aplicada parcialmente",
      "Política formal, auditada, com controles de acesso e criptografia",
    ],
  },
  {
    id: "q8", pillar: "bi", order: 8,
    title: "Como as decisões de negócio são tomadas hoje na empresa?",
    options: [
      "Principalmente pelo feeling de quem decide",
      "Com apoio de planilhas e relatórios pontuais",
      "Com dashboards, mas usados só em reuniões específicas",
      "Dashboards fazem parte da rotina diária de decisão em várias áreas",
    ],
  },
  {
    id: "q9", pillar: "bi", order: 9,
    title: "Existem indicadores (KPIs) definidos e acompanhados de verdade pela liderança?",
    options: [
      "Não existem KPIs formais",
      "Existem KPIs definidos, mas raramente medidos",
      "KPIs medidos, mas sem rotina de revisão",
      "KPIs medidos e revisados periodicamente em comitê de gestão",
    ],
  },
  {
    id: "q10", pillar: "bi", order: 10,
    title: "Quando surge uma pergunta de negócio específica, quanto tempo leva para ter uma resposta baseada em dados?",
    subtitle: "Ex: por que as vendas caíram numa região.",
    options: [
      "Não há como responder com dados hoje",
      "Dias, alguém precisa juntar informação manualmente",
      "Horas, existe algum relatório ou consulta que ajuda",
      "Minutos, existe dashboard ou processo de análise ágil pronto",
    ],
  },
  {
    id: "q11", pillar: "automacao", order: 11,
    title: "Relatórios recorrentes (semanais, mensais) ainda dependem de alguém montar manualmente?",
    options: [
      "Sim, todos são montados manualmente sempre",
      "Alguns automatizados, a maioria ainda manual",
      "A maior parte dos relatórios recorrentes é automática",
      "Praticamente tudo é automático, ninguém monta relatório na mão",
    ],
  },
  {
    id: "q12", pillar: "automacao", order: 12,
    title: "Tarefas repetitivas ligadas a dados (consolidar planilha, atualizar sistema, gerar relatório) são automatizadas?",
    options: [
      "Tudo manual",
      "Automações isoladas, feitas por iniciativa individual",
      "Automações cobrem os fluxos mais críticos da operação",
      "Operação majoritariamente automatizada, pessoas cuidam de exceções",
    ],
  },
  {
    id: "q13", pillar: "ia_preditiva", order: 13,
    title: "A empresa usa modelos preditivos (forecast, churn, scoring, precificação dinâmica) em algum processo real?",
    options: [
      "Não usa",
      "Testou em prova de conceito isolada",
      "Tem ao menos um modelo em produção",
      "Tem vários modelos em produção influenciando decisões",
    ],
  },
  {
    id: "q14", pillar: "ia_preditiva", order: 14,
    title: "Como esses modelos (ou tentativas) foram ou são desenvolvidos?",
    options: [
      "Nunca foi tentado",
      "Notebooks e análises ad-hoc, sem processo definido",
      "Processo com repositório e versionamento",
      "Pipeline completo (dados → treino → deploy → monitoramento)",
    ],
  },
  {
    id: "q15", pillar: "ia_preditiva", order: 15,
    title: "Os modelos em uso são monitorados depois de entrar em produção?",
    subtitle: "Queda de performance, dados fora do padrão (drift).",
    options: [
      "Não monitoramos, ou não há modelo em produção",
      "Checagem manual ocasional",
      "Métricas automatizadas de performance",
      "Monitoramento contínuo com retraining programado",
    ],
  },
  {
    id: "q16", pillar: "ia_preditiva", order: 16,
    title: "Como o resultado desses modelos chega até quem decide?",
    options: [
      "Não chega, fica com quem construiu",
      "Relatório pontual quando alguém pede",
      "Integrado a um dashboard ou sistema consultado pela área",
      "Direto na decisão operacional, via API ou automação, sem intervenção manual",
    ],
  },
  {
    id: "q17", pillar: "agentes_ia", order: 17,
    title: "Algum time da empresa já usa IA generativa (ChatGPT, Copilot, agentes internos) no dia a dia?",
    options: [
      "Não usa",
      "Uso pessoal, sem padrão nem processo",
      "Casos de uso definidos para tarefas específicas",
      "Integrada a produtos ou processos da operação",
    ],
  },
  {
    id: "q18", pillar: "agentes_ia", order: 18,
    title: "Existe agente de IA ou chatbot atendendo clientes ou colaboradores hoje?",
    subtitle: "Site, WhatsApp, sistema interno.",
    options: [
      "Não existe",
      "Em teste ou piloto",
      "Em produção, um caso de uso",
      "Em produção, múltiplos canais ou casos de uso",
    ],
  },
  {
    id: "q19", pillar: "agentes_ia", order: 19,
    title: "Se a empresa fosse treinar um agente de IA hoje, existe base de conhecimento organizada para alimentá-lo?",
    options: [
      "Não existe, informação dispersa",
      "Existe material, mas desatualizado ou incompleto",
      "Existe base estruturada para ao menos uma área",
      "Existe base viva, versionada, já usada por IA",
    ],
  },
  {
    id: "q20", pillar: "agentes_ia", order: 20,
    title: "Existe política ou diretriz sobre uso de IA e prompts?",
    subtitle: "Privacidade, segurança, o que pode ser exposto.",
    options: [
      "Não existe",
      "Diretrizes informais, boca a boca",
      "Política documentada",
      "Política documentada e treinamento formal do time",
    ],
  },
];
