// src/services/relatorio.service.ts

/*
|--------------------------------------------------------------------------
| Tipos gerais
|--------------------------------------------------------------------------
*/

export type Nivel = "baixo" | "medio" | "alto";

export type Distribuicao = {
  baixo: number;
  medio: number;
  alto: number;
};

type OpcaoAgrupamento = {
  valor: number;
  descricao: string;
};

export type ItemAgrupamento = {
  valor: number;
  descricao: string;
  quantidade: number;
  percentual: number;
};

type RespostaComNivel = {
  resposta: any;
  nivel: Nivel;
};
export type ItemCruzamentoBurnout = {
  valor: number;
  descricao: string;
  total: number;

  baixo: number;
  medio: number;
  alto: number;

  percentuais: {
    baixo: number;
    medio: number;
    alto: number;
  };
};

/*
|--------------------------------------------------------------------------
| Funções estatísticas
|--------------------------------------------------------------------------
*/

export function percentual(quantidade: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Number(((quantidade / total) * 100).toFixed(2));
}

export function media(valores: number[]): number {
  if (valores.length === 0) {
    return 0;
  }

  const soma = valores.reduce((total, valor) => total + valor, 0);

  return Number((soma / valores.length).toFixed(2));
}

export function desvioPadrao(valores: number[]): number {
  if (valores.length === 0) {
    return 0;
  }

  const valorMedia = media(valores);

  const variancia =
    valores.reduce(
      (total, valor) => total + Math.pow(valor - valorMedia, 2),
      0,
    ) / valores.length;

  return Number(Math.sqrt(variancia).toFixed(2));
}

/*
|--------------------------------------------------------------------------
| Funções auxiliares
|--------------------------------------------------------------------------
*/

function numero(valor: unknown): number {
  const resultado = Number(valor);

  return Number.isFinite(resultado) ? resultado : 0;
}

function criarDistribuicao(): Distribuicao {
  return {
    baixo: 0,
    medio: 0,
    alto: 0,
  };
}

function incrementar(distribuicao: Distribuicao, nivel: Nivel) {
  distribuicao[nivel]++;
}

/*
|--------------------------------------------------------------------------
| Configuração das características
|--------------------------------------------------------------------------
*/

const PERFIL: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Enfermeiro",
  },
  {
    valor: 2,
    descricao: "Técnico de enfermagem",
  },
  {
    valor: 3,
    descricao: "Auxiliar de enfermagem",
  },
];

const TEMPO_FORMACAO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Até 1 ano",
  },
  {
    valor: 2,
    descricao: "De 1 a 3 anos",
  },
  {
    valor: 3,
    descricao: "De 3 a 5 anos",
  },
  {
    valor: 4,
    descricao: "De 5 a 10 anos",
  },
  {
    valor: 5,
    descricao: "Mais de 10 anos",
  },
];

const GRADUACAO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Especialização",
  },
  {
    valor: 2,
    descricao: "Mestrado",
  },
  {
    valor: 3,
    descricao: "Doutorado/Pós-Doutorado",
  },
  {
    valor: 4,
    descricao: "Não fez pós-graduação",
  },
];

const TEMPO_INSTITUICAO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Até 1 ano",
  },
  {
    valor: 2,
    descricao: "De 1 a 3 anos",
  },
  {
    valor: 3,
    descricao: "De 3 a 5 anos",
  },
  {
    valor: 4,
    descricao: "Mais de 5 anos",
  },
];

const TEMPO_CARGO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Até 1 ano",
  },
  {
    valor: 2,
    descricao: "De 1 a 3 anos",
  },
  {
    valor: 3,
    descricao: "De 3 a 5 anos",
  },
  {
    valor: 4,
    descricao: "Mais de 5 anos",
  },
];

const AREA_TRABALHO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Bloco cirúrgico",
  },
  {
    valor: 2,
    descricao: "UTIs",
  },
  {
    valor: 3,
    descricao: "Unidade de Internação",
  },
  {
    valor: 4,
    descricao: "Administrativa",
  },
  {
    valor: 5,
    descricao: "Atendimento ambulatorial",
  },
  {
    valor: 6,
    descricao: "Apoio diagnóstico",
  },
  {
    valor: 7,
    descricao: "Urgência/Emergência",
  },
];

