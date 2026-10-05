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

import type { ItemCruzamentoBurnout } from "../../types/Relatorio";

type Props = {
  titulo: string;
  dados: ItemCruzamentoBurnout[];
  realizacaoProfissional?: boolean;
};

function GraficoBurnoutCruzamento({
  titulo,
  dados,
  realizacaoProfissional = false,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Dados
  |--------------------------------------------------------------------------
  */

  const dadosGrafico = dados
    .filter((item) => item.total > 0)
    .map((item) => ({
      descricao: item.descricao,
      baixo: item.percentuais.baixo,
      medio: item.percentuais.medio,
      alto: item.percentuais.alto,
    }));

  /*
  |--------------------------------------------------------------------------
  | Cores
  |--------------------------------------------------------------------------
  */

  const corBaixo = realizacaoProfissional ? "#ef4444" : "#22c55e";

  const corMedio = "#f59e0b";

  const corAlto = realizacaoProfissional ? "#22c55e" : "#ef4444";

  /*
  |--------------------------------------------------------------------------
  | Altura dinâmica
  |--------------------------------------------------------------------------
  */

  const altura = Math.max(180, dadosGrafico.length * 55 + 80);

  /*
  |--------------------------------------------------------------------------
  | Formatação dos percentuais
  |--------------------------------------------------------------------------
  |
  | Não mostramos valores menores que 8%, pois normalmente
  | não há espaço suficiente dentro da barra.
  |
  */

  function formatarPercentual(valor: unknown) {
    const numero = Number(valor);

    if (!Number.isFinite(numero) || numero < 8) {
      return "";
    }

    return `${numero.toFixed(1).replace(".", ",")}%`;
  }

  if (dadosGrafico.length === 0) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Gráfico
  |--------------------------------------------------------------------------
  */

  function renderGrafico(largura?: number, alturaGrafico = altura) {
    return (
      <BarChart
        {...(largura ? { width: largura } : {})}
        height={alturaGrafico}
        data={dadosGrafico}
        layout="vertical"
        margin={{
          top: 10,
          right: 30,
          left: 30,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />

        <XAxis
          type="number"
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(valor) => `${Math.round(Number(valor))}%`}
          tick={{
            fontSize: 11,
          }}
        />

        <YAxis
          type="category"
          dataKey="descricao"
          width={190}
          tick={{
            fontSize: 12,
          }}
        />

        <Tooltip
          formatter={(value) =>
            `${Number(value).toFixed(2).replace(".", ",")}%`
          }
        />

        {/* ========================================================
            BAIXO
        ======================================================== */}

        <Bar dataKey="baixo" name="Baixo" stackId="burnout" fill={corBaixo}>
          <LabelList
            dataKey="baixo"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={600}
          />
        </Bar>

        {/* ========================================================
            MÉDIO
        ======================================================== */}

        <Bar dataKey="medio" name="Médio" stackId="burnout" fill={corMedio}>
          <LabelList
            dataKey="medio"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={600}
          />
        </Bar>

        {/* ========================================================
            ALTO
        ======================================================== */}

        <Bar dataKey="alto" name="Alto" stackId="burnout" fill={corAlto}>
          <LabelList
            dataKey="alto"
            position="center"
            formatter={formatarPercentual}
            fill="#ffffff"
            fontSize={11}
            fontWeight={600}
          />
        </Bar>
      </BarChart>
    );
  }

  return (
    <div className="grafico-burnout-cruzamento print-avoid-break rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-slate-100 pb-2">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {titulo}
        </h4>
      </div>

      {/* TELA */}

      <div
        className="grafico-screen w-full"
        style={{
          height: `${altura}px`,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderGrafico()}
        </ResponsiveContainer>
      </div>

      {/* IMPRESSÃO */}

      <div className="grafico-print">{renderGrafico(700, altura)}</div>

      {/* LEGENDA */}

      <div className="legenda-burnout mt-3 flex items-center justify-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: corBaixo }}
          />
          <span>Baixo</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: corMedio }}
          />
          <span>Médio</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: corAlto }}
          />
          <span>Alto</span>
        </div>
      </div>
    </div>
  );
}

export default GraficoBurnoutCruzamento;
