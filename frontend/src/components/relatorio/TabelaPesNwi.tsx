import type { GrupoPesNwi } from "../../types/Relatorio";

type Props = {
  geral: GrupoPesNwi;
  enfermeiros: GrupoPesNwi;
  tecnicosAuxiliares: GrupoPesNwi;
};

function TabelaPesNwi({ geral, enfermeiros, tecnicosAuxiliares }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-800 px-5 py-4 text-white">
        <h2 className="text-lg font-semibold">
          Dimensões do Ambiente de Trabalho — PES-NWI
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th rowSpan={2} className="px-4 py-3 text-left">
                Dimensão
              </th>

              <th colSpan={2} className="border-l px-4 py-3">
                Geral
              </th>

              <th colSpan={2} className="border-l px-4 py-3">
                Enfermeiros
              </th>

              <th colSpan={2} className="border-l px-4 py-3">
                Técnicos/Auxiliares
              </th>
            </tr>

            <tr className="bg-slate-50 text-slate-600">
              <th className="border-l px-3 py-2">Média</th>

              <th className="px-3 py-2">DP</th>

              <th className="border-l px-3 py-2">Média</th>

              <th className="px-3 py-2">DP</th>

              <th className="border-l px-3 py-2">Média</th>

              <th className="px-3 py-2">DP</th>
            </tr>
          </thead>

          <tbody>
            {geral.dimensoes.map((dimensao, index) => {
              const enfermeiro = enfermeiros.dimensoes[index];

              const tecnico = tecnicosAuxiliares.dimensoes[index];

              return (
                <tr key={dimensao.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {dimensao.descricao}
                  </td>

                  <td className="border-l px-3 py-3 text-center">
                    {dimensao.media.toFixed(2)}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {dimensao.desvioPadrao.toFixed(2)}
                  </td>

                  <td className="border-l px-3 py-3 text-center">
                    {enfermeiro?.media.toFixed(2)}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {enfermeiro?.desvioPadrao.toFixed(2)}
                  </td>

                  <td className="border-l px-3 py-3 text-center">
                    {tecnico?.media.toFixed(2)}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {tecnico?.desvioPadrao.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaPesNwi;
