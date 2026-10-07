import { Router } from "express";

import {
  listarPesquisas,
  obterPesquisa,
  criarPesquisa,
} from "../controllers/pesquisa.controller.js";

import {
  criarQuestionario,
  listarPorPesquisa,
} from "../controllers/questionario.controller.js";

import { relatorio } from "../controllers/relatorio.controller.js";

import { gerarRelatorioPdf } from "../controllers/relatorioPdf.controller.js";

import { enviarLinkPesquisa } from "../controllers/email.controller.js";

export const router = Router();

//###############################################################################
// HEALTH
//###############################################################################

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica o funcionamento da API
 *     description: Verifica se o servidor da API está respondendo.
 *     tags:
 *       - Sistema
 *
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get("/health", (_req, res) => res.json({ status: "ok" }));

//###############################################################################
// PESQUISAS
//###############################################################################

/**
 * @swagger
 * /pesquisas:
 *   get:
 *     summary: Lista todas as pesquisas
 *     description: >
 *       Retorna todas as pesquisas de Ambiente de Trabalho e Burnout,
 *       incluindo os dados da instituição, a quantidade de questionários
 *       respondidos e a situação atual do período da pesquisa.
 *     tags:
 *       - Pesquisas
 *
 *     responses:
 *       200:
 *         description: Pesquisas listadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 10
 *
 *                   dt_cadastro_pesquisa:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-10-01T00:00:00.000Z"
 *
 *                   nm_responsavel:
 *                     type: string
 *                     nullable: true
 *                     example: Maria da Silva
 *
 *                   email_responsavel:
 *                     type: string
 *                     format: email
 *                     nullable: true
 *                     example: maria@hospital.com.br
 *
 *                   ddd_responsavel:
 *                     type: string
 *                     nullable: true
 *                     example: "11"
 *
 *                   fone_responsavel:
 *                     type: string
 *                     nullable: true
 *                     example: "999999999"
 *
 *                   cargo_responsavel:
 *                     type: string
 *                     nullable: true
 *                     example: Coordenadora de Enfermagem
 *
 *                   nro_funcionarios:
 *                     type: integer
 *                     nullable: true
 *                     example: 250
 *
 *                   dt_inicio_pesquisa:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-10-01T00:00:00.000Z"
 *
 *                   dt_fechamento_pesquisa:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-10-31T00:00:00.000Z"
 *
 *                   fechado:
 *                     type: string
 *                     nullable: true
 *                     example: "N"
 *
 *                   nome_arte:
 *                     type: string
 *                     nullable: true
 *                     example: arte-pesquisa.jpg
 *
 *                   nome_arte_original:
 *                     type: string
 *                     nullable: true
 *                     example: arte-original.jpg
 *
 *                   id_area_instituicao:
 *                     type: integer
 *                     nullable: true
 *                     example: 1
 *
 *                   id_instituicoes:
 *                     type: integer
 *                     example: 25
 *
 *                   instituicao:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 25
 *
 *                       ds_instituicao:
 *                         type: string
 *                         nullable: true
 *                         example: Hospital
 *
 *                       razao_social:
 *                         type: string
 *                         example: Hospital Exemplo Ltda
 *
 *                       nome_fantasia:
 *                         type: string
 *                         nullable: true
 *                         example: Hospital Exemplo
 *
 *                       cnpj:
 *                         type: string
 *                         nullable: true
 *                         example: "12345678000199"
 *
 *                       logradouro:
 *                         type: string
 *                         nullable: true
 *                         example: Avenida Paulista
 *
 *                       nro:
 *                         type: string
 *                         nullable: true
 *                         example: "1000"
 *
 *                       complemento:
 *                         type: string
 *                         nullable: true
 *                         example: 10º andar
 *
 *                       bairro:
 *                         type: string
 *                         nullable: true
 *                         example: Bela Vista
 *
 *                       cidade:
 *                         type: string
 *                         nullable: true
 *                         example: São Paulo
 *
 *                       uf:
 *                         type: string
 *                         nullable: true
 *                         example: SP
 *
 *                       cep:
 *                         type: string
 *                         nullable: true
 *                         example: "01310100"
 *
 *                       nro_funcionarios:
 *                         type: integer
 *                         nullable: true
 *                         example: 250
 *
 *                       dt_alteracao:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *
 *                       dt_cadastro:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *
 *                   _count:
 *                     type: object
 *                     properties:
 *                       questionarios:
 *                         type: integer
 *                         description: Quantidade de questionários respondidos
 *                         example: 35
 *
 *                   periodo:
 *                     type: object
 *                     properties:
 *                       disponivel:
 *                         type: boolean
 *                         example: true
 *
 *                       status:
 *                         type: string
 *                         enum:
 *                           - NAO_INICIADA
 *                           - EM_ANDAMENTO
 *                           - ENCERRADA
 *                           - SEM_PERIODO
 *                         example: EM_ANDAMENTO
 *
 *                       msg:
 *                         type: string
 *                         example: Pesquisa disponível.
 *
 *       500:
 *         description: Erro interno ao listar as pesquisas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro ao listar pesquisas.
 */
