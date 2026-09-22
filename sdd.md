# SDD: Formulário DMS (Data Maturity Score)

**Subárea de Dados, CITi, gestão 26.2**
**Responsável:** Gabriel Mezzalira
**Status:** Draft para revisão
**Versão:** 0.1

---

## 1. Contexto

### 1.1 O que é o DMS

O DMS (Data Maturity Score) é o guia metodológico de qualificação do cliente na pré-venda, definido na proposta de Líder de Dados 26.1. Ele classifica o cliente em uma escala de 1 a 5 conforme sua maturidade em dados:

| Nível | Nome | Estado | Serviços indicados |
|---|---|---|---|
| 1 | Sem estrutura | Dados espalhados em planilhas, WhatsApp e sistemas desconectados. Nenhuma governança, nenhuma centralização. | Consultoria e Assessment, estruturação básica de dados |
| 2 | Estrutura inicial | Dados minimamente organizados em algum sistema, sem integração entre fontes e sem processo de qualidade. | Data Infrastructure, primeiros pipelines |
| 3 | Dados centralizados | Infraestrutura básica funcionando, dados acessíveis, sem camada analítica consolidada. | BI, Dashboards, Análise de Dados |
| 4 | Maturidade analítica | Dados organizados, BI em uso, time consome informação para decidir. | Automações, modelos preditivos, primeiros casos de uso de IA |
| 5 | Data-driven | Cultura analítica consolidada, infraestrutura robusta, time preparado para adotar IA de forma estruturada. | IA Enterprise, agentes de IA customizados |

A escala de 1 a 5 segue a convenção dos frameworks de maturidade de referência do mercado (Gartner EIM, DAMA-DMBOK, CMMI, IBM Data Governance Maturity Model), adaptada ao contexto de diagnóstico comercial de projetos de dados.

### 1.2 Para que ele existe

O DMS não é um gate formal que barra a venda. Ele é a base que substitui intuição por critério. Quando o cliente insiste em comprar acima do seu nível, o DMS é o argumento técnico que o membro de Dados usa para redirecionar a conversa para o caminho que vai de fato gerar resultado.

Essa lógica se aplica diretamente ao Ciclo Comercial Modular herdado da gestão anterior: os níveis de serviço descrevem o que o CITi entrega, o DMS define em qual nível o cliente está em condições de entrar. Sem esse critério, o ciclo modular continua vulnerável ao problema que ele mesmo identificou, o comercial vende o que cabe no orçamento e não apenas o que o cliente consegue absorver.

O DMS tem dois consumidores:

1. **O cliente.** O nível vira entregável de pré-venda: um documento curto que mostra em qual nível de maturidade ele está, o que isso significa na prática e qual é o caminho recomendado de evolução. Transforma qualificação técnica em valor percebido antes do contrato, e reduz a chance de o cliente insistir em comprar acima do que consegue absorver, porque ele passa a entender o porquê.
2. **A planilha de requisitos e precificação.** O nível e as red flags entram como entrada da estimativa de horas e complexidade, conforme o Plano de Ação Final.

### 1.3 O problema deste SDD

Hoje o DMS existe como documento. Ele não roda. Sem instrumento, o framework depende da lembrança do comercial e da disponibilidade do membro de Dados, exatamente o tipo de mecanismo que depende de adesão voluntária e que já falhou antes na subárea.

Este SDD especifica a aplicação que transforma o DMS em artefato operacional: coleta estruturada das respostas, cálculo automático do nível, e relatório de maturidade entregue aos dois consumidores acima. O questionário completo está no Anexo A.

## 2. Objetivo

Entregar uma aplicação web que:

1. Coleta 20 respostas do cliente em fluxo guiado de pergunta única por tela.
2. Calcula o nível de maturidade de 1 a 5 conforme a regra da seção 6.
3. Gera relatório de maturidade com perfil por dimensão, red flags e caminho de evolução recomendado.
4. Persiste cada preenchimento como base histórica de maturidade de clientes.

