# Project Feature Execution Plan

## Project Overview
The **AI Job Application Assistant - Frontend** is a modern, responsive web application built with React 19+, TypeScript, and Vite. It serves as an intuitive platform for job seekers to manage resumes, parse job descriptions, view AI-based matching scores, track job application statuses via an interactive Kanban board, send referral requests, and view analytics.

---

## Development Workflow

We follow a strict **feature-branch Git workflow** where code is developed in isolation, reviewed, and merged systematically.

```text
develop
   │
   ▼
Create Feature Branch (feature/<feature-name>)
   │
   ▼
Development (Local coding & linting)
   │
   ▼
Testing (Unit & Responsive viewport verification)
   │
   ▼
Pull Request (Pointing to develop branch)
   │
   ▼
Code Review (Peer/Architect approval)
   │
   ▼
Merge into develop
```

---

## Feature List

# Feature 01 - Project Setup

Branch
```bash
feature/project-setup
```

### Objective
Establish the primary scaffolding, core configurations, global routing, state infrastructure, and styling foundations for the frontend application.

### Tasks
* Folder Structure
* Routing configurations (Vite routing setup)
* Redux store setup (`app/store`)
* React Query provider setup (`app/providers`)
* Axios client setup with JWT interceptor skeletons
* Tailwind CSS initialization and style variables config
* Linting and format config (`eslint`, `prettier`)

### Deliverables
* Configured Vite + React 19 + TypeScript template
* Configured core directories (`app/`, `features/`, `shared/`)
* Base router boilerplate with public/private route templates
* Configured Tailwind CSS utility library
* Configured Redux Toolkit global store

### Dependencies
None.

### Estimated Complexity
* Small

### Acceptance Criteria
- [ ] TypeScript compilation passes with no errors.
- [ ] Tailwind styles compile and display correctly in a browser.
- [ ] Dev server runs seamlessly via `npm run dev`.
- [ ] Protected route wrappers redirect unauthenticated visitors to `/login` fallback.

---

# Feature 02 - Shared Components & Design Playground

Branch
```bash
feature/shared-components
```

### Objective
Build atomic, reusable UI components and an interactive developer playground route (`/design-system`) to test layouts, states, and responsive styling.

### Tasks
* Reusable Buttons (Primary, Secondary, Danger, Icon, Loading)
* Reusable Input fields (Text, Password with hide/show, Search, TextArea, Select, Multi-Select)
* Layout frameworks (AuthLayout, DashboardLayout, Sidebar, Navbar)
* Reusable Modals (Confirmation, Delete, Success)
* Reusable Badges (Status variations: Applied, Interview, Offer, Rejected, Pending)
* Reusable Data Table (implement pagination, sorting, search inputs, and filters)
* `/design-system` playground development with visual demonstrations of all variations

### Deliverables
* Complete set of atomic design components in `shared/components/`
* Responsive Dashboard layout with collapsible sidebar and hamburger navbar
* Reusable table component
* Functioning `/design-system` page displaying all component states

### Dependencies
* Feature 01 - Project Setup

### Estimated Complexity
* Medium

### Acceptance Criteria
- [ ] Components are completely styled using CSS variables or Tailwind tokens.
- [ ] Components look visually perfect on both desktop and mobile viewports.
- [ ] Shared components do not include hardcoded feature-specific API code.
- [ ] The Data Table successfully sorts, filters, and paginates mock data arrays.

---

# Feature 03 - Authentication Module

Branch
```bash
feature/authentication
```

### Objective
Implement user registration, secure login, password recovery workflow, and state preservation utilizing JWT tokens.

### Tasks
* Routing setup for public paths
* Login Page UI (implement React Hook Form & Zod validation)
* Register Page UI (with matching password validation checks)
* Forgot Password Page UI
* JWT token storage helper (localStorage / secure cookies)
* Redux state slices for credentials and loading status
* Axios Interceptors for bearer headers and automatic refresh tokens

### Deliverables
* User Login screen
* User Registration screen
* Password recovery request screen
* Interceptor handles token injections and unauthorized checks (401 redirects to `/login`)

### Dependencies
* Feature 01 - Project Setup
* Feature 02 - Shared Components & Design Playground

### Estimated Complexity
* Medium

### Acceptance Criteria
- [ ] User authentication forms check and trigger errors using Zod schemas.
- [ ] App retains login state on page refreshes.
- [ ] Tokens refresh automatically prior to expiration.
- [ ] Direct access to `/dashboard` redirects to `/login` if no valid tokens exist.

---

# Feature 04 - Profile & Settings Module

Branch
```bash
feature/settings
```

### Objective
Allow users to edit profile information, toggle application notification rules, change UI themes, and select a default resume category.

