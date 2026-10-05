import PDFDocument from "pdfkit";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

type DadosRelatorioPdf = {
  pesquisa: any;
  instituicao: any;

  resultado: {
    participantes: number;
    caracteristicas: any;
    ambiente: any;
    burnout: any;
  };
};

const MARGEM_ESQUERDA = 45;
const MARGEM_DIREITA = 45;

const COR_TITULO = "#1E293B";
const COR_TEXTO = "#334155";
const COR_SECUNDARIA = "#64748B";
const COR_LINHA = "#CBD5E1";

const pluginPercentuaisBurnout = {
  id: "percentuaisBurnout",

  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;

    ctx.save();

    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      meta.data.forEach((barra: any, index: number) => {
        const valor = Number(dataset.data[index]);

        /*
         * Não escreve valores muito pequenos.
         * Evita texto espremido dentro da barra.
         */
        if (!Number.isFinite(valor) || valor < 5) {
          return;
        }

        /*
         * Como o gráfico é horizontal,
         * x representa o final do segmento.
         *
         * barra.base representa o início.
         */

        const inicio = barra.base;
        const fim = barra.x;

        const x = inicio + (fim - inicio) / 2;

        const y = barra.y;

        /*
         * Branco funciona bem sobre
         * verde, laranja e vermelho.
         */

        ctx.fillStyle = "#FFFFFF";

        ctx.fillText(`${valor.toFixed(0)}%`, x, y);
      });
    });

    ctx.restore();
  },
};

