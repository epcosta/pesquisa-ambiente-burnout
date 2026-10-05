export type ItemCaracteristica = {
  valor: number;
  descricao: string;
  quantidade: number;
  percentual: number;
};

export type ResultadoPerguntaPesNwi = {
  pergunta: string;
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

export type GrupoPesNwi = {
  participantes: number;
  dimensoes: ResultadoDimensaoPesNwi[];
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

export type DimensaoBurnout = {
  distribuicao: {
    baixo: number;
    medio: number;
    alto: number;
  };

  media: number;
  desvioPadrao: number;

  cruzamentos: {
    formacao: ItemCruzamentoBurnout[];
    perfil: ItemCruzamentoBurnout[];
    tempoFormacao: ItemCruzamentoBurnout[];
    graduacao: ItemCruzamentoBurnout[];
    tempoInstituicao: ItemCruzamentoBurnout[];
    tempoCargo: ItemCruzamentoBurnout[];
    areaTrabalho: ItemCruzamentoBurnout[];
    escalaTrabalho: ItemCruzamentoBurnout[];
    turnoTrabalho: ItemCruzamentoBurnout[];
    outroVinculo: ItemCruzamentoBurnout[];
    formacaoComplementar: ItemCruzamentoBurnout[];
    cargo: ItemCruzamentoBurnout[];
  };
};

export type RelatorioType = {
  pesquisa: {
    id: number;
    dtCadastro: string | null;
    dtInicio: string | null;
    dtFechamento: string | null;
    fechado: string | null;
    nroFuncionarios: number | null;

    responsavel: {
      nome: string | null;
      email: string | null;
      ddd: string | null;
      telefone: string | null;
      cargo: string | null;
    };
  };

  instituicao: {
    id: number;
    cnpj: string | null;
    razao_social: string | null;
    nome_fantasia: string | null;
    logradouro: string | null;
    nro: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    uf: string | null;
    cep: string | null;
    nro_funcionarios: number | null;
  } | null;

  participantes: number;

  caracteristicas: {
    perfil: ItemCaracteristica[];
    tempoFormacao: ItemCaracteristica[];
    graduacao: ItemCaracteristica[];
    tempoInstituicao: ItemCaracteristica[];
    tempoCargo: ItemCaracteristica[];
    areaTrabalho: ItemCaracteristica[];
    escalaTrabalho: ItemCaracteristica[];
    turnoTrabalho: ItemCaracteristica[];
    outroVinculo: ItemCaracteristica[];
  };

  ambiente: {
    totalParticipantes: number;

    geral: GrupoPesNwi;
    enfermeiros: GrupoPesNwi;
    tecnicosAuxiliares: GrupoPesNwi;

    cruzamentos: CruzamentosPesNwi;
  };

  burnout: {
    totalParticipantes: number;

    exaustaoEmocional: DimensaoBurnout;

    despersonalizacao: DimensaoBurnout;

    realizacaoProfissional: DimensaoBurnout;
  };
};
export type CruzamentoPesNwi = {
  valor: number;
  descricao: string;
  participantes: number;
  dimensoes: ResultadoDimensaoPesNwi[];
};

export type CruzamentosPesNwi = {
  // Enfermeiros / Técnicos-Auxiliares
  formacao: CruzamentoPesNwi[];

  // Perfil original
  perfil: CruzamentoPesNwi[];

  tempoFormacao: CruzamentoPesNwi[];

  graduacao: CruzamentoPesNwi[];

  tempoInstituicao: CruzamentoPesNwi[];

  tempoCargo: CruzamentoPesNwi[];

  formacaoComplementar: CruzamentoPesNwi[];

  cargo: CruzamentoPesNwi[];

  areaTrabalho: CruzamentoPesNwi[];

  escalaTrabalho: CruzamentoPesNwi[];

  turnoTrabalho: CruzamentoPesNwi[];

  outroVinculo: CruzamentoPesNwi[];
};