const ESCALA_TRABALHO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "12x36",
  },
  {
    valor: 2,
    descricao: "6x1",
  },
  {
    valor: 3,
    descricao: "12x60",
  },
  {
    valor: 4,
    descricao: "8 horas/dia - 44 horas semanais",
  },
];

const TURNO_TRABALHO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Matutino",
  },
  {
    valor: 2,
    descricao: "Vespertino",
  },
  {
    valor: 3,
    descricao: "Noturno",
  },
  {
    valor: 4,
    descricao: "Administrativo",
  },
];

const OUTRO_VINCULO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Sim",
  },
  {
    valor: 2,
    descricao: "Não",
  },
];
const CARGO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Administrativo",
  },
  {
    valor: 2,
    descricao: "Assistencial",
  },
  {
    valor: 3,
    descricao: "Gestão",
  },
];
const FORMACAO_COMPLEMENTAR: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "SIM",
  },
  {
    valor: 2,
    descricao: "NÃO",
  },
];

const FORMACAO: OpcaoAgrupamento[] = [
  {
    valor: 1,
    descricao: "Enfermeiros",
  },
  {
    valor: 2,
    descricao: "Técnicos/Auxiliares",
  },
];

function obterFormacao(resposta: any): number {
  const perfil = Number(resposta.inf_perfil);

  if (perfil === 1) {
    return 1;
  }

  if (perfil === 2 || perfil === 3) {
    return 2;
  }

  return 0;
}
function obterCargo(resposta: any): number {
  const perfil = Number(resposta.inf_perfil);

  /*
   * Enfermeiro
   *
   * 1 = Gestão
   * 2 = Administrativo
   * 3 = Assistencial
   */

  if (perfil === 1) {
    const cargo = Number(resposta.inf_cargo_enfermeiro);

    if (cargo === 1) {
      return 3; // Gestão
    }

    if (cargo === 2) {
      return 1; // Administrativo
    }

    if (cargo === 3) {
      return 2; // Assistencial
    }
  }

  /*
   * Técnico / Auxiliar
   *
   * 1 = Administrativo
   * 2 = Assistencial
   */

  const cargo = Number(resposta.inf_cargo_tecnico);

  if (cargo === 1) {
    return 1;
  }

  if (cargo === 2) {
    return 2;
  }

  return 0;
}
function obterFormacaoComplementar(resposta: any): number {
  /*
   * Formação complementar somente se aplica
   * aos enfermeiros.
   */

  if (Number(resposta.inf_perfil) !== 1) {
    return 0;
  }

  const graduacao = Number(resposta.inf_titulo_graduacao);

  /*
   * 1 = Especialização
   * 2 = Mestrado
   * 3 = Doutorado/Pós-Doutorado
   */

  if (graduacao === 1 || graduacao === 2 || graduacao === 3) {
    return 1;
  }

  /*
   * 4 = Não fez pós-graduação
   */

  if (graduacao === 4) {
    return 2;
  }

  return 0;
}
/*
|--------------------------------------------------------------------------
| Agrupamentos das características
|--------------------------------------------------------------------------
*/

function agruparCampo(
  respostas: any[],
  campo: string,
  opcoes: OpcaoAgrupamento[],
): ItemAgrupamento[] {
  const total = respostas.length;

  return opcoes.map((opcao) => {
    const quantidade = respostas.filter(
      (resposta) => numero(resposta[campo]) === opcao.valor,
    ).length;

    return {
      valor: opcao.valor,

      descricao: opcao.descricao,

      quantidade,

      percentual: percentual(quantidade, total),
    };
  });
}

/*
|--------------------------------------------------------------------------
| Características dos participantes
|--------------------------------------------------------------------------
*/