## 3. Escopo

### Dentro do escopo (MVP)

- Formulário público, acessível por link, sem autenticação do cliente.
- 20 perguntas em 4 blocos, escala de 1 a 4 por pergunta.
- Tela de identificação inicial (nome do cliente, empresa, email, serviço de interesse).
- Cálculo do score e geração do relatório.
- Tela de resultado para o cliente.
- Painel interno de listagem de preenchimentos, restrito à liderança de Dados e ao comercial.

### Fora do escopo (fase 2)

- Exportação do relatório em PDF com identidade visual do CITi.
- Autenticação do cliente e edição de respostas após envio.
- Comparação entre preenchimentos do mesmo cliente ao longo do tempo.
- Recomendação automática de serviços com preço estimado.
- Integração automática com a planilha de precificação.

## 4. Decisões de arquitetura

### ADR 01: Escala de resposta 1 a 4, score final 1 a 5

As perguntas usam 4 opções. Quatro opções eliminam o ponto médio neutro e forçam o cliente a se posicionar. O score final permanece de 1 a 5 porque essa é a escala definida na proposta e usada pelo Ciclo Comercial Modular. A conversão está na seção 6.

### ADR 02: Fundação determina o teto, IA refina dentro dele

A fonte original define que o nível mais baixo entre as dimensões é o nível final. Aplicada com IA representando 12 das 20 perguntas, essa regra derruba o score de clientes com infraestrutura sólida e IA incipiente para o nível mais baixo da escala, o que contradiz a própria tabela de níveis, onde o nível 4 já pressupõe primeiros casos de uso de IA.

A regra adotada preserva a intenção original: infraestrutura e governança formam a Fundação, e a Fundação é o teto absoluto. Cultura e IA formam a Prontidão, e a Prontidão nunca eleva o cliente acima do teto. O nível final é o menor entre os dois.

Consequência: um cliente com Fundação 2 e Prontidão 4 é nível 2. Um cliente com Fundação 4 e Prontidão 2 é nível 2. A assimetria some, o teto se mantém, e nenhuma resposta isolada de IA derruba o score sozinha.

### ADR 03: Preenchimento assíncrono pelo cliente, sem membro de Dados presente

As duas fontes primárias divergem aqui. A proposta 26.1 define o DMS como guia metodológico consultado em reunião de pré-venda pelo membro de Dados e pelo comercial juntos. O Plano de Ação Final define o DMS como formulário estruturado, com fluxo de envio e preenchimento antes da call técnica.

Este SDD segue o Plano de Ação Final, que é a fonte mais recente e a que descreve o DMS como produto e não como documento de apoio. O preenchimento antecipado libera a reunião comercial para o diagnóstico qualitativo, sem depender de o cliente responder sob supervisão.

Consequência: todas as perguntas precisam ser compreensíveis por alguém que não é técnico e que responde sozinho. Perguntas com jargão levam subtexto explicativo, e nenhuma pergunta depende de interpretação do membro de Dados.

Essa decisão está na lista de pendências. A alternativa é o modelo híbrido: cliente preenche antes, membro de Dados revisa as respostas na call e ajusta o que o cliente respondeu errado por desconhecimento. O híbrido preserva o texto da proposta e captura o ganho do Plano de Ação, ao custo de o score deixar de ser imutável após o envio.

### ADR 04: Stack alinhada ao padrão da subárea

Frontend em React + Vite + TypeScript + Tailwind. Backend em Python + FastAPI. Persistência em Supabase (PostgreSQL). Alinhada ao padrão já usado nos outros produtos internos da subárea, o que reduz custo de manutenção e permite reaproveitar o cliente Supabase e a camada de autenticação do painel interno.

### ADR 05: Cálculo no backend

O cálculo do score não roda no cliente. Regra de negócio no frontend é regra que o cliente consegue inspecionar e que diverge quando a lógica muda. O frontend envia respostas cruas, o backend calcula, persiste e devolve o resultado.

