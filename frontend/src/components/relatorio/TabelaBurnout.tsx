import type { DimensaoBurnout } from "../../types/Relatorio";

type Props = {
  exaustao: DimensaoBurnout;
  despersonalizacao: DimensaoBurnout;
  realizacao: DimensaoBurnout;
};

function TabelaBurnout({ exaustao, despersonalizacao, realizacao }: Props) {
  const dimensoes = [
    {
      nome: "Exaustão emocional",
      dados: exaustao,
    },
    {
      nome: "Despersonalização",
      dados: despersonalizacao,
    },
    {
      nome: "Realização profissional",
      dados: realizacao,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-800 px-5 py-4 text-white">
        <h2 className="text-lg font-semibold">Inventário de Maslach Burnout</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-3 text-left">Dimensão</th>

              <th className="px-4 py-3 text-center">Média</th>

              <th className="px-4 py-3 text-center">Desvio padrão</th>
            </tr>
          </thead>

          <tbody>
            {dimensoes.map((item) => (
              <tr key={item.nome} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{item.nome}</td>

                <td className="px-4 py-3 text-center">
                  {item.dados.media.toFixed(2)}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.dados.desvioPadrao.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaBurnout;
