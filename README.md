# Developer Assessment Platform API

Backend for a developer assessment and coding platform built with Node.js, Express, TypeScript, Prisma 5.22, and PostgreSQL.

## Features

- JWT authentication with company, candidate, and admin roles
- Company-owned MCQ and coding problems
- Assessments, problem links, and candidate invitations
- Timed candidate attempts and automatic scoring
- Transactional company credit top-ups
- Soft deletes and audit logs
- Platform metrics for administrators

## Requirements

- Node.js 20+
- PostgreSQL
- Redis
- npm

## Installation

```bash
npm install
copy .env.example .env
npx prisma generate --schema prisma/schema
npx prisma migrate dev --name init --schema prisma/schema
npm run dev
```

The default API URL is `http://localhost:5000/api/v1`.

Configure the values in `.env` before starting the server. PostgreSQL, Redis, and SMTP settings are required by the current startup process.

## Commands

```bash
npm run dev
npm run build
npm run lint:check
npm run format:fix
npx prisma validate --schema prisma/schema
```

## API Testing

Import the collection below into Postman:

[postman/Developer-Assessment-Platform.postman_collection.json](postman/Developer-Assessment-Platform.postman_collection.json)

Detailed Postman instructions, request payloads, variables, and response examples are documented here:

[POSTMAN.md](POSTMAN.md)
