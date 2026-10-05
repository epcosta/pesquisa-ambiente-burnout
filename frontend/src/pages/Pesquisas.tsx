import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { PeriodoPesquisa } from "../types/PeriodoPesquisa";

type Pesquisa = {
  id: number;
  nm_responsavel: string | null;
  email_responsavel: string | null;
  dt_cadastro_pesquisa: string | null;
  _count: { questionarios: number };
  periodo: PeriodoPesquisa;
};

export function Pesquisas() {
  const [dados, setDados] = useState<Pesquisa[]>([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPesquisas() {
      try {
        setLoading(true);
        setErro("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pesquisas`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setDados([]);

          setErro(data.msg ?? "Erro ao carregar pesquisas.");

          return;
        }

        setDados(data);
      } catch (error) {
        console.error(error);

        setDados([]);
        setErro("Erro de comunicação com o servidor.");
        return;
      } finally {
        setLoading(false);
      }
    }

    getPesquisas();
  }, []);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Administração
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Pesquisas</h1>
          <p className="mt-1 text-sm text-slate-600">
            Acompanhe as pesquisas cadastradas e suas respostas.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          to="/ambienteburnout/inicio/cadastro"
        >
          Nova pesquisa
        </Link>
      </div>

      {erro && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {erro}
        </div>
      )}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Carregando pesquisas...
        </div>
      )}

      {!loading && !erro && dados.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Nenhuma pesquisa cadastrada
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Cadastre a primeira pesquisa para iniciar a coleta de respostas.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {dados.map((p) => (
          <article
            className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"
            key={p.id}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  Pesquisa #{p.id}
                </h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {p._count.questionarios} resposta(s)
                </span>
                {p.periodo.status === "NAO_INICIADA" && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Não iniciada
                  </span>
                )}

                {p.periodo.status === "EM_ANDAMENTO" && (
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Em andamento
                  </span>
                )}

                {p.periodo.status === "ENCERRADA" && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    Encerrada
                  </span>
                )}

                {p.periodo.status === "SEM_PERIODO" && (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    Período não definido
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-700">
                {p.nm_responsavel || "Responsável não informado"}
              </p>
              <p className="mt-0.5 break-all text-sm text-slate-500">
                {p.email_responsavel || "E-mail não informado"}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {p.periodo.disponivel && (
                <Link
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  to={`/questionario-ambienteburnout/${p.id}`}
                >
                  Responder
                </Link>
              )}

              <Link
                className="inline-flex items-center justify-center rounded-lg border border-emerald-700 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                to={`/ambienteburnout/envio-link/${p.id}`}
              >
                Envio de link
              </Link>

              <Link
                className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
                to={`/relatorio/${p.id}`}
              >
                Relatório
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
