import type { ReactNode } from "react";

type SecaoRelatorioProps = {
  numero?: string;
  titulo: string;
  descricao?: string;
  children: ReactNode;
  novaPagina?: boolean;
  evitarQuebra?: boolean;
};

export function SecaoRelatorio({
  numero,
  titulo,
  descricao,
  children,
  novaPagina = false,
  evitarQuebra = false,
}: SecaoRelatorioProps) {
  return (
    <section
      className={`
        mb-10
        ${novaPagina ? "print-page-break" : ""}
        ${evitarQuebra ? "print-avoid-break" : ""}
      `}
    >
      <div className="mb-6 border-b-2 border-slate-800 pb-3">
        <h2 className="text-2xl font-bold text-slate-800">
          {numero && <span className="mr-2">{numero}.</span>}

          {titulo}
        </h2>

        {descricao && (
          <p className="mt-1 text-sm text-slate-500">{descricao}</p>
        )}
      </div>

      {children}
    </section>
  );
}
