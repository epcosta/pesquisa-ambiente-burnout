import type { Request, Response } from "express";
import { verificarPeriodoPesquisa } from "../utils/verificarPeriodoPesquisa.js";
import { prisma } from "../lib/prisma.js";
const date = (v: any) => (v ? new Date(`${v}T00:00:00`) : null);

//###############################################################################

export async function listarPesquisas(_req: Request, res: Response) {
  try {
    const data = await prisma.pesquisaAmbienteBurnout.findMany({
      include: {
        instituicao: true,

        _count: {
          select: {
            questionarios: true,
          },
        },
      },

      orderBy: {
        id: "desc",
      },
    });

    const pesquisas = data.map((pesquisa) => ({
      ...pesquisa,

      periodo: verificarPeriodoPesquisa({
        dt_inicio_pesquisa: pesquisa.dt_inicio_pesquisa,

        dt_fechamento_pesquisa: pesquisa.dt_fechamento_pesquisa,
      }),
    }));

    return res.status(200).json(pesquisas);
  } catch (error) {
    console.error("Erro ao listar pesquisas:", error);

    return res.status(500).json({
      msg: "Erro ao listar pesquisas.",
    });
  }
}

//###############################################################################
export async function obterPesquisa(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        msg: "Pesquisa inválida.",
      });
    }

    const data = await prisma.pesquisaAmbienteBurnout.findUnique({
      where: {
        id,
      },

      include: {
        instituicao: true,
      },
    });

    if (!data) {
      return res.status(404).json({
        msg: "Pesquisa não encontrada",
      });
    }

    const periodo = verificarPeriodoPesquisa({
      dt_inicio_pesquisa: data.dt_inicio_pesquisa,

      dt_fechamento_pesquisa: data.dt_fechamento_pesquisa,
    });

    return res.status(200).json({
      ...data,
      periodo,
    });
  } catch (error) {
    console.error("Erro ao buscar pesquisa:", error);

    return res.status(500).json({
      msg: "Erro ao buscar pesquisa.",
    });
  }
}

//###############################################################################
export async function criarPesquisa(req: Request, res: Response) {
  try {
    const dados = req.body;
    console.log(dados, "##############");

    const cnpj = String(dados.cnpj || "").replace(/\D/g, "");

    // Validação básica do CNPJ
    if (!cnpj) {
      return res.status(400).json({
        msg: "CNPJ é obrigatório",
      });
    }

    let inst = await prisma.instituicoes.findFirst({
      where: { cnpj },
    });

    if (!inst) {
      inst = await prisma.instituicoes.create({
        data: {
          cnpj,

          razao_social: dados.razao_social,
          nome_fantasia: dados.nome_fantasia || null,

          logradouro: dados.logradouro || null,
          nro: dados.nro || null,
          complemento: dados.complemento || null,
          bairro: dados.bairro || null,
          cidade: dados.cidade || null,
          uf: dados.uf || null,
          cep: dados.cep || null,

          nro_funcionarios: dados.nro_funcionarios
            ? Number(dados.nro_funcionarios)
            : null,

          dt_cadastro: new Date(),
          dt_alteracao: new Date(),
        },
      });
    } else {
      inst = await prisma.instituicoes.update({
        where: {
          id: inst.id,
        },

        data: {
          razao_social: dados.razao_social || inst.razao_social,
          nome_fantasia: dados.nome_fantasia || inst.nome_fantasia,

          logradouro: dados.logradouro || inst.logradouro,
          nro: dados.nro || inst.nro,
          complemento: dados.complemento || inst.complemento,
          bairro: dados.bairro || inst.bairro,
          cidade: dados.cidade || inst.cidade,
          uf: dados.uf || inst.uf,
          cep: dados.cep || inst.cep,

          nro_funcionarios: dados.nro_funcionarios
            ? Number(dados.nro_funcionarios)
            : inst.nro_funcionarios,

          dt_alteracao: new Date(),
        },
      });
    }

    const existente = await prisma.pesquisaAmbienteBurnout.findFirst({
      where: {
        id_instituicoes: inst.id,
      },
    });

    if (existente) {
      return res.status(409).json({
        msg: "Já existe pesquisa de Ambiente/Burnout para esta instituição",
        data: existente,
      });
    }

    const data = await prisma.pesquisaAmbienteBurnout.create({
      data: {
        dt_cadastro_pesquisa: new Date(),

        nm_responsavel: dados.nm_responsavel,
        email_responsavel: dados.email_responsavel,
        ddd_responsavel: dados.ddd_responsavel,
        fone_responsavel: dados.fone_responsavel,
        cargo_responsavel: dados.cargo_responsavel || null,

        nro_funcionarios: dados.nro_funcionarios
          ? Number(dados.nro_funcionarios)
          : null,

        dt_inicio_pesquisa: date(dados.dt_inicio_pesquisa),
        dt_fechamento_pesquisa: date(dados.dt_fechamento_pesquisa),

        id_area_instituicao: dados.id_area_instituicao
          ? Number(dados.id_area_instituicao)
          : null,

        id_instituicoes: inst.id,
      },
    });

    return res.status(201).json({
      msg: "Pesquisa cadastrada",
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "Erro ao cadastrar pesquisa",
      error: String(error),
    });
  }
}
