# Career Copilot v2 API Integration Guide (AI Copilot Engine)

Welcome to the frontend API integration documentation for the **Career Copilot v2 AI features**. This guide covers the request structures, responses, and validation requirements for the new AI-powered copilot capabilities.

---

## 1. Authentication & Base Path
All endpoints require a valid JWT token passed in the Authorization header:
```http
Authorization: Bearer <your_access_token>
```
Base URL path for all AI endpoints:
```http
http://localhost:5000/api/v1/ai
```

---

## 2. API Endpoints Reference

### A. Tailor Resume (`POST /ai/resume`)
Generates tailored resume text based on an existing resume and a target job description.

#### Request Body
```json
{
  "resumeId": "607f1f77bcf86cd799439012",
  "jobId": "607f1f77bcf86cd799439010",
  "customPrompt": "Emphasize my cloud architecture and leadership skills" // Optional
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Tailored resume generated successfully",
  "data": {
    "tailoredContent": "# John Doe\n\n## Summary\nExperienced Cloud Architect...",
    "skills": ["Cloud Architecture", "Leadership", "Agile"],
    "technologies": ["AWS", "Docker", "Kubernetes"],
    "domains": ["SaaS", "Fintech"]
  }
}
```

---

### B. Save Tailored Resume (`POST /ai/resume/save`)
Saves a generated tailored resume text to the local disk and registers it as a new resume record.

#### Request Body
```json
{
  "resumeId": "607f1f77bcf86cd799439012",
  "jobId": "607f1f77bcf86cd799439010",
  "tailoredContent": "# John Doe\n\n## Summary\nExperienced Cloud Architect...",
  "title": "Tailored Resume - AWS Role at Acme Corp", // Optional (defaults to "Tailored Resume - <Company>")
  "skills": ["Cloud Architecture", "Leadership", "Agile"],
  "technologies": ["AWS", "Docker", "Kubernetes"],
  "domains": ["SaaS", "Fintech"]
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Tailored resume saved successfully",
  "data": {
    "resume": {
      "id": "607f1f77bcf86cd799439099",
      "userId": "607f1f77bcf86cd799439011",
      "title": "Tailored Resume - AWS Role at Acme Corp",
      "fileUrl": "/uploads/resumes/tailored-1782831222828-607f1f77bcf86cd799439012.md",
      "filePath": "D:\\CareerCopilot\\career-copilot-be\\uploads\\resumes\\tailored-1782831222828-607f1f77bcf86cd799439012.md",
      "fileType": "md",
      "fileSize": 1420,
      "isDefault": false,
      "skills": ["Cloud Architecture", "Leadership", "Agile"],
      "technologies": ["AWS", "Docker", "Kubernetes"],
      "domains": ["SaaS", "Fintech"],
      "createdAt": "2026-06-30T20:34:28.000Z",
      "updatedAt": "2026-06-30T20:34:28.000Z"
    }
  }
}
```

---

### C. Generate Cover Letter (`POST /ai/cover-letter`)
Generates a personalized, professional cover letter matching a specific job description and candidate resume.

#### Request Body
```json
{
  "resumeId": "607f1f77bcf86cd799439012",
  "jobId": "607f1f77bcf86cd799439010",
  "customPrompt": "Keep it under 350 words and maintain an enthusiastic tone" // Optional
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Cover letter generated successfully",
  "data": {
    "coverLetter": "Dear Hiring Manager,\n\nI am writing to express my strong interest in..."
  }
}
```

---

### D. Generate Referral Message (`POST /ai/referral-message`)
Drafts a tailored outreach message asking a networking contact for a referral.

#### Request Body
```json
{
  "resumeId": "607f1f77bcf86cd799439012",
  "jobId": "607f1f77bcf86cd799439010",
  "referrerName": "Sarah Jenkins", // Optional
  "platform": "LinkedIn", // Optional (Defaults to "LinkedIn", e.g. "Email", "Cold Message")
  "customPrompt": "Make it brief and mention our mutual connection at Acme" // Optional
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Referral message generated successfully",
  "data": {
    "message": "Hi Sarah,\n\nI hope you're doing well. I saw Acme Corp is hiring..."
  }
}
```

---

### E. Skill Gap Analyzer (`POST /ai/skill-gap`)
Runs a deep semantic matching analysis between a resume and a job description to calculate a match score and list missing requirements alongside recommendations.

#### Request Body
```json
{
  "resumeId": "607f1f77bcf86cd799439012",
  "jobId": "607f1f77bcf86cd799439010"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Skill gap analysis completed successfully",
  "data": {
    "score": 78,
    "matchedSkills": ["TypeScript", "Node.js", "Express", "MongoDB"],
    "missingSkills": ["AWS Lambda", "Redis", "Docker"],
    "recommendations": [
      "Learn basic Redis caching mechanisms.",
      "Deploy a microservice to AWS Lambda using Serverless framework.",
      "Add a project to your resume demonstrating Docker container deployment."
    ]
  }
}
```

---

## 3. Standard Validation Errors
If any validation fails (e.g. invalid object ID format or missing fields), the API returns a `400 Bad Request` payload:
```json
{
  "success": false,
  "message": "Validation failed / Friendly error description",
  "errors": [
    { "field": "resumeId", "message": "Resume ID is required" }
  ]
}
```
