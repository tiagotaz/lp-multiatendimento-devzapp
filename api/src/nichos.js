// Conteúdo do PDF por nicho. As chaves batem com os valores do <select name="nicho">
// dos formulários do site. Só cite recursos que o DevChat entrega hoje
// (ver INFORMACOES-SISTEMA.md): multiatendimento, CRM Kanban, URA/chatbot,
// respostas rápidas, departamentos, relatórios/dashboard. IA = "em breve".

const NICHOS = {
  "Contabilidade": {
    seguranca: "Dados fiscais e financeiros dos clientes ficam no sistema, com acesso por permissão: o departamento pessoal não vê o financeiro, e vice-versa.",
    plural: "escritórios de contabilidade",
    cliente: "cliente",
    lp: "/contabilidade/",
    dores: [
      { t: "Pedidos de guia e documento se perdem", d: "Cliente pede a guia do DAS ou o holerite no WhatsApp pessoal de quem atendeu da última vez e ninguém mais vê." },
      { t: "Prazo apertado no fim do mês", d: "No fechamento, o volume de mensagens explode e as dúvidas simples tomam o tempo da equipe técnica." },
      { t: "Histórico preso no celular", d: "Quando o colaborador sai ou tira férias, o histórico das conversas com o cliente vai junto." }
    ],
    funil: ["Nova solicitação", "Aguardando documento", "Em execução", "Enviado ao cliente", "Concluído"],
    ura: {
      saudacao: "Olá! Você está falando com o escritório. Escolha o setor:",
      opcoes: ["Departamento fiscal", "Departamento pessoal / folha", "Abertura de empresa", "Financeiro e boletos"]
    },
    respostas: [
      { atalho: "//guia", texto: "Segue a sua guia do mês. O vencimento é dia {{data}}. Qualquer dúvida, é só responder aqui." },
      { atalho: "//docs", texto: "Para darmos andamento, precisamos de: extratos do mês, notas de entrada e notas de saída." },
      { atalho: "//prazo", texto: "Recebemos sua solicitação! O prazo de retorno do nosso time é de até 2 dias úteis." }
    ],
    metricas: ["Solicitações por departamento", "Tempo médio de resposta no fechamento", "Clientes que mais demandam atendimento"]
  },

  "Clínica ou consultório": {
    seguranca: "Conversas com pacientes envolvem dados de saúde. Com permissões por atendente, cada pessoa vê só o que precisa, e o histórico fica na clínica, não no celular de alguém.",
    plural: "clínicas e consultórios",
    cliente: "paciente",
    lp: "/para/clinicas/",
    dores: [
      { t: "Paciente sem resposta marca em outro lugar", d: "Quem pede horário e espera muito pela resposta acaba agendando com o concorrente." },
      { t: "Recepção sobrecarregada", d: "Agendamento, confirmação, dúvida de convênio e resultado de exame chegam todos no mesmo celular." },
      { t: "Faltas e remarcações sem controle", d: "Sem saber em que etapa cada paciente está, as confirmações viram planilha e lembrete no papel." }
    ],
    funil: ["Novo contato", "Agendamento", "Confirmado", "Atendido", "Retorno"],
    ura: {
      saudacao: "Olá! Bem-vindo(a) à clínica. Como podemos ajudar?",
      opcoes: ["Agendar consulta", "Confirmar ou remarcar", "Convênios e valores", "Resultados de exames"]
    },
    respostas: [
      { atalho: "//confirma", texto: "Olá! Passando para confirmar sua consulta amanhã às {{hora}}. Responda 1 para confirmar ou 2 para remarcar." },
      { atalho: "//convenios", texto: "Atendemos os seguintes convênios: {{lista}}. Para particular, o valor da consulta é {{valor}}." },
      { atalho: "//preparo", texto: "Para o seu exame, siga estas orientações de preparo: {{orientações}}." }
    ],
    metricas: ["Contatos que viraram agendamento", "Tempo médio até a primeira resposta", "Atendimentos por recepcionista"]
  },

  "Imobiliária": {
    seguranca: "A carteira de clientes fica na imobiliária. Com permissões, cada corretor vê os próprios atendimentos e o gestor acompanha todos.",
    plural: "imobiliárias",
    cliente: "lead",
    lp: "/para/imobiliarias/",
    dores: [
      { t: "Lead de portal esfria rápido", d: "O interessado chama três imobiliárias ao mesmo tempo. Quem responde primeiro leva a visita." },
      { t: "Corretor atendendo no número pessoal", d: "A carteira de clientes fica no celular do corretor e sai com ele quando ele muda de imobiliária." },
      { t: "Gestor sem visão do funil", d: "Não dá para saber quantas visitas foram marcadas nem quais propostas estão paradas." }
    ],
    funil: ["Novo lead", "Qualificação", "Visita agendada", "Proposta", "Fechado"],
    ura: {
      saudacao: "Olá! Que bom ter você aqui. O que você procura?",
      opcoes: ["Comprar imóvel", "Alugar imóvel", "Anunciar meu imóvel", "Falar com meu corretor"]
    },
    respostas: [
      { atalho: "//visita", texto: "Ótima escolha! Tenho horários para visita em {{dias}}. Qual fica melhor para você?" },
      { atalho: "//docsaluguel", texto: "Para a análise de locação, precisamos de: RG, CPF, comprovante de renda e comprovante de residência." },
      { atalho: "//perfil", texto: "Para eu separar as melhores opções: qual região, quantos quartos e qual a faixa de valor?" }
    ],
    metricas: ["Leads por corretor", "Tempo até a primeira resposta ao lead", "Leads por etapa do funil"]
  },

  "Escola ou curso": {
    seguranca: "Escolas lidam com dados de alunos, muitos menores de idade. Com permissões, a secretaria, o financeiro e a coordenação veem só o que é do seu setor.",
    plural: "escolas e cursos",
    cliente: "aluno ou responsável",
    lp: "/para/escolas/",
    dores: [
      { t: "Matrícula perdida na época de pico", d: "No período de matrículas, os pedidos de informação se acumulam e muitos ficam sem retorno." },
      { t: "Secretaria e financeiro no mesmo número", d: "Dúvidas de boleto, declaração e matrícula se misturam, e o responsável repete tudo a cada contato." },
      { t: "Sem acompanhamento de interessados", d: "Quem pediu informação e não matriculou some, porque ninguém sabe em que etapa a conversa parou." }
    ],
    funil: ["Interessado", "Visita ou aula experimental", "Matrícula em andamento", "Matriculado", "Rematrícula"],
    ura: {
      saudacao: "Olá! Seja bem-vindo(a). Sobre o que você quer falar?",
      opcoes: ["Matrículas e valores", "Secretaria e documentos", "Financeiro e boletos", "Coordenação pedagógica"]
    },
    respostas: [
      { atalho: "//matricula", texto: "As matrículas para {{ano}} estão abertas! Posso te enviar os valores e agendar uma visita?" },
      { atalho: "//declaracao", texto: "Sua solicitação de declaração foi registrada. Ela fica pronta em até {{prazo}} dias úteis." },
      { atalho: "//boleto", texto: "Segue a segunda via do boleto. Se já pagou, pode desconsiderar esta mensagem." }
    ],
    metricas: ["Interessados por etapa da matrícula", "Atendimentos por setor", "Horários com maior demanda"]
  },

  "Loja ou e-commerce": {
    seguranca: "Dados de pedidos e de clientes ficam centralizados, com acesso por permissão para cada atendente.",
    plural: "lojas e e-commerces",
    cliente: "cliente",
    lp: "/para/ecommerce/",
    dores: [
      { t: "Dúvida sem resposta vira carrinho abandonado", d: "O cliente pergunta sobre tamanho, frete ou prazo e, sem resposta rápida, compra em outra loja." },
      { t: "“Cadê meu pedido?” o dia inteiro", d: "As perguntas sobre status de entrega tomam o tempo que deveria ir para vender." },
      { t: "Troca e devolução sem padrão", d: "Cada atendente explica a política de um jeito diferente, e o cliente fica confuso." }
    ],
    funil: ["Dúvida pré-venda", "Orçamento ou carrinho", "Pedido confirmado", "Em entrega", "Pós-venda"],
    ura: {
      saudacao: "Oi! Que bom te ver por aqui. Como podemos ajudar?",
      opcoes: ["Quero comprar", "Acompanhar meu pedido", "Trocas e devoluções", "Falar com um atendente"]
    },
    respostas: [
      { atalho: "//rastreio", texto: "Seu pedido já foi enviado! Acompanhe a entrega por aqui: {{link}}." },
      { atalho: "//troca", texto: "Você pode solicitar a troca em até {{dias}} dias após o recebimento. Funciona assim: {{passos}}." },
      { atalho: "//frete", texto: "Para calcular o frete, me envia o seu CEP que eu já te passo valor e prazo." }
    ],
    metricas: ["Atendimentos de pré-venda x pós-venda", "Tempo médio de resposta em horário de pico", "Clientes que mais acionam o suporte"]
  },

  "Concessionária ou oficina": {
    seguranca: "Cada vendedor vê os próprios atendimentos, e a carteira de clientes continua na empresa quando alguém sai da equipe.",
    plural: "concessionárias e oficinas",
    cliente: "cliente",
    lp: "/para/automotivo/",
    dores: [
      { t: "Lead de veículo sem retorno", d: "O interessado pede uma avaliação ou um test-drive e espera horas, enquanto a loja vizinha responde na hora." },
      { t: "Vendas, oficina e peças no mesmo número", d: "Agendamento de revisão, orçamento de peça e proposta de venda disputam a mesma fila." },
      { t: "Pós-venda esquecido", d: "Lembrete de revisão e pesquisa de satisfação dependem da memória do vendedor." }
    ],
    funil: ["Novo contato", "Avaliação ou test-drive", "Proposta", "Venda ou serviço fechado", "Pós-venda"],
    ura: {
      saudacao: "Olá! Obrigado pelo contato. Escolha o setor:",
      opcoes: ["Comprar um veículo", "Agendar revisão ou serviço", "Orçamento de peças", "Falar com meu vendedor"]
    },
    respostas: [
      { atalho: "//testdrive", texto: "Vamos agendar seu test-drive! Tenho horários em {{dias}}. Qual prefere?" },
      { atalho: "//revisao", texto: "Sua revisão ficou agendada para {{data}} às {{hora}}. Traga o manual e o documento do veículo." },
      { atalho: "//orcamento", texto: "Para o orçamento, me informe o modelo, o ano e a placa do veículo." }
    ],
    metricas: ["Leads por vendedor", "Agendamentos da oficina por semana", "Tempo até a primeira resposta"]
  },

  "Advocacia": {
    seguranca: "Conversas com clientes são sigilosas. Com permissões por atendente, cada pessoa vê só os atendimentos do seu setor.",
    plural: "escritórios de advocacia",
    cliente: "cliente",
    lp: "/",
    dores: [
      { t: "Primeiro contato sem triagem", d: "Quem chega pelo WhatsApp cai direto no advogado, sem saber qual a área do caso." },
      { t: "Cliente pedindo andamento toda hora", d: "As perguntas sobre o processo tomam o tempo da equipe e ficam espalhadas em vários celulares." },
      { t: "Histórico de conversa sem registro", d: "Combinados e orientações dados pelo WhatsApp não ficam centralizados no escritório." }
    ],
    funil: ["Novo contato", "Triagem do caso", "Consulta agendada", "Proposta de honorários", "Cliente ativo"],
    ura: {
      saudacao: "Olá! Você está falando com o escritório. Qual o assunto?",
      opcoes: ["Direito trabalhista", "Direito de família", "Direito civil / consumidor", "Já sou cliente"]
    },
    respostas: [
      { atalho: "//consulta", texto: "Podemos agendar uma consulta inicial. Tenho horários em {{dias}}. Qual fica melhor?" },
      { atalho: "//docs", texto: "Para analisarmos o seu caso, envie: documento com foto, comprovante de residência e {{documentos}}." },
      { atalho: "//andamento", texto: "Recebemos sua solicitação. O advogado responsável retorna com a atualização até {{prazo}}." }
    ],
    metricas: ["Contatos por área do direito", "Consultas agendadas por mês", "Tempo médio de resposta"]
  },

  "Outro": {
    seguranca: "Com permissões por atendente, cada pessoa vê só o que precisa, e o histórico dos clientes fica na empresa.",
    plural: "empresas que atendem pelo WhatsApp",
    cliente: "cliente",
    lp: "/",
    dores: [
      { t: "Mensagens perdidas", d: "Com várias pessoas respondendo, alguns clientes ficam sem resposta e procuram o concorrente." },
      { t: "Equipe sem padrão", d: "Cada atendente responde de um jeito, e a experiência do cliente muda a cada conversa." },
      { t: "Falta de controle", d: "O gestor não sabe quem está atendendo o quê nem quanto tempo o cliente espera." }
    ],
    funil: ["Novo contato", "Em atendimento", "Proposta", "Fechado", "Pós-venda"],
    ura: {
      saudacao: "Olá! Obrigado pelo contato. Escolha uma opção:",
      opcoes: ["Comercial", "Suporte", "Financeiro", "Falar com um atendente"]
    },
    respostas: [
      { atalho: "//boasvindas", texto: "Olá! Obrigado por falar com a gente. Em que posso ajudar?" },
      { atalho: "//horario", texto: "Nosso horário de atendimento é de {{horário}}. Fora desse horário, respondemos assim que voltarmos." },
      { atalho: "//proposta", texto: "Segue a proposta conforme conversamos. Qualquer dúvida, estou à disposição." }
    ],
    metricas: ["Atendimentos por atendente", "Tempo médio de resposta", "Horários com maior demanda"]
  }
};

