/**
 * CITi — Formulário "Nos conte sua ideia!"
 * Google Apps Script — recebe os dados do formulário e grava na planilha.
 *
 * COMO FAZER O DEPLOY:
 * 1. Acesse script.google.com e crie um novo projeto.
 * 2. Cole este código no editor.
 * 3. Clique em "Implantar" → "Nova implantação".
 * 4. Tipo: "Aplicativo da Web".
 * 5. Executar como: "Eu (minha conta Google)".
 * 6. Quem tem acesso: "Qualquer pessoa" (Anyone).
 * 7. Clique em "Implantar" e copie a URL gerada.
 * 8. Cole a URL no arquivo index.html onde está APPS_SCRIPT_URL.
 *
 * CABEÇALHOS DA PLANILHA (linha 1):
 * Timestamp | Nome | E-mail | Telefone | Interesse | Investimento | Descrição
 *
 * ATUALIZAR CÓDIGO DEPOIS DO 1º DEPLOY (ex.: ao editar este arquivo):
 * Colar o código novo no editor não é suficiente — a implantação existente
 * continua servindo a versão antiga. É preciso "Implantar" → "Gerenciar
 * implantações" → ícone de lápis na implantação ativa → Versão: "Nova
 * versão" → "Implantar". A URL do Web App não muda.
 *
 * NOTIFICAÇÃO POR E-MAIL:
 * Cada novo lead dispara um e-mail para a lista em EMAILS_NOTIFICACAO, mais
 * o dono do script (a conta usada em "Executar como" no deploy), via
 * notificarNovoLead_(). Na primeira execução após colar/alterar este código,
 * o Apps Script vai pedir autorização para usar o serviço de e-mail
 * (MailApp) — autorize normalmente.
 *
 * INTEGRAÇÃO COM O DMS (Data Maturity Score):
 * O formulário do DMS não pergunta "interesse" — ele envia nome, email,
 * telefone e setor (entre outros campos que não têm coluna aqui, como
 * empresa e cargo, e por isso não são gravados). Por isso o Interesse cai
 * para data.setor quando data.interesse não vem no payload. Investimento e
 * Descrição ficam em branco nas linhas geradas pelo DMS.
 *
 * RESULTADO COMPLETO DO DMS (respostas + score):
 * Um segundo tipo de submissão, marcada com data.tipo === 'dms_resultado',
 * grava numa aba própria — DMS_Resultados, criada automaticamente na
 * primeira chamada — em vez de misturar com a aba de leads acima. Essa aba
 * guarda as 20 respostas cruas (coluna Respostas, em JSON) e o score por
 * pilar, então a regra de cálculo pode mudar sem perder o histórico bruto.
 */

var EMAILS_NOTIFICACAO = [
  'rafael.nobrega@citi.org.br',
  'tiago.mattos@citi.org.br',
  'daniel.dias@citi.org.br',
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.tipo === 'dms_resultado') {
      registrarResultadoDMS_(data);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria cabeçalhos se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Nome',
        'E-mail',
        'Telefone',
        'Interesse',
        'Investimento',
        'Descrição',
      ]);
    }

    sheet.appendRow([
      new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' }),
      data.nome || '',
      data.email || '',
      data.telefone || '',
      data.interesse || data.setor || '',
      data.investimento || '',
      data.descricao || '',
    ]);

    notificarNovoLead_(data, sheet);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Grava o resultado completo do diagnóstico DMS (respostas + score por
// pilar) numa aba própria, separada dos leads de marketing.
function registrarResultadoDMS_(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('DMS_Resultados');
  if (!sheet) {
    sheet = ss.insertSheet('DMS_Resultados');
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Nome',
      'E-mail',
      'Telefone',
      'Empresa',
      'Cargo',
      'Setor',
      'Porte',
      'Infraestrutura',
      'Integração',
      'Governança',
      'BI & Decisão',
      'Automação',
      'IA Preditiva',
      'Agentes de IA',
      'Fundação',
      'Prontidão',
      'Score Final',
      'Faixa',
      'Respostas (JSON)',
    ]);
  }

  var pilares = data.scorePorPilar || {};

  sheet.appendRow([
    new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' }),
    data.nome || '',
    data.email || '',
    data.telefone || '',
    data.empresa || '',
    data.cargo || '',
    data.setor || '',
    data.porte || '',
    pilares.infra != null ? pilares.infra : '',
    pilares.integracao != null ? pilares.integracao : '',
    pilares.governanca != null ? pilares.governanca : '',
    pilares.bi != null ? pilares.bi : '',
    pilares.automacao != null ? pilares.automacao : '',
    pilares.ia_preditiva != null ? pilares.ia_preditiva : '',
    pilares.agentes_ia != null ? pilares.agentes_ia : '',
    data.scoreFundacao != null ? data.scoreFundacao : '',
    data.scoreProntidao != null ? data.scoreProntidao : '',
    data.scoreFinal != null ? data.scoreFinal : '',
    data.faixa || '',
    JSON.stringify(data.respostas || {}),
  ]);
}

// Envia um e-mail avisando o dono do script assim que um lead novo chega.
// Falha de envio não deve derrubar o registro do lead — por isso o try/catch próprio.
function notificarNovoLead_(data, sheet) {
  try {
    var dono = Session.getEffectiveUser().getEmail();
    var destinatarios = EMAILS_NOTIFICACAO.slice();
    if (dono && destinatarios.indexOf(dono) === -1) destinatarios.push(dono);
    if (destinatarios.length === 0) return;

    var planilhaUrl = sheet.getParent().getUrl();
    var assunto = 'Novo lead no formulário: ' + (data.nome || 'sem nome');
    var corpo = [
      'Um novo lead preencheu o formulário "Nos conte sua ideia!".',
      '',
      'Nome: ' + (data.nome || '-'),
      'E-mail: ' + (data.email || '-'),
      'Telefone: ' + (data.telefone || '-'),
      'Interesse: ' + (data.interesse || data.setor || '-'),
      'Investimento: ' + (data.investimento || '-'),
      'Descrição: ' + (data.descricao || '-'),
      '',
      'Planilha: ' + planilhaUrl,
    ].join('\n');

    MailApp.sendEmail(destinatarios.join(','), assunto, corpo);
  } catch (mailErr) {
    // Notificação é best-effort; nunca deve impedir o appendRow acima.
  }
}

// Função temporária só para forçar a tela de autorização do MailApp e
// confirmar pra qual conta o e-mail está indo. Pode apagar depois do teste.
function testeNotificacao() {
  var dono = Session.getEffectiveUser().getEmail();
  var destinatarios = EMAILS_NOTIFICACAO.slice();
  if (dono && destinatarios.indexOf(dono) === -1) destinatarios.push(dono);
  var corpo = [
    'Se você recebeu isso, a permissão de e-mail está ok.',
    'Destinatários: ' + destinatarios.join(', '),
  ].join('\n');
  MailApp.sendEmail(destinatarios.join(','), 'Teste CITi', corpo);
}

// Permite testar via GET no browser (retorna status)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'CITi form script is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