## 5. Modelo de dados

### Tabela `dms_submissions`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid, PK | Identificador do preenchimento |
| `empresa` | text | Nome da empresa do cliente |
| `contato_nome` | text | Nome de quem preencheu |
| `contato_email` | text | Email de contato |
| `contato_cargo` | text | Cargo de quem preencheu |
| `servico_interesse` | text | Serviço que motivou o contato |
| `respostas` | jsonb | Mapa `{ "q1": 3, "q2": 1, ... "q20": 2 }` |
| `nivel_infraestrutura` | int | 1 a 5 |
| `nivel_governanca` | int | 1 a 5 |
| `nivel_cultura` | int | 1 a 5 |
| `nivel_ia` | int | 1 a 5 |
| `nivel_fundacao` | int | 1 a 5 |
| `nivel_prontidao` | int | 1 a 5 |
| `nivel_final` | int | 1 a 5 |
| `red_flags` | jsonb | Lista de códigos de red flag disparados |
| `created_at` | timestamptz | Data do preenchimento |
| `origem` | text | Canal de origem (comercial, site, indicação) |

### Tabela `dms_questions`

Perguntas versionadas em banco, não hardcoded no frontend. A revisão prevista para o segundo trimestre ajusta perguntas que não capturaram o que deveriam, e essa revisão não pode exigir deploy.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | text, PK | `q1` a `q20` |
| `bloco` | text | `infraestrutura`, `governanca`, `cultura`, `ia` |
| `ordem` | int | Ordem de exibição |
| `pergunta` | text | Texto da pergunta |
| `subtexto` | text, nullable | Explicação de apoio |
| `opcoes` | jsonb | `[{valor: 1, label: "..."}, ...]` |
| `versao` | int | Versão do questionário |
| `ativa` | bool | Perguntas desativadas somem do formulário e permanecem no histórico |

Cada `dms_submissions` grava `versao_questionario` para que resultados antigos continuem interpretáveis depois de uma revisão.

## 6. Regra de cálculo

### 6.1 Composição dos blocos

| Bloco | Perguntas | Peso na composição |
|---|---|---|
| Infraestrutura | q1, q2, q3 | Fundação |
| Governança | q4, q5, q6 | Fundação |
| Cultura analítica | q7, q8 | Prontidão |
| IA, automação e ML | q9 a q20 | Prontidão |

### 6.2 Nível por bloco

Média aritmética das respostas do bloco, na escala de 1 a 4, mapeada para a escala de 1 a 5:

| Média do bloco | Nível |
|---|---|
| menor que 1,50 | 1 |
| de 1,50 a 2,24 | 2 |
| de 2,25 a 2,99 | 3 |
| de 3,00 a 3,59 | 4 |
| 3,60 ou mais | 5 |

### 6.3 Fundação, Prontidão e nível final

```
nivel_fundacao  = min(nivel_infraestrutura, nivel_governanca)
nivel_prontidao = mapear(media_ponderada(cultura, ia))
nivel_final     = min(nivel_fundacao, nivel_prontidao)
```

Na Prontidão, Cultura e IA entram com peso proporcional ao número de perguntas: 2 de Cultura e 12 de IA, o que dá à IA 86% do peso da Prontidão. A Prontidão é o eixo em que a granularidade de IA importa, e a Fundação continua sendo o freio.

### 6.4 Red flags

Disparadas independentemente do score e destacadas no relatório:

