import type { Request, Response } from "express";
import { chromium } from "playwright";

export const gerarRelatorioPdf = async (req: Request, res: Response) => {
  let browser;

  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      res.status(400).json({
        msg: "ID da pesquisa inválido",
      });

      return;
    }

    /*
     * URL do FRONTEND.
     *
     * O Playwright vai abrir exatamente o relatório
     * React que já criamos.
     */
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const urlRelatorio = `${frontendUrl}/relatorio/${id}`;

    console.log("Gerando PDF do relatório:", urlRelatorio);

    /*
     * Abre o Chromium em modo headless.
     */
    browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 1000,
      },
    });

    /*
     * Abre a página React.
     */
    await page.goto(urlRelatorio, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    /*
     * Espera o relatório existir.
     *
     * Seu Relatorio.tsx possui:
     *
     * id="relatorio"
     */
    await page.waitForSelector("#relatorio", {
      state: "visible",
      timeout: 60000,
    });

    /*
     * Garante que fontes carregadas pela página
     * estejam prontas antes do PDF.
     */
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    /*
     * Utiliza as regras @media print do seu CSS.
     */
    await page.emulateMedia({
      media: "print",
    });

    /*
     * Dados usados no cabeçalho.
     *
     * Inicialmente usaremos o ID.
     * Depois podemos passar também instituição
     * e participantes.
     */

    const pdf = await page.pdf({
      format: "A4",

      printBackground: true,

      displayHeaderFooter: true,

      margin: {
        top: "25mm",
        bottom: "20mm",
        left: "10mm",
        right: "10mm",
      },

      /*
       * CABEÇALHO
       */

      headerTemplate: `
        <div
          style="
            width: 100%;
            margin: 0 10mm;
            padding-bottom: 5px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            border-bottom: 1px solid #cbd5e1;

            font-family: Arial, sans-serif;
            font-size: 8px;
            color: #475569;
          "
        >
          <span
            style="
              font-weight: 600;
              color: #334155;
            "
          >
            Avaliação do Ambiente de Trabalho e Risco ao Burnout
          </span>

          <span>
            Pesquisa #${id}
          </span>
        </div>
      `,

      /*
       * RODAPÉ
       */

      footerTemplate: `
        <div
          style="
            width: 100%;
            margin: 0 10mm;
            padding-top: 5px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            border-top: 1px solid #cbd5e1;

            font-family: Arial, sans-serif;
            font-size: 8px;
            color: #64748b;
          "
        >
          <span>
            Pesquisa #${id}
          </span>

          <span>
            Página
            <span class="pageNumber"></span>
            de
            <span class="totalPages"></span>
          </span>
        </div>
      `,
    });

    /*
     * Fecha o navegador.
     */
    await browser.close();

    browser = undefined;

    /*
     * Devolve o PDF diretamente para o navegador.
     */
    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `inline; filename="relatorio-burnout-${id}.pdf"`,
    );

    res.setHeader("Content-Length", pdf.length.toString());

    res.status(200).send(pdf);
  } catch (error) {
    console.error("Erro ao gerar PDF com Playwright:", error);

    if (browser) {
      await browser.close();
    }

    res.status(500).json({
      msg: "Erro ao gerar PDF",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
