# Empleability Node / NestJS Project

Short demo project implementing a hiring/postulation API using NestJS, TypeORM and PostgreSQL. It includes JWT authentication, API key guard, role-based access, seeders, Swagger docs, Docker support and a minimal frontend.

**Repository layout**
- `app/` — NestJS backend (source, tests, Dockerfile, scripts, frontend)
- `backend/` — (optional) alternate backend folder used during refactors
- `docker-compose.yaml` — compose file to run the API and Postgres

---

## Tech Stack
- Node.js (v20+)
- NestJS
- TypeORM
- PostgreSQL (official Docker image)
- JWT / Passport for authentication
- Jest for unit tests
- Docker & Docker Compose

## Prerequisites
- Docker and Docker Compose installed
- Node.js and npm (for local development and running tests)

## Quickstart (Docker)
1. Build and start services with Docker Compose:

```bash
docker compose up --build -d
```

2. Check logs (app service):

```bash
docker compose logs --tail=200 app
```

3. Stop and remove containers:

```bash
docker compose down -v
```

By default the API listens on port `3000` (configurable via `.env`). Swagger is exposed at `/docs` once the app is running.

## Local development (without Docker)
1. Install dependencies:

```bash
cd app
npm install --legacy-peer-deps
```

2. Run in watch mode:

```bash
npm run start:dev
```

3. Run tests:

```bash
npm test
```

## Seed data
The project includes a seeder script to create initial users/roles. Run it after the database is available:

```bash
cd app
npm run seed
```

## Frontend
A minimal static frontend is included at `app/frontend`. To serve it locally you can use any static server (for example `serve` or `http-server`) or open the `index.html` directly for development.

## Environment variables
Copy or consult `.env.example` inside the `app/` folder and set values for the database, JWT secret and API key. When using Docker Compose the compose file reads `./.env` at repository root.

## API documentation
Once the backend is running, Swagger is available at:

- `http://localhost:3000/docs`

## Tests
Run unit tests from the `app` folder:

```bash
cd app
npm test
```

## Notes and troubleshooting
- If you see dependency resolution errors during `npm install`, use the `--legacy-peer-deps` flag as shown above.
- If Dockerized app cannot find `dist/main`, ensure the Dockerfile builds the project during image build and that no host bind-mount overwrites the container filesystem at runtime.
