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

import type { GrupoPesNwi } from "../../types/Relatorio";

type Props = {
  geral: GrupoPesNwi;
  enfermeiros: GrupoPesNwi;
  tecnicosAuxiliares: GrupoPesNwi;
};

function GraficoPesNwi({ geral, enfermeiros, tecnicosAuxiliares }: Props) {
  /*
  |--------------------------------------------------------------------------
  | Dados do gráfico
  |--------------------------------------------------------------------------
  */

  const dados = geral.dimensoes.map((dimensao, index) => ({
    dimensao: `D${dimensao.id}`,

    descricao: dimensao.descricao,

    geral: dimensao.media,

    enfermeiros: enfermeiros.dimensoes[index]?.media ?? 0,

    tecnicos: tecnicosAuxiliares.dimensoes[index]?.media ?? 0,
  }));

  /*
  |--------------------------------------------------------------------------
  | Formatação da média
  |--------------------------------------------------------------------------
  |
  | PES-NWI utiliza uma escala de 0 a 4.
  |
  | Portanto mostramos a própria média:
  |
  | 2.74 -> 2,74
  | 3.12 -> 3,12
  |
  */

  function formatarMedia(valor: unknown) {
    const numero = Number(valor);

    if (!Number.isFinite(numero) || numero <= 0) {
      return "";
    }

    return numero.toFixed(2).replace(".", ",");
  }

  /*
  |--------------------------------------------------------------------------
  | Gráfico
  |--------------------------------------------------------------------------
  |
  | largura:
  |
  | undefined -> ResponsiveContainer controla na tela
  | 700       -> largura fixa utilizada na impressão
  |
  */

  function renderGrafico(largura?: number, altura = 320) {
    return (
      <BarChart
        {...(largura ? { width: largura } : {})}
        height={altura}
        data={dados}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 10,
        }}
      >
        {/* ========================================================
            GRADE
        ======================================================== */}

        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        {/* ========================================================
            EIXO X
        ======================================================== */}

        <XAxis
          dataKey="dimensao"
          tick={{
            fontSize: 12,
          }}
        />

        {/* ========================================================
            EIXO Y

            Escala PES-NWI: 0 a 4
        ======================================================== */}

        <YAxis
          domain={[0, 4]}
          ticks={[0, 1, 2, 3, 4]}
          tick={{
            fontSize: 12,
          }}
        />

        {/* ========================================================
            TOOLTIP
        ======================================================== */}

        <Tooltip
          formatter={(value, name) => [
            Number(value).toFixed(2).replace(".", ","),
            String(name),
          ]}
        />

        {/* ========================================================
            GERAL
        ======================================================== */}

        <Bar dataKey="geral" name="Geral" fill="#475569" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="geral"
            position="center"
            formatter={formatarMedia}
            fill="#ffffff"
            fontSize={10}
            fontWeight={600}
          />
        </Bar>

        {/* ========================================================
            ENFERMEIROS
        ======================================================== */}

        <Bar
          dataKey="enfermeiros"
          name="Enfermeiros"
          fill="#2563eb"
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="enfermeiros"
            position="center"
            formatter={formatarMedia}
            fill="#ffffff"
            fontSize={10}
            fontWeight={600}
          />
        </Bar>

        {/* ========================================================
            TÉCNICOS / AUXILIARES
        ======================================================== */}

        <Bar
          dataKey="tecnicos"
          name="Técnicos / Auxiliares"
          fill="#16a34a"
          radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="tecnicos"
            position="center"
            formatter={formatarMedia}
            fill="#ffffff"
            fontSize={10}
            fontWeight={600}
          />
        </Bar>
      </BarChart>
    );
  }

  return (
    <div className="print-avoid-break rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* =========================================================
          CABEÇALHO
      ========================================================= */}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          Comparativo das dimensões PES-NWI
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Comparação das médias entre todos os participantes, enfermeiros e
          técnicos/auxiliares.
        </p>
      </div>

      {/* =========================================================
          GRÁFICO PARA TELA
      ========================================================= */}

      <div className="grafico-screen h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderGrafico()}
        </ResponsiveContainer>
      </div>

      {/* =========================================================
          GRÁFICO PARA IMPRESSÃO
      ========================================================= */}

      <div className="grafico-print">{renderGrafico(700, 300)}</div>

      {/* =========================================================
          LEGENDA DO GRÁFICO

          Mantemos fora do Recharts para controlar melhor
          o espaçamento na tela e no PDF.
      ========================================================= */}

      <div className="legenda-pesnwi mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-600">
        {/* GERAL */}

        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{
              backgroundColor: "#475569",
            }}
          />

          <span>Geral</span>
        </div>

        {/* ENFERMEIROS */}

        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{
              backgroundColor: "#2563eb",
            }}
          />

          <span>Enfermeiros</span>
        </div>

        {/* TÉCNICOS / AUXILIARES */}

        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{
              backgroundColor: "#16a34a",
            }}
          />

          <span>Técnicos / Auxiliares</span>
        </div>
      </div>

      {/* =========================================================
          LEGENDA DAS DIMENSÕES PES-NWI
      ========================================================= */}

      <div className="mt-6 border-t border-slate-200 pt-5">
        <h4 className="mb-4 font-semibold text-slate-700">Dimensões PES-NWI</h4>

        <div className="grid gap-3 md:grid-cols-2">
          {geral.dimensoes.map((dimensao) => (
            <div
              key={dimensao.id}
              className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
            >
              {/* D1, D2, D3... */}

              <span className="flex h-8 min-w-8 items-center justify-center rounded-md bg-slate-800 text-sm font-bold text-white">
                D{dimensao.id}
              </span>

              {/* Descrição */}

              <span className="pt-1 text-sm text-slate-600">
                {dimensao.descricao}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GraficoPesNwi;
