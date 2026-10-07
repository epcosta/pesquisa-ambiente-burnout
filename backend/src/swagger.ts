import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",

    info: {
      title: "API - Pesquisa Ambiente de Trabalho e Burnout",
      version: "1.0.0",
      description:
        "API responsável pelo cadastro de pesquisas, questionários, envio de links e geração de relatórios.",
    },

    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor de desenvolvimento",
      },
    ],
  },

  apis: ["./src/routes/*.ts"],
});
