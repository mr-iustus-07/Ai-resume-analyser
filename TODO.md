# TODO — AI Resume Analyzer SaaS

## Phase 1: Monorepo Foundation
- [x] Create root workspace configuration (`package.json`, `.gitignore`, formatting configs)
- [x] Create folder skeleton (`client`, `server`, `shared`, `docker`)
- [ ] Create root documentation baseline (`README.md` placeholder, env strategy)

## Phase 2: Resume Upload
- [x] Upload route and UI flow completed
- [x] Client build clean and compile-fix completed

## Phase 3: Resume Parsing Engine (Locked Scope)
- [x] Update upload module to store files in `server/temp/uploads/` (temporary, no DB)
- [x] Update upload response to include `{ uploadId, filename, path, size }`
- [x] Create parser module files:
  - [x] `server/src/modules/parser/parser.types.ts`
  - [x] `server/src/modules/parser/parser.service.ts`
  - [x] `server/src/modules/parser/parser.controller.ts`
  - [x] `server/src/modules/parser/parser.routes.ts`
- [x] Implement Strategy Pattern:
  - [x] `ResumeParser` interface
  - [x] `PDFParser`
  - [x] `DOCXParser`
  - [x] `TXTParser`
  - [x] `ParserFactory`
- [ ] Implement extraction for:
  - [ ] Personal info (name, email, phone, address, linkedin, github, website)
  - [ ] Summary
  - [ ] Skills
  - [ ] Education
  - [ ] Experience
  - [ ] Projects
  - [ ] Certifications
  - [ ] Languages
  - [ ] Achievements
- [ ] Implement normalization:
  - [ ] whitespace
  - [ ] capitalization
  - [ ] phone/email normalization
  - [ ] date normalization
  - [ ] duplicate skill removal
- [x] Implement parser validation/error handling:
  - [x] missing uploadId
  - [x] missing uploaded file
  - [x] unsupported file type
  - [x] corrupted/unreadable file
  - [x] empty parsed text
  - [x] parser failure
- [x] Wire parser route in `server/src/main.ts`
- [x] Install parsing dependencies
- [x] Run verification commands:
  - [x] `npm install`
  - [x] `npm run build`
  - [x] `npm run dev -w server`
- [ ] Run critical parser endpoint tests:
  - [ ] valid PDF
  - [ ] valid DOCX
  - [x] valid TXT
  - [ ] empty file
  - [x] corrupted file
  - [x] invalid uploadId
- [ ] Improve extraction quality on realistic resumes (Software Engineer, AI Engineer, Student Fresher, Experienced Developer)
- [ ] Prepare final Phase 3 deliverables report only (no AI features)