export function calcularCaracteristicas(respostas: any[]) {
  return {
    perfil: agruparCampo(respostas, "inf_perfil", PERFIL),

    tempoFormacao: agruparCampo(
      respostas,
      "inf_tempo_formacao_area_enfermagem",
      TEMPO_FORMACAO,
    ),

    graduacao: agruparCampo(respostas, "inf_titulo_graduacao", GRADUACAO),

    tempoInstituicao: agruparCampo(
      respostas,
      "inf_tempo_trabalho_instituicao",
      TEMPO_INSTITUICAO,
    ),

    tempoCargo: agruparCampo(
      respostas,
      "inf_tempo_trabalho_cargo",
      TEMPO_CARGO,
    ),

    areaTrabalho: agruparCampo(respostas, "inf_area_trabalho", AREA_TRABALHO),

    escalaTrabalho: agruparCampo(
      respostas,
      "inf_escala_trabalho",
      ESCALA_TRABALHO,
    ),

    turnoTrabalho: agruparCampo(
      respostas,
      "inf_turno_trabalho",
      TURNO_TRABALHO,
    ),

    outroVinculo: agruparCampo(respostas, "inf_outro_vinculo", OUTRO_VINCULO),
  };
}

/*
|--------------------------------------------------------------------------
| BURNOUT
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Perguntas por dimensão
|--------------------------------------------------------------------------
*/

const QUESTOES_EXAUSTAO = [
  "burnout_01",
  "burnout_13",
  "burnout_14",
  "burnout_08",
  "burnout_06",
  "burnout_16",
  "burnout_20",
  "burnout_03",
  "burnout_02",
] as const;

const QUESTOES_DESPERSONALIZACAO = [
  "burnout_15",
  "burnout_22",
  "burnout_11",
  "burnout_10",
  "burnout_05",
] as const;

const QUESTOES_REALIZACAO = [
  "burnout_21",
  "burnout_04",
  "burnout_19",
  "burnout_18",
  "burnout_17",
  "burnout_07",
  "burnout_09",
  "burnout_12",
] as const;

/*
|--------------------------------------------------------------------------
| Soma das perguntas
|--------------------------------------------------------------------------
*/

function somarQuestoes(resposta: any, perguntas: readonly string[]): number {
  return perguntas.reduce(
    (total, pergunta) => total + numero(resposta[pergunta]),
    0,
  );
}

/*
|--------------------------------------------------------------------------
| Pontuação das dimensões
|--------------------------------------------------------------------------
*/

function calcularExaustao(resposta: any): number {
  return somarQuestoes(resposta, QUESTOES_EXAUSTAO) - QUESTOES_EXAUSTAO.length;
}

function calcularDespersonalizacao(resposta: any): number {
  return (
    somarQuestoes(resposta, QUESTOES_DESPERSONALIZACAO) -
    QUESTOES_DESPERSONALIZACAO.length
  );
}

function calcularRealizacao(resposta: any): number {
  return (
    somarQuestoes(resposta, QUESTOES_REALIZACAO) - QUESTOES_REALIZACAO.length
  );
}

/*
|--------------------------------------------------------------------------
| Classificação Burnout
|--------------------------------------------------------------------------
*/

function classificarExaustao(valor: number): Nivel {
  if (valor >= 22) {
    return "alto";
  }

  if (valor >= 11) {
    return "medio";
  }

  return "baixo";
}

function classificarDespersonalizacao(valor: number): Nivel {
  if (valor >= 9) {
    return "alto";
  }

  if (valor >= 3) {
    return "medio";
  }

  return "baixo";
}

function classificarRealizacao(valor: number): Nivel {
  if (valor >= 9) {
    return "alto";
  }

  if (valor >= 3) {
    return "medio";
  }

  return "baixo";
}

/*
|--------------------------------------------------------------------------
| Cruzamentos Burnout
|--------------------------------------------------------------------------
*/
function cruzarComNivelCalculado(
  respostas: RespostaComNivel[],
  opcoes: OpcaoAgrupamento[],
  obterValor: (resposta: any) => number,
): ItemCruzamentoBurnout[] {
  return opcoes.map((opcao) => {
    const registros = respostas.filter(
      (item) => obterValor(item.resposta) === opcao.valor,
    );

    const total = registros.length;

    const baixo = registros.filter((item) => item.nivel === "baixo").length;

    const medio = registros.filter((item) => item.nivel === "medio").length;

    const alto = registros.filter((item) => item.nivel === "alto").length;

    return {
      valor: opcao.valor,
      descricao: opcao.descricao,
      total,
      baixo,
      medio,
      alto,

      percentuais: {
        baixo: percentual(baixo, total),

        medio: percentual(medio, total),

        alto: percentual(alto, total),
      },
    };
  });
}

