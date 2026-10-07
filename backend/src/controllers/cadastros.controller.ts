import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listarDDDs(_req: Request, res: Response) {
  const dados = await prisma.tabelaDDD.findMany({ orderBy: { ddd: "asc" } });
  res.json(dados);
}

export async function listarInstituicoes(_req: Request, res: Response) {
  const dados = await prisma.instituicoes.findMany({
    orderBy: { ds_instituicao: "asc" },
  });
  res.json(dados);
}

export async function buscarInstituicao(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id))
    return res.status(400).json({ msg: "ID inválido" });
  const dado = await prisma.instituicoes.findUnique({ where: { id } });
  if (!dado) return res.status(404).json({ msg: "Instituição não encontrada" });
  res.json(dado);
}
