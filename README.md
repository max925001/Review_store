# Store Rating Platform

A full-stack web application for discovering local stores, submitting ratings and reviews, and managing store operations through role-based dashboards.

---

## Demo Video

> Watch the full walkthrough here: **[Click to Watch Demo](https://drive.google.com/file/d/1YMIGjK5anRpU1Hz-d18xhPEovt7lfV5m/view?usp=sharing)**

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Run the Application](#4-run-the-application)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [API Overview](#api-overview)
- [User Roles](#user-roles)
- [Application Routes](#application-routes)

---

## Overview

The Store Rating Platform allows customers to search for stores, submit star-rated reviews, and read community feedback. Store owners can manage their branch employees and monitor incoming reviews from a dedicated dashboard. System administrators have full operational control over all users, stores, and ratings through a centralized admin panel.

Authentication is handled using a stateless, HTTP-only cookie token strategy with automatic session restoration on page refresh.

---

## Tech Stack

### Frontend

| Technology       | Purpose                                      |
|------------------|----------------------------------------------|
| React 19         | UI library and component architecture        |
| Vite 8           | Build tool and development server            |
| Redux Toolkit    | Global state management                      |
| React Router v7  | Client-side routing and navigation           |
| Axios            | HTTP client for REST API communication       |
| Tailwind CSS v4  | Utility-first CSS styling framework          |
| Lucide React     | Icon library                                 |
| Zod              | Client-side form validation schemas          |

### Backend

| Technology          | Purpose                                       |
|---------------------|-----------------------------------------------|
| Node.js             | JavaScript runtime environment                |
| Express.js          | HTTP server and REST API framework            |
| PostgreSQL           | Relational database                           |
| Prisma ORM v7        | Type-safe database access layer               |
| JSON Web Tokens      | Stateless authentication (access + refresh)  |
| bcrypt               | Password hashing                              |
| Zod                  | Server-side request validation                |
| Helmet               | HTTP security headers                         |
| express-rate-limit   | API rate limiting                             |
| Winston              | Structured application logging                |
| Swagger UI           | Auto-generated interactive API documentation  |
| Morgan               | HTTP request logging middleware               |

---

## Features

**For Customers (USER role)**
- Browse and search stores with debounced search and autocomplete suggestions
- Submit one star rating (1 to 5 stars) and a written review per store
- View all community reviews with pagination
- Update profile and change account password

**For Store Owners (STORE_OWNER role)**
- View store details, average rating, and total review count
- Manage branch employees: add and remove staff accounts
- Browse paginated customer reviews and feedback

**For System Administrators (ADMIN role)**
- View platform-wide statistics: total users, stores, and submitted ratings
- Create, search, and filter user accounts with role assignment
- Create new store locations and assign ownership
- Inspect detailed user profiles and linked store data
- Full dashboard management with skeleton loading states

**Common**
- Light and dark theme toggle (preference persisted to localStorage)
- Secure session management with HTTP-only cookie tokens
- Skeleton loading placeholders throughout the interface
- Fully responsive layout with mobile navigation drawer
- Centered modal dialogs for all form interactions
- Change password functionality from the profile page

---

## Project Structure

```
Review/
├── backend/                   # Express.js REST API
│   ├── migrations/            # Raw SQL migration files (run in order)
│   ├── prisma/
│   │   └── schema/            # Modular Prisma schema files
│   ├── src/
│   │   ├── config/            # Database, environment, Swagger, Prisma client
│   │   ├── constants/         # Role and route constants
│   │   ├── middlewares/       # Auth, role, error, rate-limiter middleware
│   │   ├── modules/           # Feature modules (auth, stores, users, employees, dashboard)
│   │   └── utils/             # ApiError, logger, cookie helpers
│   ├── .env.example           # Environment variable template
│   └── package.json
│
└── frontend/                  # React + Vite SPA
    ├── src/
    │   ├── api/               # Axios instance with token refresh interceptor
    │   ├── app/               # Redux store configuration
    │   ├── components/        # Reusable UI and store components
    │   ├── features/          # Redux slices, thunks, and API calls per feature
    │   ├── hooks/             # Custom hooks (useTheme)
    │   ├── layout/            # MainLayout and AuthLayout wrappers
    │   ├── pages/             # Page components per route
    │   ├── routes/            # Route guards and route definitions
    │   └── styles/            # Global CSS
    └── package.json
```

---

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js** v18 or higher ([nodejs.org](https://nodejs.org))
- **npm** v9 or higher (bundled with Node.js)
- **PostgreSQL** v14 or higher, running locally or a hosted instance (e.g., Neon, Supabase, Railway)
- **Git** for cloning the repository

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/store-rating-platform.git
cd store-rating-platform
```

Replace the URL with the actual repository URL.

---

### 2. Backend Setup

**Step 1: Navigate to the backend directory**

```bash
cd backend
```

**Step 2: Install dependencies**

```bash
npm install
```

**Step 3: Create the environment file**

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and update the values. See the [Environment Variables](#environment-variables) section for details.

**Step 4: Run database migrations**

The project uses raw SQL migration files located in the `migrations/` folder. Run them against your PostgreSQL database in order:

```bash
npm run migrate
```

This script runs all migration files sequentially to create the tables and constraints.

**Step 5: Generate the Prisma client**

```bash
npx prisma generate --schema=prisma/schema
```

---

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

**Step 1: Install dependencies**

```bash
npm install
```

**Step 2: Verify the API base URL**

The frontend connects to the backend at `http://localhost:5000` by default. If you changed the backend port in `.env`, update the Axios base URL in `src/api/axios.js`.

---

### 4. Run the Application

Start both servers in separate terminal windows.

**Start the backend server (port 5000):**

```bash
cd backend
npm run dev
```

**Start the frontend development server (port 3000):**

```bash
cd frontend
npm run dev
```

Open your browser and visit: `http://localhost:3000`

The Swagger API documentation is available at: `http://localhost:5000/api-docs`

---

## Environment Variables

Create a `.env` file inside the `backend/` directory using the following template:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL connection string
DATABASE_URL=postgres://username:password@hostname:5432/databasename?sslmode=require

# JWT secrets (use long, random strings in production)
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Token expiration durations
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Admin registration secret key
ADMIN_SECRET_KEY=super_secret_admin_registration_key

# Frontend origin for CORS
CLIENT_URL=http://localhost:3000
```

**Notes:**
- `DATABASE_URL` must point to a live PostgreSQL database.
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` should be unique, randomly generated strings of at least 32 characters.
- `ADMIN_SECRET_KEY` is required when registering a new admin account through the `/admin-signup` route.

---

## Database Migrations

The database schema is managed through plain SQL migration files inside `backend/migrations/`. They must be applied in order:

| File                                    | Description                                        |
|-----------------------------------------|----------------------------------------------------|
| `001_init_users.sql`                    | Creates the `users` table with role constraint     |
| `002_user_sessions.sql`                 | Creates the `user_sessions` table for refresh tokens |
| `003_create_stores.sql`                 | Creates the `stores` table                         |
| `004_create_employees_table.sql`        | Creates the `employees` table linking users to stores |
| `005_add_rating_fields_to_stores.sql`   | Adds `avgrating` and `total_review_user` to stores |
| `006_add_ratings_unique.sql`            | Adds unique constraint on (store_id, user_id) in ratings |

To run all migrations at once, use:

```bash
npm run migrate
```

---

## API Overview

All API routes are prefixed with `/api/v1`. The full interactive documentation is available via Swagger at `http://localhost:5000/api-docs` when the server is running.

| Group                    | Base Path                      | Access         | Description                          |
|--------------------------|--------------------------------|----------------|--------------------------------------|
| Authentication           | `/api/v1/auth`                 | Public         | Login, signup, refresh, logout, change password |
| Admin Users              | `/api/v1/admin/users`          | ADMIN only     | List, create, and view user profiles |
| Admin Stores             | `/api/v1/admin/stores`         | ADMIN only     | Create and list store locations      |
| Admin Dashboard          | `/api/v1/admin/dashboard`      | ADMIN only     | Platform statistics                  |
| Owner Employees          | `/api/v1/owner/stores`         | STORE_OWNER    | List and manage branch employees     |
| Shared Stores and Ratings| `/api/v1/stores`               | All logged-in  | Browse stores, submit and read reviews |
| Health Check             | `/health`                      | Public         | Server and database status check     |

---

## User Roles

| Role          | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| `USER`        | Standard customer account. Can browse stores, submit reviews, and read feedback. |
| `STORE_OWNER` | Assigned to a store location. Can manage employees and view customer reviews.   |
| `ADMIN`       | Full platform access. Can manage all users, stores, ratings, and system settings. |

Roles are assigned at account creation and enforced on every protected route through JWT claims and middleware checks.

---

## Application Routes

| Path                  | Access               | Description                            |
|-----------------------|----------------------|----------------------------------------|
| `/login`              | Public               | User login page                        |
| `/signup`             | Public               | New user registration                  |
| `/admin-signup`       | Public (secret key)  | Admin account registration             |
| `/`                   | All logged-in users  | Home page with store search and reviews|
| `/profile`            | All logged-in users  | User profile and password change       |
| `/settings`           | All logged-in users  | Theme toggle and session management    |
| `/admin-dashboard`    | ADMIN only           | System administration panel            |
| `/store-owner`        | STORE_OWNER only     | Store management dashboard             |
| `/stores/:id`         | ADMIN, STORE_OWNER   | Store detail and review page           |
