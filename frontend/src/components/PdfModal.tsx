import { useEffect, useState } from "react";
import { Download, FileText, LoaderCircle, X } from "lucide-react";

type PdfModalProps = {
  open: boolean;
  onClose: () => void;
  pesquisaId: number;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3500/api";

export default function PdfModal({ open, onClose, pesquisaId }: PdfModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    let objectUrl: string | null = null;

    async function carregarPdf() {
      setLoading(true);
      setErro("");
      setPdfUrl(null);

      try {
        const response = await fetch(
          `${API_URL}/relatorios/${pesquisaId}/pdf`,
          {
            signal: controller.signal,
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Não foi possível gerar o relatório PDF.");
        }

        const blob = await response.blob();

        if (!blob.size) {
          throw new Error("O PDF retornado está vazio.");
        }

        if (controller.signal.aborted) return;

        objectUrl = URL.createObjectURL(
          new Blob([blob], { type: "application/pdf" }),
        );

        setPdfUrl(objectUrl);
      } catch (error) {
        if (controller.signal.aborted) return;

        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar o documento.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    carregarPdf();

    return () => {
      controller.abort();

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [open, pesquisaId]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualização do relatório PDF"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3"
    >
      <div className="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" />

            <h2 className="text-lg font-semibold">
              Relatório PDF — Pesquisa #{pesquisaId}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {pdfUrl && (
              <a
                href={pdfUrl}
                download={`relatorio-burnout-${pesquisaId}.pdf`}
                className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                <Download size={18} />
                Baixar PDF
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar relatório"
              className="cursor-pointer rounded p-2 hover:bg-gray-100"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="relative flex-1 bg-gray-100">
          {loading && (
            <div
              role="status"
              className="flex h-full flex-col items-center justify-center gap-4"
            >
              <LoaderCircle size={48} className="animate-spin text-blue-600" />

              <p className="text-lg font-semibold">Gerando relatório PDF...</p>

              <p className="text-sm text-gray-500">
                Aguarde enquanto preparamos seu documento.
              </p>
            </div>
          )}

          {erro && (
            <div
              role="alert"
              className="flex h-full flex-col items-center justify-center gap-4 p-6"
            >
              <p className="text-red-600">{erro}</p>

              <button
                type="button"
                onClick={onClose}
                className="rounded bg-gray-800 px-4 py-2 text-white"
              >
                Fechar
              </button>
            </div>
          )}

          {pdfUrl && !loading && (
            <iframe
              src={pdfUrl}
              title={`Relatório da pesquisa ${pesquisaId}`}
              className="h-full w-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
