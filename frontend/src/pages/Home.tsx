import { Link } from "react-router-dom";

export function Home() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-800 px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
          Pesquisa organizacional
        </p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Avaliação do Ambiente de Trabalho e Risco de Burnout
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50 sm:text-lg">
          Aplicação para cadastro de pesquisas, coleta de respostas e
          acompanhamento dos resultados de ambiente de trabalho e burnout.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
            to="/ambienteburnout/inicio/cadastro"
          >
            Cadastrar pesquisa
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-lg border border-emerald-300/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            to="/ambienteburnout/listar"
          >
            Ver pesquisas
          </Link>
        </div>
      </div>
    </section>
  );
}
