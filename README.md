# Developer Assessment Platform

A full-stack backend API for creating, managing, and taking developer assessments. Companies can create coding problems and assessments, invite candidates via email, and evaluate their submissions.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Express.js 5** | HTTP framework |
| **TypeScript 7** | Type-safe development |
| **Prisma 5.22** | ORM & database migrations |
| **PostgreSQL** | Primary database |
| **Redis** | Caching & session storage |
| **JWT** | Authentication (access + refresh tokens) |
| **Bkash** | Payment gateway integration |
| **Cloudinary** | File/image uploads |
| **Nodemailer** | Email delivery (SMTP) |
| **Google Auth Library** | OAuth authentication |
| **Biome 2.5** | Linting & formatting |
| **tsup** | TypeScript bundler |
| **Vercel** | Deployment |

## Project Structure

```
src/
├── app.ts                     # Express app setup (CORS, middleware, routes)
├── server.ts                  # Server entry point (DB, Redis, SMTP init)
├── app/
│   ├── config/index.ts        # Environment configuration
│   ├── interfaces/            # Shared TypeScript interfaces
│   ├── lib/                   # External service clients
│   │   ├── bkash.ts           # Bkash payment gateway
│   │   ├── cloudinary.ts      # Cloudinary upload client
│   │   ├── googleAuth.ts      # Google OAuth verification
│   │   ├── multer.ts          # File upload middleware
│   │   ├── nodemailer.ts      # SMTP email transporter
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── redis.ts           # Redis client
│   ├── middleware/
│   │   ├── checkAuth.ts       # JWT auth + role guard
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts # Zod schema validation
│   ├── module/
│   │   ├── auth/              # Registration, login, JWT, logout
│   │   ├── user/              # Profile CRUD
│   │   ├── admin/             # Dashboard metrics, audit logs
│   │   ├── problem/           # Coding/MCQ problem management
│   │   ├── assessment/        # Assessment builder + invitations
│   │   ├── attempt/           # Candidate attempt + submission
│   │   └── payment/           # Bkash top-up + history
│   ├── routes/index.ts        # Central router
│   └── utils/                 # Helpers (AppError, catchAsync, JWT, QueryBuilder)
prisma/
├── schema/                    # Split Prisma schema files
│   ├── base.prisma
│   ├── enums.prisma
│   ├── user.prisma
│   ├── problem.prisma
│   ├── assessment.prisma
│   ├── attempt.prisma
│   ├── payment.prisma
│   └── audit.prisma
└── migrations/
```

## Database Models

| Model | Description |
|---|---|
| `User` | Users with role (ADMIN, COMPANY, CANDIDATE), email, hashed password |
| `CompanyProfile` | Company name, website, credits balance |
| `Problem` | Coding/MCQ problems with difficulty, test cases (JSON), points |
| `Assessment` | Time-bound test with pass marks, linked to problems |
| `AssessmentProblem` | Many-to-many: assessment ↔ problem with marks |
| `Invitation` | Email-based candidate invite with unique token and status |
| `Attempt` | Candidate's exam session (start/end time, status, score) |
| `Submission` | Per-problem answer/code with correctness and marks |
| `Payment` | Bkash top-up transactions with credits |
| `AuditLog` | Admin action tracking with JSON details |

## API Endpoints

All routes are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register (CANDIDATE or COMPANY) |
| POST | `/auth/login` | Public | Login, returns access + refresh tokens |
| GET | `/auth/me` | Any | Get current user profile |
| POST | `/auth/logout` | Any | Logout |

### User

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/user/profile` | Any | Get own profile |
| PATCH | `/user/profile` | Any | Update own profile |

### Problems (COMPANY only)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/problems` | Create a problem |
| GET | `/problems` | List all own problems |
| GET | `/problems/:id` | Get problem details |
| PATCH | `/problems/:id` | Update a problem |
| DELETE | `/problems/:id` | Soft-delete a problem |

### Assessments (COMPANY only)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/assessments` | Create assessment with problems |
| GET | `/assessments` | List own assessments |
| GET | `/assessments/:id` | Get assessment details |
| PATCH | `/assessments/:id` | Update assessment |
| DELETE | `/assessments/:id` | Soft-delete assessment |
| POST | `/assessments/:id/invitations` | Invite candidates via email |

### Attempts (CANDIDATE only)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/attempts` | Start an assessment attempt |
| GET | `/attempts/:id` | Get attempt details |
| POST | `/attempts/:id/submit` | Submit answers |

### Payments (COMPANY only)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/payments/top-up` | Top up credits via Bkash |
| GET | `/payments` | View payment history |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/metrics` | Dashboard metrics |
| GET | `/admin/audit-logs` | List audit logs |
| POST | `/admin/audit-logs` | Create audit log entry |

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- Redis
- SMTP account (e.g. Gmail, SendGrid)
- Bkash sandbox credentials
- Cloudinary account

### Installation

```bash
git clone <repo-url>
cd developer-assessment
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Key variables:

```admin
Admin Email     : admin12@gmail.com
Admin Password  : Admin1234!
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Development

```bash
npm run dev
```

Server starts at `http://localhost:5000`.

### Production Build

```bash
npm run build
npm start
```

### Linting & Formatting

```bash
npm run lint:check
npm run lint:fix
npm run format:check
npm run format:fix
```

## Deployment

Configured for **Vercel** via `vercel.json`. The build output (`dist/server.js`) is served as a serverless function.

```bash
vercel deploy
```

## Postman Collection

Import the collection from `postman/Developer-Assessment-Platform.postman_collection.json` to test all endpoints.

## License

ISC
