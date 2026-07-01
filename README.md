# Learn Code — Advanced Tech Learning & Practice Portal 🚀

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)

An enterprise-grade, interactive web application designed to help developers practice, learn, and master modern technological skills. Built from the ground up using the latest **Next.js 16 App Router**, **React 19**, and a highly scalable multi-database micro-architecture.

---

## ✨ Key Features

### 🔐 Enterprise Authentication & Security
- **Dual-Token JWT Architecture**: Short-lived access tokens (15 mins) paired with HttpOnly, `SameSite=Strict` refresh cookies (7 days) for seamless, secure session persistence.
- **Social OAuth Integration**: Built-in OAuth 2.0 flows (e.g., GitHub) with automated pseudo-email fallback and secure redirection handling.
- **Session Revocation & Monitoring**: Track active user sessions across devices with instant token hash revocation capabilities.
- **Edge Route Protection (`proxy.ts`)**: Next.js 16 middleware proxy intercepts requests at the network edge to enforce route guards with **zero UI flicker**.
- **Rate Limiting & Threat Mitigation**: Redis-powered fixed-window rate limiting via **Upstash Redis**, combined with automated XSS, SQLi, and forbidden payload filtering on incoming API requests.
- **Email Verification & Password Reset**: Transactional HTML emails powered by **Resend** and custom **React Email** templates.

### 📚 Tech Learning & Practice Arena
- **Interactive Technology Catalog**: Explore curated tech stacks and tools with pagination, search filtering, and responsive skeleton loaders (`/technologies`).
- **Practice Arena**: Test coding knowledge and solve interactive technical challenges (`/practice`).
- **Personalized Dashboard**: View real-time user profiles, verification statuses, subscription tiers, and quick navigation links (`/dashboard`).

### 🎨 Premium UI/UX & Design System
- **Tailwind CSS v4 & Radix UI**: Sleek, accessible components built to WCAG 2.1 AA standards.
- **Dynamic Dark/Light Mode**: Smooth theme transitions powered by a custom React theme context.
- **Responsive Navigation**: Adaptive header featuring mobile sheet menus, user initials avatars, and instant clean-navigation logout flows.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19, TypeScript (Strict) |
| **Styling & UI** | Tailwind CSS v4, Radix UI Primitives, Lucide Icons, React Icons |
| **State Management** | Redux Toolkit (Session & User Slices), TanStack Query v4 (Server Sync) |
| **Form & Validation** | React Hook Form, Zod Schema Validation |
| **Database & ORM** | MongoDB Atlas, Prisma ORM (Multi-Schema Configuration) |
| **Caching & Security** | Upstash Redis, Bcryptjs, JSON Web Tokens |
| **Email Service** | Resend API, React Email Templates |
| **Code Quality** | ESLint 9, Prettier (Automated Formatting Scripts) |

---

## 🏛️ Architecture & Multi-Schema Database

To ensure modularity and clean domain separation, this project implements a **Multi-Prisma Schema** architectural pattern connecting to MongoDB:

```text
prisma/
├── users/
│   └── users.schema.prisma         # User accounts, sessions, verification tokens
└── technologies/
    └── technologies.schema.prisma  # Tech catalog, practice items, categories
```

Whenever schemas are modified, separate Prisma clients are generated using custom npm scripts to maintain type safety across domain boundaries.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v20 or higher
- **npm**, **yarn**, or **pnpm**
- A running **MongoDB** instance or Atlas URI
- An **Upstash Redis** REST URL and Token (for rate limiting)
- A **Resend** API key (for emails)

### 1. Clone the Repository
```bash
git clone https://github.com/souryadeepRC/learn_code.git
cd learn-code
```

### 2. Install Dependencies
```bash
npm install
```
*(Note: The `postinstall` script will automatically trigger `npm run prisma:generate:all` to compile the Prisma clients).*

### 3. Environment Setup
Create a `.env` file in the root directory and configure the required environment variables:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database URIs (MongoDB)
USERS_DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/users_db?retryWrites=true&w=majority"
TECHNOLOGIES_DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/technologies_db?retryWrites=true&w=majority"

# Authentication Secrets
JWT_ACCESS_SECRET="your-super-secret-access-token-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key"

# OAuth Credentials (GitHub)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Email Delivery (Resend)
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="noreply@yourdomain.com"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the compiled production server |
| `npm run format:all` | Formats code with Prettier and automatically fixes ESLint issues |
| `npm run prisma:generate:users` | Generates the Prisma client for the User domain |
| `npm run prisma:generate:technologies` | Generates the Prisma client for the Technology domain |
| `npm run prisma:generate:all` | Compiles all multi-schema Prisma clients concurrently |

---

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router pages and endpoints
│   ├── (auth)/           # Authentication layout and views (login, join, reset)
│   ├── api/              # Backend API routes (/api/auth, /api/user, /api/technologies)
│   ├── dashboard/        # Authenticated user dashboard
│   ├── practice/         # Interactive practice arena
│   └── technologies/     # Tech catalog and learning portal
├── components/           # Reusable UI components
│   ├── common/           # AppHeader, AuthGuard, ThemeToggle, Heading
│   ├── features/         # Domain-specific components (AuthTabs, TechnologyCard)
│   └── ui/               # Radix UI + Tailwind design system primitives
├── config/               # Route configurations, navigation rules, site metadata
├── context/              # React Context providers (ThemeContext)
├── emails/               # React Email transactional templates
├── hooks/                # Custom React hooks (useCurrentUser, useLogin, useTechnologies)
├── lib/                  # Core integrations (Axios, Prisma clients, Redis, Resend, JWT)
├── providers/            # Root application wrappers (Redux + React Query + Theme)
├── schema/               # Zod validation schemas for requests and domain models
├── store/                # Redux Toolkit store, slices, and selectors
├── types/                # Strict TypeScript type definitions
└── utils/                # Helper utilities (APIHandler, cookie management, rate limits)
```

---

## 🛡️ Security Best Practices Implemented
- **No Sensitive Cookie Access in JS**: Refresh tokens are flagged with `HttpOnly` and `SameSite=Strict`, making them completely inaccessible to client-side scripts.
- **Clean Logout Navigation**: Executing logout terminates server sessions, wipes all cookies with `maxAge: 0`, and triggers a hard browser navigation (`window.location.href`) to clear client-side router caches.
- **Strict Input Validation**: Every mutating API request undergoes strict Zod schema parsing and payload inspection before execution.

---

## 📄 License
This project is licensed under the MIT License.
