# Career Copilot API Integration Guide for Frontend Developers

Welcome to the frontend API documentation for the **Career Copilot Backend**. This guide outlines all available routes, request formats, response bodies, and authentication requirements for integrating the user interfaces.

---

## 1. Global API Standards & Configuration

### Base URL
All API routes are prefixed with:
```
http://localhost:5000/api/v1
```

### Interactive Sandbox (Swagger UI)
When the local dev server is running, you can interactively explore and test endpoints at:
```
http://localhost:5000/docs
```

### Headers & Authentication
- **Public Endpoints:** Require no headers.
- **Private Endpoints (Authenticated):** Require an `Authorization` header with a valid JSON Web Token (JWT) access token:
  ```http
  Authorization: Bearer <your_access_token>
  ```
- **File Uploads:** Content-Type must be `multipart/form-data` (specifically for resume file posts).
- **JSON Payloads:** Content-Type must be `application/json` (default for all other post/put endpoints).

### Standard Success Response Envelope
All successful requests return the following format:
```json
{
  "success": true,
  "message": "Friendly success description text",
  "data": {
    // Return object containing requested resource(s)
  }
}
```

### Standard Error Response Envelope
All rejected requests (e.g. 400 Bad Request, 401 Unauthorized, 404 Not Found, 409 Conflict) return the following format:
```json
{
  "success": false,
  "message": "Validation failed / Friendly error description",
  "errors": [
    // Array of details. E.g., for Zod validation errors:
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

---

## 2. API Endpoints Reference by Module

### A. Authentication Module (`/auth`)

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | **Public** | Create a new user account |
| `POST` | `/auth/login` | **Public** | Authenticate credentials and return Access/Refresh tokens |
| `POST` | `/auth/refresh-token` | **Public** | Exchange a valid Refresh token for a new token pair |
| `POST` | `/auth/logout` | **Private** | Revoke all issued sessions (invalidates current Refresh tokens) |

#### Registration Request Payload:
```json
{
  "email": "developer@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login Success Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "607f1f77bcf86cd799439011",
      "email": "developer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "preferences": { "theme": "light", "notificationsEnabled": true },
      "createdAt": "2026-06-28T05:00:00.000Z",
      "updatedAt": "2026-06-28T05:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

#### Refresh Token Request Payload:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

### B. User Profile Module (`/users`)

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/profile` | **Private** | Fetch logged-in user profile & UI preferences |
| `PUT` | `/users/profile` | **Private** | Update profile fields or toggles (theme, notifications) |

#### Update Profile Request Payload (All fields optional):
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "preferences": {
    "theme": "dark",
    "notificationsEnabled": false
  }
}
```

---

### C. Resume Module (`/resumes`)

All actions are **Private** (Authenticated).

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/resumes` | **Private** | Upload a resume and trigger background AI parser |
| `GET` | `/resumes` | **Private** | Get listings of all resumes uploaded by user |
| `GET` | `/resumes/:id` | **Private** | Retrieve details, file URL, and extracted AI keywords for a specific resume |
| `PUT` | `/resumes/:id` | **Private** | Update resume title metadata or default flag |
| `DELETE` | `/resumes/:id` | **Private** | Delete resume from database and remove local file |

#### Upload Details:
- Must use `multipart/form-data`.
- Field name: `file` (Binary file, limit 5MB, PDF/DOC/DOCX only).
- Optional text field: `title` (User-defined resume identifier. Defaults to raw file name if blank).
- *Behavior:* Uploading parses text, sends it to Gemini API, extracts `skills`, `technologies`, and `domains`, and updates the resume record dynamically.

#### Update Resume Metadata Request Payload:
```json
{
  "title": "Senior React Developer Resume - Updated",
  "isDefault": true
}
```

---

### D. Jobs Module (`/jobs`)

All actions are **Private** (Authenticated).

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/jobs` | **Private** | Create a job entry and trigger automatic description parsing |
| `GET` | `/jobs` | **Private** | List all job descriptions registered by user |
| `GET` | `/jobs/:id` | **Private** | Get full job description metadata and extracted keywords |
| `PUT` | `/jobs/:id` | **Private** | Update job details (title, company, description, etc.) |
| `DELETE` | `/jobs/:id` | **Private** | Delete job entry |
| `POST` | `/jobs/:id/match-resumes` | **Private** | Run matching engine to compare all user resumes against this job |

#### Create / Update Job Request Payload:
```json
{
  "title": "Senior TypeScript Developer",
  "company": "Acme Corp",
  "location": "Remote, USA",
  "description": "Looking for an expert with TypeScript, Node.js, Express, React, and MongoDB...",
  "url": "https://linkedin.com/jobs/view/12345",
  "salary": "$120,000 - $140,000",
  "status": "active" // Optional: "active", "archived", "draft"
}
```

#### Match Resumes Response (`POST /jobs/:id/match-resumes`):
Returns resumes graded and sorted in descending order of match percentage. Recommendation status flags `RECOMMENDED` if score >= 80, otherwise `USER_DECISION_REQUIRED`.
```json
{
  "success": true,
  "message": "Resumes matched successfully",
  "data": {
    "matches": [
      {
        "resumeId": "607f1f77bcf86cd799439012",
        "resumeTitle": "TypeScript Lead Resume",
        "score": 92,
        "matchedSkills": ["TypeScript", "Node.js", "Express", "React", "MongoDB"],
        "missingSkills": [],
        "recommendationStatus": "RECOMMENDED"
      },
      {
        "resumeId": "607f1f77bcf86cd799439013",
        "resumeTitle": "Legacy Backend Resume",
        "score": 60,
        "matchedSkills": ["Node.js", "MongoDB"],
        "missingSkills": ["TypeScript", "Express", "React"],
        "recommendationStatus": "USER_DECISION_REQUIRED"
      }
    ]
  }
}
```

---

### E. Applications Module (`/applications`)

All actions are **Private** (Authenticated).

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/applications` | **Private** | Link a resume to a job and create an application tracking pipeline |
| `GET` | `/applications` | **Private** | List all applications along with nested job and resume info |
| `PATCH` | `/applications/:id/status` | **Private** | Progress the application status and log note in history timeline |
| `DELETE` | `/applications/:id` | **Private** | Delete application record |

#### Create Application Request Payload:
```json
{
  "jobId": "607f1f77bcf86cd799439010",
  "resumeId": "607f1f77bcf86cd799439012", // Optional
  "status": "applied", // Optional. Defaults to "applied". Enums: applied, interviewing, offered, rejected, withdrawn
  "appliedAt": "2026-06-28T05:30:00.000Z", // Optional
  "note": "Applied through company career website portal." // Optional
}
```

#### Update Application Status Request Payload:
```json
{
  "status": "interviewing",
  "note": "Scheduled 1st round technical video call."
}
```

---

### F. Referral Module (`/referrals`)

All actions are **Private** (Authenticated).

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/referrals` | **Private** | Log a job referral contact and request |
| `GET` | `/referrals` | **Private** | List referral log entries |
| `PATCH` | `/referrals/:id/status` | **Private** | Update referral request state |
| `DELETE` | `/referrals/:id` | **Private** | Delete referral entry |

#### Create Referral Request Payload:
```json
{
  "jobId": "607f1f77bcf86cd799439010",
  "referrerName": "Sarah Jenkins",
  "referrerEmail": "sarah.j@acme.com", // Optional
  "referrerContact": "+123456789", // Optional
  "status": "pending", // Optional: pending, referred, declined
  "notes": "Sent cold message on LinkedIn. She agreed to refer." // Optional
}
```

#### Update Referral Status Request Payload:
```json
{
  "status": "referred",
  "notes": "She confirmed submission in internally-referred portal."
}
```

---

### G. Follow-Up Task Module (`/followups`)

All actions are **Private** (Authenticated).

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/followups` | **Private** | Create a reminder task |
| `GET` | `/followups` | **Private** | List pending follow-ups |
| `PATCH` | `/followups/:id/status` | **Private** | Update status (`pending` or `completed`) |
| `DELETE` | `/followups/:id` | **Private** | Delete task reminder |

#### Create Follow-Up Request Payload:
```json
{
  "jobId": "607f1f77bcf86cd799439010", // Optional
  "title": "Send thank you note",
  "description": "Follow up with Sarah and hiring manager after technical screen.",
  "dueDate": "2026-07-02T12:00:00.000Z"
}
```

#### Update Follow-Up Status Request Payload:
```json
{
  "status": "completed"
}
```

---

### H. Notifications Module (`/notifications`)

All actions are **Private** (Authenticated).

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/notifications` | **Private** | Create a new notification (primarily internally generated, can be used for mock testing) |
| `GET` | `/notifications` | **Private** | List notifications for caller (optionally filter with `?isRead=false` query parameter) |
| `POST` | `/notifications/mark-all-read` | **Private** | Set read state for all notifications |
| `GET` | `/notifications/:id` | **Private** | Fetch detail log of a notification |
| `PUT` | `/notifications/:id` | **Private** | Edit notification parameters |
| `PATCH` | `/notifications/:id/read` | **Private** | Mark a single notification as read |
| `DELETE` | `/notifications/:id` | **Private** | Remove a notification entry |

---

### I. Dashboard Summary Module (`/dashboard`)

All actions are **Private** (Authenticated).

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/summary` | **Private** | Retrieve card totals: jobs, resumes, pipeline status distributions, referral states, and pending follow-ups |
| `GET` | `/dashboard/recent-activity` | **Private** | Fetch a chronological merged timeline (last 10 events) of user activity |
| `GET` | `/dashboard/upcoming-actions` | **Private** | Fetch pending reminders (followups) sorted by due date, alongside unread notifications counts |

#### Dashboard Summary Response Example:
```json
{
  "success": true,
  "message": "Dashboard summary metrics retrieved successfully",
  "data": {
    "summary": {
      "jobsCount": 15,
      "resumesCount": 3,
      "applicationsCount": {
        "total": 10,
        "applied": 5,
        "interviewing": 3,
        "offered": 1,
        "rejected": 1,
        "withdrawn": 0
      },
      "referralsCount": {
        "total": 4,
        "pending": 2,
        "referred": 2,
        "declined": 0
      },
      "pendingFollowUpsCount": 5
    }
  }
}
```

---

### J. Analytics Module (`/analytics`)

All actions are **Private** (Authenticated).

| Method | Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/analytics/resumes` | **Private** | Fetch performance statistics per resume document (success & interview rates) |
| `GET` | `/analytics/applications` | **Private** | Fetch monthly application volumes over time (grouped by YYYY-MM) |
| `GET` | `/analytics/sources` | **Private** | Retrieve referral source platform counts parsed from job descriptions' URLs |
| `GET` | `/analytics/conversions` | **Private** | Funnel conversion calculation percentages (applied -> interviewed -> offered) |

#### Funnel Conversions Response Example (`GET /analytics/conversions`):
```json
{
  "success": true,
  "message": "Stage progression conversion analysis retrieved successfully",
  "data": {
    "conversions": {
      "funnel": {
        "applied": 12,
        "interviewed": 6,
        "offered": 2
      },
      "rates": {
        "appliedToInterviewRate": 50,
        "interviewToOfferRate": 33.33,
        "overallSuccessRate": 16.67
      }
    }
  }
}
```