| Código | Condição | Significado |
|---|---|---|
| `RF_LGPD` | q3 = 1 | Cliente sem política de backup e segurança. Responsabilidade sobre dados precisa ser definida em contrato antes da execução. |
| `RF_SEM_DONO` | q4 = 1 | Ninguém responde pelos dados. Projeto sem interlocutor técnico do lado do cliente. |
| `RF_SEM_POLITICA_IA` | q10 = 1 e serviço de interesse envolve IA | Cliente quer IA sem política de uso, privacidade ou compliance. |
| `RF_SEM_OPERADOR` | q20 = 1 e serviço de interesse envolve IA | Ninguém vai operar a solução após a entrega. Risco de abandono pós-projeto. |
| `RF_FUNDACAO_BAIXA` | `nivel_fundacao` menor ou igual a 2 e serviço de interesse envolve IA | Cliente quer comprar acima do nível. Argumento técnico para redirecionar a conversa para estruturação de dados antes de IA. |

O DMS não barra a venda. As red flags não bloqueiam proposta comercial: elas armam o membro de Dados com o argumento técnico para redirecionar a conversa e determinam o que precisa estar escrito no contrato.

`RF_LGPD` existe porque o caso já aconteceu: um cliente perguntou ao gerente de projeto quem respondia pelo armazenamento e pela conformidade com a LGPD, e a resposta não existia. O formulário força a pergunta antes do contrato.

## 7. Fluxo da aplicação

### 7.1 Telas

1. **Abertura.** Título, explicação de 2 linhas do que é o DMS, tempo estimado de preenchimento, botão de início.
2. **Identificação.** Empresa, nome, cargo, email, serviço de interesse (select).
3. **Perguntas, 1 a 20.** Uma pergunta por tela. Cabeçalho com progresso percentual, nome do bloco atual e indicador de blocos. Quatro opções em cartões clicáveis. Navegação Anterior e Próxima. Próxima desabilitada até haver seleção.
4. **Resultado.** Nível final, perfil por dimensão, red flags, caminho de evolução, serviços indicados.

### 7.2 Relatório de resultado

- **Nível final** com o nome do nível e uma frase que descreve o estágio.
- **Perfil por dimensão**, os quatro níveis lado a lado. Torna visível o gap que gerou o teto.
- **O que isso significa na prática**, texto por nível.
- **Caminho recomendado de evolução**, o que precisa mudar para subir um nível, derivado das perguntas com resposta 1 ou 2 nos blocos de Fundação.
- **Serviços indicados**, conforme a tabela de níveis da fonte.
- **Red flags**, exibidas ao cliente em linguagem neutra e ao time interno em linguagem de risco.

O relatório é o entregável de pré-venda. O cliente entende por que não faz sentido comprar acima do nível dele antes de o comercial precisar argumentar.

## 8. API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/questions` | Retorna perguntas ativas da versão corrente, ordenadas |
| `POST` | `/submissions` | Recebe identificação e respostas, calcula, persiste, retorna resultado completo |
| `GET` | `/submissions/{id}` | Retorna resultado de um preenchimento. Consumido pela tela de resultado |
| `GET` | `/submissions` | Lista preenchimentos. Requer autenticação. Painel interno |

`POST /submissions` valida que as 20 respostas estão presentes e no intervalo de 1 a 4. Preenchimento incompleto retorna 422.

## 9. Integrações

### 9.1 Planilha de requisitos e precificação

Fase 2. No MVP, o membro de Dados copia o nível e as red flags manualmente para a planilha. O Plano de Ação Final prevê o DMS como entrada obrigatória da planilha, e o rito de precificação depende disso antes da automação existir.

## 10. Riscos

| Risco | Mitigação |
|---|---|
| Cliente responde acima do que é verdade, por vaidade ou desconhecimento | As perguntas descrevem estados concretos e observáveis, não usam adjetivos de qualidade. A call técnica valida os pontos que sustentam o teto. |
| Comercial deixa de enviar o formulário e o DMS vira artefato de Notion, como o Catálogo de T-Shirt Size | O envio do link é etapa do Ciclo Comercial Modular. Registrar no painel interno quais oportunidades chegaram à call sem `submission_id` associado, para a ausência ficar rastreável. |
| 20 perguntas geram abandono no meio do preenchimento | Uma pergunta por tela, progresso visível, sem campos abertos. Registrar taxa de conclusão desde o primeiro preenchimento para estabelecer baseline. |
| Regra de cálculo produz níveis que contradizem a leitura de quem conhece o cliente | Os 10 primeiros preenchimentos são revisados manualmente pela liderança de Dados contra a percepção do comercial. Divergência sistemática dispara revisão da regra, não do caso. |
| Perguntas não capturam o que deveriam | Perguntas versionadas em banco, revisão prevista no segundo trimestre conforme o Plano de Ação. |