function cruzarComNivel(
  dados: RespostaComNivel[],
  campo: string,
  opcoes: OpcaoAgrupamento[],
) {
  return opcoes.map((opcao) => {
    const registros = dados.filter(
      ({ resposta }) => numero(resposta[campo]) === opcao.valor,
    );

    const baixo = registros.filter(({ nivel }) => nivel === "baixo").length;

    const medio = registros.filter(({ nivel }) => nivel === "medio").length;

    const alto = registros.filter(({ nivel }) => nivel === "alto").length;

    return {
      valor: opcao.valor,

      descricao: opcao.descricao,

      total: registros.length,

      baixo,
      medio,
      alto,

      percentuais: {
        baixo: percentual(baixo, registros.length),

        medio: percentual(medio, registros.length),

        alto: percentual(alto, registros.length),
      },
    };
  });
}

function criarCruzamentosBurnout(respostas: RespostaComNivel[]) {
  return {
    perfil: cruzarComNivel(respostas, "inf_perfil", PERFIL),
    tempoFormacao: cruzarComNivel(
      respostas,
      "inf_tempo_formacao_area_enfermagem",
      TEMPO_FORMACAO,
    ),
    graduacao: cruzarComNivel(respostas, "inf_titulo_graduacao", GRADUACAO),
    tempoInstituicao: cruzarComNivel(
      respostas,
      "inf_tempo_trabalho_instituicao",
      TEMPO_INSTITUICAO,
    ),
    tempoCargo: cruzarComNivel(
      respostas,
      "inf_tempo_trabalho_cargo",
      TEMPO_CARGO,
    ),
    formacaoComplementar: cruzarComNivelCalculado(
      respostas,
      FORMACAO_COMPLEMENTAR,
      obterFormacaoComplementar,
    ),
    cargo: cruzarComNivelCalculado(respostas, CARGO, obterCargo),

    formacao: cruzarComNivelCalculado(respostas, FORMACAO, obterFormacao),

    areaTrabalho: cruzarComNivel(respostas, "inf_area_trabalho", AREA_TRABALHO),
    escalaTrabalho: cruzarComNivel(
      respostas,
      "inf_escala_trabalho",
      ESCALA_TRABALHO,
    ),
    turnoTrabalho: cruzarComNivel(
      respostas,
      "inf_turno_trabalho",
      TURNO_TRABALHO,
    ),
    outroVinculo: cruzarComNivel(respostas, "inf_outro_vinculo", OUTRO_VINCULO),
  };
}

/*
|--------------------------------------------------------------------------
| Resultado Burnout
|--------------------------------------------------------------------------
*/

