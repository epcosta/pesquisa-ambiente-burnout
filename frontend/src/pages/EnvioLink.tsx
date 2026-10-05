import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

type Pesquisa = {
  id: number;
  nm_responsavel: string | null;
  email_responsavel: string | null;
  dt_inicio_pesquisa: string | null;
  dt_fechamento_pesquisa: string | null;

  instituicao?: {
    razao_social?: string | null;
    nome_fantasia?: string | null;
  };
};

export default function EnvioLink() {
  const { id } = useParams();

  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [periodo, setPeriodo] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const FRONTEND_URL = window.location.origin;

  const linkPesquisa = `${FRONTEND_URL}/questionario-ambienteburnout/${id}`;

  useEffect(() => {
    async function carregarPesquisa() {
      try {
        setLoading(true);
        setErro("");

        const response = await fetch(`${API_URL}/pesquisas/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Erro ao carregar pesquisa.");
        }

        setPesquisa(data);
        if (!data.periodo.disponivel) {
          setPeriodo(false);
        }
        console.log(data.periodo.disponivel);
      } catch (error) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Erro ao carregar pesquisa.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      carregarPesquisa();
    }
  }, [id, API_URL]);

  // Enviar e-mail para o responsável pela pesquisa
  async function enviarEmail() {
    if (!pesquisa) return;

    try {
      setEnviando(true);
      setMensagem("");
      setErroEmail("");

      const response = await fetch(
        `${API_URL}/pesquisas/${pesquisa.id}/enviar-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErroEmail(data.msg ?? "Não foi possível enviar o e-mail.");
        return;
      }

      setMensagem(data.msg ?? "E-mail enviado com sucesso.");
    } catch (error) {
      console.error(error);

      setErroEmail("Erro de comunicação com o servidor.");
    } finally {
      setEnviando(false);
    }
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(linkPesquisa);
    } catch {
      setErro("Não foi possível copiar o link.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Carregando pesquisa...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {erro}
        </div>

        <Link
          to="/ambienteburnout/listar"
          className="mt-4 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Voltar
        </Link>
      </div>
    );
  }

  if (!pesquisa) {
    return null;
  }

  const nomeInstituicao =
    pesquisa.instituicao?.nome_fantasia ||
    pesquisa.instituicao?.razao_social ||
    "Instituição não informada";

  return (
    <section className="mx-auto max-w-5xl">
      {/* Cabeçalho */}

      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Distribuição da pesquisa
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Envio de link
        </h1>

        <div className="flex justify-between">
          <p className="mt-2 text-sm text-slate-600">
            Compartilhe o acesso à pesquisa com o responsável pela instituição.
          </p>
          <Link
            to="/ambienteburnout/listar"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Dados da pesquisa */}

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Pesquisa</p>

              <h2 className="text-xl font-bold text-slate-900">
                Pesquisa #{pesquisa.id}
              </h2>
            </div>

            <span className="self-start rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 sm:self-auto">
              Disponível para envio
            </span>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          {/* Instituição */}

          <section>
            <h3 className="text-lg font-semibold text-slate-900">
              Instituição
            </h3>

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">{nomeInstituicao}</p>
            </div>
          </section>

          {/* Responsável */}

          <section>
            <h3 className="text-lg font-semibold text-slate-900">
              Responsável pela pesquisa
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nome
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {pesquisa.nm_responsavel || "Não informado"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  E-mail
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {pesquisa.email_responsavel || "Não informado"}
                </p>
              </div>
            </div>
          </section>

          {/* Link */}

          <section>
            <h3 className="text-lg font-semibold text-slate-900">
              Link para responder à pesquisa
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Este endereço será enviado ao responsável e também será utilizado
              pelo QR Code.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={linkPesquisa}
                readOnly
                className="h-11 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-700 outline-none"
              />

              <button
                type="button"
                onClick={copiarLink}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-emerald-700 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Copiar link
              </button>
            </div>

            <a
              href={linkPesquisa}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline"
            >
              Abrir pesquisa em uma nova aba
            </a>
          </section>

          {/* Área reservada para QR Code */}

          <section>
            <h3 className="text-lg font-semibold text-slate-900">QR Code</h3>

            <p className="mt-1 text-sm text-slate-500">
              Os participantes podem apontar a câmera do celular para o QR Code
              e acessar diretamente o questionário.
            </p>

            <div className="mt-5 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <QRCodeSVG
                  value={linkPesquisa}
                  size={220}
                  level="H"
                  marginSize={2}
                />
              </div>
              <Link
                to={`/ambienteburnout/qrcode/${pesquisa.id}`}
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Visualizar QR Code
              </Link>

              <p className="mt-4 text-center text-sm font-semibold text-slate-800">
                Pesquisa #{pesquisa.id}
              </p>

              <p className="mt-1 text-center text-sm text-slate-600">
                {nomeInstituicao}
              </p>

              <p className="mt-4 max-w-xl break-all text-center text-xs text-slate-500">
                {linkPesquisa}
              </p>
            </div>
          </section>

          {/* Ações */}

          <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <Link
              to="/ambienteburnout/listar"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Voltar
            </Link>
            <button
              type="button"
              onClick={enviarEmail}
              disabled={enviando || periodo == false}
              className="
              rounded-lg
              bg-emerald-700
              px-5
              py-2.5
              font-semibold
              text-white
              transition
              hover:bg-emerald-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            >
              {enviando ? "Enviando..." : "Enviar e-mail"}
            </button>
            {mensagem && (
              <div
                className="
                mt-4
                rounded-lg
                border
                border-emerald-200
                bg-emerald-50
                p-3
                font-medium
                text-emerald-700
              "
              >
                {mensagem}
              </div>
            )}

            {erro && (
              <div
                className="
                mt-4
                rounded-lg
                border
                border-red-200
                bg-red-50
                p-3
                font-medium
                text-red-700
              "
              >
                {erro}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
