# TODO — AI Resume Analyzer SaaS

## Phase 1: Monorepo Foundation
- [x] Create root workspace configuration (`package.json`, `.gitignore`, formatting configs)
- [ ] Create folder skeleton (`client`, `server`, `shared`, `docker`)
- [ ] Create root documentation baseline (`README.md` placeholder, env strategy)

## Phase 2: Upload Workflow (Current Scope - Locked)
- [ ] Create upload page at `client/src/pages/UploadResumePage.tsx`
- [ ] Create upload components:
  - [ ] `client/src/components/upload/UploadDropzone.tsx`
  - [ ] `client/src/components/upload/UploadCard.tsx`
  - [ ] `client/src/components/upload/UploadProgress.tsx`
  - [ ] `client/src/components/upload/FilePreview.tsx`
  - [ ] `client/src/components/upload/UploadError.tsx`
  - [ ] `client/src/components/upload/SupportedFormats.tsx`
  - [ ] `client/src/components/upload/UploadActions.tsx`
- [ ] Add frontend routing:
  - [ ] `/` renders existing landing page
  - [ ] `/upload` renders upload page
  - [ ] Wire “Analyze Resume” button to navigate to `/upload`
- [ ] Implement frontend validation (Zod):
  - [ ] Allowed types: PDF, DOCX, TXT
  - [ ] Max size: 10MB
  - [ ] Reject empty file
  - [ ] Friendly error states
- [ ] Implement upload flow UI:
  - [ ] Drag & drop
  - [ ] Click to browse
  - [ ] Upload progress
  - [ ] File preview (name, ext, size, upload time)
  - [ ] Remove and replace actions
  - [ ] Success state
  - [ ] Retry on error
- [ ] Implement backend endpoint:
  - [ ] `POST /api/v1/upload`
  - [ ] Multipart receive using memory storage
  - [ ] Validate type/size/empty
  - [ ] Return `{ success: true, uploadId, filename, size }`
  - [ ] No DB persistence, no parsing, no AI/OCR/ATS
- [ ] Verify Phase 2:
  - [ ] `npm install`
  - [ ] `npm run build`
  - [ ] `npm run dev -w client`
  - [ ] `npm run dev -w server`
  - [ ] Manual checks for navigation, DnD, validation, success/error handling

## Phase 3: Backend (Express + TypeScript + Prisma)
- [x] Initialize server package and TS config
- [x] Add security middleware (helmet, cors, rate limiting, compression)
- [ ] Add auth module (email JWT + Google OAuth scaffolding)
- [ ] Add resume upload module with validation and scan hook
- [ ] Add parser services (PDF, DOCX, OCR adapter hook)
- [ ] Add AI provider abstraction + OpenAI provider
- [ ] Add analysis module endpoints (resume score, ATS, JD match, rewrite, career coach)
- [ ] Add Prisma schema and DB client wiring
- [ ] Add logging, error handling, validation middleware
- [ ] Add health endpoint and test-ready setup

## Phase 4: Frontend (React + Vite + Tailwind + TS)
- [ ] Initialize client package and Tailwind setup
- [ ] Build design system tokens/theme (dark/light mode)
- [ ] Build landing page (hero, features, testimonials, pricing, FAQ, footer)
- [ ] Build auth pages (login/register/forgot)
- [ ] Build protected dashboard shell
- [ ] Build upload flow (drag-drop, progress, preview)
- [ ] Build analysis pages with charts and score cards
- [ ] Build profile/settings/notifications pages
- [ ] Add React Query API clients and Zustand stores
- [ ] Add animations (Framer Motion + GSAP) and skeleton loaders
- [ ] Accessibility and responsive refinements

## Phase 5: DevOps & Deployment
- [ ] Add Dockerfiles (client/server) and docker-compose with Postgres
- [ ] Add env examples for all packages
- [ ] Add deployment docs for Vercel + Railway/Render
- [ ] Add scripts for lint, format, build, run

## Phase 6: Final Documentation & Polish
- [ ] Complete production README with architecture and setup
- [ ] Add security notes and scaling guidance
- [ ] Verify folder structure and consistency
- [ ] Final pass on code quality and maintainability