router.get("/pesquisas", listarPesquisas);

//###############################################################################

/**
 * @swagger
 * /pesquisas/{id}:
 *   get:
 *     summary: Busca uma pesquisa pelo ID
 *     description: >
 *       Retorna os dados de uma pesquisa específica,
 *       incluindo os dados da instituição e a situação
 *       atual do período da pesquisa.
 *     tags:
 *       - Pesquisas
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da pesquisa
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Pesquisa encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *
 *                 dt_cadastro_pesquisa:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *
 *                 nm_responsavel:
 *                   type: string
 *                   nullable: true
 *                   example: Maria da Silva
 *
 *                 email_responsavel:
 *                   type: string
 *                   format: email
 *                   nullable: true
 *                   example: maria@hospital.com.br
 *
 *                 ddd_responsavel:
 *                   type: string
 *                   nullable: true
 *                   example: "11"
 *
 *                 fone_responsavel:
 *                   type: string
 *                   nullable: true
 *                   example: "999999999"
 *
 *                 cargo_responsavel:
 *                   type: string
 *                   nullable: true
 *                   example: Coordenadora de Enfermagem
 *
 *                 nro_funcionarios:
 *                   type: integer
 *                   nullable: true
 *                   example: 250
 *
 *                 dt_inicio_pesquisa:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *
 *                 dt_fechamento_pesquisa:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *
 *                 fechado:
 *                   type: string
 *                   nullable: true
 *                   example: "N"
 *
 *                 nome_arte:
 *                   type: string
 *                   nullable: true
 *
 *                 nome_arte_original:
 *                   type: string
 *                   nullable: true
 *
 *                 id_area_instituicao:
 *                   type: integer
 *                   nullable: true
 *
 *                 id_instituicoes:
 *                   type: integer
 *                   example: 25
 *
 *                 instituicao:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 25
 *
 *                     ds_instituicao:
 *                       type: string
 *                       nullable: true
 *
 *                     razao_social:
 *                       type: string
 *                       example: Hospital Exemplo Ltda
 *
 *                     nome_fantasia:
 *                       type: string
 *                       nullable: true
 *                       example: Hospital Exemplo
 *
 *                     cnpj:
 *                       type: string
 *                       nullable: true
 *                       example: "12345678000199"
 *
 *                     logradouro:
 *                       type: string
 *                       nullable: true
 *
 *                     nro:
 *                       type: string
 *                       nullable: true
 *
 *                     complemento:
 *                       type: string
 *                       nullable: true
 *
 *                     bairro:
 *                       type: string
 *                       nullable: true
 *
 *                     cidade:
 *                       type: string
 *                       nullable: true
 *
 *                     uf:
 *                       type: string
 *                       nullable: true
 *
 *                     cep:
 *                       type: string
 *                       nullable: true
 *
 *                     nro_funcionarios:
 *                       type: integer
 *                       nullable: true
 *
 *                     dt_alteracao:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *                     dt_cadastro:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *                 periodo:
 *                   type: object
 *                   properties:
 *                     disponivel:
 *                       type: boolean
 *                       example: true
 *
 *                     status:
 *                       type: string
 *                       enum:
 *                         - NAO_INICIADA
 *                         - EM_ANDAMENTO
 *                         - ENCERRADA
 *                         - SEM_PERIODO
 *                       example: EM_ANDAMENTO
 *
 *                     msg:
 *                       type: string
 *                       example: Pesquisa disponível.
 *
 *       400:
 *         description: ID da pesquisa inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pesquisa inválida.
 *
 *       404:
 *         description: Pesquisa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pesquisa não encontrada
 *
 *       500:
 *         description: Erro interno ao buscar a pesquisa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro ao buscar pesquisa.
 */
