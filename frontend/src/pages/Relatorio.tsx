import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CardResumo from "../components/relatorio/CardResumo";
import TabelaCaracteristicas from "../components/relatorio/TabelaCaracteristicas";
import TabelaPesNwi from "../components/relatorio/TabelaPesNwi";
import TabelaBurnout from "../components/relatorio/TabelaBurnout";
import GraficoBurnout from "../components/relatorio/GraficoBurnout";
import GraficoBurnoutCruzamento from "../components/relatorio/GraficoBurnoutCruzamento";
import TabelaCruzamentoPesNwi from "../components/relatorio/TabelaCruzamentoPesNwi";
import GraficoPesNwi from "../components/relatorio/GraficoPesNwi";
import { SecaoRelatorio } from "../components/relatorio/SecaoRelatorio";
import "../styles/relatorio-print.css";
import type { RelatorioType, DimensaoBurnout } from "../types/Relatorio";
import PdfModal from "../components/PdfModal";

PdfModal;

function Relatorio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [relatorio, setRelatorio] = useState<RelatorioType | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modalPdfAberto, setModalPdfAberto] = useState(false);
  const [pesquisaPdfId, setPesquisaPdfId] = useState<number | null>(null);
  function visualizarPdf(id: number) {
    setPesquisaPdfId(id);
    setModalPdfAberto(true);
  }

  useEffect(() => {
    async function buscarRelatorio() {
      try {
        setCarregando(true);
        setErro("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/relatorios/${id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Erro ao carregar relatório");
        }

        setRelatorio(data);
      } catch (error) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Erro ao carregar relatório");
        }
      } finally {
        setCarregando(false);
      }
    }

    if (id) {
      buscarRelatorio();
    }
  }, [id]);

  if (carregando) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-slate-500">Gerando relatório...</p>
      </div>
    );
  }

  if (erro || !relatorio) {
    return (
      <div className="mx-auto mt-10 max-w-4xl rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
        {erro || "Relatório não encontrado"}
      </div>
    );
  }

  if (relatorio.participantes === 0) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-800">
            Pesquisa sem respostas
          </h2>

          <p className="mt-2 text-amber-700">
            Ainda não existem questionários respondidos para esta pesquisa.
          </p>
        </div>
      </div>
    );
  }

  const { pesquisa, instituicao, caracteristicas, ambiente, burnout } =
    relatorio;

  function gerarPdf() {
    if (!id) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    //window.open(`${apiUrl}/relatorios/${id}/pdf`, "_blank");
    visualizarPdf(Number(id));
  }

  /*
  |--------------------------------------------------------------------------
  | Gráficos Burnout
  |--------------------------------------------------------------------------
  */

  const graficosBurnout = [
    {
      key: "formacao",
      titulo: "Formação",
    },
    {
      key: "tempoFormacao",
      titulo: "Tempo de formação na área de enfermagem",
    },
    {
      key: "tempoInstituicao",
      titulo: "Tempo em que trabalha na instituição",
    },
    {
      key: "tempoCargo",
      titulo: "Tempo em que trabalha no cargo atual",
    },
    {
      key: "formacaoComplementar",
      titulo: "Formação complementar",
    },
    {
      key: "cargo",
      titulo: "Cargo",
    },
    {
      key: "areaTrabalho",
      titulo: "Área de trabalho",
    },
    {
      key: "escalaTrabalho",
      titulo: "Escala de trabalho",
    },
    {
      key: "turnoTrabalho",
      titulo: "Turno de trabalho",
    },
    {
      key: "outroVinculo",
      titulo: "Outro vínculo empregatício",
    },
  ] as const;

  /*
  |--------------------------------------------------------------------------
  | Componente interno - gráficos Burnout
  |--------------------------------------------------------------------------
  */

  type SecaoBurnoutProps = {
    titulo: string;
    dados: DimensaoBurnout;
    realizacaoProfissional?: boolean;
  };

  function SecaoGraficosBurnout({
    titulo,
    dados,
    realizacaoProfissional = false,
  }: SecaoBurnoutProps) {
    return (
      <section className="space-y-6">
        <div className="print-keep-with-next border-b border-slate-200 pb-3">
          <h3 className="text-xl font-bold text-slate-800">{titulo}</h3>

          <p className="mt-1 text-sm text-slate-500">
            Distribuição dos participantes segundo os níveis de Burnout e
            características profissionais.
          </p>
        </div>

        <div className="space-y-6">
          {graficosBurnout.map((grafico) => (
            <div key={grafico.key} className="print-avoid-break">
              <GraficoBurnoutCruzamento
                titulo={grafico.titulo}
                dados={dados.cruzamentos[grafico.key]}
                realizacaoProfissional={realizacaoProfissional}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Cruzamentos PES-NWI
  |--------------------------------------------------------------------------
  */

  const tabelasPesNwi = [
    {
      titulo: "Formação",
      dados: ambiente.cruzamentos.formacao,
    },
    {
      titulo: "Tempo de formação",
      dados: ambiente.cruzamentos.tempoFormacao,
    },
    {
      titulo: "Titulação / Pós-graduação",
      dados: ambiente.cruzamentos.graduacao,
    },
    {
      titulo: "Tempo de trabalho na instituição",
      dados: ambiente.cruzamentos.tempoInstituicao,
    },
    {
      titulo: "Tempo de trabalho no cargo",
      dados: ambiente.cruzamentos.tempoCargo,
    },
    {
      titulo: "Formação complementar",
      dados: ambiente.cruzamentos.formacaoComplementar,
    },
    {
      titulo: "Cargo",
      dados: ambiente.cruzamentos.cargo,
    },
    {
      titulo: "Área de trabalho",
      dados: ambiente.cruzamentos.areaTrabalho,
    },
    {
      titulo: "Escala de trabalho",
      dados: ambiente.cruzamentos.escalaTrabalho,
    },
    {
      titulo: "Turno de trabalho",
      dados: ambiente.cruzamentos.turnoTrabalho,
    },
    {
      titulo: "Outro vínculo empregatício",
      dados: ambiente.cruzamentos.outroVinculo,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-slate-100 print:bg-white">
      <div className="print-page-footer">
        <div className="print-page-footer-content">
          <span>
            Relatório de Avaliação do Ambiente de Trabalho e Risco ao Burnout
          </span>

          <span>Pesquisa #{pesquisa.id}</span>
        </div>
      </div>

      <div className="no-print sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-275 items-center justify-between px-6 py-3">
          <button
            type="button"
            onClick={() => navigate("/ambienteburnout/listar")}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Voltar
          </button>

          <button
            type="button"
            onClick={gerarPdf}
            className="cursor-pointer rounded-lg bg-emerald-900 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-600"
          >
            Gerar PDF
          </button>
        </div>
      </div>

      {/* ============================================================
          DOCUMENTO
      ============================================================ */}

      <div
        id="relatorio"
        className="
          relatorio
          mx-auto
          my-8
          max-w-275
          space-y-10
          bg-white
          px-8
          py-10
          shadow-lg
          md:px-12
          print:m-0
          print:max-w-none
          print:p-0
          print:shadow-none
        "
      >
        {/* ==========================================================
            CABEÇALHO PRINCIPAL DO RELATÓRIO
        ========================================================== */}

        <header className="cabecalho-relatorio print-avoid-break overflow-hidden rounded-2xl bg-slate-800 shadow">
          <div className="p-6 text-white md:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              {/* LADO ESQUERDO */}

              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-wider text-emerald-300">
                  Pesquisa Ambiente de Trabalho e Burnout
                </p>

                <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                  Relatório de Avaliação do Ambiente de Trabalho e Risco ao
                  Burnout
                </h1>

                {instituicao && (
                  <p className="mt-3 text-slate-300">
                    {instituicao.razao_social || instituicao.nome_fantasia}
                  </p>
                )}
              </div>

              {/* LADO DIREITO */}

              <div className="cabecalho-relatorio-info shrink-0 text-sm md:text-right">
                <div>
                  <span className="text-slate-400">Pesquisa</span>

                  <strong className="ml-2 text-white">#{pesquisa.id}</strong>
                </div>

                <div className="mt-2">
                  <span className="text-slate-400">Participantes</span>

                  <strong className="ml-2 text-white">
                    {relatorio.participantes}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ==========================================================
            RESUMO
        ========================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="print-avoid-break">
            <CardResumo
              titulo="Participantes"
              valor={relatorio.participantes}
              descricao="Questionários respondidos"
            />
          </div>

          <div className="print-avoid-break">
            <CardResumo
              titulo="Funcionários"
              valor={pesquisa.nroFuncionarios ?? "-"}
              descricao="Informado na pesquisa"
            />
          </div>

          <div className="print-avoid-break">
            <CardResumo
              titulo="Enfermeiros"
              valor={ambiente.enfermeiros.participantes}
            />
          </div>

          <div className="print-avoid-break">
            <CardResumo
              titulo="Técnicos / Auxiliares"
              valor={ambiente.tecnicosAuxiliares.participantes}
            />
          </div>
        </section>

        {/* ==========================================================
            1 - CARACTERÍSTICAS
        ========================================================== */}

        <SecaoRelatorio
          numero="1"
          titulo="Características dos participantes"
          descricao="Distribuição dos participantes segundo as características profissionais e de trabalho."
        >
          <div className="caracteristicas-grid grid gap-5 lg:grid-cols-2">
            <TabelaCaracteristicas
              titulo="PERFIL"
              dados={caracteristicas.perfil}
            />

            <TabelaCaracteristicas
              titulo="TEMPO DE FORMAÇÃO"
              dados={caracteristicas.tempoFormacao}
            />

            <TabelaCaracteristicas
              titulo="TITULAÇÃO / PÓS-GRADUAÇÃO"
              dados={caracteristicas.graduacao}
            />

            <TabelaCaracteristicas
              titulo="TEMPO NA INSTITUIÇÃO"
              dados={caracteristicas.tempoInstituicao}
            />

            <TabelaCaracteristicas
              titulo="TEMPO NO CARGO"
              dados={caracteristicas.tempoCargo}
            />

            <TabelaCaracteristicas
              titulo="ÁREA DE TRABALHO"
              dados={caracteristicas.areaTrabalho}
            />

            <TabelaCaracteristicas
              titulo="ESCALA DE TRABALHO"
              dados={caracteristicas.escalaTrabalho}
            />

            <TabelaCaracteristicas
              titulo="TURNO DE TRABALHO"
              dados={caracteristicas.turnoTrabalho}
            />

            <TabelaCaracteristicas
              titulo="OUTRO VÍNCULO EMPREGATÍCIO"
              dados={caracteristicas.outroVinculo}
            />
          </div>
        </SecaoRelatorio>

        {/* ==========================================================
            2 - PES-NWI
        ========================================================== */}

        <SecaoRelatorio
          numero="2"
          titulo="Ambiente de Trabalho — PES-NWI"
          descricao="Resultados das dimensões relacionadas ao ambiente da prática profissional de enfermagem."
          novaPagina
        >
          {/* TABELA GERAL PES-NWI */}

          <div className="print-avoid-break">
            <TabelaPesNwi
              geral={ambiente.geral}
              enfermeiros={ambiente.enfermeiros}
              tecnicosAuxiliares={ambiente.tecnicosAuxiliares}
            />
          </div>

          {/* GRÁFICO GERAL PES-NWI */}

          <div className="print-avoid-break mt-8">
            <GraficoPesNwi
              geral={ambiente.geral}
              enfermeiros={ambiente.enfermeiros}
              tecnicosAuxiliares={ambiente.tecnicosAuxiliares}
            />
          </div>

          {/* ========================================================
              2.1 - CRUZAMENTOS PES-NWI
          ======================================================== */}

          <div className="mt-10">
            <div className="print-keep-with-next">
              <div className="print-keep-with-next mb-6 border-b border-slate-200 pb-3">
                <h3 className="text-xl font-bold text-slate-800">
                  2.1. Resultados segundo características dos participantes
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Médias e desvios padrão das dimensões PES-NWI segundo as
                  características profissionais e de trabalho dos participantes.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {tabelasPesNwi.map((tabela) => (
                <div key={tabela.titulo} className="print-avoid-break">
                  <TabelaCruzamentoPesNwi
                    titulo={tabela.titulo}
                    dados={tabela.dados}
                  />
                </div>
              ))}
            </div>
          </div>
        </SecaoRelatorio>

        {/* ==========================================================
            3 - BURNOUT
        ========================================================== */}

        <SecaoRelatorio
          numero="3"
          titulo="Síndrome de Burnout"
          descricao="Resultados do Inventário de Maslach Burnout."
          novaPagina
        >
          {/* TABELA RESUMO */}

          <div className="print-avoid-break">
            <TabelaBurnout
              exaustao={burnout.exaustaoEmocional}
              despersonalizacao={burnout.despersonalizacao}
              realizacao={burnout.realizacaoProfissional}
            />
          </div>

          {/* GRÁFICO RESUMO */}

          <div className="print-avoid-break mt-8">
            <GraficoBurnout
              exaustao={burnout.exaustaoEmocional}
              despersonalizacao={burnout.despersonalizacao}
              realizacao={burnout.realizacaoProfissional}
            />
          </div>

          {/* ========================================================
              3.1 - EXAUSTÃO EMOCIONAL
          ======================================================== */}

          <div className="mt-12">
            <SecaoGraficosBurnout
              titulo="3.1. Exaustão Emocional"
              dados={burnout.exaustaoEmocional}
            />
          </div>

          {/* ========================================================
              3.2 - DESPERSONALIZAÇÃO
          ======================================================== */}

          <div className="print-page-break mt-12">
            <SecaoGraficosBurnout
              titulo="3.2. Despersonalização"
              dados={burnout.despersonalizacao}
            />
          </div>

          {/* ========================================================
              3.3 - REALIZAÇÃO PROFISSIONAL
          ======================================================== */}

          <div className="print-page-break mt-12">
            <SecaoGraficosBurnout
              titulo="3.3. Realização Profissional"
              dados={burnout.realizacaoProfissional}
              realizacaoProfissional
            />
          </div>
        </SecaoRelatorio>
      </div>
      {pesquisaPdfId !== null && (
        <PdfModal
          open={modalPdfAberto}
          pesquisaId={pesquisaPdfId}
          onClose={() => {
            setModalPdfAberto(false);
            setPesquisaPdfId(null);
          }}
        />
      )}
    </main>
  );
}

export default Relatorio;
