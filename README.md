# Ambiente Burnout

**Plataforma web para criação, aplicação e acompanhamento de pesquisas de ambiente e burnout**, com coleta de respostas, visualização de indicadores e geração de relatórios em PDF.

O projeto utiliza uma arquitetura full stack com **React + TypeScript**, **Node.js + Express**, **Prisma ORM**, **MySQL 8** e **Docker Compose**. O ambiente de desenvolvimento utiliza Vite; o ambiente de produção entrega o frontend compilado por meio do Nginx.

> **Status:** desenvolvimento e produção local configurados. A publicação em nuvem, domínio próprio e HTTPS são etapas de implantação a realizar.

## Funcionalidades

- Cadastro e listagem de pesquisas, com identificação do responsável.
- Cadastro de informações institucionais e consulta de CEP no formulário.
- Aplicação de questionários por link compartilhável.
- Envio do link da pesquisa por e-mail, utilizando SMTP/Nodemailer.
- Disponibilização de QR Code para acesso ao questionário.
- Consulta das respostas e indicadores das pesquisas.
- Relatórios com gráficos e visualização no navegador.
- Geração de relatórios PDF com Playwright/Chromium, visualizados em modal com indicador de carregamento e opção de download.
- Documentação da API com Swagger (quando habilitada na aplicação).

## Tecnologias

| Camada         | Tecnologias                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| Frontend       | React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, Lucide React |
| Backend        | Node.js 24, Express 5, TypeScript, Nodemailer                               |
| Persistência   | MySQL 8, Prisma ORM 7, adaptador MariaDB                                    |
| Relatórios     | Playwright, Chromium, bibliotecas de gráficos                               |
| Infraestrutura | Docker, Docker Compose, Nginx (produção)                                    |

## Arquitetura

### Desenvolvimento

```text
Navegador ── localhost:5173 ── React / Vite
                                    │
                                    ▼
                              localhost:3500
                              Node.js / Express
                                    │
                                    ▼
                              MySQL no Docker
                              host: localhost:3307
                              rede Docker: mysql:3306
```

### Produção

```text
Navegador ── localhost:8080 ── Nginx ── React compilado
                                    │
                                    └── /api/* ── backend:3500
                                                     │
                                                     └── mysql:3306

Playwright no backend ── http://frontend/relatorio/:id
```

Na produção, Nginx e backend comunicam-se pela rede interna do Compose. O MySQL e a API não precisam ter portas expostas publicamente. O HTTPS poderá ser adicionado com um proxy reverso, como Caddy, quando houver domínio e servidor acessível.

## Pré-requisitos

- Docker Desktop com Docker Compose (Windows 11) ou Docker Engine + Compose (Linux).
- Git, para clonar o repositório.
- Acesso a um servidor SMTP para o envio de links por e-mail.
- Portas **5173, 3500 e 3307** disponíveis para desenvolvimento; **8080** para a produção local.

> Os comandos abaixo devem ser executados na raiz do repositório, onde estão os arquivos `compose.yml` e `compose.prod.yml`.

## Estrutura do projeto

```text
ambiente-burnout/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── nginx.conf
│   └── package.json
├── compose.yml
├── compose.prod.yml
├── .env.docker           # local, não versionar
└── .env.production       # local, não versionar
```

## Instalação — desenvolvimento

### 1. Clonar o repositório

```bash
git clone https://github.com/epcosta/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

> Substitua `SEU-REPOSITORIO` pelo nome real do repositório publicado no GitHub.

### 2. Criar `.env.docker`

Na raiz do projeto:

```dotenv
MYSQL_ROOT_PASSWORD=defina-uma-senha-local
MYSQL_DATABASE=db_epcosta

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-do-aplicativo-email
SMTP_FROM=seu-email@gmail.com
```

Use os valores de banco e SMTP apropriados para seu ambiente. Para Gmail, normalmente é necessário usar uma **senha de aplicativo** em vez da senha normal da conta.

### 3. Construir e iniciar os containers

```bash
docker compose --env-file .env.docker -f compose.yml up -d --build
```

### 4. Preparar o banco de desenvolvimento

Confira as migrations antes de aplicá-las:

```bash
docker compose --env-file .env.docker -f compose.yml exec backend npx prisma migrate status
```

Para aplicar as migrations pendentes:

```bash
docker compose --env-file .env.docker -f compose.yml exec backend npx prisma migrate deploy
```

O ambiente de desenvolvimento pode utilizar o seed do projeto para carregar dados de teste. **A execução exata do seed depende do script configurado no repositório**; não execute seeds contra o banco de produção.

### 5. Acessar

| Serviço                         | Endereço                  |
| ------------------------------- | ------------------------- |
| Frontend                        | http://localhost:5173     |
| API                             | http://localhost:3500/api |
| MySQL (acesso a partir do host) | `localhost:3307`          |

O Vite utiliza hot reload e os diretórios do código são montados como volumes, permitindo acompanhar alterações durante o desenvolvimento.

## Instalação — produção local

A produção usa imagens próprias, código compilado e **volume de MySQL separado** do desenvolvimento.

### 1. Criar `.env.production`

```dotenv
MYSQL_ROOT_PASSWORD=defina-uma-senha-forte-e-exclusiva
MYSQL_DATABASE=db_epcosta

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-aplicativo
SMTP_FROM=seu-email@gmail.com
```

> Não copie credenciais reais para o README nem envie arquivos `.env` ao GitHub. O nome `db_epcosta` corresponde à configuração testada; altere-o somente de maneira consistente com o Compose e com o banco pretendido.

### 2. Validar e construir as imagens

```bash
docker compose --env-file .env.production -f compose.prod.yml config

