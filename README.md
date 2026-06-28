# AI Job Application Assistant - Frontend

> A beautiful, responsive, and feature-rich React + TypeScript frontend application designed to optimize and streamline the job search, resume matching, application tracking, and referral process.

---

## 🌟 Project Vision

The frontend project acts as the user-facing command center for the **AI Job Application Assistant**. It empowers job seekers—especially software engineers, developers, and QA professionals—to manage their applications and optimize their job hunt from a single unified workspace.

Instead of manually editing resumes, managing chaotic spreadsheets, or writing repetitive emails, the frontend provides interactive interfaces to:
- **Manage Multiple Resumes:** Group resumes by category (e.g., React Resume, Full Stack Resume) and track usage counts.
- **Analyze Job Descriptions:** View parsed skills, keywords, and qualifications extracted from job descriptions.
- **Match Resumes and Score:** Instantly see match percentages (e.g., Resume A = 85%) and missing skills.
- **Track Applications (Kanban Board):** Monitor the lifecycle of applications through drag-and-drop stages (Saved, Applied, Assessment, Interview, Offer, Rejected).
- **Track Referrals:** Manage requested referrals, follow-up dates, and generate personalized referral request messages.
- **View Interactive Analytics:** Visualize application counts, conversion rates (interview/offer), resume performance, and job source performance.

---

## 🛠️ Technology Stack

The project uses a modern frontend development stack built for performance, strict type-safety, and smooth animations.

### Core Architecture
- **Framework:** React 19+
- **Build Tool:** Vite (for fast builds and hot module replacement)
- **Language:** TypeScript (configured in Strict Mode)

### Styling & UI
- **Styling:** Tailwind CSS (utility-first, responsive, and easily customized for Dark Mode)
- **Icons:** Lucide React (clean, consistent SVG icons)
- **Toasts & Notifications:** React Toastify
- **Charts:** Recharts (responsive and beautiful data visualizations)

### State & Server Communication
- **Global State Management:** Redux Toolkit (used primarily for auth status, theme preference, and UI state)
- **Server State Management:** React Query / TanStack Query (used exclusively for API caching, pagination, and data synchronization. *Rule: Avoid storing API data in Redux.*)
- **HTTP Client:** Axios (configured with interceptors for token refreshing and error handling)

### Forms & Validation
- **Form Management:** React Hook Form
- **Schema Validation:** Zod (ensures client-side validation aligns perfectly with API validation rules)

---

## 📂 Folder Structure

The project implements a **feature-based folder structure** to maintain isolation, readability, and ease of scaling.

```text
src/
├── app/                  # App initialization, routing config, global stores
│   ├── store/            # Redux Toolkit store and slices (auth, UI)
│   ├── routes/           # React Router router definition and navigation trees
│   └── providers/        # Global providers wrapper (Redux, React Query, Toastify)
│
├── features/             # Business features - self-contained modules
│   ├── auth/             # Login, Signup, Forgot Password screens
│   ├── dashboard/        # Main landing widgets, statistics, recent actions
│   ├── resumes/          # Resume upload, listing, keywords, details
│   ├── jobs/             # Job listings, job details, description analysis
│   ├── applications/     # Kanban board, drag-and-drop tracker, application details
│   ├── referrals/        # Referral lists, custom message generators
│   └── analytics/        # Recharts visualizations, conversion funnels
│
├── shared/               # Shared codebase across features
│   ├── components/       # Universal UI components (Buttons, Inputs, Tables, etc.)
│   ├── hooks/            # General purpose custom React hooks
│   ├── utils/            # Shared formatting and utility functions
│   ├── services/         # Axios client and generic API call configurations
│   ├── constants/        # System configuration, endpoints, and constants
│   ├── types/            # App-wide TypeScript interfaces and types
│   └── layouts/          # Common page frames (AuthLayout, DashboardLayout)
│
├── assets/               # Static assets (images, logos, styles)
└── main.tsx              # Application index entry point
```

---

## 🏗️ Reusable Component Library (`src/shared/components`)

To ensure design consistency and high aesthetic standards, reusable components must be built and documented in the **Design System Playground (`/design-system`)** before feature integration:

### Buttons
- `Primary Button`, `Secondary Button`, `Danger Button`, `Icon Button`, `Loading Button` (with built-in loading spinner states).

### Inputs
- `Text Input`, `Password Input` (with show/hide toggle), `Search Input`, `Text Area`, `Select` dropdowns, and `Multi Select` tags.

### Modals
- `Confirmation Modal` (generic actions), `Delete Modal` (destructive warnings), `Success Modal` (completion states).

### Cards
- `Statistic Card` (numeric info + trends), `Resume Card`, `Job Card`, `Application Card` (compact tracker details).