## 11. Fatiamento

**Fatia 1.** Formulário funcional ponta a ponta: perguntas em banco, 20 telas, cálculo no backend, persistência, tela de resultado com nível final e perfil por dimensão. Entrega o valor central.

**Fatia 2.** Red flags, caminho de evolução, serviços indicados no relatório, painel interno de listagem.

Fatia 1 é usável em pré-venda real sem a fatia 2. Esse é o critério de corte.

## 12. Métricas

Nenhuma meta antes da baseline. Os três primeiros meses estabelecem os números, e a meta vem depois.

- Taxa de conclusão do formulário entre os enviados.
- Percentual de calls de pré-venda que rodaram com DMS preenchido.
- Percentual de contratos fechados com nível DMS registrado na planilha de precificação.
- Distribuição de níveis na base de clientes.
- Divergência entre nível calculado e nível percebido pelo time nos 10 primeiros casos.

## 13. Decisões pendentes

1. Aprovação da regra da seção 6.3 como desvio consciente da regra de mínimo entre as 4 dimensões da fonte original.
2. Resolução da divergência do ADR 03: preenchimento assíncrono puro (Plano de Ação) ou modelo híbrido com revisão do membro de Dados na call (preserva o texto da proposta 26.1).
3. Se o relatório de resultado é exibido integralmente ao cliente ou se as red flags ficam restritas ao time interno.
4. Lista fechada de opções do campo `servico_interesse`, que precisa se alinhar aos níveis de serviço do Ciclo Comercial Modular.
5. Quem no comercial é responsável por enviar o link e em que ponto do Ciclo Comercial Modular esse envio acontece.

---

## Anexo A: Questionário

20 perguntas, 4 opções cada, escala de 1 a 4. Doze das vinte perguntas (60%) tratam de IA, automação e ML, o eixo em que a granularidade diferencia clientes nível 3 de clientes nível 5. Infraestrutura, Governança e Cultura carregam menos perguntas e mais peso: elas formam a Fundação, que é o teto do score.

### Bloco 1: Infraestrutura de dados (Fundação)

**Q1. Onde os dados da empresa estão armazenados hoje?**
1. Planilhas e arquivos soltos
2. Sistema principal, sem integração
3. Banco de dados centralizado
4. Banco de dados com cloud estruturada

**Q2. Existe processo automatizado de coleta dos dados?**
*Considere ERPs, CRMs, formulários e integrações entre sistemas.*
1. Tudo manual
2. Coleta automatizada em parte dos fluxos
3. Automatizada na maior parte dos fluxos
4. Pipeline de ingestão ponta a ponta

**Q3. Existe backup e proteção formal dos dados?**
*LGPD, criptografia, controle de acessos.*
1. Não existe política
2. Backups manuais
3. Backups automatizados
4. Backup e segurança auditada

### Bloco 2: Qualidade e governança (Fundação)

**Q4. Quem responde pelos dados dentro da empresa?**
1. Ninguém definido
2. Um analista cuida informalmente
3. Pessoa ou time formalmente responsável
4. Time com processo de qualidade ativo

**Q5. O significado e o cálculo dos dados estão documentados?**
*Alguém que entra na empresa hoje consegue entender o que cada dado significa?*
1. Não existe documentação
2. Documentação informal e incompleta
3. Documentação parcial dos dados principais
4. Documentação completa e atualizada