docker compose --env-file .env.production -f compose.prod.yml build
```

O build do frontend executa `tsc -b && vite build`; a imagem final usa Nginx. O backend gera o Prisma Client, compila TypeScript e inicia com `node dist/server.js`. O Dockerfile de produção do backend precisa manter o Chromium instalado para o Playwright.

**Prisma 7 durante o build:** se `prisma.config.ts` exigir `DATABASE_URL` no comando `prisma generate`, use uma URL fictícia apenas nessa etapa, sem incluir credenciais reais na imagem:

```dockerfile
RUN DATABASE_URL="mysql://build:build@localhost:3306/build" npx prisma generate
```

Essa URL não é utilizada pelo backend em execução; a conexão real é fornecida pelas variáveis do Compose.

### 3. Iniciar os serviços

```bash
docker compose --env-file .env.production -f compose.prod.yml up -d
```

### 4. Criar a estrutura do banco

Verifique as migrations:

```bash
docker compose --env-file .env.production -f compose.prod.yml exec backend npx prisma migrate status
```

Após revisar o SQL das migrations, aplique as pendentes:

```bash
docker compose --env-file .env.production -f compose.prod.yml exec backend npx prisma migrate deploy
```

Confirme:

```bash
docker compose --env-file .env.production -f compose.prod.yml exec backend npx prisma migrate status
```

**Não executar seed em produção.** O banco deve iniciar apenas com as tabelas e receber instituições, pesquisas e respostas por meio da própria aplicação.

### 5. Acessar

**http://localhost:8080**

O Nginx serve os arquivos estáticos e encaminha `/api/*` para o backend pela rede interna. A variável de compilação do Vite deve ser `VITE_API_URL=/api`, evitando URLs `localhost:3500` no navegador de produção.

### 6. Testes de validação

- Abrir a página inicial e navegar entre rotas do React Router.
- Cadastrar uma pesquisa legítima.
- Gerar e enviar um link por e-mail.
- Responder ao questionário e conferir os resultados.
- Visualizar e baixar o PDF pelo modal.
- Confirmar que o Playwright acessa `http://frontend` dentro da rede Docker.

Para testes com dados fictícios, prefira um ambiente de homologação separado da produção real.

## Operação e logs

### Desenvolvimento

```bash
docker compose --env-file .env.docker -f compose.yml ps
docker compose --env-file .env.docker -f compose.yml logs -f backend
```

### Produção

```bash
docker compose --env-file .env.production -f compose.prod.yml ps
docker compose --env-file .env.production -f compose.prod.yml logs -f backend
docker compose --env-file .env.production -f compose.prod.yml logs --tail=100 frontend
```

Atualizar somente o backend após alterações no código:

```bash
docker compose --env-file .env.production -f compose.prod.yml up -d --build backend
```

Atualizar o frontend:

```bash
docker compose --env-file .env.production -f compose.prod.yml up -d --build frontend
```

**Atenção:** não use `docker compose down -v` no ambiente de produção. Esse comando pode remover volumes e causar perda dos dados do MySQL.

## Configuração de e-mail

O backend utiliza as variáveis `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` e `SMTP_FROM`. Após alterá-las em `.env.production`, recrie o container para carregar os novos valores:

```bash
docker compose --env-file .env.production -f compose.prod.yml up -d --no-deps --force-recreate backend
```

Um erro SMTP `535 5.7.8` indica rejeição das credenciais pelo provedor; confira usuário, senha de aplicativo e políticas da conta, sem imprimir senhas nos logs.

## Publicação na internet (planejada)

Para disponibilizar a aplicação externamente, ainda serão necessários:

1. Servidor em nuvem com recursos suficientes para MySQL e Chromium.
2. Domínio com registro DNS apontando para o IP público do servidor.
3. Proxy reverso com HTTPS (por exemplo, Caddy) e portas 80/443 liberadas.
4. Configuração da URL pública utilizada nos links enviados por e-mail.
5. Política de backups, restauração e atualização de segurança.
6. Revisão de autenticação, autorização, exposição de rotas e tratamento de dados das pesquisas antes da abertura pública.

> **Privacidade:** pesquisas sobre burnout podem conter informações sensíveis. Antes de operar publicamente, revise controles de acesso, consentimento, retenção de dados e requisitos aplicáveis da LGPD.

## Cuidados de segurança

- Não versionar `.env.docker`, `.env.production` ou segredos.
- Utilizar senhas diferentes para desenvolvimento e produção.
- Restringir o acesso ao MySQL à rede interna do Docker em produção.
- Revisar alertas de `npm audit` antes da publicação pública.
- Fazer backups regulares e testar o procedimento de restauração.
- Não carregar dados fictícios via seed na produção real.
- Não apagar volumes Docker sem um backup confirmado.

## Licença

A definir pelo mantenedor do repositório.
