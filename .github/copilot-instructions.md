# Project Standards

DO NOT MISS ANY OF THE BELOW POINTS. ALL POINTS ARE MANDATORY AND MUST BE FOLLOWED STRICTLY. ALSO FOLLOW CLIENT MESSAGE DO NOT MISS ANY OF THE REQUIREMENTS IN CHAT.

## Tech Stack

- **Frontend:** React 18+ (Vite), TypeScript strict mode, Material-UI (MUI)
- **Backend:** Node.js ≥18.x, Express.js, TypeScript strict mode
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** express-session + connect-mongo (session-based, NO JWT)
- **Validation:** Zod (backend), Formik + Yup (frontend forms)
- **Monorepo:** `client/` and `server/` directories in project root

## Project Structure

```
roas-printfast/
├── client/           # React frontend (Vite)
│   └── src/
│       ├── components/   # Reusable UI components (Layout/, Breadcrumb/, Table/)
│       ├── pages/        # Page components (Login/, Signup/, Dashboard/, etc.)
│       ├── contexts/     # React contexts (AuthContext)
│       ├── hooks/        # Custom hooks (useAuth, useApi)
│       ├── services/     # API service modules
│       ├── types/        # TypeScript type definitions
│       ├── config/       # config.ts — centralized env access
│       ├── theme/        # MUI theme config
│       └── utils/        # Helper utilities
├── server/           # Express backend
│   └── src/
│       ├── config/       # config.ts, database.ts, session.ts
│       ├── features/     # Feature modules (auth/, users/, config/)
│       ├── middleware/    # Express middleware (auth, role, error, validation)
│       ├── types/        # TypeScript types, enums, declaration files
│       ├── utils/        # Logger, error classes, response helpers
│       └── scripts/      # Seed scripts
└── docs/             # Documentation
```

## Naming Conventions

| Item               | Convention       | Example                   |
| ------------------ | ---------------- | ------------------------- |
| Feature folder     | kebab-case       | `features/auth/`          |
| TS files (backend) | kebab-case       | `auth.controllers.ts`     |
| React components   | PascalCase       | `Sidebar.tsx`             |
| Component folders  | PascalCase       | `components/Layout/`      |
| Hooks              | camelCase, `use` | `useAuth.ts`              |
| Services (client)  | kebab-case       | `auth.service.ts`         |
| Types/interfaces   | PascalCase, `I`  | `IUser`, `UserRole`       |
| Enums              | PascalCase       | `UserRole.GOD_USER`       |
| Constants          | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS`      |

## UI Standards

1. No `.tsx` file should exceed 200 lines. If it does, break it down into multiple smaller, reusable components, organized inside a folder named after the main component.
2. Use the **`size` attribute** for **MUI Grid** layouts and import from `import Grid from '@mui/material/Grid';`.
3. Avoid using **SCSS**. Use MUI `sx` prop or `styled()` for styling.
4. All pages must be absolutely responsive (mobile, tablet, desktop) using MUI breakpoints.
5. Use **Formik** and **Yup** for all React forms.
6. Use Context API only for deep or global data sharing; otherwise use props with strongly typed interfaces. Avoid `any`, `unknown`, and misuse of `never`.
7. Use **MUI Components only** — no third-party UI libraries.
8. Add **Breadcrumb** navigation to all pages.
9. Ensure every table supports **pagination, filtering, searching, and sorting**, with backend APIs designed accordingly.
10. Dashboard uses a **persistent MUI Drawer** left sidebar (~240px desktop, temporary on mobile, collapsible on tablet).

## Backend Standards

### Feature Structure
Segregate each feature into the following files:
1. `<feature>.controllers.ts` — request/response handling only
2. `<feature>.models.ts` — Mongoose schemas and models
3. `<feature>.routes.ts` — Express route definitions
4. `<feature>.validators.ts` — Zod schemas for request validation
5. `<feature>.services.ts` — business logic (called by controllers)

### API Conventions
- Base path: `/api/v1/`
- RESTful endpoints with consistent JSON response format:
  ```json
  { "success": true, "data": {}, "message": "..." }
  ```
- Error responses:
  ```json
  { "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
  ```
- All list endpoints must support: `page`, `limit`, `sort`, `order`, `search`, and feature-specific filters
- Use Zod validation middleware on all routes receiving request bodies or query params

### Database Conventions
- All Mongoose schemas must use `timestamps: true`
- Soft delete pattern: use `isActive: boolean` field — never hard delete
- Index all fields used in queries, filters, and lookups
- Use `select: false` for sensitive fields (e.g., password)
- Reference other documents via `ObjectId` with `ref`

## Authentication & Authorization

### Authentication
- **Session-based** using `express-session` + `connect-mongo` — **NO JWT**
- Passwords hashed with **bcrypt (12 rounds)**
- Session cookie: `httpOnly`, `secure` in production, `sameSite: strict` (production) / `lax` (development)
- Login: `POST /api/v1/auth/login`
- Signup: `POST /api/v1/auth/signup` (Admin gated by `ALLOW_ADMIN_SIGNUP` flag; Vendor always allowed; God User always rejected)
- Logout: `POST /api/v1/auth/logout` (destroy session + clear cookie)
- Session check: `GET /api/v1/auth/me` (restore auth state on app load)

### Authorization (RBAC)
Three roles in hierarchy: **God User > Admin User > Vendor User**
- `requireAuth` middleware — checks valid session exists
- `requireRole(...roles)` middleware — checks user role is in allowed list
- God User: full system access, created via seed script only
- Admin User: manages vendors, optional self-signup via feature flag
- Vendor User: own data only, self-signup always available
- All role-based access enforced **server-side via middleware** — never client-side only

### Feature Flags
- `ALLOW_ADMIN_SIGNUP` — boolean flag in server config, exposed via `GET /api/v1/config/public`
- All feature flags read from `config.ts`, never direct `process.env`

## Error Handling

- Use custom `AppError` class extending `Error` with `statusCode` and `code` fields
- Centralized error-handling middleware as the last Express middleware
- Never expose stack traces in production
- Use standardized error codes (e.g., `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `ADMIN_SIGNUP_DISABLED`)

## TypeScript Configuration

- `strict: true` in all tsconfig files
- No `any` types — use proper typed alternatives
- Use interfaces for object shapes, enums for fixed sets of values
- Shared types (e.g., `UserRole` enum) must be kept in sync between client and server

## For Both UI and Server Project

1. Run **build** and **type checks** after every change.
2. Fix all build and type errors. Perform a strict review and ensure no file is skipped.
3. Format the code if everything is correct.
4. Push the final code.
5. The code should be scalable and future-proof, following best practices and clean architecture. Avoid hacks or temporary tricks—only stable, production-ready implementations should be used.
6. After completing the development, run full checks including build, type validation, and linting. If any issues are found, they must be fixed before considering the work complete.
7. Create `config.ts` in both UI and Server.
8. All credentials and environment values must be centralized in a `config.ts` file.
9. Do not access `process.env` directly across the codebase.
