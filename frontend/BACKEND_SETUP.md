# Greeting.co — Backend Setup Guide

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router (Route Handlers) |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| Auth | Better Auth (email/password + admin RBAC) |

---

## 1. Prerequisites

- PostgreSQL server running locally **or** a cloud DB (Neon, Supabase, Railway, etc.)
- Node.js ≥ 20

---

## 2. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/greetingco

# Base URL of the app
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Better Auth secret — generate with:  openssl rand -hex 32
BETTER_AUTH_SECRET=your-64-char-hex-secret-here

# One-time setup endpoint secret (any strong secret you choose)
SETUP_SECRET=your-setup-secret-here
```

---

## 3. Create the Database

If using local PostgreSQL:
```sql
CREATE DATABASE greetingco;
```

If using the provided Docker Compose setup:
```bash
npm run db:up
```

---

## 4. Push Schema & Seed

```bash
# One-command setup (recommended)
npm run db:setup

# Or run step-by-step:
# Push the Drizzle schema to the database (creates all tables)
npm run db:push

# Seed the 16 menu items
npm run db:seed
```

---

## 5. Create the Cashier Admin Account

Start the dev server first:
```bash
npm run dev
```

Then run **both** of these in order:

**Step A — Register the account:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"kasir@greeting.co","password":"Kasir123!","name":"Kasir Greeting.co"}'
```

**Step B — Promote to admin role:**
```bash
curl -X POST http://localhost:3000/api/setup \
  -H "x-setup-secret: YOUR_SETUP_SECRET_HERE"
```

Response:
```json
{ "message": "Admin account ready", "email": "kasir@greeting.co", "password": "Kasir123!" }
```

> ⚠️ Change the default password after your first login.

---

## 6. Run the App

```bash
npm run dev
```

| URL | Description |
|---|---|
| `http://localhost:3000` | Customer landing page |
| `http://localhost:3000/menu` | Menu catalog |
| `http://localhost:3000/cart` | Cart & checkout |
| `http://localhost:3000/reservation` | Table reservation |
| `http://localhost:3000/cashier/login` | Cashier login |
| `http://localhost:3000/cashier` | Cashier dashboard (admin only) |

---

## 7. API Reference

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/menu` | List all available menu items |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/:id` | Get single order (for confirmation page) |
| `POST` | `/api/reservations` | Submit a table reservation |

### Admin-Only Endpoints (require cashier session)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | List all orders (supports `?status=active\|completed`) |
| `PATCH` | `/api/orders/:id` | Update order status |
| `GET` | `/api/reservations` | List all reservations |
| `GET` | `/api/cashier/stats` | Revenue stats (supports `?period=today\|week\|month\|custom&date=YYYY-MM-DD`) |

### Auth Endpoints (Better Auth)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/sign-in/email` | Sign in |
| `POST` | `/api/auth/sign-up/email` | Register |
| `POST` | `/api/auth/sign-out` | Sign out |
| `GET` | `/api/auth/get-session` | Get current session |

---

## 8. Database Schema Overview

```
users           — Better Auth users (role: "user" | "admin")
sessions        — Better Auth sessions
accounts        — Better Auth OAuth accounts
verifications   — Better Auth email verifications
menu_items      — Coffee shop menu (16 items, seeded)
orders          — Customer orders (pending → preparing → ready → completed)
order_items     — Line items for each order (price snapshot)
reservations    — Table reservations
```

---

## 9. Drizzle Studio (Optional)

To visually browse and edit your database:
```bash
npm run db:studio
```
Opens at `http://127.0.0.1:4983`

---

## 10. Migrations (Production)

For production deployments, use migrations instead of `db:push`:
```bash
npm run db:generate   # generate SQL migration files
npm run db:migrate    # apply migrations to the DB
```

---

## 11. Deploy to Vercel

This project lives inside the `frontend/` folder, so deploy that folder as the app root.

### Option A — Vercel Dashboard (Recommended)

1. Import the GitHub repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variables in Vercel Project Settings:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `SETUP_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your production URL, e.g. `https://your-app.vercel.app`)
5. Deploy.

### Option B — Vercel CLI

From the `frontend/` directory:
```bash
npm run vercel:deploy
```

For production deployment:
```bash
npm run vercel:deploy:prod
```

### After First Production Deploy

1. Run production migration against your production database (`npm run db:migrate` with production `DATABASE_URL`).
2. Create and promote cashier admin with your production URL:
```bash
curl -X POST https://YOUR_DOMAIN/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"kasir@greeting.co","password":"Kasir123!","name":"Kasir Greeting.co"}'

curl -X POST https://YOUR_DOMAIN/api/setup \
  -H "x-setup-secret: YOUR_SETUP_SECRET_HERE"
```
