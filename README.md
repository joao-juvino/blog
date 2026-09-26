# Juvino Tech

Blog técnico fullstack criado como projeto de portfólio: uma experiência editorial moderna para leitores e um estúdio Markdown completo para administração. A aplicação combina Angular, Spring Boot e PostgreSQL, com autenticação JWT, conteúdo pesquisável, taxonomia, projetos relacionados e upload seguro para o Supabase Storage.

> **Screenshot:** após personalizar seus dados, adicione uma captura da home em `docs/screenshot.png` e substitua este aviso por `![Juvino Tech](docs/screenshot.png)`.

## Funcionalidades

- Home editorial com hero, destaques, tecnologias e projetos configuráveis.
- Artigos com busca no título, resumo e conteúdo; filtros compartilháveis por categoria e tag; paginação.
- Markdown sanitizado, syntax highlighting, botão de cópia, índice automático e conteúdo relacionado.
- Tema claro/escuro persistido e preferência do sistema, layout responsivo e foco visível.
- Metadados dinâmicos, canonical, Open Graph, `robots.txt`, sitemap-base e URLs amigáveis.
- Administração protegida por JWT: dashboard, criação, edição, exclusão confirmada, rascunho e publicação.
- Editor Markdown em duas colunas com preview em tempo real e toolbar.
- Gerenciamento de categorias, tags e projetos; associação entre artigo e projeto.
- Slug único, tempo de leitura calculado, validação, erros padronizados e Swagger.
- Migrações Flyway e seed exclusivamente no perfil `dev`.
- Upload de imagens no Supabase Storage sem persistência no container.
- Docker Compose e CI no GitHub Actions.

## Stack

**Frontend:** Angular 20, TypeScript, RxJS, Marked, DOMPurify, Highlight.js.  
**Backend:** Java 17, Spring Boot 3.5, Security, JWT, Data JPA/Hibernate, Bean Validation, Springdoc.  
**Dados e entrega:** PostgreSQL 17, Flyway, Docker, GitHub Actions, Render e Supabase.

## Architecture

```text
Angular
   ↓
REST API
   ↓
Spring Boot
   ↓
PostgreSQL
```

A API usa controllers finos, services para regras de negócio, repositories JPA, DTOs na fronteira, filtro JWT e um handler global de erros. As entidades nunca são expostas diretamente. No frontend, rotas são carregadas sob demanda e serviços concentram API, autenticação e SEO.

Em produção:

```text
Render Static Site
        ↓
     Angular
        ↓
Render Web Service
        ↓
   Spring Boot
        ↓
Supabase PostgreSQL ── Supabase Storage
```

## Estrutura

```text
blog/
├── frontend/              # Angular
├── backend/               # Spring Boot + Flyway
├── .github/workflows/     # CI
├── docker-compose.yml
├── render.yaml
└── .env.example
```

## Executar localmente

### Docker (recomendado)

Copie `.env.example` para `.env`, use valores locais e execute:

```bash
docker compose up --build
```

- Site: http://localhost:8081
- API: http://localhost:8080/api
- Swagger (perfil dev): http://localhost:8080/swagger-ui.html
- PostgreSQL: `localhost:5432`

O Compose cria o administrador a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD`. A senha precisa ter pelo menos 10 caracteres.

### Sem Docker

Inicie um PostgreSQL e configure as variáveis de `.env.example` no terminal. Depois:

```bash
cd backend
mvn spring-boot:run
```

Em outro terminal:

```bash
cd frontend
npm ci
npm start
```

Abra http://localhost:4200. O ambiente de desenvolvimento Angular aponta para `http://localhost:8080/api`.

## Configuração e credenciais

| Variável | Uso |
|---|---|
| `DATABASE_URL` | URL JDBC do PostgreSQL |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | Credenciais do banco |
| `JWT_SECRET` | Chave aleatória com pelo menos 32 bytes |
| `JWT_EXPIRATION_MS` | Validade do token; padrão 1 hora |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas, separadas por vírgula |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Bootstrap do primeiro administrador |
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` | Backend do Storage |
| `SUPABASE_STORAGE_BUCKET` | Bucket público de imagens |

Não existe cadastro público. Na primeira inicialização, o backend cria o usuário somente se `ADMIN_EMAIL` e uma senha forte forem fornecidos. O hash BCrypt é persistido; a senha não é armazenada no código. Depois da criação, remova `ADMIN_PASSWORD` do ambiente se o provedor permitir. Nunca coloque a service key do Supabase no frontend.

## API

Principais rotas públicas:

- `GET /api/posts` — `q`, `category`, `tag`, `featured`, `page` e `size`.
- `GET /api/posts/{slug}`
- `GET /api/categories`, `/api/tags`, `/api/projects`
- `POST /api/auth/login`

As rotas `/api/admin/**` exigem `Authorization: Bearer <token>`. No perfil `dev`, use o Swagger para explorar contratos e validações.

## Testes

```bash
cd backend
mvn test

cd ../frontend
npm run lint
npm test
```

O backend cobre slug, tempo de leitura, autenticação, publicação, cálculo automático e duplicidade de slug com JUnit/Mockito. O frontend cobre a propagação segura do JWT; componentes e serviços foram estruturados para testes isolados. O pipeline executa testes e builds em pushes e pull requests.

## Deploy

### Supabase

1. Crie um projeto gratuito e copie a conexão PostgreSQL com SSL (prefira o pooler compatível com IPv4 no Render).
2. Crie um bucket público `blog-images` no Storage.
3. Guarde URL e service-role key somente nas variáveis do backend.
4. O Flyway cria o schema automaticamente ao iniciar; o perfil `prod` não carrega seed fictício.

### Backend no Render

Crie um Web Service pelo `render.yaml` ou pelo Dockerfile em `backend/`. Cadastre todas as variáveis da tabela acima, defina `SPRING_PROFILES_ACTIVE=prod` e use `/actuator/health` como health check. O Swagger fica desativado em produção.

### Frontend no Render

Antes do deploy, substitua os placeholders em `frontend/src/environments/environment.production.ts`, `robots.txt`, `sitemap.xml` e links `SEU-USUARIO`/`SEU-PORTFOLIO`. Crie um Static Site com:

```text
Build command: cd frontend && npm ci && npm run build
Publish directory: frontend/dist/juvino-tech/browser
Rewrite: /* → /index.html
```

No backend, atualize `CORS_ALLOWED_ORIGINS` com a URL final do site.

## Decisões técnicas

- DTOs e services mantêm regras fora dos controllers.
- `ddl-auto=validate` garante que o schema seja responsabilidade do Flyway.
- Conteúdo Markdown é sanitizado antes de entrar no DOM.
- A service key do Storage permanece no backend e uploads aceitam somente formatos de imagem conhecidos.
- Angular usa lazy loading e imagens com carregamento tardio; a API pagina resultados e possui índices para consultas frequentes.
- Dados pessoais desconhecidos são placeholders explícitos; nenhuma experiência foi inventada.

## Personalização necessária

Antes de publicar, substitua nome/cargo, biografia, links `SEU-USUARIO`, `SEU-PORTFOLIO`, URLs do Render, sitemap e descrições reais dos projetos. Esses são dados pessoais que o repositório original não fornecia, não pendências técnicas da aplicação.
