type Props = {
  titulo: string;
  valor: string | number;
  descricao?: string;
};

function CardResumo({ titulo, valor, descricao }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>

      <p className="mt-2 text-3xl font-bold text-slate-800">{valor}</p>

      {descricao && <p className="mt-1 text-sm text-slate-500">{descricao}</p>}
    </div>
  );
}

export default CardResumo;
