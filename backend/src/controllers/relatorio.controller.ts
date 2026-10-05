import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";
import { calcularRelatorio } from "../services/relatorio.service.js";

/*
|--------------------------------------------------------------------------
| GET /api/relatorios/:id
|--------------------------------------------------------------------------
|
| Gera os dados necessários para o relatório Ambiente / Burnout.
|
| :id = id da pesquisa_ambiente_burnout
|
*/

export async function relatorio(req: Request, res: Response) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Validação do ID
    |--------------------------------------------------------------------------
    */

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        msg: "ID da pesquisa inválido",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Pesquisa
    |--------------------------------------------------------------------------
    */

    const pesquisa = await prisma.pesquisaAmbienteBurnout.findUnique({
      where: {
        id,
      },
    });

    if (!pesquisa) {
      return res.status(404).json({
        msg: "Pesquisa não encontrada",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Instituição
    |--------------------------------------------------------------------------
    |
    | A pesquisa possui:
    |
    | id_instituicoes
    |
    | que referencia:
    |
    | instituicoes.id
    |
    */

    const instituicao = await prisma.instituicoes.findUnique({
      where: {
        id: pesquisa.id_instituicoes,
      },

      select: {
        id: true,
        cnpj: true,
        razao_social: true,
        nome_fantasia: true,

        logradouro: true,
        nro: true,
        complemento: true,
        bairro: true,
        cidade: true,
        uf: true,
        cep: true,

        nro_funcionarios: true,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Questionários
    |--------------------------------------------------------------------------
    */

    const questionarios = await prisma.questionarioAmbienteBurnout.findMany({
      where: {
        id_pesquisa_ambiente_burnout: id,
      },

      orderBy: {
        id: "asc",
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Caso ainda não existam respostas
    |--------------------------------------------------------------------------
    */

    if (questionarios.length === 0) {
      return res.status(200).json({
        pesquisa: {
          id: pesquisa.id,

          dtCadastro: pesquisa.dt_cadastro_pesquisa,

          dtInicio: pesquisa.dt_inicio_pesquisa,

          dtFechamento: pesquisa.dt_fechamento_pesquisa,

          fechado: pesquisa.fechado,

          responsavel: {
            nome: pesquisa.nm_responsavel,

            email: pesquisa.email_responsavel,

            ddd: pesquisa.ddd_responsavel,

            telefone: pesquisa.fone_responsavel,

            cargo: pesquisa.cargo_responsavel,
          },
        },

        instituicao,

        participantes: 0,

        caracteristicas: null,

        ambiente: null,

        burnout: null,

        msg: "Ainda não existem questionários respondidos para esta pesquisa.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Cálculos do relatório
    |--------------------------------------------------------------------------
    |
    | Toda a regra estatística fica no service.
    |
    | O controller não precisa saber como:
    |
    | - PES-NWI é calculado
    | - Burnout é calculado
    | - médias são calculadas
    | - desvios padrão são calculados
    | - cruzamentos são calculados
    |
    */

    const resultado = calcularRelatorio(questionarios);

    /*
    |--------------------------------------------------------------------------
    | Resposta para o React
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      pesquisa: {
        id: pesquisa.id,

        dtCadastro: pesquisa.dt_cadastro_pesquisa,

        dtInicio: pesquisa.dt_inicio_pesquisa,

        dtFechamento: pesquisa.dt_fechamento_pesquisa,

        fechado: pesquisa.fechado,

        nroFuncionarios: pesquisa.nro_funcionarios,

        responsavel: {
          nome: pesquisa.nm_responsavel,

          email: pesquisa.email_responsavel,

          ddd: pesquisa.ddd_responsavel,

          telefone: pesquisa.fone_responsavel,

          cargo: pesquisa.cargo_responsavel,
        },
      },

      instituicao,

      ...resultado,
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);

    return res.status(500).json({
      msg: "Erro ao gerar relatório",
    });
  }
}
