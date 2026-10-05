import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import "../styles/qrcode-print.css";

type Pesquisa = {
  id: number;
  nm_responsavel: string | null;
  email_responsavel: string | null;

  instituicao?: {
    razao_social?: string | null;
    nome_fantasia?: string | null;
  };
};

export default function VisualizarQrCode() {
  const { id } = useParams();

  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const FRONTEND_URL = import.meta.env.VITE_APP_URL || window.location.origin;

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

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center text-slate-500">
        Carregando QR Code...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {erro}
        </div>
      </div>
    );
  }

  if (!pesquisa) {
    return null;
  }

  const nomeInstituicao =
    pesquisa.instituicao?.nome_fantasia ||
    pesquisa.instituicao?.razao_social ||
    "Instituição";

  return (
    <>
      {/* Botões somente para tela */}

      <div className="no-print mx-auto mb-6 flex max-w-4xl flex-wrap justify-between gap-3">
        <Link
          to={`/ambienteburnout/envio-link/${pesquisa.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Voltar
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Imprimir
        </button>
      </div>

      {/* Material para divulgação */}

      <main className="pagina-qrcode mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-8 text-center sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Pesquisa
          </p>

          <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            Avaliação do Ambiente de Trabalho e Risco ao Burnout
          </h1>

          <div className="mx-auto mt-6 h-px max-w-xl bg-slate-200" />

          <h2 className="mt-6 text-xl font-semibold text-slate-800">
            {nomeInstituicao}
          </h2>

          <p className="mt-2 text-sm text-slate-500">Pesquisa #{pesquisa.id}</p>

          {/* Instrução */}

          <div className="mx-auto mt-10 max-w-xl">
            <h3 className="text-2xl font-bold text-slate-900">
              Participe da pesquisa
            </h3>

            <p className="mt-3 text-lg leading-relaxed text-slate-600">
              Aponte a câmera do seu celular para o QR Code abaixo e acesse o
              questionário.
            </p>
          </div>

          {/* QR Code */}

          <div className="mt-8 flex justify-center">
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
              <QRCodeSVG
                value={linkPesquisa}
                size={300}
                level="H"
                marginSize={2}
              />
            </div>
          </div>

          <p className="mt-7 text-sm font-semibold text-slate-700">
            Ou acesse diretamente:
          </p>

          <p className="mx-auto mt-2 max-w-2xl break-all text-sm text-emerald-700">
            {linkPesquisa}
          </p>

          <div className="mx-auto mt-10 max-w-xl border-t border-slate-200 pt-6">
            <p className="text-sm leading-relaxed text-slate-500">
              Sua participação é importante para a avaliação do ambiente de
              trabalho.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
