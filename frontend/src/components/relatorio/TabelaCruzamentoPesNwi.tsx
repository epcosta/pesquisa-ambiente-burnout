import type { CruzamentoPesNwi } from "../../types/Relatorio";
import { Fragment } from "react";

type Props = {
  titulo: string;
  dados: CruzamentoPesNwi[];
};

function TabelaCruzamentoPesNwi({ titulo, dados }: Props) {
  const dimensoes = dados[0]?.dimensoes ?? [];

  if (dados.length === 0) {
    return null;
  }

  return (
    <div className="tabela-pesnwi overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* TÍTULO */}

      <div className="border-b border-slate-200 bg-slate-800 px-5 py-4">
        <h3 className="font-semibold text-white">{titulo}</h3>
      </div>

      {/* TABELA */}

      <div className="tabela-pesnwi-scroll overflow-x-auto">
        <table className="tabela-pesnwi-table w-full min-w-275 text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th
                rowSpan={2}
                className="tabela-col-caracteristica border-r border-slate-200 px-4 py-3 text-left"
              >
                Característica
              </th>

              <th
                rowSpan={2}
                className="tabela-col-participantes border-r border-slate-200 px-4 py-3 text-center"
              >
                Participantes
              </th>

              {dimensoes.map((dimensao) => (
                <th
                  key={dimensao.id}
                  colSpan={2}
                  className="tabela-col-dimensao border-r border-slate-200 px-4 py-3 text-center"
                >
                  {dimensao.descricao}
                </th>
              ))}
            </tr>

            <tr className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
              {dimensoes.map((dimensao) => (
                <FragmentDimensao key={dimensao.id} />
              ))}
            </tr>
          </thead>

          <tbody>
            {dados.map((item) => (
              <tr
                key={item.valor}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="border-r border-slate-100 px-4 py-3 font-medium text-slate-700">
                  {item.descricao}
                </td>

                <td className="border-r border-slate-100 px-4 py-3 text-center">
                  {item.participantes}
                </td>

                {item.dimensoes.map((dimensao) => (
                  <Fragment key={dimensao.id}>
                    <td className="px-3 py-3 text-center">
                      {dimensao.media.toFixed(2)}
                    </td>

                    <td className="border-r border-slate-100 px-3 py-3 text-center text-slate-500">
                      {dimensao.desvioPadrao.toFixed(2)}
                    </td>
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentDimensao() {
  return (
    <>
      <th className="px-3 py-2 text-center">Média</th>

      <th className="border-r border-slate-200 px-3 py-2 text-center">DP</th>
    </>
  );
}

export default TabelaCruzamentoPesNwi;
