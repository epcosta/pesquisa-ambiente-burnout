import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";
import { email } from "../services/email.service.js";
import { criarEmailPesquisa } from "../emails/pesquisa.email.js";

export async function enviarLinkPesquisa(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        msg: "Pesquisa inválida.",
      });
    }

    const pesquisa = await prisma.pesquisaAmbienteBurnout.findUnique({
      where: {
        id,
      },

      include: {
        instituicao: true,
      },
    });

    if (!pesquisa) {
      return res.status(404).json({
        msg: "Pesquisa não encontrada.",
      });
    }

    if (!pesquisa.email_responsavel) {
      return res.status(400).json({
        msg: "A pesquisa não possui e-mail do responsável.",
      });
    }

    const { assunto, corpo } = criarEmailPesquisa({
      nomeResponsavel: pesquisa.nm_responsavel ?? "Responsável",

      instituicao: pesquisa.instituicao?.razao_social ?? "Instituição",

      idPesquisa: pesquisa.id,
    });

    const info = await email.enviar({
      assunto,
      destinatario: pesquisa.email_responsavel,
      corpo,
    });

    console.log("E-mail enviado:", info.messageId);

    return res.status(200).json({
      msg: "E-mail enviado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail da pesquisa:", error);

    return res.status(500).json({
      msg: "Não foi possível enviar o e-mail.",
    });
  }
}
