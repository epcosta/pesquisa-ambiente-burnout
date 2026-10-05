import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DimensaoBurnout } from "../../types/Relatorio";

type Props = {
  exaustao: DimensaoBurnout;
  despersonalizacao: DimensaoBurnout;
  realizacao: DimensaoBurnout;
};

function GraficoBurnout({ exaustao, despersonalizacao, realizacao }: Props) {
  /*
  |--------------------------------------------------------------------------
  | Cálculo dos percentuais
  |--------------------------------------------------------------------------
  */

  function calcularPercentuais(dimensao: DimensaoBurnout) {
    const total =
      dimensao.distribuicao.baixo +
      dimensao.distribuicao.medio +
      dimensao.distribuicao.alto;

    function percentual(valor: number) {
      if (total === 0) {
        return 0;
      }

      return Number(((valor / total) * 100).toFixed(2));
    }

    return {
      baixo: percentual(dimensao.distribuicao.baixo),

      medio: percentual(dimensao.distribuicao.medio),

      alto: percentual(dimensao.distribuicao.alto),
    };
  }

  const pctExaustao = calcularPercentuais(exaustao);

  const pctDespersonalizacao = calcularPercentuais(despersonalizacao);

  const pctRealizacao = calcularPercentuais(realizacao);

  /*
  |--------------------------------------------------------------------------
  | Dados do gráfico
  |--------------------------------------------------------------------------
  |
  | Exaustão emocional:
  |
  | Baixo -> verde
  | Médio -> laranja
  | Alto  -> vermelho
  |
  | Despersonalização:
  |
  | Baixo -> verde
  | Médio -> laranja
  | Alto  -> vermelho
  |
  | Realização profissional:
  |
  | Baixo -> vermelho
  | Médio -> laranja
  | Alto  -> verde
  |
  | Por isso utilizamos seis séries.
  |--------------------------------------------------------------------------
  */

  const dados = [
    {
      nome: "Exaustão emocional",

      baixoNormal: pctExaustao.baixo,
      medioNormal: pctExaustao.medio,
      altoNormal: pctExaustao.alto,

      baixoRealizacao: 0,
      medioRealizacao: 0,
      altoRealizacao: 0,
    },

    {
      nome: "Despersonalização",

      baixoNormal: pctDespersonalizacao.baixo,

      medioNormal: pctDespersonalizacao.medio,

      altoNormal: pctDespersonalizacao.alto,

      baixoRealizacao: 0,
      medioRealizacao: 0,
      altoRealizacao: 0,
    },

    {
      nome: "Realização profissional",

      baixoNormal: 0,
      medioNormal: 0,
      altoNormal: 0,

      baixoRealizacao: pctRealizacao.baixo,

      medioRealizacao: pctRealizacao.medio,

      altoRealizacao: pctRealizacao.alto,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Formatação dos percentuais dentro das barras
  |--------------------------------------------------------------------------
  |
  | Segmentos menores que 8% não recebem texto porque normalmente
  | não há espaço suficiente.
  |--------------------------------------------------------------------------
  */

  function formatarPercentual(valor: unknown) {
    const numero = Number(valor);

    if (!Number.isFinite(numero) || numero < 8) {
      return "";
    }

    return `${numero.toFixed(1).replace(".", ",")}%`;
  }

  /*
  |--------------------------------------------------------------------------
  | Renderização do gráfico
  |--------------------------------------------------------------------------
  |
  | largura:
  |
  | undefined -> ResponsiveContainer controla na tela
  | 700       -> largura fixa utilizada no PDF
  |--------------------------------------------------------------------------
  */

  function renderGrafico(largura?: number, altura = 300) {
    return (
      <BarChart
        {...(largura ? { width: largura } : {})}
        height={altura}
        data={dados}
        layout="vertical"
        margin={{
          top: 10,
          right: 30,
          left: 40,
          bottom: 10,
        }}
      >
        {/* ========================================================
            GRADE
        ======================================================== */}

        <CartesianGrid strokeDasharray="3 3" horizontal={false} />

        {/* ========================================================
            EIXO X
        ======================================================== */}

        <XAxis
          type="number"
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(valor) => `${Math.round(Number(valor))}%`}
          tick={{
            fontSize: 11,
          }}
        />

        {/* ========================================================
            EIXO Y
        ======================================================== */}

        <YAxis
          type="category"
          dataKey="nome"
          width={150}
          tick={{
            fontSize: 12,
          }}
        />

        {/* ========================================================
            TOOLTIP
        ======================================================== */}

        <Tooltip
          formatter={(value) =>
            `${Number(value).toFixed(2).replace(".", ",")}%`
          }
        />

        {/* ========================================================
            EXAUSTÃO / DESPERSONALIZAÇÃO

            BAIXO
            Verde
        ======================================================== */}

        <Bar dataKey="baixoNormal" name="Baixo" stackId="nivel" fill="#22c55e">
          <LabelList
            dataKey="baixoNormal"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>

        {/* ========================================================
            EXAUSTÃO / DESPERSONALIZAÇÃO

            MÉDIO
            Laranja
        ======================================================== */}

        <Bar dataKey="medioNormal" name="Médio" stackId="nivel" fill="#f59e0b">
          <LabelList
            dataKey="medioNormal"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>

        {/* ========================================================
            EXAUSTÃO / DESPERSONALIZAÇÃO

            ALTO
            Vermelho
        ======================================================== */}

        <Bar dataKey="altoNormal" name="Alto" stackId="nivel" fill="#ef4444">
          <LabelList
            dataKey="altoNormal"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>

        {/* ========================================================
            REALIZAÇÃO PROFISSIONAL

            BAIXO
            Vermelho
        ======================================================== */}

        <Bar
          dataKey="baixoRealizacao"
          name="Baixo"
          stackId="nivel"
          fill="#ef4444"
        >
          <LabelList
            dataKey="baixoRealizacao"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>

        {/* ========================================================
            REALIZAÇÃO PROFISSIONAL

            MÉDIO
            Laranja
        ======================================================== */}

        <Bar
          dataKey="medioRealizacao"
          name="Médio"
          stackId="nivel"
          fill="#f59e0b"
        >
          <LabelList
            dataKey="medioRealizacao"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>

        {/* ========================================================
            REALIZAÇÃO PROFISSIONAL

            ALTO
            Verde
        ======================================================== */}

        <Bar
          dataKey="altoRealizacao"
          name="Alto"
          stackId="nivel"
          fill="#22c55e"
        >
          <LabelList
            dataKey="altoRealizacao"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={700}
          />
        </Bar>
      </BarChart>
    );
  }

  return (
    <div className="grafico-burnout print-avoid-break rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* =========================================================
          CABEÇALHO
      ========================================================= */}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          Classificação das dimensões de Burnout
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Distribuição percentual dos participantes segundo os níveis de
          classificação de cada dimensão.
        </p>
      </div>

      {/* =========================================================
          GRÁFICO PARA TELA
      ========================================================= */}

      <div className="grafico-screen h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderGrafico()}
        </ResponsiveContainer>
      </div>

      {/* =========================================================
          GRÁFICO PARA IMPRESSÃO
      ========================================================= */}

      <div className="grafico-print">{renderGrafico(700, 300)}</div>

      {/* =========================================================
          LEGENDAS
      ========================================================= */}

      <div className="legenda-burnout mt-5 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-2">
        {/* EXAUSTÃO / DESPERSONALIZAÇÃO */}

        <div>
          <p className="mb-2 text-center text-xs font-semibold text-slate-600">
            Exaustão / Despersonalização
          </p>

          <div className="flex items-center justify-center gap-5 text-xs text-slate-600">
            {/* BAIXO */}

            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: "#22c55e",
                }}
              />

              <span>Baixo</span>
            </div>

            {/* MÉDIO */}

            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: "#f59e0b",
                }}
              />

              <span>Médio</span>
            </div>

            {/* ALTO */}

            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: "#ef4444",
                }}
              />

              <span>Alto</span>
            </div>
          </div>
        </div>

        {/* REALIZAÇÃO PROFISSIONAL */}

        <div>
          <p className="mb-2 text-center text-xs font-semibold text-slate-600">
            Realização Profissional
          </p>

          <div className="flex items-center justify-center gap-5 text-xs text-slate-600">
            {/* BAIXO */}

            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: "#ef4444",
                }}
              />

              <span>Baixo</span>
            </div>

            {/* MÉDIO */}

            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: "#f59e0b",
                }}
              />

              <span>Médio</span>
            </div>

            {/* ALTO */}

            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: "#22c55e",
                }}
              />

              <span>Alto</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          OBSERVAÇÃO
      ========================================================= */}

      <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <strong>Observação:</strong> na dimensão Realização Profissional, a
        interpretação dos níveis é inversa: nível alto representa uma condição
        mais favorável, enquanto nível baixo representa uma condição mais
        desfavorável. Por esse motivo, nessa dimensão, alto é apresentado em
        verde e baixo em vermelho.
      </div>
    </div>
  );
}

export default GraficoBurnout;