router.get("/pesquisas/:id", obterPesquisa);

//###############################################################################

/**
 * @swagger
 * /pesquisas:
 *   post:
 *     summary: Cadastra uma nova pesquisa
 *     description: >
 *       Cadastra uma nova pesquisa de Ambiente de Trabalho e Burnout.
 *       Caso a instituição ainda não exista, ela será cadastrada.
 *       Caso já exista pelo CNPJ, seus dados serão atualizados.
 *     tags:
 *       - Pesquisas
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cnpj
 *             properties:
 *               cnpj:
 *                 type: string
 *                 description: CNPJ da instituição
 *                 example: "12345678000199"
 *
 *               razao_social:
 *                 type: string
 *                 example: Hospital Exemplo Ltda
 *
 *               nome_fantasia:
 *                 type: string
 *                 nullable: true
 *                 example: Hospital Exemplo
 *
 *               logradouro:
 *                 type: string
 *                 nullable: true
 *                 example: Avenida Paulista
 *
 *               nro:
 *                 type: string
 *                 nullable: true
 *                 example: "1000"
 *
 *               complemento:
 *                 type: string
 *                 nullable: true
 *                 example: 10º andar
 *
 *               bairro:
 *                 type: string
 *                 nullable: true
 *                 example: Bela Vista
 *
 *               cidade:
 *                 type: string
 *                 nullable: true
 *                 example: São Paulo
 *
 *               uf:
 *                 type: string
 *                 nullable: true
 *                 example: SP
 *
 *               cep:
 *                 type: string
 *                 nullable: true
 *                 example: "01310100"
 *
 *               nro_funcionarios:
 *                 type: integer
 *                 nullable: true
 *                 example: 250
 *
 *               nm_responsavel:
 *                 type: string
 *                 nullable: true
 *                 example: Maria da Silva
 *
 *               email_responsavel:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 example: maria@hospital.com.br
 *
 *               ddd_responsavel:
 *                 type: string
 *                 nullable: true
 *                 example: "11"
 *
 *               fone_responsavel:
 *                 type: string
 *                 nullable: true
 *                 example: "999999999"
 *
 *               cargo_responsavel:
 *                 type: string
 *                 nullable: true
 *                 example: Coordenadora de Enfermagem
 *
 *               dt_inicio_pesquisa:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "2026-10-10"
 *
 *               dt_fechamento_pesquisa:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "2026-10-31"
 *
 *               id_area_instituicao:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *
 *     responses:
 *       201:
 *         description: Pesquisa cadastrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pesquisa cadastrada
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *
 *                     dt_cadastro_pesquisa:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *                     nm_responsavel:
 *                       type: string
 *                       nullable: true
 *
 *                     email_responsavel:
 *                       type: string
 *                       nullable: true
 *
 *                     ddd_responsavel:
 *                       type: string
 *                       nullable: true
 *
 *                     fone_responsavel:
 *                       type: string
 *                       nullable: true
 *
 *                     cargo_responsavel:
 *                       type: string
 *                       nullable: true
 *
 *                     nro_funcionarios:
 *                       type: integer
 *                       nullable: true
 *
 *                     dt_inicio_pesquisa:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *                     dt_fechamento_pesquisa:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *                     fechado:
 *                       type: string
 *                       nullable: true
 *
 *                     nome_arte:
 *                       type: string
 *                       nullable: true
 *
 *                     nome_arte_original:
 *                       type: string
 *                       nullable: true
 *
 *                     id_area_instituicao:
 *                       type: integer
 *                       nullable: true
 *
 *                     id_instituicoes:
 *                       type: integer
 *                       example: 25
 *
 *       400:
 *         description: CNPJ não informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: CNPJ é obrigatório
 *
 *       409:
 *         description: Já existe uma pesquisa para a instituição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Já existe pesquisa de Ambiente/Burnout para esta instituição
 *
 *                 data:
 *                   type: object
 *                   description: Dados da pesquisa já existente
 *
 *       500:
 *         description: Erro interno ao cadastrar a pesquisa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro ao cadastrar pesquisa
 *
 *                 error:
 *                   type: string
 *                   example: Mensagem interna do erro
 */
