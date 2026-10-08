import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  port: Number(process.env.DATABASE_PORT ?? 3306),
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({
  adapter,
});

/*
|--------------------------------------------------------------------------
| Diretório dos arquivos CSV
|--------------------------------------------------------------------------
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDataPath = path.join(__dirname, "seed-data");

function lerCsv(nomeArquivo: string) {
  const caminho = path.join(seedDataPath, nomeArquivo);

  if (!fs.existsSync(caminho)) {
    throw new Error(`Arquivo não encontrado: ${caminho}`);
  }

  const conteudo = fs.readFileSync(caminho, "utf8");

  return parse(conteudo, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ";",
    trim: true,
  }) as Record<string, string>[];
}

/*
|--------------------------------------------------------------------------
| Conversões
|--------------------------------------------------------------------------
*/

function valorNull(valor: string | undefined): string | null {
  if (
    valor === undefined ||
    valor === "" ||
    valor === "\\N" ||
    valor === "NULL"
  ) {
    return null;
  }

  return valor;
}

function numero(valor: string | undefined): number | null {
  const resultado = valorNull(valor);

  if (resultado === null) {
    return null;
  }

  return Number(resultado);
}

function data(valor: string | undefined): Date | null {
  const resultado = valorNull(valor);

  if (resultado === null) {
    return null;
  }

  // Formato brasileiro: DD/MM/YYYY
  const formatoBr = resultado.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (formatoBr) {
    const [, dia, mes, ano] = formatoBr;

    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  // Formato ISO/MySQL: YYYY-MM-DD
  const formatoMysql = resultado.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (formatoMysql) {
    const [, ano, mes, dia] = formatoMysql;

    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  throw new Error(`Data inválida encontrada no seed: "${resultado}"`);
}

/*
|--------------------------------------------------------------------------
| Instituições
|--------------------------------------------------------------------------
*/

async function seedInstituicoes() {
  const registros = lerCsv("instituicoes.csv");

  const dados = registros.map((item) => ({
    id: Number(item.id),

    ds_instituicao: valorNull(item.ds_instituicao),
    razao_social: item.razao_social,
    nome_fantasia: valorNull(item.nome_fantasia),
    cnpj: null,

    logradouro: valorNull(item.logradouro),
    nro: valorNull(item.nro),
    complemento: valorNull(item.complemento),
    bairro: valorNull(item.bairro),
    cidade: valorNull(item.cidade),
    uf: valorNull(item.uf),
    cep: valorNull(item.cep),

    nro_funcionarios: numero(item.nro_funcionarios),

    dt_alteracao: data(item.dt_alteracao),
    dt_cadastro: data(item.dt_cadastro),
  }));

  const resultado = await prisma.instituicoes.createMany({
    data: dados,
    skipDuplicates: true,
  });

  console.log(`🏥 Instituições inseridas: ${resultado.count}`);
}

/*
|--------------------------------------------------------------------------
| Pesquisas
|--------------------------------------------------------------------------
*/

async function seedPesquisas() {
  const registros = lerCsv("pesquisas.csv");

  const dados = registros.map((item) => ({
    id: Number(item.id),

    dt_cadastro_pesquisa: data(item.dt_cadastro_pesquisa),

    nm_responsavel: valorNull(item.nm_responsavel),
    email_responsavel: valorNull(item.email_responsavel),
    ddd_responsavel: valorNull(item.ddd_responsavel),
    fone_responsavel: valorNull(item.fone_responsavel),
    cargo_responsavel: valorNull(item.cargo_responsavel),

    nro_funcionarios: numero(item.nro_funcionarios),

    dt_inicio_pesquisa: data(item.dt_inicio_pesquisa),
    dt_fechamento_pesquisa: data(item.dt_fechamento_pesquisa),

    fechado: valorNull(item.fechado),

    nome_arte: valorNull(item.nome_arte),
    nome_arte_original: valorNull(item.nome_arte_original),

    id_area_instituicao: numero(item.id_area_instituicao),

    id_instituicoes: Number(item.id_instituicoes),
  }));

  const resultado = await prisma.pesquisaAmbienteBurnout.createMany({
    data: dados,
    skipDuplicates: true,
  });

  console.log(`📋 Pesquisas inseridas: ${resultado.count}`);
}

/*
|--------------------------------------------------------------------------
| Questionários
|--------------------------------------------------------------------------
*/

async function seedQuestionarios() {
  const registros = lerCsv("questionarios.csv");

  const dados = registros.map((item) => {
    /*
     * Campos básicos do questionário.
     */
    const questionario: Record<string, number | Date | null> = {
      id: Number(item.id),

      dt_cadastro_pesquisa: data(item.dt_cadastro_pesquisa),

      id_pesquisa_ambiente_burnout: Number(item.id_pesquisa_ambiente_burnout),
    };

    for (const [campo, valor] of Object.entries(item)) {
      if (
        campo.startsWith("inf_") ||
        campo.startsWith("pesnwi_") ||
        campo.startsWith("burnout_")
      ) {
        questionario[campo] = numero(valor);
      }
    }

    return questionario;
  });

  const tamanhoLote = 250;

  let totalInseridos = 0;

  for (let i = 0; i < dados.length; i += tamanhoLote) {
    const lote = dados.slice(i, i + tamanhoLote);

    const resultado = await prisma.questionarioAmbienteBurnout.createMany({
      data: lote as any,
      skipDuplicates: true,
    });

    totalInseridos += resultado.count;
  }

  console.log(`📝 Questionários inseridos: ${totalInseridos}`);
}

/*
|--------------------------------------------------------------------------
| Execução do Seed
|--------------------------------------------------------------------------
*/

async function main() {
  console.log("");
  console.log("🌱 Iniciando seed...");
  console.log("");

  await seedInstituicoes();

  await seedPesquisas();

  await seedQuestionarios();

  console.log("");
  console.log("✅ Seed concluído com sucesso.");
  console.log("");
}

/*
|--------------------------------------------------------------------------
| Inicialização
|--------------------------------------------------------------------------
*/

main()
  .catch((error) => {
    console.error("");
    console.error("❌ Erro durante o seed:");
    console.error(error);
    console.error("");

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