/*
|--------------------------------------------------------------------------
| Formatação
|--------------------------------------------------------------------------
*/
function formatarData(valor: string | Date | null | undefined): string {
  if (!valor) {
    return "-";
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR").format(data);
}

function formatarDataHora(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

/*
|--------------------------------------------------------------------------
| Nome da instituição
|--------------------------------------------------------------------------
*/

function obterNomeInstituicao(instituicao: any): string {
  return (
    instituicao?.nome_fantasia ||
    instituicao?.razao_social ||
    instituicao?.nome ||
    "Instituição"
  );
}

/*
|--------------------------------------------------------------------------
| Cabeçalho
|--------------------------------------------------------------------------
*/

function adicionarCabecalho(doc: PDFKit.PDFDocument, dados: DadosRelatorioPdf) {
  const yAnterior = doc.y;

  const nomeInstituicao = obterNomeInstituicao(dados.instituicao);

  doc
    .fillColor(COR_TITULO)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Ambiente & Burnout", MARGEM_ESQUERDA, 28);

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(7)
    .text(nomeInstituicao, MARGEM_ESQUERDA, 42, {
      width: 350,
    });

  doc
    .fillColor(COR_SECUNDARIA)
    .fontSize(7)
    .text(`Pesquisa #${dados.pesquisa.id}`, 400, 30, {
      width: 150,
      align: "right",
    });

  doc
    .moveTo(MARGEM_ESQUERDA, 58)
    .lineTo(550, 58)
    .strokeColor(COR_LINHA)
    .lineWidth(0.5)
    .stroke();

  /*
   * Como escrevemos usando posições absolutas,
   * reposicionamos o cursor do PDFKit.
   */

  doc.y = yAnterior;
}

/*
|--------------------------------------------------------------------------
| Rodapé
|--------------------------------------------------------------------------
*/

function adicionarRodape(
  doc: PDFKit.PDFDocument,
  dados: DadosRelatorioPdf,
  paginaAtual: number,
  totalPaginas: number,
) {
  const yAnterior = doc.y;
  const y = 790;

  doc
    .moveTo(MARGEM_ESQUERDA, y - 8)
    .lineTo(550, y - 8)
    .strokeColor(COR_LINHA)
    .lineWidth(0.5)
    .stroke();

  doc.fillColor(COR_SECUNDARIA).font("Helvetica").fontSize(7);

  doc.text(`Pesquisa #${dados.pesquisa.id}`, MARGEM_ESQUERDA, y, {
    width: 200,
    height: 10,
    lineBreak: false,
  });

  doc.text(`Página ${paginaAtual} de ${totalPaginas}`, 350, y, {
    width: 200,
    height: 10,
    align: "right",
    lineBreak: false,
  });

  doc.y = yAnterior;
}

/*
|--------------------------------------------------------------------------
| Título de seção
|--------------------------------------------------------------------------
*/

function adicionarTituloSecao(doc: PDFKit.PDFDocument, titulo: string) {
  doc.fillColor(COR_TITULO).font("Helvetica-Bold").fontSize(15).text(titulo);

  doc.moveDown(0.5);

  doc
    .strokeColor(COR_LINHA)
    .lineWidth(0.5)
    .moveTo(MARGEM_ESQUERDA, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc.moveDown(1);
}

/*
|--------------------------------------------------------------------------
| Campo / valor
|--------------------------------------------------------------------------
*/

function adicionarCampo(
  doc: PDFKit.PDFDocument,
  titulo: string,
  valor: string | number,
) {
  doc.fillColor(COR_SECUNDARIA).font("Helvetica-Bold").fontSize(8).text(titulo);

  doc.fillColor(COR_TEXTO).font("Helvetica").fontSize(10).text(String(valor));

  doc.moveDown(0.7);
}

/*
|--------------------------------------------------------------------------
| Capa
|--------------------------------------------------------------------------
*/

function adicionarCapa(
  doc: PDFKit.PDFDocument,
  dados: DadosRelatorioPdf,
  dataEmissao: Date,
) {
  const nomeInstituicao = obterNomeInstituicao(dados.instituicao);

  /*
   * Ambiente & Burnout
   */

  doc
    .fillColor(COR_TITULO)
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("Ambiente & Burnout", 0, 100, {
      align: "center",
    });

  /*
   * Título
   */

  doc
    .fillColor(COR_TITULO)
    .font("Helvetica-Bold")
    .fontSize(19)
    .text(
      "RELATÓRIO DE AVALIAÇÃO DO\nAMBIENTE DE TRABALHO E\nRISCO AO BURNOUT",
      70,
      180,
      {
        width: 455,
        align: "center",
        lineGap: 5,
      },
    );

  /*
   * Instituição
   */

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(9)
    .text("INSTITUIÇÃO", 70, 330, {
      width: 455,
      align: "center",
    });

  doc
    .fillColor(COR_TEXTO)
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(nomeInstituicao, 70, 348, {
      width: 455,
      align: "center",
    });

  /*
   * Pesquisa
   */

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(9)
    .text("PESQUISA", 70, 405, {
      width: 455,
      align: "center",
    });

  doc
    .fillColor(COR_TEXTO)
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(`#${dados.pesquisa.id}`, 70, 422, {
      width: 455,
      align: "center",
    });

  /*
   * Período
   */

  const dataInicio = dados.pesquisa.dtInicio ?? dados.pesquisa.dt_inicio;

  const dataFim =
    dados.pesquisa.dtFim ??
    dados.pesquisa.dt_fim ??
    dados.pesquisa.dtFechamento;

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(9)
    .text("PERÍODO", 70, 475, {
      width: 455,
      align: "center",
    });

  doc
    .fillColor(COR_TEXTO)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(`${formatarData(dataInicio)} a ${formatarData(dataFim)}`, 70, 492, {
      width: 455,
      align: "center",
    });

  /*
   * Participantes
   */

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(9)
    .text("PARTICIPANTES", 70, 545, {
      width: 455,
      align: "center",
    });

  doc
    .fillColor(COR_TEXTO)
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(String(dados.resultado.participantes), 70, 563, {
      width: 455,
      align: "center",
    });

  /*
   * Data de emissão
   */

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(8)
    .text(`Emitido em ${formatarDataHora(dataEmissao)}`, 70, 690, {
      width: 455,
      align: "center",
    });
}

/*
|--------------------------------------------------------------------------
| Resumo do relatório
|--------------------------------------------------------------------------
*/

function adicionarResumo(doc: PDFKit.PDFDocument, dados: DadosRelatorioPdf) {
  adicionarTituloSecao(doc, "1. Informações da pesquisa");

  adicionarCampo(doc, "Instituição", obterNomeInstituicao(dados.instituicao));

  adicionarCampo(doc, "Pesquisa", `#${dados.pesquisa.id}`);

  adicionarCampo(doc, "Participantes", dados.resultado.participantes);

  doc.moveDown(1);

  adicionarTituloSecao(doc, "2. Resumo Burnout");

  const burnout = dados.resultado.burnout;

  adicionarCampo(
    doc,
    "Exaustão emocional - média",
    burnout.exaustaoEmocional.media,
  );

  adicionarCampo(
    doc,
    "Exaustão emocional - desvio padrão",
    burnout.exaustaoEmocional.desvioPadrao,
  );

  adicionarCampo(
    doc,
    "Despersonalização - média",
    burnout.despersonalizacao.media,
  );

  adicionarCampo(
    doc,
    "Despersonalização - desvio padrão",
    burnout.despersonalizacao.desvioPadrao,
  );

  adicionarCampo(
    doc,
    "Realização profissional - média",
    burnout.realizacaoProfissional.media,
  );

  adicionarCampo(
    doc,
    "Realização profissional - desvio padrão",
    burnout.realizacaoProfissional.desvioPadrao,
  );
}

/*
|--------------------------------------------------------------------------
| Cabeçalho e rodapé de todas as páginas
|--------------------------------------------------------------------------
*/

function finalizarPaginas(doc: PDFKit.PDFDocument, dados: DadosRelatorioPdf) {
  const range = doc.bufferedPageRange();

  const totalPaginas = range.count;

  for (let i = 0; i < totalPaginas; i++) {
    doc.switchToPage(range.start + i);

    /*
     * Não colocaremos o cabeçalho
     * institucional na capa.
     */

    if (i > 0) {
      adicionarCabecalho(doc, dados);
    }

    /*
     * O rodapé aparece inclusive
     * na capa.
     */

    adicionarRodape(doc, dados, i + 1, totalPaginas);
  }
}

type ItemCaracteristica = {
  valor: number;
  descricao: string;
  quantidade: number;
  percentual: number;
};

function adicionarTabelaCaracteristica(
  doc: PDFKit.PDFDocument,
  titulo: string,
  dados: ItemCaracteristica[],
) {
  const larguraTotal = 505;

  const larguraDescricao = 285;
  const larguraQuantidade = 100;
  const larguraPercentual = 120;

  const alturaLinha = 22;

  /*
  |--------------------------------------------------------------------------
  | Verifica espaço antes de iniciar a tabela
  |--------------------------------------------------------------------------
  */

  if (doc.y + 80 > 760) {
    doc.addPage();
    doc.y = 80;
  }

  /*
  |--------------------------------------------------------------------------
  | Título
  |--------------------------------------------------------------------------
  */

  doc.fillColor(COR_TITULO).font("Helvetica-Bold").fontSize(10).text(titulo);

  doc.moveDown(0.5);

  let y = doc.y;

  /*
  |--------------------------------------------------------------------------
  | Cabeçalho da tabela
  |--------------------------------------------------------------------------
  */

  doc.rect(MARGEM_ESQUERDA, y, larguraTotal, alturaLinha).fill("#F1F5F9");

  doc.fillColor(COR_TITULO).font("Helvetica-Bold").fontSize(8);

  doc.text("Descrição", MARGEM_ESQUERDA + 6, y + 7, {
    width: larguraDescricao - 12,
    lineBreak: false,
  });

  doc.text("Quantidade", MARGEM_ESQUERDA + larguraDescricao, y + 7, {
    width: larguraQuantidade,
    align: "center",
    lineBreak: false,
  });

  doc.text("%", MARGEM_ESQUERDA + larguraDescricao + larguraQuantidade, y + 7, {
    width: larguraPercentual,
    align: "center",
    lineBreak: false,
  });

  y += alturaLinha;

  /*
  |--------------------------------------------------------------------------
  | Dados
  |--------------------------------------------------------------------------
  */

  const registros = dados.filter((item) => item.quantidade > 0);

  for (const item of registros) {
    /*
     * Se não houver espaço para outra linha,
     * cria uma nova página.
     */

    if (y + alturaLinha > 760) {
      doc.addPage();

      y = 80;
    }

    /*
     * Linha inferior
     */

    doc
      .moveTo(MARGEM_ESQUERDA, y + alturaLinha)
      .lineTo(MARGEM_ESQUERDA + larguraTotal, y + alturaLinha)
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .stroke();

    /*
     * Descrição
     */

    doc
      .fillColor(COR_TEXTO)
      .font("Helvetica")
      .fontSize(8)
      .text(item.descricao, MARGEM_ESQUERDA + 6, y + 7, {
        width: larguraDescricao - 12,
        lineBreak: false,
      });

    /*
     * Quantidade
     */

    doc.text(
      String(item.quantidade),
      MARGEM_ESQUERDA + larguraDescricao,
      y + 7,
      {
        width: larguraQuantidade,
        align: "center",
        lineBreak: false,
      },
    );

    /*
     * Percentual
     */

    doc.text(
      `${item.percentual.toFixed(2)}%`,
      MARGEM_ESQUERDA + larguraDescricao + larguraQuantidade,
      y + 7,
      {
        width: larguraPercentual,
        align: "center",
        lineBreak: false,
      },
    );

    y += alturaLinha;
  }

  /*
   * Atualiza posição do próximo conteúdo.
   */

  doc.y = y + 14;
}

function adicionarCaracteristicas(
  doc: PDFKit.PDFDocument,
  dados: DadosRelatorioPdf,
) {
  const caracteristicas = dados.resultado.caracteristicas;

  doc.addPage();

  doc.y = 80;

  adicionarTituloSecao(doc, "3. Características dos participantes");

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(9)
    .text(
      "Distribuição dos participantes segundo as características profissionais e de atuação.",
      {
        width: 505,
      },
    );

  doc.moveDown(1.5);

  /*
  |--------------------------------------------------------------------------
  | Formação / Perfil
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(doc, "Formação", caracteristicas.perfil);

  /*
  |--------------------------------------------------------------------------
  | Tempo de formação
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(
    doc,
    "Tempo de formação na área de enfermagem",
    caracteristicas.tempoFormacao,
  );

  /*
  |--------------------------------------------------------------------------
  | Titulação
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(
    doc,
    "Titulação / Pós-graduação",
    caracteristicas.graduacao,
  );

  /*
  |--------------------------------------------------------------------------
  | Tempo na instituição
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(
    doc,
    "Tempo em que trabalha na instituição",
    caracteristicas.tempoInstituicao,
  );

  /*
  |--------------------------------------------------------------------------
  | Tempo no cargo
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(
    doc,
    "Tempo em que trabalha no cargo atual",
    caracteristicas.tempoCargo,
  );

  /*
  |--------------------------------------------------------------------------
  | Área
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(
    doc,
    "Área de trabalho",
    caracteristicas.areaTrabalho,
  );

  /*
  |--------------------------------------------------------------------------
  | Escala
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(
    doc,
    "Escala de trabalho",
    caracteristicas.escalaTrabalho,
  );

  /*
  |--------------------------------------------------------------------------
  | Turno
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(
    doc,
    "Turno de trabalho",
    caracteristicas.turnoTrabalho,
  );

  /*
  |--------------------------------------------------------------------------
  | Outro vínculo
  |--------------------------------------------------------------------------
  */

  adicionarTabelaCaracteristica(
    doc,
    "Outro vínculo empregatício",
    caracteristicas.outroVinculo,
  );
}
/*
|--------------------------------------------------------------------------
| Gerar PDF
|--------------------------------------------------------------------------
*/

export async function gerarRelatorioPdf(
  dados: DadosRelatorioPdf,
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      /*
       * A data é criada uma única vez.
       */

      const dataEmissao = new Date();

      const doc = new PDFDocument({
        size: "A4",

        margins: {
          top: 80,
          bottom: 60,
          left: MARGEM_ESQUERDA,
          right: MARGEM_DIREITA,
        },

        /*
         * Fundamental para
         * Página X de Y.
         */

        bufferPages: true,

        info: {
          Title:
            "Relatório de Avaliação do Ambiente de Trabalho e Risco ao Burnout",

          Author: "Ambiente & Burnout",

          Subject: "Avaliação do Ambiente de Trabalho e Risco ao Burnout",
        },
      });

      const buffers: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => {
        buffers.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      doc.on("error", (error) => {
        reject(error);
      });

      /*
        |--------------------------------------------------------------------------
        | CAPA
        |--------------------------------------------------------------------------
        */

      adicionarCapa(doc, dados, dataEmissao);

      /*
        |--------------------------------------------------------------------------
        | PÁGINA 2
        |--------------------------------------------------------------------------
        */

      doc.addPage();

      doc.y = 80;

      adicionarResumo(doc, dados);

      adicionarCaracteristicas(doc, dados);
      adicionarTabelaDimensoesPesNwi(doc, dados);
      adicionarDetalhamentoPesNwi(doc, dados);
      adicionarCruzamentosPesNwi(doc, dados);
      adicionarResumoBurnout(doc, dados);
      await adicionarGraficosBurnout(doc, dados);

      finalizarPaginas(doc, dados);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function adicionarTabelaDimensoesPesNwi(
  doc: PDFKit.PDFDocument,
  dados: DadosRelatorioPdf,
) {
  const ambiente = dados.resultado.ambiente;

  const geral = ambiente.geral;
  const enfermeiros = ambiente.enfermeiros;
  const tecnicos = ambiente.tecnicosAuxiliares;

  /*
  |--------------------------------------------------------------------------
  | Nova página
  |--------------------------------------------------------------------------
  */

  doc.addPage();
  doc.y = 80;

  adicionarTituloSecao(doc, "4. Ambiente de Trabalho - PES-NWI");

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(9)
    .text(
      "Resultados das dimensões do Practice Environment Scale of the Nursing Work Index (PES-NWI).",
      {
        width: 505,
      },
    );

  doc.moveDown(1.5);

  /*
  |--------------------------------------------------------------------------
  | Participantes
  |--------------------------------------------------------------------------
  */

  doc
    .fillColor(COR_TEXTO)
    .font("Helvetica")
    .fontSize(8)
    .text(
      `Participantes: ${geral.participantes} | ` +
        `Enfermeiros: ${enfermeiros.participantes} | ` +
        `Técnicos/Auxiliares: ${tecnicos.participantes}`,
    );

  doc.moveDown(1);

  /*
  |--------------------------------------------------------------------------
  | Dimensões
  |--------------------------------------------------------------------------
  */

  const larguraDimensao = 205;

  const larguraGrupo = 100;

  const larguraTotal = larguraDimensao + larguraGrupo * 3;

  let y = doc.y;

  /*
  |--------------------------------------------------------------------------
  | Cabeçalho
  |--------------------------------------------------------------------------
  */

  const alturaCabecalho = 38;

  doc.rect(MARGEM_ESQUERDA, y, larguraTotal, alturaCabecalho).fill("#F1F5F9");

  doc.fillColor(COR_TITULO).font("Helvetica-Bold").fontSize(7);

  doc.text("Dimensão", MARGEM_ESQUERDA + 5, y + 13, {
    width: larguraDimensao - 10,
  });

  doc.text("Geral\nMédia / DP", MARGEM_ESQUERDA + larguraDimensao, y + 8, {
    width: larguraGrupo,
    align: "center",
  });

  doc.text(
    "Enfermeiros\nMédia / DP",
    MARGEM_ESQUERDA + larguraDimensao + larguraGrupo,
    y + 8,
    {
      width: larguraGrupo,
      align: "center",
    },
  );

  doc.text(
    "Téc./Aux.\nMédia / DP",
    MARGEM_ESQUERDA + larguraDimensao + larguraGrupo * 2,
    y + 8,
    {
      width: larguraGrupo,
      align: "center",
    },
  );

  y += alturaCabecalho;

  /*
  |--------------------------------------------------------------------------
  | Linhas das dimensões
  |--------------------------------------------------------------------------
  */

  geral.dimensoes.forEach((dimensao: any, index: number) => {
    const dimensaoEnfermeiros = enfermeiros.dimensoes[index];

    const dimensaoTecnicos = tecnicos.dimensoes[index];

    /*
     * A descrição pode ocupar duas
     * ou três linhas.
     */

    const alturaTexto = doc.heightOfString(dimensao.descricao, {
      width: larguraDimensao - 15,
    });

    const alturaLinha = Math.max(35, alturaTexto + 14);

    /*
     * Fundo alternado
     */

    if (index % 2 !== 0) {
      doc.rect(MARGEM_ESQUERDA, y, larguraTotal, alturaLinha).fill("#F8FAFC");
    }

    /*
     * Linha inferior
     */

    doc
      .moveTo(MARGEM_ESQUERDA, y + alturaLinha)
      .lineTo(MARGEM_ESQUERDA + larguraTotal, y + alturaLinha)
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .stroke();

    /*
     * Dimensão
     */

    doc
      .fillColor(COR_TEXTO)
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text(
        `D${dimensao.id} - ${dimensao.descricao}`,
        MARGEM_ESQUERDA + 5,
        y + 8,
        {
          width: larguraDimensao - 10,
        },
      );

    /*
     * Geral
     */

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(
        `${dimensao.media.toFixed(2)} / ${dimensao.desvioPadrao.toFixed(2)}`,
        MARGEM_ESQUERDA + larguraDimensao,
        y + 13,
        {
          width: larguraGrupo,
          align: "center",
          lineBreak: false,
        },
      );

    /*
     * Enfermeiros
     */

    doc.text(
      `${dimensaoEnfermeiros.media.toFixed(2)} / ${dimensaoEnfermeiros.desvioPadrao.toFixed(2)}`,
      MARGEM_ESQUERDA + larguraDimensao + larguraGrupo,
      y + 13,
      {
        width: larguraGrupo,
        align: "center",
        lineBreak: false,
      },
    );

    /*
     * Técnicos / Auxiliares
     */

    doc.text(
      `${dimensaoTecnicos.media.toFixed(2)} / ${dimensaoTecnicos.desvioPadrao.toFixed(2)}`,
      MARGEM_ESQUERDA + larguraDimensao + larguraGrupo * 2,
      y + 13,
      {
        width: larguraGrupo,
        align: "center",
        lineBreak: false,
      },
    );

    y += alturaLinha;
  });

  doc.y = y + 15;

  /*
  |--------------------------------------------------------------------------
  | Legenda
  |--------------------------------------------------------------------------
  */

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(7)
    .text("DP = Desvio Padrão.");

  doc.y += 10;
}

function adicionarDetalhamentoPesNwi(
  doc: PDFKit.PDFDocument,
  dados: DadosRelatorioPdf,
) {
  const ambiente = dados.resultado.ambiente;

  const geral = ambiente.geral;

  /*
  |--------------------------------------------------------------------------
  | Nova página
  |--------------------------------------------------------------------------
  */

  doc.addPage();
  doc.y = 80;

  adicionarTituloSecao(doc, "4.1. Detalhamento das questões PES-NWI");

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(8)
    .text(
      "Média e desvio padrão das respostas de cada questão, organizadas por dimensão.",
    );

  doc.moveDown(1.5);

  /*
  |--------------------------------------------------------------------------
  | Dimensões
  |--------------------------------------------------------------------------
  */

  for (const dimensao of geral.dimensoes) {
    /*
     * Evita iniciar uma dimensão
     * no final da página.
     */

    if (doc.y > 690) {
      doc.addPage();
      doc.y = 80;
    }

    /*
     * Título da dimensão
     */

    doc
      .fillColor(COR_TITULO)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`D${dimensao.id} - ${dimensao.descricao}`);

    doc
      .fillColor(COR_SECUNDARIA)
      .font("Helvetica")
      .fontSize(7)
      .text(
        `Média da dimensão: ${dimensao.media.toFixed(2)} | DP: ${dimensao.desvioPadrao.toFixed(2)}`,
      );

    doc.moveDown(0.7);

    /*
     * Cabeçalho
     */

    let y = doc.y;

    const larguraPergunta = 305;
    const larguraMedia = 100;
    const larguraDp = 100;

    const alturaLinha = 21;

    doc.rect(MARGEM_ESQUERDA, y, 505, alturaLinha).fill("#F1F5F9");

    doc.fillColor(COR_TITULO).font("Helvetica-Bold").fontSize(7.5);

    doc.text("Questão", MARGEM_ESQUERDA + 6, y + 7, {
      width: larguraPergunta - 12,
    });

    doc.text("Média", MARGEM_ESQUERDA + larguraPergunta, y + 7, {
      width: larguraMedia,
      align: "center",
    });

    doc.text("DP", MARGEM_ESQUERDA + larguraPergunta + larguraMedia, y + 7, {
      width: larguraDp,
      align: "center",
    });

    y += alturaLinha;

    /*
    |--------------------------------------------------------------------------
    | Perguntas
    |--------------------------------------------------------------------------
    */

    for (const pergunta of dimensao.perguntas) {
      if (y + alturaLinha > 755) {
        doc.addPage();

        y = 80;
      }

      doc
        .moveTo(MARGEM_ESQUERDA, y + alturaLinha)
        .lineTo(550, y + alturaLinha)
        .strokeColor("#E2E8F0")
        .lineWidth(0.5)
        .stroke();

      doc.fillColor(COR_TEXTO).font("Helvetica").fontSize(8);

      doc.text(`Questão ${pergunta.numero}`, MARGEM_ESQUERDA + 6, y + 6, {
        width: larguraPergunta - 12,
        lineBreak: false,
      });

      doc.text(
        pergunta.media.toFixed(2),
        MARGEM_ESQUERDA + larguraPergunta,
        y + 6,
        {
          width: larguraMedia,
          align: "center",
          lineBreak: false,
        },
      );

      doc.text(
        pergunta.desvioPadrao.toFixed(2),
        MARGEM_ESQUERDA + larguraPergunta + larguraMedia,
        y + 6,
        {
          width: larguraDp,
          align: "center",
          lineBreak: false,
        },
      );

      y += alturaLinha;
    }

    doc.y = y + 18;
  }
}
function adicionarGrupoCruzamentoPesNwi(
  doc: PDFKit.PDFDocument,
  titulo: string,
  grupos: any[],
) {
  /*
  |--------------------------------------------------------------------------
  | Configuração das colunas
  |--------------------------------------------------------------------------
  */

  const larguraCaracteristica = 145;
  const larguraN = 35;
  const larguraDimensao = 65;

  const larguraTotal = larguraCaracteristica + larguraN + larguraDimensao * 5;

  const alturaLinha = 25;

  /*
  |--------------------------------------------------------------------------
  | Remove categorias sem participantes
  |--------------------------------------------------------------------------
  */

  const registros = grupos.filter((grupo) => grupo.participantes > 0);

  if (registros.length === 0) {
    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Verifica espaço para título + primeira linha
  |--------------------------------------------------------------------------
  */

  if (doc.y + 70 > 755) {
    doc.addPage();
    doc.y = 80;
  }

  /*
  |--------------------------------------------------------------------------
  | Título do agrupamento
  |--------------------------------------------------------------------------
  */

  doc.fillColor(COR_TITULO).font("Helvetica-Bold").fontSize(9).text(titulo);

  doc.moveDown(0.4);

  let y = doc.y;

  /*
  |--------------------------------------------------------------------------
  | Cabeçalho
  |--------------------------------------------------------------------------
  */

  doc.rect(MARGEM_ESQUERDA, y, larguraTotal, 32).fill("#E2E8F0");

  doc.fillColor(COR_TITULO).font("Helvetica-Bold").fontSize(6.5);

  doc.text("Característica", MARGEM_ESQUERDA + 5, y + 11, {
    width: larguraCaracteristica - 10,
  });

  doc.text("N", MARGEM_ESQUERDA + larguraCaracteristica, y + 11, {
    width: larguraN,
    align: "center",
  });

  /*
  |--------------------------------------------------------------------------
  | D1 ... D5
  |--------------------------------------------------------------------------
  */

  for (let i = 0; i < 5; i++) {
    doc.text(
      `D${i + 1}\nMédia / DP`,
      MARGEM_ESQUERDA + larguraCaracteristica + larguraN + larguraDimensao * i,
      y + 5,
      {
        width: larguraDimensao,
        align: "center",
      },
    );
  }

  y += 32;

  /*
  |--------------------------------------------------------------------------
  | Linhas
  |--------------------------------------------------------------------------
  */

  registros.forEach((grupo, index) => {
    /*
     * Quebra de página
     */

    if (y + alturaLinha > 755) {
      doc.addPage();
      y = 80;
    }

    /*
     * Fundo alternado
     */

    if (index % 2 !== 0) {
      doc.rect(MARGEM_ESQUERDA, y, larguraTotal, alturaLinha).fill("#F8FAFC");
    }

    /*
     * Linha inferior
     */

    doc
      .moveTo(MARGEM_ESQUERDA, y + alturaLinha)
      .lineTo(MARGEM_ESQUERDA + larguraTotal, y + alturaLinha)
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .stroke();

    /*
     * Descrição
     */

    doc
      .fillColor(COR_TEXTO)
      .font("Helvetica")
      .fontSize(7)
      .text(grupo.descricao, MARGEM_ESQUERDA + 5, y + 8, {
        width: larguraCaracteristica - 10,
        lineBreak: false,
      });

    /*
     * Participantes
     */

    doc.text(
      String(grupo.participantes),
      MARGEM_ESQUERDA + larguraCaracteristica,
      y + 8,
      {
        width: larguraN,
        align: "center",
        lineBreak: false,
      },
    );

    /*
     * Cinco dimensões
     */

    grupo.dimensoes.forEach((dimensao: any, dimensaoIndex: number) => {
      doc.text(
        `${dimensao.media.toFixed(2)} / ${dimensao.desvioPadrao.toFixed(2)}`,
        MARGEM_ESQUERDA +
          larguraCaracteristica +
          larguraN +
          larguraDimensao * dimensaoIndex,
        y + 8,
        {
          width: larguraDimensao,
          align: "center",
          lineBreak: false,
        },
      );
    });

    y += alturaLinha;
  });

  doc.y = y + 15;
}
function adicionarCruzamentosPesNwi(
  doc: PDFKit.PDFDocument,
  dados: DadosRelatorioPdf,
) {
  const cruzamentos = dados.resultado.ambiente.cruzamentos;

  doc.addPage();
  doc.y = 80;

  adicionarTituloSecao(doc, "4.2. Características profissionais × PES-NWI");

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(8)
    .text(
      "Média e desvio padrão das cinco dimensões do PES-NWI segundo as características dos participantes.",
      {
        width: 505,
      },
    );

  doc.moveDown(1.5);

  /*
  |--------------------------------------------------------------------------
  | Formação
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(doc, "Formação", cruzamentos.formacao);

  /*
  |--------------------------------------------------------------------------
  | Tempo de formação
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Tempo de formação na área de enfermagem",
    cruzamentos.tempoFormacao,
  );

  /*
  |--------------------------------------------------------------------------
  | Titulação
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Titulação / Pós-graduação",
    cruzamentos.graduacao,
  );

  /*
  |--------------------------------------------------------------------------
  | Tempo na instituição
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Tempo em que trabalha na instituição",
    cruzamentos.tempoInstituicao,
  );

  /*
  |--------------------------------------------------------------------------
  | Tempo no cargo
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Tempo em que trabalha no cargo atual",
    cruzamentos.tempoCargo,
  );

  /*
  |--------------------------------------------------------------------------
  | Formação complementar
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Formação complementar",
    cruzamentos.formacaoComplementar,
  );

  /*
  |--------------------------------------------------------------------------
  | Cargo
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(doc, "Cargo", cruzamentos.cargo);

  /*
  |--------------------------------------------------------------------------
  | Área
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Área de trabalho",
    cruzamentos.areaTrabalho,
  );

  /*
  |--------------------------------------------------------------------------
  | Escala
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Escala de trabalho",
    cruzamentos.escalaTrabalho,
  );

  /*
  |--------------------------------------------------------------------------
  | Turno
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Turno de trabalho",
    cruzamentos.turnoTrabalho,
  );

  /*
  |--------------------------------------------------------------------------
  | Outro vínculo
  |--------------------------------------------------------------------------
  */

  adicionarGrupoCruzamentoPesNwi(
    doc,
    "Outro vínculo empregatício",
    cruzamentos.outroVinculo,
  );

  /*
  |--------------------------------------------------------------------------
  | Legenda
  |--------------------------------------------------------------------------
  */

  if (doc.y > 720) {
    doc.addPage();
    doc.y = 80;
  }

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(7)
    .text("D1 a D5 = Dimensões do PES-NWI | DP = Desvio Padrão.");
}

function adicionarResumoBurnout(
  doc: PDFKit.PDFDocument,
  dados: DadosRelatorioPdf,
) {
  const burnout = dados.resultado.burnout;

  doc.addPage();
  doc.y = 80;

  adicionarTituloSecao(doc, "5. Síndrome de Burnout");

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(9)
    .text(
      "Resultados das dimensões Exaustão Emocional, Despersonalização e Realização Profissional.",
      {
        width: 505,
      },
    );

  doc.moveDown(1.5);

  doc
    .fillColor(COR_TEXTO)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(`Participantes: ${burnout.totalParticipantes}`);

  doc.moveDown(1.5);

  adicionarTabelaResumoBurnout(doc, burnout);
}
function adicionarTabelaResumoBurnout(doc: PDFKit.PDFDocument, burnout: any) {
  const dimensoes = [
    {
      descricao: "Exaustão Emocional",
      dados: burnout.exaustaoEmocional,
    },
    {
      descricao: "Despersonalização",
      dados: burnout.despersonalizacao,
    },
    {
      descricao: "Realização Profissional",
      dados: burnout.realizacaoProfissional,
    },
  ];

  const larguraDescricao = 145;
  const larguraMedia = 60;
  const larguraDp = 60;
  const larguraNivel = 80;

  const larguraTotal =
    larguraDescricao + larguraMedia + larguraDp + larguraNivel * 3;

  const alturaCabecalho = 32;
  const alturaLinha = 35;

  let y = doc.y;

  /*
  |--------------------------------------------------------------------------
  | Cabeçalho
  |--------------------------------------------------------------------------
  */

  doc.rect(MARGEM_ESQUERDA, y, larguraTotal, alturaCabecalho).fill("#E2E8F0");

  doc.fillColor(COR_TITULO).font("Helvetica-Bold").fontSize(7);

  doc.text("Dimensão", MARGEM_ESQUERDA + 5, y + 11, {
    width: larguraDescricao - 10,
  });

  doc.text("Média", MARGEM_ESQUERDA + larguraDescricao, y + 11, {
    width: larguraMedia,
    align: "center",
  });

  doc.text("DP", MARGEM_ESQUERDA + larguraDescricao + larguraMedia, y + 11, {
    width: larguraDp,
    align: "center",
  });

  doc.text(
    "Baixo",
    MARGEM_ESQUERDA + larguraDescricao + larguraMedia + larguraDp,
    y + 11,
    {
      width: larguraNivel,
      align: "center",
    },
  );

  doc.text(
    "Médio",
    MARGEM_ESQUERDA +
      larguraDescricao +
      larguraMedia +
      larguraDp +
      larguraNivel,
    y + 11,
    {
      width: larguraNivel,
      align: "center",
    },
  );

  doc.text(
    "Alto",
    MARGEM_ESQUERDA +
      larguraDescricao +
      larguraMedia +
      larguraDp +
      larguraNivel * 2,
    y + 11,
    {
      width: larguraNivel,
      align: "center",
    },
  );

  y += alturaCabecalho;

  /*
  |--------------------------------------------------------------------------
  | Dimensões
  |--------------------------------------------------------------------------
  */

  dimensoes.forEach((dimensao, index) => {
    const resultado = dimensao.dados;

    if (index % 2 !== 0) {
      doc.rect(MARGEM_ESQUERDA, y, larguraTotal, alturaLinha).fill("#F8FAFC");
    }

    doc
      .moveTo(MARGEM_ESQUERDA, y + alturaLinha)
      .lineTo(MARGEM_ESQUERDA + larguraTotal, y + alturaLinha)
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .stroke();

    doc
      .fillColor(COR_TEXTO)
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text(dimensao.descricao, MARGEM_ESQUERDA + 5, y + 12, {
        width: larguraDescricao - 10,
        lineBreak: false,
      });

    doc
      .font("Helvetica")
      .text(
        resultado.media.toFixed(2),
        MARGEM_ESQUERDA + larguraDescricao,
        y + 12,
        {
          width: larguraMedia,
          align: "center",
          lineBreak: false,
        },
      );

    doc.text(
      resultado.desvioPadrao.toFixed(2),
      MARGEM_ESQUERDA + larguraDescricao + larguraMedia,
      y + 12,
      {
        width: larguraDp,
        align: "center",
        lineBreak: false,
      },
    );

    doc.text(
      String(resultado.distribuicao.baixo),
      MARGEM_ESQUERDA + larguraDescricao + larguraMedia + larguraDp,
      y + 12,
      {
        width: larguraNivel,
        align: "center",
        lineBreak: false,
      },
    );

    doc.text(
      String(resultado.distribuicao.medio),
      MARGEM_ESQUERDA +
        larguraDescricao +
        larguraMedia +
        larguraDp +
        larguraNivel,
      y + 12,
      {
        width: larguraNivel,
        align: "center",
        lineBreak: false,
      },
    );

    doc.text(
      String(resultado.distribuicao.alto),
      MARGEM_ESQUERDA +
        larguraDescricao +
        larguraMedia +
        larguraDp +
        larguraNivel * 2,
      y + 12,
      {
        width: larguraNivel,
        align: "center",
        lineBreak: false,
      },
    );

    y += alturaLinha;
  });

  doc.y = y + 15;

  doc
    .fillColor(COR_SECUNDARIA)
    .font("Helvetica")
    .fontSize(7)
    .text("DP = Desvio Padrão.");
}

type ItemGraficoBurnout = {
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

async function gerarGraficoBurnout(
  titulo: string,
  dados: ItemGraficoBurnout[],
  realizacaoProfissional = false,
): Promise<Buffer> {
  const registros = dados.filter((item) => item.total > 0);

  const width = 1000;

  const height = Math.max(300, 130 + registros.length * 60);

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: "white",
  });

  /*
  |--------------------------------------------------------------------------
  | Cores
  |--------------------------------------------------------------------------
  */

  const corBaixo = realizacaoProfissional ? "#EF4444" : "#22C55E";

  const corMedio = "#F59E0B";

  const corAlto = realizacaoProfissional ? "#22C55E" : "#EF4444";

  const configuration: any = {
    type: "bar",

    data: {
      labels: registros.map((item) => item.descricao),

      datasets: [
        {
          label: "Baixo",

          data: registros.map((item) => item.percentuais.baixo),

          backgroundColor: corBaixo,
        },

        {
          label: "Médio",

          data: registros.map((item) => item.percentuais.medio),

          backgroundColor: corMedio,
        },

        {
          label: "Alto",

          data: registros.map((item) => item.percentuais.alto),

          backgroundColor: corAlto,
        },
      ],
    },

    options: {
      indexAxis: "y",

      responsive: false,

      animation: false,

      plugins: {
        title: {
          display: true,

          text: titulo,

          font: {
            size: 18,
          },
        },

        legend: {
          display: true,

          position: "bottom",

          labels: {
            font: {
              size: 14,
            },
          },
        },

        tooltip: {
          enabled: false,
        },
      },

      scales: {
        x: {
          stacked: true,

          min: 0,
          max: 100,

          title: {
            display: true,
            text: "Percentual (%)",
          },

          ticks: {
            callback: (value: number | string) => `${value}%`,
          },
        },

        y: {
          stacked: true,

          ticks: {
            font: {
              size: 13,
            },
          },
        },
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Plugin que escreve os percentuais
    |--------------------------------------------------------------------------
    */

    plugins: [pluginPercentuaisBurnout],
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function adicionarGraficoBurnoutPdf(
  doc: PDFKit.PDFDocument,
  titulo: string,
  dados: ItemGraficoBurnout[],
  realizacaoProfissional = false,
) {
  const registros = dados.filter((item) => item.total > 0);

  if (registros.length === 0) {
    return;
  }

  const imagem = await gerarGraficoBurnout(
    titulo,
    registros,
    realizacaoProfissional,
  );

  /*
  |--------------------------------------------------------------------------
  | Altura proporcional
  |--------------------------------------------------------------------------
  */

  const altura = Math.min(300, Math.max(160, 100 + registros.length * 25));

  /*
  |--------------------------------------------------------------------------
  | Verifica espaço
  |--------------------------------------------------------------------------
  */

  if (doc.y + altura > 750) {
    doc.addPage();
    doc.y = 80;
  }

  doc.image(imagem, MARGEM_ESQUERDA, doc.y, {
    width: 505,
    height: altura,
  });

  doc.y += altura + 15;
}

function obterConfiguracaoBurnout(cruzamentos: any) {
  return [
    {
      titulo: "Formação",
      dados: cruzamentos.formacao ?? cruzamentos.perfil,
    },

    {
      titulo: "Tempo de formação na enfermagem",
      dados: cruzamentos.tempoFormacao,
    },

    {
      titulo: "Tempo em que trabalha na instituição",
      dados: cruzamentos.tempoInstituicao,
    },

    {
      titulo: "Tempo de trabalho no cargo",
      dados: cruzamentos.tempoCargo,
    },

    {
      titulo: "Formação complementar",
      dados: cruzamentos.formacaoComplementar,
    },

    {
      titulo: "Cargo",
      dados: cruzamentos.cargo,
    },

    {
      titulo: "Área de trabalho",
      dados: cruzamentos.areaTrabalho,
    },

    {
      titulo: "Jornada / Escala de trabalho",
      dados: cruzamentos.escalaTrabalho,
    },

    {
      titulo: "Turno de trabalho",
      dados: cruzamentos.turnoTrabalho,
    },

    {
      titulo: "Possui outro vínculo",
      dados: cruzamentos.outroVinculo,
    },
  ];
}

async function adicionarGraficosDimensaoBurnout(
  doc: PDFKit.PDFDocument,
  titulo: string,
  cruzamentos: any,
  realizacaoProfissional = false,
) {
  doc.addPage();
  doc.y = 80;

  adicionarTituloSecao(doc, titulo);

  const configuracoes = obterConfiguracaoBurnout(cruzamentos);

  for (const configuracao of configuracoes) {
    await adicionarGraficoBurnoutPdf(
      doc,
      configuracao.titulo,
      configuracao.dados,
      realizacaoProfissional,
    );
  }
}
async function adicionarGraficosBurnout(
  doc: PDFKit.PDFDocument,
  dados: DadosRelatorioPdf,
) {
  const burnout = dados.resultado.burnout;

  /*
  |--------------------------------------------------------------------------
  | EXAUSTÃO EMOCIONAL
  |--------------------------------------------------------------------------
  */

  await adicionarGraficosDimensaoBurnout(
    doc,
    "5.1. Exaustão Emocional",
    burnout.exaustaoEmocional.cruzamentos,
    false,
  );

  /*
  |--------------------------------------------------------------------------
  | DESPERSONALIZAÇÃO
  |--------------------------------------------------------------------------
  */

  await adicionarGraficosDimensaoBurnout(
    doc,
    "5.2. Despersonalização",
    burnout.despersonalizacao.cruzamentos,
    false,
  );

  /*
  |--------------------------------------------------------------------------
  | REALIZAÇÃO PROFISSIONAL
  |--------------------------------------------------------------------------
  */

  await adicionarGraficosDimensaoBurnout(
    doc,
    "5.3. Realização Profissional",
    burnout.realizacaoProfissional.cruzamentos,
    true,
  );
}