### Tasks
* User settings layout screen
* Edit Profile form inputs (Name, Email modifications)
* Dark Mode toggle implementation (interfacing Tailwind `.dark` root hooks)
* Notifications preferences checkboxes
* Default Resume selector dropdown
* API state integrations (react-query updates)

### Deliverables
* Profile settings screen
* UI preferences persistence
* Integration with Profile API endpoints

### Dependencies
* Feature 03 - Authentication Module

### Estimated Complexity
* Small

### Acceptance Criteria
- [ ] Theme toggles between Light and Dark mode instantly across all dashboard views.
- [ ] Settings changes validate correct schemas via Zod before API submits.
- [ ] Settings correctly load and display saved DB configurations upon entry.

---

# Feature 05 - Dashboard Overview

Branch
```bash
feature/dashboard
```

### Objective
Generate the main interactive landing portal displaying aggregate metrics, active items, and quick action widgets.

### Tasks
* Statistic Cards (Total Jobs, Applied, Interviews, Offers, Rejections, Pending Referrals)
* Recent Activity feed
* Upcoming Follow-Ups widget (with dates and shortcuts)
* Resume Performance cards (interview rates per category)
* API connection integrations (React Query hook fetches dashboard overview)

### Deliverables
* Combined dashboard dashboard metrics portal
* Responsive grid cards adjusting metrics for mobile
* Actionable navigation redirections from overview panels

### Dependencies
* Feature 03 - Authentication Module
* Feature 04 - Profile & Settings Module

### Estimated Complexity
* Medium

### Acceptance Criteria
- [ ] Metrics reflect true numbers fetched from the backend `/dashboard/summary` APIs.
- [ ] Responsive grid aligns columns logically from 1 (mobile) to 4 (desktop).
- [ ] Follow-up action clicks navigate to the relevant application detail window.

---

# Feature 06 - Resume Management

Branch
```bash
feature/resumes
```

### Objective
Provide interfaces for resume listing, document uploading, parsing statuses, and individual resume analytics metadata displays.

### Tasks
* Resume listing grid UI (shows resume cards with category, upload date, keywords)
* Upload resume form (file drag-and-drop, resume name input, category selections)
* Resume Details view page
* Extracted Keywords visual tag cloud
* Linked applications list
* Delete resume flow with verification prompts

### Deliverables
* Resume list page
* File upload modal/form (integrated with backend Cloudinary / upload service)
* Resume details page (parsed keywords, usage rate stats)

### Dependencies
* Feature 03 - Authentication Module
* Feature 05 - Dashboard Overview

### Estimated Complexity
* Medium

### Acceptance Criteria
- [ ] Supports PDF and DOCX files with size checks.
- [ ] Displays parsed keywords returned from backend parser.
- [ ] Confirming resume deletion triggers correct cleanup and list refreshes.

---

# Feature 07 - Job Module & Resume Match UI

Branch
```bash
feature/jobs
```

### Objective
Construct job tracking records, description analysis, and interactive match diagnostics scoring UI.

### Tasks
* Job Listing view (uses Reusable Data Table with filter options)
* Add Job form UI (Company, Role, Source, URL, Job Description textarea)
* Job Detail details page (parsed requirements and skills)
* Match Results card (compares job keywords vs resume keywords)
* Recommended Resumes scoring list (renders match percentages and recommendations)

### Deliverables
* Job creation and listing features
* Detailed Job Description parser response display
* Resume matching score diagnostics panel (scores and comparison lists)

### Dependencies
* Feature 06 - Resume Management

### Estimated Complexity
* Large

### Acceptance Criteria
- [ ] Match diagnostic scores calculate and render matching stats cleanly.
- [ ] Recommended Resumes badge highlights high-match candidates (> 80%).
- [ ] Interface allows single-click selection to lock in recommended resumes.

---

# Feature 08 - Application Tracker (Kanban Board)

Branch
```bash
feature/applications
```

### Objective
Develop a visual drag-and-drop workspace representing the progress of active job applications.

### Tasks
* Kanban Board UI grid (Columns: Saved, Applied, Assessment, Interview, Offer, Rejected)
* Drag and drop library implementation (e.g., `@hello-pangea/dnd`)
* Kanban Card items UI
* Application Details modal panel (shows dates, linked resume, interview notes, referral attachment)
* Status updates trigger APIs (updates board positions dynamically)

### Deliverables
* Interactive Kanban Board page
* Drag-and-drop event handles updating server state
* Application detailed view & notes editor

### Dependencies
* Feature 07 - Job Module & Resume Match UI

### Estimated Complexity
* Large

### Acceptance Criteria
- [ ] Dragging columns triggers API calls that update status successfully.
- [ ] Kanban boards become swipeable horizontal scroll grids on mobile screen size.
- [ ] Details panel allows editing dates and comments with automatic updates.

---