export function calcularDadosBurnout(respostas: any[]) {
  const exaustao = criarDistribuicao();

  const despersonalizacao = criarDistribuicao();

  const realizacao = criarDistribuicao();

  const valoresExaustao: number[] = [];

  const valoresDespersonalizacao: number[] = [];

  const valoresRealizacao: number[] = [];

  const dadosExaustao: RespostaComNivel[] = [];

  const dadosDespersonalizacao: RespostaComNivel[] = [];

  const dadosRealizacao: RespostaComNivel[] = [];

  for (const resposta of respostas) {
    /*
    |--------------------------------------------------------------------------
    | Exaustão
    |--------------------------------------------------------------------------
    */

    const valorExaustao = calcularExaustao(resposta);

    const nivelExaustao = classificarExaustao(valorExaustao);

    valoresExaustao.push(valorExaustao);

    incrementar(exaustao, nivelExaustao);

    dadosExaustao.push({
      resposta,
      nivel: nivelExaustao,
    });

    /*
    |--------------------------------------------------------------------------
    | Despersonalização
    |--------------------------------------------------------------------------
    */

    const valorDespersonalizacao = calcularDespersonalizacao(resposta);

    const nivelDespersonalizacao = classificarDespersonalizacao(
      valorDespersonalizacao,
    );

    valoresDespersonalizacao.push(valorDespersonalizacao);

    incrementar(despersonalizacao, nivelDespersonalizacao);

    dadosDespersonalizacao.push({
      resposta,
      nivel: nivelDespersonalizacao,
    });

    /*
    |--------------------------------------------------------------------------
    | Realização
    |--------------------------------------------------------------------------
    */

    const valorRealizacao = calcularRealizacao(resposta);

    const nivelRealizacao = classificarRealizacao(valorRealizacao);

    valoresRealizacao.push(valorRealizacao);

    incrementar(realizacao, nivelRealizacao);

    dadosRealizacao.push({
      resposta,
      nivel: nivelRealizacao,
    });
  }

  return {
    totalParticipantes: respostas.length,

    exaustaoEmocional: {
      distribuicao: exaustao,

      media: media(valoresExaustao),

      desvioPadrao: desvioPadrao(valoresExaustao),

      cruzamentos: criarCruzamentosBurnout(dadosExaustao),
    },

    despersonalizacao: {
      distribuicao: despersonalizacao,

      media: media(valoresDespersonalizacao),

      desvioPadrao: desvioPadrao(valoresDespersonalizacao),

      cruzamentos: criarCruzamentosBurnout(dadosDespersonalizacao),
    },

    realizacaoProfissional: {
      distribuicao: realizacao,

      media: media(valoresRealizacao),

      desvioPadrao: desvioPadrao(valoresRealizacao),

      cruzamentos: criarCruzamentosBurnout(dadosRealizacao),
    },
  };
}

/*
|--------------------------------------------------------------------------
| PES-NWI
|--------------------------------------------------------------------------
*/

type CampoPesNwi = `pesnwi_${string}`;

type ConfiguracaoDimensaoPesNwi = {
  id: number;
  descricao: string;
  perguntas: readonly CampoPesNwi[];
};

export type ResultadoPerguntaPesNwi = {
  pergunta: CampoPesNwi;
  numero: number;
  media: number;
  desvioPadrao: number;
};

export type ResultadoDimensaoPesNwi = {
  id: number;
  descricao: string;
  quantidadePerguntas: number;
  media: number;
  desvioPadrao: number;
  perguntas: ResultadoPerguntaPesNwi[];
};

/*
|--------------------------------------------------------------------------
| Dimensões PES-NWI
|--------------------------------------------------------------------------
|
| Composição extraída do relatório legado.
|
*/

const DIMENSOES_PES_NWI: ConfiguracaoDimensaoPesNwi[] = [
  {
    id: 1,
    descricao: "Participação da enfermagem em assuntos hospitalares",

    perguntas: [
      "pesnwi_15",
      "pesnwi_28",
      "pesnwi_11",
      "pesnwi_27",
      "pesnwi_06",
      "pesnwi_05",
      "pesnwi_21",
      "pesnwi_23",
      "pesnwi_17",
    ],
  },

  {
    id: 2,
    descricao: "Fundamentos de enfermagem para a qualidade do atendimento",

    perguntas: [
      "pesnwi_26",
      "pesnwi_18",
      "pesnwi_19",
      "pesnwi_22",
      "pesnwi_31",
      "pesnwi_14",
      "pesnwi_25",
      "pesnwi_30",
      "pesnwi_29",
      "pesnwi_04",
    ],
  },

  {
    id: 3,
    descricao:
      "Capacidade do enfermeiro gestor, liderança e apoio dos enfermeiros",

    perguntas: [
      "pesnwi_03",
      "pesnwi_20",
      "pesnwi_07",
      "pesnwi_10",
      "pesnwi_13",
    ],
  },

  {
    id: 4,
    descricao: "Adequação de pessoal e recurso",

    perguntas: ["pesnwi_01", "pesnwi_12", "pesnwi_09", "pesnwi_08"],
  },

  {
    id: 5,
    descricao: "Relações de trabalho positivas entre enfermeiros e médicos",

    perguntas: ["pesnwi_24", "pesnwi_02", "pesnwi_16"],
  },
];

/*
|--------------------------------------------------------------------------
| Valores das perguntas PES-NWI
|--------------------------------------------------------------------------
*/