router.post("/pesquisas", criarPesquisa);

//###############################################################################

/**
 * @swagger
 * /pesquisas/{id}/enviar-link:
 *   post:
 *     summary: Envia o link da pesquisa por e-mail
 *     description: >
 *       Envia para o e-mail do responsável os links relacionados
 *       à pesquisa de Ambiente de Trabalho e Burnout.
 *     tags:
 *       - E-mail
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da pesquisa
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: E-mail enviado com sucesso.
 *
 *       400:
 *         description: Pesquisa inválida ou sem e-mail do responsável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: A pesquisa não possui e-mail do responsável.
 *
 *       404:
 *         description: Pesquisa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pesquisa não encontrada.
 *
 *       500:
 *         description: Erro interno ao enviar o e-mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Não foi possível enviar o e-mail.
 */
router.post("/pesquisas/:id/enviar-link", enviarLinkPesquisa);

//###############################################################################
// QUESTIONÁRIOS
//###############################################################################

/**
 * @swagger
 * /questionarios/pesquisa/{id}:
 *   get:
 *     summary: Lista os questionários de uma pesquisa
 *     description: >
 *       Retorna todos os questionários respondidos vinculados
 *       a uma determinada pesquisa de Ambiente de Trabalho e Burnout.
 *       Antes de buscar os questionários, verifica se o ID informado
 *       é válido e se a pesquisa existe.
 *     tags:
 *       - Questionários
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da pesquisa
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Questionários encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 100
 *
 *                   dt_cadastro_pesquisa:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-10-06T14:00:00.000Z"
 *
 *                   inf_perfil:
 *                     type: integer
 *                     nullable: true
 *                     example: 1
 *
 *                   inf_tempo_formacao_area_enfermagem:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   inf_titulo_graduacao:
 *                     type: integer
 *                     nullable: true
 *                     example: 1
 *
 *                   inf_cargo_enfermeiro:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   inf_cargo_tecnico:
 *                     type: integer
 *                     nullable: true
 *                     example: null
 *
 *                   inf_tempo_trabalho_instituicao:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   inf_tempo_trabalho_cargo:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   inf_area_trabalho:
 *                     type: integer
 *                     nullable: true
 *                     example: 1
 *
 *                   inf_escala_trabalho:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   inf_turno_trabalho:
 *                     type: integer
 *                     nullable: true
 *                     example: 1
 *
 *                   inf_outro_vinculo:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_01:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_02:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_03:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   pesnwi_04:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_05:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_06:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_07:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   pesnwi_08:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_09:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_10:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_11:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_12:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   pesnwi_13:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_14:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_15:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_16:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   pesnwi_17:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_18:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_19:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_20:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_21:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   pesnwi_22:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_23:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_24:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_25:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   pesnwi_26:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_27:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_28:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   pesnwi_29:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   pesnwi_30:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   pesnwi_31:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_01:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_02:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   burnout_03:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   burnout_04:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_05:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   burnout_06:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_07:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   burnout_08:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   burnout_09:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_10:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_11:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   burnout_12:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   burnout_13:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_14:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   burnout_15:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_16:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   burnout_17:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   burnout_18:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_19:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   burnout_20:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *
 *                   burnout_21:
 *                     type: integer
 *                     nullable: true
 *                     example: 4
 *
 *                   burnout_22:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *
 *                   id_pesquisa_ambiente_burnout:
 *                     type: integer
 *                     example: 10
 *
 *       400:
 *         description: ID da pesquisa inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pesquisa inválida.
 *
 *       404:
 *         description: Pesquisa não encontrada ou sem questionários respondidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *
 *             examples:
 *               pesquisaNaoEncontrada:
 *                 summary: Pesquisa não encontrada
 *                 value:
 *                   msg: Pesquisa não encontrada.
 *
 *               semQuestionarios:
 *                 summary: Pesquisa sem questionários respondidos
 *                 value:
 *                   msg: Não existem questionários respondidos para esta pesquisa.
 *
 *       500:
 *         description: Erro interno ao listar os questionários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro ao listar questionários da pesquisa.
 *
 *                 error:
 *                   type: string
 *                   example: Mensagem interna do erro
 */
