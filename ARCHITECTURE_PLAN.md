# AI Resume Analyzer SaaS — Implementation Plan

## Information Gathered
- Current workspace is empty (`c:/Users/VIJAY/Ai resume analyzer`).
- Full application must be built from scratch.
- Required architecture: `client/`, `server/`, `shared/` with enterprise-quality modularity.
- Required stack includes React + Vite + TypeScript frontend and Express + TypeScript backend.
- Must include AI analysis engine abstraction with OpenAI provider and swappable provider design.
- Must include PostgreSQL + Prisma, JWT auth, Google OAuth, secure upload pipeline, OCR hook, ATS analytics, charts, reports, and deployment readiness via Docker.

## Plan

### Phase 1 — Monorepo Foundation
1. Create root workspace structure:
   - `client/`, `server/`, `shared/`, `docker/`, `.github/`, docs files.
2. Add root-level workspace config:
   - `package.json` (workspaces), `.gitignore`, `.editorconfig`, `.prettierrc`, `README.md`.
3. Add shared TypeScript package for reusable schemas/types/constants:
   - Zod contracts for API responses and AI output.

### Phase 2 — Backend (Production-ready baseline)
1. Initialize `server/` with:
   - Express, TypeScript, Prisma, JWT, Passport Google OAuth, Helmet, CORS, rate limiting, compression, cookie parser, multer, zod validation.
2. Implement enterprise folder structure:
   - `src/app`, `config`, `modules`, `middlewares`, `utils`, `services`, `providers`, `jobs`, `types`.
3. Security:
   - Helmet, CORS allowlist, rate limiter, request size limits, centralized validation/error handling, secure headers.
4. Authentication:
   - Email login/register + hashed passwords + refresh/access JWT flow.
   - Google OAuth endpoint placeholders and callback flow.
5. Resume ingestion:
   - Upload endpoint with file type validation, safe filename generation, size limits, malware scan hook function.
6. Parsing:
   - PDF parser service, DOCX parser service, OCR adapter hook (stub with interface + future provider integration).
7. AI analysis domain:
   - Provider abstraction (`LLMProvider`), OpenAI implementation, structured prompt templates, JSON schema validation.
8. Core analytics endpoints:
   - Analyze resume
   - ATS analysis
   - JD matching
   - Bullet rewrite suggestions
   - Career coach recommendations
9. Prisma schema:
   - User, Session, Resume, ResumeVersion, Analysis, Report, Notification, ChatMessage.
10. Logging and observability:
   - Structured logger utility + request logging middleware.
11. Testing-ready setup:
   - Jest/Vitest baseline and health endpoint.

### Phase 3 — Frontend (Premium SaaS UX)
1. Initialize `client/` with React 19 + Vite + TypeScript + Tailwind.
2. Add architecture:
   - `src/components`, `features`, `hooks`, `services`, `api`, `store`, `lib`, `types`, `utils`, `constants`, `assets`, `pages`.
3. Design system:
   - Theme tokens, dark/light mode, glassmorphism cards, gradient backgrounds, typography scale, spacing system.
4. Routing + auth guards:
   - Public landing/auth pages and protected dashboard routes.
5. Pages:
   - Landing, Login/Register/Forgot, Dashboard, Upload, Analysis Detail, Reports, Settings/Profile.
6. Interactions:
   - Framer Motion + GSAP tasteful animations; skeleton loaders; micro-interactions.
7. Data layer:
   - React Query API clients + Zustand app/session state.
8. Upload and preview:
   - drag-drop, progress UI, preview, replace/delete.
9. Visualizations:
   - ATS gauge, skill radar, score breakdown, trend charts.
10. Accessibility:
   - Keyboard nav, ARIA labels, color contrast constraints, focus states.

### Phase 4 — Shared Business Contracts
1. Add shared zod schemas for:
   - AI response structure
   - ATS report format
   - JD match report
   - API response envelopes and error contracts.
2. Use shared contracts in frontend and backend for strict type safety.

### Phase 5 — DevOps and Deployment
1. Docker:
   - `client` Dockerfile, `server` Dockerfile, `docker-compose.yml` with Postgres.
2. Environment:
   - `.env.example` files for root/client/server.
3. Deployment docs:
   - Vercel frontend + Railway/Render backend + managed Postgres.
4. Build/test scripts and CI-ready commands.

### Phase 6 — Documentation and Polish
1. Comprehensive README:
   - setup, architecture, env vars, scripts, testing, deployment.
2. Security and scalability notes.
3. Future roadmap for premium additions (GitHub analyzer, LinkedIn suggestions, multilingual, offline drafts, realtime notifications).

## Dependent Files to be Created/Edited
- Root:
  - `package.json`, `README.md`, `.gitignore`, `.editorconfig`, `.prettierrc`, `ARCHITECTURE_PLAN.md`
- `shared/` package files
- `server/` full source + config + Prisma
- `client/` full source + styling + routes + components
- Docker and deployment files

## Follow-up Steps After Approval
1. Create `TODO.md` with granular execution checklist.
2. Implement project structure and root configs.
3. Implement shared package.
4. Implement server.
5. Implement client.
6. Add Docker + docs.
7. Final verification and handoff.
