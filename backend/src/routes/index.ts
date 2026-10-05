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
router.get("/health", (_q, s) => s.json({ status: "ok" }));

router.get("/pesquisas", listarPesquisas);
router.get("/pesquisas/:id", obterPesquisa);
router.post("/pesquisas", criarPesquisa);
router.post("/pesquisas/:id/enviar-link", enviarLinkPesquisa);

router.get("/questionarios/pesquisa/:id", listarPorPesquisa);
router.post("/questionarios", criarQuestionario);

router.get("/relatorios/:id", relatorio);
router.get("/relatorios/:id/pdf", gerarRelatorioPdf);
