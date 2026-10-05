import "dotenv/config";
import nodemailer from "nodemailer";

type AnexoEmail = {
  nome: string;
  caminho: string;
};

type EnviarEmailParams = {
  assunto: string;
  destinatario: string | string[];
  corpo: string;
  anexos?: AnexoEmail[];
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function enviar({
  assunto,
  destinatario,
  corpo,
  anexos = [],
}: EnviarEmailParams) {
  const attachments = anexos.map((anexo) => ({
    filename: anexo.nome,
    path: anexo.caminho,
  }));

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: destinatario,
    subject: assunto,
    html: corpo,
    attachments,
  });

  return info;
}

export const email = {
  enviar,
};
