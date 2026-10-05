import type { ItemCaracteristica } from "../../types/Relatorio";

type Props = {
  titulo: string;
  dados: ItemCaracteristica[];
};

function TabelaCaracteristicas({ titulo, dados }: Props) {
  return (
    <div className="tabela-caracteristicas overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h3 className="font-semibold text-slate-700 uppercase">{titulo}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-left text-slate-600">
              <th className="px-4 py-3">Descrição</th>

              <th className="px-4 py-3 text-center">Qtd.</th>

              <th className="px-4 py-3 text-center">%</th>
            </tr>
          </thead>

          <tbody>
            {dados.map((item) => (
              <tr
                key={item.valor}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3">{item.descricao}</td>

                <td className="px-4 py-3 text-center font-medium">
                  {item.quantidade}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.percentual > 0 ? item.percentual.toFixed(2) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaCaracteristicas;
