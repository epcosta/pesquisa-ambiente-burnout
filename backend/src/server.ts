import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

import { router } from "./routes/index.js";
import { prisma } from "./lib/prisma.js";
const app = express();
const port = Number(process.env.PORT ?? 3000);
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use("/api", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((_req, res) => res.status(404).json({ msg: "Rota não encontrada" }));

async function startServer() {
  try {
    // Testa a conexão com o banco
    await prisma.$connect();

    console.log("✅ Banco de dados conectado com sucesso!");

    app.listen(port, () => {
      console.log(`🚀 API: http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:");
    console.error(error);

    process.exit(1);
  }
}

startServer();
