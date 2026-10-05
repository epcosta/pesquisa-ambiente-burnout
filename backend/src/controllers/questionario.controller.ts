import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { verificarPeriodoPesquisa } from "../utils/verificarPeriodoPesquisa.js";
const int = (v: unknown) =>
  v === undefined || v === null || v === "" ? null : Number(v);

//###############################################################################
export async function criarQuestionario(req: Request, res: Response) {
  try {
    const body = req.body;

    const idPesquisa = Number(body.id_pesquisa_ambiente_burnout);

    if (!Number.isInteger(idPesquisa) || idPesquisa <= 0) {
      return res.status(400).json({
        msg: "Pesquisa inválida.",
      });
    }

    /*
     * Verifica se a pesquisa existe
     */
    const pesquisa = await prisma.pesquisaAmbienteBurnout.findUnique({
      where: {
        id: idPesquisa,
      },
    });

    if (!pesquisa) {
      return res.status(404).json({
        msg: "Pesquisa não encontrada.",
      });
    }

    /*
     * Verifica se a pesquisa está
     * dentro do período permitido
     */
    const periodo = verificarPeriodoPesquisa({
      dt_inicio_pesquisa: pesquisa.dt_inicio_pesquisa,

      dt_fechamento_pesquisa: pesquisa.dt_fechamento_pesquisa,
    });

    if (!periodo.disponivel) {
      return res.status(403).json({
        msg: periodo.msg,
        status: periodo.status,
      });
    }

    /*
     * Montagem dos dados do questionário
     */
    const data: any = {
      dt_cadastro_pesquisa: new Date(),

      id_pesquisa_ambiente_burnout: idPesquisa,
    };

    for (const k of Object.keys(body)) {
      if (
        k.startsWith("inf_") ||
        k.startsWith("pesnwi_") ||
        k.startsWith("burnout_")
      ) {
        data[k] = int(body[k]);
      }
    }

    /*
     * Grava questionário
     */
    const item = await prisma.questionarioAmbienteBurnout.create({
      data,
    });

    return res.status(201).json({
      msg: "Questionário registrado com sucesso",
      data: item,
    });
  } catch (error) {
    console.error("Erro ao gravar questionário:", error);

    return res.status(500).json({
      msg: "Erro ao gravar questionário",
      error: String(error),
    });
  }
}

//###############################################################################
export async function listarPorPesquisa(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await prisma.questionarioAmbienteBurnout.findMany({
    where: { id_pesquisa_ambiente_burnout: id },
  });
  res.json(data);
}