function numeroPerguntaPesNwi(campo: CampoPesNwi): number {
  return Number(campo.replace("pesnwi_", ""));
}

function valoresValidosPerguntaPesNwi(
  respostas: any[],
  pergunta: CampoPesNwi,
): number[] {
  return respostas
    .map((resposta) => Number(resposta[pergunta]))
    .filter((valor) => Number.isFinite(valor));
}

/*
|--------------------------------------------------------------------------
| Resultado de uma pergunta
|--------------------------------------------------------------------------
*/

function calcularPerguntaPesNwi(
  respostas: any[],
  pergunta: CampoPesNwi,
): ResultadoPerguntaPesNwi {
  const valores = valoresValidosPerguntaPesNwi(respostas, pergunta);

  return {
    pergunta,

    numero: numeroPerguntaPesNwi(pergunta),

    media: media(valores),

    desvioPadrao: desvioPadrao(valores),
  };
}

/*
|--------------------------------------------------------------------------
| Resultado de uma dimensão
|--------------------------------------------------------------------------
*/

function calcularDimensaoPesNwi(
  respostas: any[],
  dimensao: ConfiguracaoDimensaoPesNwi,
): ResultadoDimensaoPesNwi {
  const perguntas = dimensao.perguntas.map((pergunta) =>
    calcularPerguntaPesNwi(respostas, pergunta),
  );

  const mediasPerguntas = perguntas.map((pergunta) => pergunta.media);

  const todasRespostas = dimensao.perguntas.flatMap((pergunta) =>
    valoresValidosPerguntaPesNwi(respostas, pergunta),
  );

  return {
    id: dimensao.id,

    descricao: dimensao.descricao,

    quantidadePerguntas: dimensao.perguntas.length,

    media: media(mediasPerguntas),

    desvioPadrao: desvioPadrao(todasRespostas),

    perguntas,
  };
}

/*
|--------------------------------------------------------------------------
| Todas as dimensões
|--------------------------------------------------------------------------
*/

function calcularDimensoesPesNwi(respostas: any[]): ResultadoDimensaoPesNwi[] {
  return DIMENSOES_PES_NWI.map((dimensao) =>
    calcularDimensaoPesNwi(respostas, dimensao),
  );
}

/*
|--------------------------------------------------------------------------
| PES-NWI por agrupamento
|--------------------------------------------------------------------------
*/

function calcularPesNwiPorAgrupamento(
  respostas: any[],
  campo: string,
  opcoes: OpcaoAgrupamento[],
) {
  return opcoes.map((opcao) => {
    const grupo = respostas.filter(
      (resposta) => numero(resposta[campo]) === opcao.valor,
    );

    return {
      valor: opcao.valor,

      descricao: opcao.descricao,

      participantes: grupo.length,

      dimensoes: calcularDimensoesPesNwi(grupo),
    };
  });
}
function calcularPesNwiPorAgrupamentoCalculado(
  respostas: any[],
  opcoes: OpcaoAgrupamento[],
  obterValor: (resposta: any) => number,
) {
  return opcoes.map((opcao) => {
    const grupo = respostas.filter(
      (resposta) => obterValor(resposta) === opcao.valor,
    );

    return {
      valor: opcao.valor,
      descricao: opcao.descricao,
      participantes: grupo.length,
      dimensoes: calcularDimensoesPesNwi(grupo),
    };
  });
}

/*
|--------------------------------------------------------------------------
| Cruzamentos PES-NWI
|--------------------------------------------------------------------------
*/