// Texto do cenário conforme a faixa de atendentes informada no formulário.
const CENARIO_EQUIPE = {
  "1 a 2": "Com uma equipe enxuta, o ganho está em não depender de um único celular: as duas pessoas atendem o mesmo número, cada uma pelo seu navegador ou pelo app, e as respostas rápidas economizam digitação.",
  "3 a 5": "Com 3 a 5 pessoas no mesmo número, a URA já separa os assuntos e cada conversa tem um responsável. Ninguém responde em dobro e ninguém fica sem resposta.",
  "6 a 10": "Com 6 a 10 atendentes, vale organizar departamentos e ligar a distribuição automática. O gestor acompanha a fila e o desempenho de cada um pelo dashboard.",
  "11 a 20": "Com 11 a 20 atendentes, departamentos, permissões por operador e o CRM Kanban dão ao gestor a visão da operação inteira sem precisar perguntar para ninguém.",
  "21 ou mais": "Com mais de 20 atendentes, a operação pede estrutura de central: departamentos, distribuição automática, permissões, relatórios exportáveis e webhooks para integrar com os seus sistemas."
};

// Plano indicado pela faixa de atendentes (preços e limites de /planos/).
// Kanban e URA só existem a partir do Profissional; o material mostra os dois.
const PLANOS = {
  "1 a 2": { nome: "Profissional", preco: "R$356/mês", detalhe: "Até 4 atendentes, com CRM Kanban, URA e departamentos. Para só 2 atendentes sem funil e URA, o Essencial sai por R$178/mês." },
  "3 a 5": { nome: "Profissional", preco: "R$356/mês", detalhe: "Até 4 atendentes ao mesmo tempo, com CRM Kanban, URA e departamentos. Se forem 5 atendendo juntos, o indicado é o Avançado (R$750/mês, até 10)." },
  "6 a 10": { nome: "Avançado", preco: "R$750/mês", detalhe: "Até 10 atendentes ao mesmo tempo, múltiplos departamentos, onboarding dedicado e suporte prioritário." },
  "11 a 20": { nome: "Avançado + operadores extras", preco: "sob consulta", detalhe: "O Avançado cobre 10 atendentes ao mesmo tempo. Para a sua equipe, um especialista monta a proposta com os operadores adicionais." },
  "21 ou mais": { nome: "Avançado + operadores extras", preco: "sob consulta", detalhe: "O Avançado cobre 10 atendentes ao mesmo tempo. Para a sua equipe, um especialista monta a proposta com os operadores adicionais." }
};

function getNicho(nome) {
  return NICHOS[nome] ? { nome, ...NICHOS[nome] } : { nome: "Outro", ...NICHOS.Outro };
}

module.exports = { NICHOS, CENARIO_EQUIPE, PLANOS, getNicho };
