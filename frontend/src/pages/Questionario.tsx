import { FormEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PeriodoPesquisa } from "../types/PeriodoPesquisa";
import {
  profileQuestions,
  pesnwiQuestions,
  burnoutQuestions,
  pesnwiOptions,
  burnoutOptions,
  type Question,
  type Option,
} from "../data/questions";

function Block({
  q,
  options,
  onChange,
}: {
  q: Question;
  options: Option[];
  onChange: (n: string, v: number) => void;
}) {
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <legend className="px-1 text-sm font-semibold leading-6 text-slate-900 sm:text-base">
        {q.text}
      </legend>
      <div className="mt-4 grid gap-2.5">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/50 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-900"
          >
            <input
              required
              type="radio"
              name={q.name}
              value={o.value}
              onChange={() => onChange(q.name, o.value)}
              className="mt-0.5 h-4 w-4 accent-emerald-700"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Questionario() {
  const { id } = useParams();
  const nav = useNavigate();
  const [values, setValues] = useState<Record<string, number>>({});
  const [sending, setSending] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [periodo, setPeriodo] = useState<PeriodoPesquisa | null>(null);

  const set = (n: string, v: number) => setValues((x) => ({ ...x, [n]: v }));
  useEffect(() => {
    async function verificarPesquisa() {
      try {
        setCarregando(true);
        setErro("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pesquisas/${id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setErro(data.msg ?? "Não foi possível carregar a pesquisa.");

          return;
        }

        setPeriodo(data.periodo);
      } catch (error) {
        console.error(error);

        setErro("Não foi possível comunicar com o servidor.");
      } finally {
        setCarregando(false);
      }
    }

    verificarPesquisa();
  }, [id]);

  async function submit(e: FormEvent) {
    e.preventDefault();

    setSending(true);
    setErro("");

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/questionarios",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...values,

            id_pesquisa_ambiente_burnout: Number(id),
          }),
        },
      );

      const data = await response.json();

      /*
       * A pesquisa terminou enquanto
       * a pessoa estava preenchendo.
       */
      if (
        response.status === 403 &&
        (data.status === "NAO_INICIADA" ||
          data.status === "ENCERRADA" ||
          data.status === "SEM_PERIODO")
      ) {
        setPeriodo({
          disponivel: false,
          status: data.status,
          msg: data.msg,
        });

        return;
      }

      if (!response.ok) {
        throw new Error(data.msg ?? "Não foi possível enviar o questionário.");
      }

      nav("/obrigado");
    } catch (e: any) {
      setErro(e.message ?? "Erro ao enviar questionário.");
    } finally {
      setSending(false);
    }
  }

  const perfil = values.inf_perfil;
  const perguntasPerfil = profileQuestions.filter(
    (q) =>
      (q.name !== "inf_titulo_graduacao" &&
        q.name !== "inf_cargo_enfermeiro" &&
        q.name !== "inf_cargo_tecnico") ||
      (q.name === "inf_titulo_graduacao" && perfil === 1) ||
      (q.name === "inf_cargo_enfermeiro" && perfil === 1) ||
      (q.name === "inf_cargo_tecnico" && (perfil === 2 || perfil === 3)),
  );
  if (carregando) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">
            Verificando disponibilidade da pesquisa...
          </p>
        </div>
      </div>
    );
  }

  if (erro && !periodo) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-800">
            Não foi possível acessar a pesquisa
          </h1>

          <p className="mt-4 text-red-700">{erro}</p>
        </div>
      </div>
    );
  }

  if (periodo && !periodo.disponivel) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-amber-800">
            Pesquisa indisponível
          </h1>

          <p className="mt-4 text-lg text-amber-700">{periodo.msg}</p>

          <p className="mt-4 text-sm text-amber-600">
            Em caso de dúvida, entre em contato com o responsável pela pesquisa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="mx-auto max-w-4xl" onSubmit={submit}>
      <div className="mb-8 rounded-2xl bg-emerald-900 px-6 py-8 text-white shadow-sm sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
          Questionário
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Pesquisa de Ambiente e Burnout
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
          Responda todas as questões abaixo. Selecione uma alternativa para cada
          pergunta.
        </p>
      </div>

      {erro && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {erro}
        </div>
      )}

      <section className="mb-10">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Etapa 1
          </span>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Perfil profissional
          </h2>
        </div>
        <div className="space-y-4">
          {perguntasPerfil.map((q) => (
            <Block
              key={q.name}
              q={q}
              options={q.options || []}
              onChange={set}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Etapa 2
          </span>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Ambiente de trabalho (PES-NWI)
          </h2>
        </div>
        <div className="space-y-4">
          {pesnwiQuestions.map((q) => (
            <Block key={q.name} q={q} options={pesnwiOptions} onChange={set} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Etapa 3
          </span>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Inventário de Burnout
          </h2>
        </div>
        <div className="space-y-4">
          {burnoutQuestions.map((q) => (
            <Block key={q.name} q={q} options={burnoutOptions} onChange={set} />
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <button
          disabled={sending}
          className="inline-flex min-w-48 cursor-pointer items-center justify-center rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Enviando..." : "Enviar questionário"}
        </button>
      </div>
    </form>
  );
}