function criarCruzamentosPesNwi(respostas: any[]) {
  return {
    /*
    |--------------------------------------------------------------------------
    | Perfil
    |--------------------------------------------------------------------------
    */

    perfil: calcularPesNwiPorAgrupamento(respostas, "inf_perfil", PERFIL),

    /*
    |--------------------------------------------------------------------------
    | Tempo de formação
    |--------------------------------------------------------------------------
    */

    tempoFormacao: calcularPesNwiPorAgrupamento(
      respostas,
      "inf_tempo_formacao_area_enfermagem",
      TEMPO_FORMACAO,
    ),

    /*
    |--------------------------------------------------------------------------
    | Graduação
    |--------------------------------------------------------------------------
    */

    graduacao: calcularPesNwiPorAgrupamento(
      respostas,
      "inf_titulo_graduacao",
      GRADUACAO,
    ),

    /*
    |--------------------------------------------------------------------------
    | Tempo na instituição
    |--------------------------------------------------------------------------
    */

    tempoInstituicao: calcularPesNwiPorAgrupamento(
      respostas,
      "inf_tempo_trabalho_instituicao",
      TEMPO_INSTITUICAO,
    ),

    /*
    |--------------------------------------------------------------------------
    | Tempo no cargo
    |--------------------------------------------------------------------------
    */

    tempoCargo: calcularPesNwiPorAgrupamento(
      respostas,
      "inf_tempo_trabalho_cargo",
      TEMPO_CARGO,
    ),

    /*
    |--------------------------------------------------------------------------
    | Formação complementar
    |--------------------------------------------------------------------------
    */

    formacaoComplementar: calcularPesNwiPorAgrupamentoCalculado(
      respostas,
      FORMACAO_COMPLEMENTAR,
      obterFormacaoComplementar,
    ),

    /*
    |--------------------------------------------------------------------------
    | Cargo
    |--------------------------------------------------------------------------
    */

    cargo: calcularPesNwiPorAgrupamentoCalculado(respostas, CARGO, obterCargo),

    /*
    |--------------------------------------------------------------------------
    | Área de trabalho
    |--------------------------------------------------------------------------
    */

    areaTrabalho: calcularPesNwiPorAgrupamento(
      respostas,
      "inf_area_trabalho",
      AREA_TRABALHO,
    ),

    /*
    |--------------------------------------------------------------------------
    | Escala
    |--------------------------------------------------------------------------
    */

    escalaTrabalho: calcularPesNwiPorAgrupamento(
      respostas,
      "inf_escala_trabalho",
      ESCALA_TRABALHO,
    ),

    /*
    |--------------------------------------------------------------------------
    | Turno
    |--------------------------------------------------------------------------
    */

    turnoTrabalho: calcularPesNwiPorAgrupamento(
      respostas,
      "inf_turno_trabalho",
      TURNO_TRABALHO,
    ),

    /*
    |--------------------------------------------------------------------------
    | Outro vínculo
    |--------------------------------------------------------------------------
    */

    outroVinculo: calcularPesNwiPorAgrupamento(
      respostas,
      "inf_outro_vinculo",
      OUTRO_VINCULO,
    ),
    /*
    |--------------------------------------------------------------------------
    | Formação
    |--------------------------------------------------------------------------
    */

    formacao: calcularPesNwiPorAgrupamentoCalculado(
      respostas,
      FORMACAO,
      obterFormacao,
    ),
  };
}

/*
|--------------------------------------------------------------------------
| Resultado PES-NWI
|--------------------------------------------------------------------------
*/

export function calcularDadosAmbiente(respostas: any[]) {
  const enfermeiros = respostas.filter(
    (resposta) => numero(resposta.inf_perfil) === 1,
  );

  const tecnicosAuxiliares = respostas.filter((resposta) => {
    const perfil = numero(resposta.inf_perfil);

    return perfil === 2 || perfil === 3;
  });

  return {
    totalParticipantes: respostas.length,

    geral: {
      participantes: respostas.length,

      dimensoes: calcularDimensoesPesNwi(respostas),
    },

    enfermeiros: {
      participantes: enfermeiros.length,

      dimensoes: calcularDimensoesPesNwi(enfermeiros),
    },

    tecnicosAuxiliares: {
      participantes: tecnicosAuxiliares.length,

      dimensoes: calcularDimensoesPesNwi(tecnicosAuxiliares),
    },

    cruzamentos: criarCruzamentosPesNwi(respostas),
  };
}

/*
|--------------------------------------------------------------------------
| Relatório completo
|--------------------------------------------------------------------------
|
| Esta será a função principal chamada pelo controller.
|
*/

export function calcularRelatorio(respostas: any[]) {
  return {
    participantes: respostas.length,

    caracteristicas: calcularCaracteristicas(respostas),

    ambiente: calcularDadosAmbiente(respostas),

    burnout: calcularDadosBurnout(respostas),
  };
}