router.get("/questionarios/pesquisa/:id", listarPorPesquisa);
//###############################################################################

/**
 * @swagger
 * /questionarios:
 *   post:
 *     summary: Registra as respostas de um questionário
 *     description: >
 *       Registra os dados do perfil do participante,
 *       as 31 respostas do PES-NWI e as 22 respostas
 *       relacionadas ao Burnout.
 *     tags:
 *       - Questionários
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_pesquisa_ambiente_burnout
 *
 *             properties:
 *               id_pesquisa_ambiente_burnout:
 *                 type: integer
 *                 description: ID da pesquisa
 *                 example: 10
 *
 *               inf_perfil:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_tempo_formacao_area_enfermagem:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_titulo_graduacao:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_cargo_enfermeiro:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_cargo_tecnico:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_tempo_trabalho_instituicao:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_tempo_trabalho_cargo:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_area_trabalho:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_escala_trabalho:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_turno_trabalho:
 *                 type: integer
 *                 nullable: true
 *
 *               inf_outro_vinculo:
 *                 type: integer
 *                 nullable: true
 *
 *               pesnwi_01:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_02:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_03:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_04:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_05:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_06:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_07:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_08:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_09:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_10:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_11:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_12:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_13:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_14:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_15:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_16:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_17:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_18:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_19:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_20:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_21:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_22:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_23:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_24:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_25:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_26:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_27:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_28:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_29:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_30:
 *                 type: integer
 *                 nullable: true
 *               pesnwi_31:
 *                 type: integer
 *                 nullable: true
 *
 *               burnout_01:
 *                 type: integer
 *                 nullable: true
 *               burnout_02:
 *                 type: integer
 *                 nullable: true
 *               burnout_03:
 *                 type: integer
 *                 nullable: true
 *               burnout_04:
 *                 type: integer
 *                 nullable: true
 *               burnout_05:
 *                 type: integer
 *                 nullable: true
 *               burnout_06:
 *                 type: integer
 *                 nullable: true
 *               burnout_07:
 *                 type: integer
 *                 nullable: true
 *               burnout_08:
 *                 type: integer
 *                 nullable: true
 *               burnout_09:
 *                 type: integer
 *                 nullable: true
 *               burnout_10:
 *                 type: integer
 *                 nullable: true
 *               burnout_11:
 *                 type: integer
 *                 nullable: true
 *               burnout_12:
 *                 type: integer
 *                 nullable: true
 *               burnout_13:
 *                 type: integer
 *                 nullable: true
 *               burnout_14:
 *                 type: integer
 *                 nullable: true
 *               burnout_15:
 *                 type: integer
 *                 nullable: true
 *               burnout_16:
 *                 type: integer
 *                 nullable: true
 *               burnout_17:
 *                 type: integer
 *                 nullable: true
 *               burnout_18:
 *                 type: integer
 *                 nullable: true
 *               burnout_19:
 *                 type: integer
 *                 nullable: true
 *               burnout_20:
 *                 type: integer
 *                 nullable: true
 *               burnout_21:
 *                 type: integer
 *                 nullable: true
 *               burnout_22:
 *                 type: integer
 *                 nullable: true
 *
 *     responses:
 *       201:
 *         description: Questionário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Questionário registrado com sucesso
 *
 *                 data:
 *                   type: object
 *                   description: Questionário registrado no banco de dados
 *
 *       400:
 *         description: ID da pesquisa inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pesquisa inválida.
 *
 *       403:
 *         description: Pesquisa fora do período permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Esta pesquisa já foi concluída.
 *
 *                 status:
 *                   type: string
 *                   enum:
 *                     - NAO_INICIADA
 *                     - ENCERRADA
 *                     - SEM_PERIODO
 *                   example: ENCERRADA
 *
 *       404:
 *         description: Pesquisa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pesquisa não encontrada.
 *
 *       500:
 *         description: Erro interno ao gravar o questionário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro ao gravar questionário
 *
 *                 error:
 *                   type: string
 *                   example: Mensagem interna do erro
 */