# Feature 09 - Referral Module

Branch
```bash
feature/referrals
```

### Objective
Track employee referral pipelines and assist outreach efforts with AI-generated templates.

### Tasks
* Referral tracking table UI (displays contact details, company, outreach dates, status)
* Add Referral workflow dialog
* Referral detail sidebar panel
* Template selector & Copy-to-Clipboard options for generated copy messages

### Deliverables
* Referrals table page
* Form dialog for adding referrers
* AI copy template display sidebar (with copy feedback indicators)

### Dependencies
* Feature 08 - Application Tracker (Kanban Board)

### Estimated Complexity
* Medium

### Acceptance Criteria
- [ ] Templates load copy text placeholders.
- [ ] Outreach status transitions (Pending -> Sent -> Accepted) reflect in list views.
- [ ] Clipboard actions give immediate visual copy confirmations.

---

# Feature 10 - Analytics & Reports

Branch
```bash
feature/analytics
```

### Objective
Build responsive charts summarizing conversion percentages, pipeline throughput, and resume efficiency.

### Tasks
* Monthly application graphs (using Recharts Area / Bar charts)
* Interview conversions pie/funnel metrics
* Job source efficiency charts (e.g. LinkedIn vs Naukri success rates)
* Resume efficiency comparison panels
* Analytics dates and categories filter hooks

### Deliverables
* Metrics dashboards with filter forms
* Interactive chart widgets using live backend metrics data

### Dependencies
* Feature 08 - Application Tracker (Kanban Board)
* Feature 09 - Referral Module

### Estimated Complexity
* Medium

### Acceptance Criteria
- [ ] Charts render and animate smoothly upon load.
- [ ] UI remains accessible with descriptive tooltips for graphs.
- [ ] Charts resize fluidly on mobile screen sizes.

---

## Suggested Development Order

1. **Project Setup** (`feature/project-setup`): Base dependencies, store structure, and routing framework.
2. **Shared Components & Design Playground** (`feature/shared-components`): Establish UI system blocks first.
3. **Authentication Module** (`feature/authentication`): Secure route restrictions before building user actions.
4. **Profile & Settings Module** (`feature/settings`): Manage custom profile parameters and themes.
5. **Dashboard Overview** (`feature/dashboard`): Portal overview container coordinates all active data metrics.
6. **Resume Management** (`feature/resumes`): Resume uploads form the core resource for matching actions.
7. **Job Module & Resume Match UI** (`feature/jobs`): Ingest job roles and compare with active resumes.
8. **Application Tracker (Kanban Board)** (`feature/applications`): Map job matches into drag-and-drop tracks.
9. **Referral Module** (`feature/referrals`): Coordinate network referrals for active applications.
10. **Analytics & Reports** (`feature/analytics`): Final charts summarizing entire system data.

---

## Milestones

| Sprint | Features | Status |
| ------ | -------- | ------ |
| Sprint 1 | Project Setup, Base Components | ⏳ Pending |
| Sprint 2 | Shared Design Playground | ⏳ Pending |
| Sprint 3 | Authentication | ⏳ Pending |
| Sprint 4 | Dashboard, Settings | ⏳ Pending |
| Sprint 5 | Resume Upload & Keyword Parse | ⏳ Pending |
| Sprint 6 | Job Intake & Matching Engine UI | ⏳ Pending |
| Sprint 7 | Application Kanban Board | ⏳ Pending |
| Sprint 8 | Referral Tracker & Copy Templates | ⏳ Pending |
| Sprint 9 | Analytics & Visual Charts | ⏳ Pending |

---

## Git Commands

### Starting a Feature

Always pull latest changes before writing code:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/authentication
```

### Committing Progress

Use descriptive conventional commits:
```bash
git add .
git commit -m "feat(auth): implement login form with zod schema validation"
git push origin feature/authentication
```

### Merging and Branch Cleanup

```text
1. Push branch to remote.
2. Open Pull Request to 'develop' branch.
3. Pass all automated lints & compile steps.
4. Obtain architect / peer code review approval.
5. Merge PR on remote repository.
```
Locally, clean up branches:
```bash
git checkout develop
git pull origin develop
git branch -d feature/authentication
```

---

## Best Practices

* **One Feature Per Branch:** Never combine unrelated tasks inside the same feature branch.
* **Small, Atomic Commits:** Commit often with clear details. Maintain conventional commit formats.
* **Strict TypeScript:** Enable and keep strict compiler configurations. Do not use `any`.
* **No Cache Duplications:** Fetch server states with React Query. Do not sync local duplicates in Redux store.
* **Responsive Layout Design:** Implement dark mode classes (`dark:`) and test fluid viewports on all screen frames.
* **Document and Assert:** Update project markdown guides, write tests, and verify components in the Playground before merging.
