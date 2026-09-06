# 🚀 Developer Assessment & Coding Platform API

A robust, enterprise-grade backend for a **Developer Assessment Platform** (similar to HackerRank or Byteboard). Built with Node.js, Express.js, TypeScript, Prisma ORM (v5.22), and PostgreSQL. 

The system enables companies to create assessments, invite candidates, evaluate coding/MCQ problems, and track performance with transactional credit top-ups, automated scoring, and comprehensive audit logs.

---

## 🔗 Submission Links

* **Live API Base URL:** `https://your-app-name.onrender.com/api/v1`
* **Postman API Documentation:** `https://documenter.getpostman.com/view/YOUR_POSTMAN_DOCUMENTATION_LINK`
* **Video Walkthrough (3-5 mins):** `https://loom.com/share/YOUR_VIDEO_LINK`
* **ERD Diagram:** `https://your-erd-image-link.png`

---

## 🔑 Demo Credentials for Testing

| Role | Email | Password |
| :--- | :--- | :--- |
| **ADMIN** | `admin@example.com` | `Password123!` |
| **COMPANY** | `company@example.com` | `Password123!` |
| **CANDIDATE** | `candidate@example.com` | `Password123!` |

---

## ✨ Key Features & Architecture Highlights

### 🛡️ Core Capabilities
* **Role-Based Access Control (RBAC):** Distinct permissions and workflows for `ADMIN`, `COMPANY`, and `CANDIDATE`.
* **Multi-File Schema Architecture:** Uses Prisma `previewFeatures = ["prismaSchemaFolder"]` to organize database schemas logically by domain.
* **Timed Assessment & Auto-Scoring:** Strict timer verification for candidates with atomic scoring during attempt submission.
* **Transactional Credit System:** Managed top-ups updating company balances securely via Prisma `$transaction`.
* **Data Integrity & Compliance:** Integrated soft-deletes (`isDeleted`, `deletedAt`) across models and detailed platform `AuditLog` history.

### 🛠️ Advanced Engineering Patterns
* **Centralized Error Handling:** Custom `AppError` class with standard error response structure and Zod schema validation formatting.
* **Reusable QueryBuilder:** Global utility for server-side pagination, searching, sorting, and dynamic filtering.
* **Global Response Handler:** Unified `sendResponse` utility ensuring JSON standardization (`success`, `statusCode`, `message`, `data`).

---

## 💻 Tech Stack

* **Language:** TypeScript
* **Runtime:** Node.js (v20+)
* **Framework:** Express.js
* **Database & ORM:** PostgreSQL (Neon / Supabase), Prisma ORM v5.22.0
* **Authentication:** JWT (JSON Web Tokens), Bcrypt.js
* **Validation:** Zod Schema Validation
* **Caching & Services:** Redis, Multer, Cloudinary, Nodemailer

---

## 🚦 Local Setup Instructions

### Prerequisites
* Node.js v20 or higher
* PostgreSQL Database URL
* Redis Server (Local or Cloud instance)

### Step 1: Clone Repository & Install Dependencies
```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git)
cd server
npm install