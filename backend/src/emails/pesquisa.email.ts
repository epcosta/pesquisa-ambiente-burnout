type EmailPesquisaParams = {
  nomeResponsavel: string;
  instituicao: string;
  idPesquisa: number;
};

export function criarEmailPesquisa({
  nomeResponsavel,
  instituicao,
  idPesquisa,
}: EmailPesquisaParams) {
  const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

  const linkPesquisa = `${frontendUrl}/questionario-ambienteburnout/${idPesquisa}`;

  const linkQrCode = `${frontendUrl}/ambienteburnout/qrcode/${idPesquisa}`;

  const assunto = `Pesquisa Ambiente de Trabalho e Burnout - ${instituicao}`;

  const corpo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            background-color: #f4f4f4;
            padding: 30px 15px;
          "
        >
          <tr>
            <td align="center">

              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  width: 100%;
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                "
              >

                <tr>
                  <td
                    style="
                      padding: 30px;
                      text-align: center;
                      background-color: #047857;
                      color: #ffffff;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        font-size: 22px;
                      "
                    >
                      Pesquisa Ambiente de Trabalho e Burnout
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 30px;">

                    <p>
                      Olá <strong>${nomeResponsavel}</strong>,
                    </p>

                    <p>
                      A pesquisa da instituição
                      <strong>${instituicao}</strong>
                      está disponível para participação.
                    </p>

                    <p>
                      Para acessar diretamente o questionário,
                      clique no botão abaixo:
                    </p>

                    <p
                      style="
                        margin: 30px 0;
                        text-align: center;
                      "
                    >
                      <a
                        href="${linkPesquisa}"
                        style="
                          display: inline-block;
                          padding: 14px 24px;
                          background-color: #047857;
                          color: #ffffff;
                          text-decoration: none;
                          border-radius: 6px;
                          font-weight: bold;
                        "
                      >
                        Responder pesquisa
                      </a>
                    </p>

                    <p>
                      Para disponibilizar a pesquisa através de
                      QR Code, utilize o botão abaixo.
                    </p>

                    <p
                      style="
                        margin: 30px 0;
                        text-align: center;
                      "
                    >
                      <a
                        href="${linkQrCode}"
                        style="
                          display: inline-block;
                          padding: 14px 24px;
                          background-color: #ffffff;
                          color: #047857;
                          text-decoration: none;
                          border: 2px solid #047857;
                          border-radius: 6px;
                          font-weight: bold;
                        "
                      >
                        Visualizar QR Code
                      </a>
                    </p>

                    <hr
                      style="
                        margin: 30px 0;
                        border: 0;
                        border-top: 1px solid #dddddd;
                      "
                    >

                    <p
                      style="
                        font-size: 12px;
                        color: #777777;
                      "
                    >
                      Caso os botões não funcionem,
                      copie e cole os endereços abaixo
                      no navegador.
                    </p>

                    <p
                      style="
                        font-size: 12px;
                        color: #777777;
                        word-break: break-all;
                      "
                    >
                      <strong>Questionário:</strong><br>
                      ${linkPesquisa}
                    </p>

                    <p
                      style="
                        font-size: 12px;
                        color: #777777;
                        word-break: break-all;
                      "
                    >
                      <strong>QR Code:</strong><br>
                      ${linkQrCode}
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;

  return {
    assunto,
    corpo,
  };
}
