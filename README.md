# ROAS PrintFast

A Return on Ad Spend (ROAS) management application built on the MERN stack with TypeScript.

## Tech Stack

- **Frontend:** React 18+ with TypeScript, Material-UI (MUI), Vite
- **Backend:** Node.js, Express.js with TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Express-session with connect-mongo (session-based)
- **Validation:** Zod (backend), Yup + Formik (frontend)

## Project Structure

```
roas-printfast/
├── client/                # React frontend (Vite + TypeScript)
├── server/                # Express backend (TypeScript)
├── docs/                  # Project documentation
│   ├── requirements/      # Business requirements & user roles
│   ├── setup/             # Development setup guides
│   ├── architecture/      # Architecture decisions & design
│   ├── api/               # API endpoint specifications
│   └── database/          # Database schema documentation
├── .github/               # GitHub config & copilot instructions
├── .env.example           # Environment variable template
└── README.md              # This file
```

## User Roles

| Role         | Description                                           |
| ------------ | ----------------------------------------------------- |
| **God User** | Super admin with full system access (seed only)       |
| **Admin**    | Organization management, created by God User or signup (when enabled) |
| **Vendor**   | Limited vendor operations, created by God/Admin or self-signup |

See [docs/requirements/user-roles.md](docs/requirements/user-roles.md) for the full permissions matrix.

## Authentication

- **Login:** Email + password → server-side session
- **Signup:** Public page for Vendor (always) and Admin (when `ALLOW_ADMIN_SIGNUP=true`)
- **God User:** Created via seed script only — no signup or UI creation

## Dashboard

After login, users see a **left sidebar navigation** dashboard with role-based menu items:
- Dashboard, Users, Vendors, Reports, Profile, Settings

## Quick Start

### Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x (local or Atlas)
- npm >= 9.x

### 1. Clone & Install

```bash
git clone <repo-url>
cd roas-printfast

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
cp .env.example server/.env
cp .env.example client/.env
```

Edit `.env` files — see [docs/setup/environment-variables.md](docs/setup/environment-variables.md).

### 3. Seed God User

```bash
cd server
npm run seed:god-user
```

### 4. Start Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1

### 5. Optional: Enable Admin Signup

In `server/.env`, set:
```
ALLOW_ADMIN_SIGNUP=true
```

Restart the server. The signup page will now show the Admin role option.

## Scripts

### Server

| Script                   | Description                        |
| ------------------------ | ---------------------------------- |
| `npm run dev`            | Start development server (nodemon) |
| `npm run build`          | Compile TypeScript                 |
| `npm run type-check`     | Run TypeScript compiler checks     |
| `npm run lint`           | Run ESLint                         |
| `npm run format`         | Run Prettier                       |
| `npm run seed:god-user`  | Create initial God User            |

### Client

| Script               | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start Vite dev server         |
| `npm run build`      | Build for production          |
| `npm run type-check` | Run TypeScript compiler checks|
| `npm run lint`       | Run ESLint                    |
| `npm run format`     | Run Prettier                  |

## Documentation

- [Local Development Setup](docs/setup/local-development.md)
- [Environment Variables](docs/setup/environment-variables.md)
- [User Roles & Permissions](docs/requirements/user-roles.md)
- [Architecture Overview](docs/architecture/overview.md)
- [API Documentation](docs/api/README.md)
- [Database Schema](docs/database/schema.md)

## License

Private — All rights reserved.
