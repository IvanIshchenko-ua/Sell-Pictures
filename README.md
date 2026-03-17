# Sell-Pictures

Sell-Pictures is a full-stack marketplace web application for selling original paintings. It includes a TypeScript + Express backend (MySQL) with image uploads and admin features, and a React + Vite TypeScript frontend styled with Tailwind CSS.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Database setup](#database-setup)
- [Run locally](#run-locally)
- [Run with Docker](#run-with-docker)
- [Admin user and scripts](#admin-user-and-scripts)
- [API overview](#api-overview)
- [Notes & next steps](#notes--next-steps)

## Features

- Public gallery of paintings with pagination and detail pages
- Shopping cart and checkout flow
- Order management for admin (status updates)
- Admin authentication (JWT)
- Image upload for painting entries
- Simple REST API used by the frontend

## Tech stack

- Backend: Node.js, Express, TypeScript, MySQL (mysql2), JWT, multer
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Dev tools: ts-node-dev for backend development, Vite for frontend

## Repository structure

- `backend/` — Express API server (TypeScript)
	- `src/` — source code (controllers, models, routes, middleware)
	- `scripts/` — helper scripts and `schema.sql`
	- `uploads/` — stored uploaded image files (served statically)
- `frontend/` — React + Vite application

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MySQL server (or MariaDB)

## Environment variables

Create a `.env` file inside `backend/` with at least the following variables:

- `DB_HOST` — MySQL host (e.g. `localhost`)
- `DB_USER` — MySQL user (e.g. `root`)
- `DB_PASSWORD` — MySQL password
- `DB_NAME` — database name
- `JWT_SECRET` — secret used to sign admin tokens (set a secure value)
- `PORT` — optional, backend port (defaults to `5001`)
- `DB_PORT` — optional, MySQL port (defaults to `3306`)
- `CORS_ORIGIN` — comma-separated allowlist of trusted origins (example: `http://localhost:8080`)
- `REQUEST_JSON_LIMIT` — max JSON body size (default: `100kb`)
- `MAX_UPLOAD_SIZE_BYTES` — max upload size in bytes (default: `5242880`)
- `GLOBAL_RATE_LIMIT_WINDOW_MS` — global limiter window (default: `900000`)
- `GLOBAL_RATE_LIMIT_MAX` — max requests per IP in global window (default: `250`)
- `AUTH_RATE_LIMIT_WINDOW_MS` — login limiter window (default: `900000`)
- `AUTH_RATE_LIMIT_MAX` — max login attempts per IP per window (default: `10`)
- `ORDER_RATE_LIMIT_WINDOW_MS` — public order limiter window (default: `300000`)
- `ORDER_RATE_LIMIT_MAX` — max order attempts per IP per window (default: `20`)

Example `.env` (do NOT commit):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=art_shop
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:8080
REQUEST_JSON_LIMIT=100kb
MAX_UPLOAD_SIZE_BYTES=5242880
GLOBAL_RATE_LIMIT_WINDOW_MS=900000
GLOBAL_RATE_LIMIT_MAX=250
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10
ORDER_RATE_LIMIT_WINDOW_MS=300000
ORDER_RATE_LIMIT_MAX=20
PORT=5001
```

For Docker, these values are provided by `docker-compose.yml` by default.

## Database setup

1. Create the database you referenced in `DB_NAME`.
2. From the `backend/` folder, run the SQL schema to create the required tables:

	 - Open your MySQL client and run the SQL in `backend/scripts/schema.sql`

	 Or from terminal (example):

	 mysql -u root -p your_database_name < backend/scripts/schema.sql

## Run locally

Backend (development):

1. cd to `backend/`
2. Install dependencies: `npm install`
3. Start in development mode (auto-reload): `npm run dev`

Build & run backend for production:

1. `npm run build`
2. `npm start`

Frontend (development):

1. cd to `frontend/`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

The frontend uses relative `/api` and `/uploads` paths by default. In local development, Vite proxies those requests to `http://localhost:5001`.

## Run with Docker

The repository includes a full Docker setup for MySQL, backend, and frontend.

1. From the repository root, build and start everything:

	```bash
	docker compose up --build
	```

2. Open the app at `http://localhost:8080`
3. The frontend proxies API and image requests to the backend container automatically
4. MySQL is exposed at `localhost:3307` on the host and `db:3306` inside Docker

Notes:

- The database schema is initialized automatically from `backend/scripts/schema.sql`
- Uploaded images are stored in `backend/uploads`
- To stop containers: `docker compose down`
- To stop containers and remove database data: `docker compose down -v`

Demo seed:

- Run `docker compose exec backend npm run seed:demo` to create one admin, three paintings, and three demo orders

## Admin user and helper scripts

- A small helper script exists at `backend/scripts/create-admin.js` to create an admin user directly in the database. Use it after your database is ready.

## API overview

The backend exposes endpoints for:

- Authentication (admin login)
- Paintings CRUD and image upload
- Orders listing and status management

Refer to the `backend/src/routes` files for route names and behaviors. Images are served from `/uploads` (static route).

## Notes & next steps

- This README covers local development and basic setup. Recommended next steps:
	- Add integration tests for API endpoints
	- Add CORS/production configuration and a reverse proxy for serving frontend and backend together
	- Harden authentication and input validation

## Security hardening status

Implemented in backend:

- Strict CORS allowlist (requests from unknown origins are blocked)
- Helmet security headers and disabled `x-powered-by`
- Global and route-level rate limiting (`/api/auth/login`, public order creation)
- Input validation and normalization for auth, paintings, and orders
- Upload hardening: mime allowlist, file size limit, single-file limit, randomized filenames
- JWT verification/signing with strict algorithm and strong-secret requirement
- Request-id propagation (`X-Request-Id`) and structured security/audit logs
- HPP middleware to mitigate HTTP parameter pollution

Implemented in frontend edge (Nginx):

- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)

Implemented in Docker runtime:

- `no-new-privileges` for backend and frontend containers
- Linux capability drop for backend container
- Backend healthcheck

Security note:

- No system can be 100% attack-proof. Keep dependencies updated, rotate secrets, add WAF/reverse-proxy protection, and use HTTPS termination in production.

If you want, I can also:

- add an example `.env.example` file
- add a simple Postman collection or OpenAPI spec for the API
- add start scripts to run both frontend and backend concurrently (e.g. using `concurrently`)

---

If you'd like any section expanded (detailed API docs, deployment steps, or `.env.example`), tell me which and I'll add it.