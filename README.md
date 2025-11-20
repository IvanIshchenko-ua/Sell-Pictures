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
- `PORT` — optional, backend port (defaults to `5000`)

Example `.env` (do NOT commit):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=art_shop
JWT_SECRET=your_jwt_secret
PORT=5000
```

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

The frontend expects the backend API to be available (check `frontend/src/api/axiosClient.ts` for the configured base URL). If needed, update the base URL or run both apps concurrently.

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

If you want, I can also:

- add an example `.env.example` file
- add a simple Postman collection or OpenAPI spec for the API
- add start scripts to run both frontend and backend concurrently (e.g. using `concurrently`)

---

If you'd like any section expanded (detailed API docs, deployment steps, or `.env.example`), tell me which and I'll add it.