### Tables
- `Reusable Data Table` featuring out-of-the-box support for:
  - Column Sorting
  - Server-side and Client-side Pagination
  - Global/Column Searching
  - Advanced Filtering (e.g., status, match score, source)

### Badges
- Status indicator badges: `Applied` (blue), `Interview` (yellow), `Offer` (green), `Rejected` (red), `Pending` (gray).

---

## 🚦 Navigation & Routes

The application divides routing into public landing screens, authenticated private spaces, and developer environments.

### Public Routes
- `/login` - Credential entry with password recovery links.
- `/signup` - Registration form (Name, Email, Password, Confirmation).
- `/forgot-password` - Email recovery trigger page.

### Private Routes (Authenticated via DashboardLayout)
- `/dashboard` - Overview of job applications, upcoming actions, resume metrics, and follow-ups.
- `/resumes` - List uploaded resumes, upload a new resume, parse keywords, and examine analytics.
- `/jobs` - List jobs, add a job URL/description, analyze skills, and trigger resume matching.
- `/applications` - Interactive Kanban board showing the status of job applications with drag-and-drop capability.
- `/referrals` - Referral pipeline showcasing employee contacts, message generators, and statuses.
- `/analytics` - Charts tracking application frequency, interview rates, and job search success.
- `/settings` - Profile modifications, dark/light theme options, notification toggles, and default resume settings.

### Developer Utilities
- `/design-system` - **Design System Playground** containing previews of all shared components (Buttons, Inputs, Cards, Tables, Badges) in different states. Useful for testing UI components isolated from API calls.

---

## 📈 Sprint & Roadmap Plan (V1 MVP)

Frontend development is divided into nine clear sprints to match backend implementation:

### 🏁 Sprint 1: Project Setup
- Scaffold project with Vite + React + TypeScript.
- Install and configure Tailwind CSS, Redux Toolkit, React Query, and React Router DOM.

### 🧩 Sprint 2: Shared Components
- Build the core design system components.
- Set up the `/design-system` test playground route.

### 🔑 Sprint 3: Authentication Module
- Develop `Login`, `Signup`, and `Forgot Password` pages.
- Set up layouts, JWT local token storage, and protected route wrappers.

### 📊 Sprint 4: Dashboard Module
- Create dashboard widgets, summary stats cards, recent activity, and upcoming tasks.

### 📄 Sprint 5: Resume Module
- Build the `Resume List` and `Resume Upload` page (handling categories like Frontend/Backend/Full Stack).
- Build the `Resume Details` page showcasing parsed keywords, applications associated, and interview rates.

### 💼 Sprint 6: Job Module
- Create the `Job Listing` table and search filters.
- Develop `Add Job` screen (URLs and job descriptions).
- Implement the `Job Analysis` & `Resume Matching UI` (highlighting match percentages and recommended resumes).

### 📋 Sprint 7: Application Tracker
- Build the `Kanban Board` with interactive stages.
- Configure drag-and-drop status changes and `Application Details` view.

### 🤝 Sprint 8: Referral Tracker
- Build `Referrals List` showing current referral request pipelines.
- Create referral templates and automated outreach text generators.

### 📉 Sprint 9: Analytics
- Integrate Recharts to generate visual representations of:
  - Applications per month
  - Interview rates
  - Offer rates
  - Individual resume performance
  - Job source success rates

---

## 🎨 Quality & Design Standards

To ensure a premium, modern user experience, developers must follow these design guidelines:
1. **Glassmorphism & Rich Styling:** Use subtle shadows, rounded borders (`rounded-xl` / `rounded-2xl`), smooth gradients, and harmony-focused color schemes. Avoid standard browser colors.
2. **Mobile First & Responsive Layouts:** 
   - Sidebars must collapse into a hamburger menu (`☰ Menu`) on mobile.
   - Kanban boards must switch to scrollable horizontal grids, and cards must stack vertically.
3. **Strict TypeScript:** Explicitly define types for all states, component props, and API request/response structures. Do not use `any`.
4. **Optimal Performance:** Implement lazy loading and code splitting for routes using `React.lazy` and `Suspense`. Build skeleton UI loaders for asynchronous pages.
5. **SEO & Accessibility:** Write semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<section>`). Keep `id` tags unique on interactive elements.

---

## 🏆 Definition of Done (DoD)

A feature branch is ready for merge only when:
- [ ] TypeScript builds successfully with zero compiler errors.
- [ ] Responsive design functions perfectly on Desktop, Tablet, and Mobile.
- [ ] Shared components are referenced from `shared/components` rather than duplicated.
- [ ] No direct API data caching is placed in Redux (use React Query).
- [ ] Dark Mode class hooks (`dark:`) are configured and look visually balanced.
- [ ] Pull Request is raised from a clean branch named `feature/<feature-name>` pointing to `develop`.
- [ ] Walkthrough documentation of visual adjustments is ready for review.