router.post("/questionarios", criarQuestionario);

//###############################################################################
// RELATÓRIOS
//###############################################################################

/**
 * @swagger
 * /relatorios/{id}:
 *   get:
 *     summary: Gera os dados do relatório da pesquisa
 *     description: >
 *       Retorna os dados da pesquisa, instituição e os resultados
 *       calculados do Ambiente de Trabalho e Burnout.
 *     tags:
 *       - Relatórios
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da pesquisa
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pesquisa:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *
 *                     dtCadastro:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *                     dtInicio:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *                     dtFechamento:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *                     fechado:
 *                       type: string
 *                       nullable: true
 *                       example: "N"
 *
 *                     nroFuncionarios:
 *                       type: integer
 *                       nullable: true
 *                       example: 250
 *
 *                     responsavel:
 *                       type: object
 *                       properties:
 *                         nome:
 *                           type: string
 *                           nullable: true
 *                           example: Maria da Silva
 *
 *                         email:
 *                           type: string
 *                           format: email
 *                           nullable: true
 *                           example: maria@hospital.com.br
 *
 *                         ddd:
 *                           type: string
 *                           nullable: true
 *                           example: "11"
 *
 *                         telefone:
 *                           type: string
 *                           nullable: true
 *                           example: "999999999"
 *
 *                         cargo:
 *                           type: string
 *                           nullable: true
 *                           example: Coordenadora de Enfermagem
 *
 *                 instituicao:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *
 *                     cnpj:
 *                       type: string
 *                       nullable: true
 *
 *                     razao_social:
 *                       type: string
 *
 *                     nome_fantasia:
 *                       type: string
 *                       nullable: true
 *
 *                     logradouro:
 *                       type: string
 *                       nullable: true
 *
 *                     nro:
 *                       type: string
 *                       nullable: true
 *
 *                     complemento:
 *                       type: string
 *                       nullable: true
 *
 *                     bairro:
 *                       type: string
 *                       nullable: true
 *
 *                     cidade:
 *                       type: string
 *                       nullable: true
 *
 *                     uf:
 *                       type: string
 *                       nullable: true
 *
 *                     cep:
 *                       type: string
 *                       nullable: true
 *
 *                     nro_funcionarios:
 *                       type: integer
 *                       nullable: true
 *
 *                 participantes:
 *                   type: integer
 *                   example: 150
 *
 *                 caracteristicas:
 *                   type: object
 *                   nullable: true
 *                   description: Características calculadas dos participantes
 *
 *                 ambiente:
 *                   type: object
 *                   nullable: true
 *                   description: Resultados calculados do PES-NWI
 *
 *                 burnout:
 *                   type: object
 *                   nullable: true
 *                   description: Resultados calculados do Burnout
 *
 *                 msg:
 *                   type: string
 *                   nullable: true
 *                   example: Ainda não existem questionários respondidos para esta pesquisa.
 *
 *       400:
 *         description: ID da pesquisa inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: ID da pesquisa inválido
 *
 *       404:
 *         description: Pesquisa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pesquisa não encontrada
 *
 *       500:
 *         description: Erro interno ao gerar o relatório
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro ao gerar relatório
 */
router.get("/relatorios/:id", relatorio);

//###############################################################################

/**
 * @swagger
 * /relatorios/{id}/pdf:
 *   get:
 *     summary: Gera o relatório da pesquisa em PDF
 *     description: >
 *       Abre o relatório React utilizando o Playwright
 *       e gera o documento em formato PDF.
 *     tags:
 *       - Relatórios
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da pesquisa
 *         schema:
 *           type: integer
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       400:
 *         description: ID da pesquisa inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: ID da pesquisa inválido
 *
 *       500:
 *         description: Erro interno ao gerar o PDF
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro ao gerar PDF
 *
 *                 error:
 *                   type: string
 *                   example: Mensagem interna do erro
 */
router.get("/relatorios/:id/pdf", gerarRelatorioPdf);