**Q6. Os dados de sistemas diferentes batem entre si?**
1. Inconsistências frequentes
2. Inconsistências ocasionais, sem monitoramento
3. Poucas inconsistências, validação pontual
4. Consistentes, com validação ativa

### Bloco 3: Cultura analítica (Prontidão)

**Q7. Como as decisões mais importantes são tomadas?**
1. Por intuição e experiência
2. Dados consultados só em momento de crise
3. Dashboards consultados regularmente pela liderança
4. Decisões rastreáveis em dados, em todos os níveis

**Q8. Existem KPIs por área, medidos e revisados com regularidade?**
1. Não definidos
2. Definidos, mas não medidos
3. Medidos parcialmente
4. Medidos e revisados em rito formal

### Bloco 4: IA, automação e ML (Prontidão)

**Q9. A área usa IA generativa no dia a dia?**
1. Não usa
2. Uso pessoal, sem padrão
3. Casos de uso definidos
4. Integrada em produtos e processos

**Q10. Existe política de uso de IA e prompts?**
*Privacidade, segurança e compliance.*
1. Não existe
2. Diretrizes informais
3. Política documentada
4. Política com treinamento do time

**Q11. Há automações com agentes ou RAG sobre dados próprios da empresa?**
*RAG é a técnica que permite a uma IA responder com base nos documentos e dados da própria empresa.*
1. Não
2. Provas de conceito isoladas
3. Casos em produção
4. Plataforma de agentes ativa

**Q12. Tarefas repetitivas são automatizadas?**
1. Tudo manual
2. Automações isoladas
3. Automações em fluxos críticos
4. Operação majoritariamente automatizada

**Q13. Quais ferramentas de automação a empresa usa?**
1. Nenhuma
2. Macros ou scripts pontuais
3. No-code (Zapier, Make, n8n)
4. Plataforma própria com código

**Q14. Existe monitoramento dos jobs e automações em produção?**
*Alguém sabe quando uma automação falha, e como?*
1. Sem monitoramento
2. Checagem manual
3. Alertas automáticos
4. SLA e observabilidade

**Q15. Quanto tempo por mês as automações economizam?**
*Estimativa aproximada.*
1. Nada mensurável
2. Algumas horas
3. Dezenas de horas
4. Centenas de horas

**Q16. A empresa usa modelos preditivos?**
*Previsão de demanda, churn, scoring de clientes.*
1. Não usa
2. Provas de conceito isoladas
3. Modelos em produção
4. Vários modelos em produção

**Q17. Como esses modelos são desenvolvidos e versionados?**
1. Não há processo
2. Notebooks ad-hoc
3. Repositório versionado
4. Pipeline de MLOps completo

**Q18. Os modelos em produção são monitorados?**
*Queda de performance, mudança de comportamento dos dados.*
1. Não monitoramos
2. Checagens manuais
3. Métricas automatizadas
4. Monitoramento contínuo com retraining

**Q19. Como a empresa mede o retorno das iniciativas de IA?**
1. Não medimos
2. Percepção qualitativa
3. Métrica por caso de uso
4. Painel consolidado de ROI

**Q20. Existe responsável definido por operar e sustentar as soluções de IA após a entrega?**
1. Ninguém responsável
2. Responsabilidade informal
3. Pessoa ou time com dedicação parcial
4. Time dedicado com rotina de operação

### Nota de desenho

Q17 e Q18 pressupõem que a empresa usa modelos preditivos. Cliente que responde 1 em Q16 não tem contexto para responder Q17 e Q18 com sentido, e responde 1 em ambas por eliminação. Isso é aceitável no cálculo, porque quem não tem modelo de fato não tem maturidade de ML, mas gera três telas seguidas de resposta óbvia e aumenta o risco de abandono.

Alternativa a avaliar na fatia 2: pular Q17 e Q18 quando Q16 = 1, e imputar valor 1 nas duas. Reduz o formulário para 18 perguntas efetivas nesse caminho, sem alterar o score. Decisão fora do MVP.