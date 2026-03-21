# GymFlow Backend API (`gymflow-be`)

GymFlow Backend is the REST API for the GymFlow product.
It powers authentication, members, plans, payments, attendance, and dashboard analytics for gym owners.

## Product Scope

This API supports a multi-tenant gym management workflow:
1. Gym owner registers/logs in
2. Creates membership plans
3. Adds members to plans
4. Records payments and tracks dues/status
5. Marks daily attendance
6. Views dashboard KPIs (member counts, revenue, expiring members, recent payments)

Tenant isolation is implemented by storing records with `gymId` and resolving that from the authenticated user token.

## Tech Stack

- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- Zod validation
- JWT authentication
- Winston + Morgan logging

## Backend Architecture

```text
src/
  app.ts                     # Express app + middleware + route mounting
  server.ts                  # DB connect + server startup + graceful shutdown
  config/                    # env, database, logger, CORS, rate limiter
  routes/
    health.routes.ts
    index.ts                 # v1 module router
    routeCatalog.routes.ts   # API route preview metadata
  modules/
    auth/
    members/
    plans/
    payments/
    attendance/
    dashboard/
  middleware/                # authenticate, validate, error handler, etc.
  shared/                    # ApiResponse, token, hash, pagination, email/upload helpers
```

Each module follows a layered pattern:
- `*.routes.ts` -> HTTP route bindings
- `*.controller.ts` -> request/response orchestration
- `*.service.ts` -> business logic
- `*.repository.ts` -> database operations
- `*.model.ts` -> Mongoose schema
- `*.validation.ts` -> Zod request validation

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://your-connection-string

JWT_SECRET=your-super-secret-64-char-minimum
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@gymflow.com
```

Required for local boot:
- `MONGODB_URI`
- `JWT_SECRET`

Optional integrations:
- Cloudinary keys (image upload helpers)
- SMTP keys (email helpers)

## Getting Started

Prerequisites:
- Node.js 20+ (recommended)
- MongoDB connection string

Install and run:

```bash
npm install
npm run dev
```

Default API base URL:
- `http://localhost:5000/api/v1`

## Scripts

- `npm run dev` - run dev server via `ts-node-dev`
- `npm run build` - compile TypeScript to `dist/`
- `npm run start` - run compiled server from `dist/server.js`
- `npm run lint` - lint `src/**/*.ts`
- `npm run format` - format source with Prettier

## API Response Format

Success:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

## Route Groups

Public routes:
- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/meta/routes-preview`

Protected routes (JWT required via `Authorization: Bearer <token>` or `token` cookie):
- `GET /api/v1/auth/me`

Members:
- `GET /api/v1/members` (`page`, `limit`, `status`, `sort`, `order`)
- `POST /api/v1/members`
- `GET /api/v1/members/search` (`q`)
- `GET /api/v1/members/expiring` (`days`, default `7`)
- `GET /api/v1/members/:id`
- `PUT /api/v1/members/:id`
- `DELETE /api/v1/members/:id`

Plans:
- `GET /api/v1/plans`
- `POST /api/v1/plans`
- `PUT /api/v1/plans/:id`
- `DELETE /api/v1/plans/:id`

Payments:
- `GET /api/v1/payments` (`page`, `limit`)
- `POST /api/v1/payments`
- `GET /api/v1/payments/member/:memberId`
- `PUT /api/v1/payments/:id`

Attendance:
- `POST /api/v1/attendance`
- `GET /api/v1/attendance` (`date` optional)
- `GET /api/v1/attendance/member/:memberId`

Dashboard:
- `GET /api/v1/dashboard`

## Core Business Rules

- Member `expiryDate` is auto-calculated from `joinDate + plan.duration`.
- Payment `dueAmount` and `status` (`paid`/`partial`/`unpaid`) are auto-derived from `totalAmount` and `paidAmount`.
- Attendance marking uses upsert behavior (same day + member updates existing record).
- Deleting a member cascades and removes that member’s payments.
- A plan cannot be deleted while members are assigned to it.

## Security and Reliability

Enabled middleware:
- `helmet`
- `cors` (restricted to `CLIENT_URL`)
- `cookie-parser`
- request sanitization (`express-mongo-sanitize`)
- `hpp`
- global rate limiter (`100` requests per `15` minutes)

Operational behavior:
- MongoDB connection retry with exponential backoff
- Graceful shutdown on `SIGTERM`, `SIGINT`, unhandled rejection, uncaught exception

## Useful Dev Endpoint

Use route preview for quick API contract checks:
- `GET /api/v1/meta/routes-preview`

It returns endpoint metadata with dummy request/response examples.
