# MY Internship Platform - Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student" // or "employer", "institution", "admin"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

### Verify Token
**GET** `/auth/verify` *(Protected)*

**Response:**
```json
{
  "valid": true,
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "student"
  }
}
```

---

## 🏢 Internship Endpoints

### Get All Internships
**GET** `/internships?search=frontend&location=remote&workMode=hybrid&limit=20&offset=0`

**Response:**
```json
{
  "internships": [
    {
      "id": "uuid",
      "company_id": "uuid",
      "title": "Frontend Developer",
      "description": "Build amazing web apps",
      "location": "Remote",
      "work_mode": "remote",
      "start_date": "2026-10-01",
      "end_date": "2026-12-31",
      "duration_weeks": 12,
      "salary": 500,
      "status": "active",
      "created_at": "2026-09-16T00:00:00Z"
    }
  ],
  "total": 1
}
```

### Get Internship by ID
**GET** `/internships/:id`

**Response:**
```json
{
  "internship": {
    "id": "uuid",
    "title": "Frontend Developer",
    "description": "Build amazing web apps",
    "location": "Remote",
    "work_mode": "remote",
    "start_date": "2026-10-01",
    "end_date": "2026-12-31",
    "duration_weeks": 12,
    "salary": 500,
    "status": "active"
  }
}
```

### Create Internship
**POST** `/internships` *(Protected)*

**Request Body:**
```json
{
  "title": "Frontend Developer",
  "description": "Build amazing web apps",
  "location": "Remote",
  "workMode": "remote",
  "startDate": "2026-10-01",
  "endDate": "2026-12-31",
  "durationWeeks": 12,
  "salary": 500
}
```

**Response:**
```json
{
  "message": "Internship created successfully",
  "internship": {
    "id": "uuid",
    "title": "Frontend Developer",
    "description": "Build amazing web apps",
    "location": "Remote",
    "workMode": "remote",
    "startDate": "2026-10-01",
    "endDate": "2026-12-31"
  }
}
```

---

## 📝 Application Endpoints

### Get Applications
**GET** `/applications?role=employer` *(Protected)*

Role can be: `employer` or `student`

**Response:**
```json
{
  "applications": [
    {
      "id": "uuid",
      "internship_id": "uuid",
      "student_id": "uuid",
      "status": "applied",
      "cover_letter": "I am interested in this role...",
      "applied_at": "2026-09-16T10:00:00Z",
      "internship_title": "Frontend Developer",
      "student_name": "John Doe"
    }
  ]
}
```

### Submit Application
**POST** `/applications/submit` *(Protected)*

**Request Body:**
```json
{
  "internshipId": "uuid",
  "coverLetter": "I am interested in this role..."
}
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "applicationId": "uuid"
}
```

### Accept Application
**POST** `/applications/accept` *(Protected)*

**Request Body:**
```json
{
  "applicationId": "uuid"
}
```

**Response:**
```json
{
  "message": "Application accepted successfully",
  "acceptance": {
    "acceptanceId": "uuid",
    "verificationCode": "A1B2C3D4E5F6G7H8I9J0",
    "pdfUrl": "/uploads/acceptance-...-...-....pdf",
    "qrCode": "data:image/png;base64,...",
    "placementId": "uuid"
  }
}
```

### Reject Application
**POST** `/applications/reject` *(Protected)*

**Request Body:**
```json
{
  "applicationId": "uuid",
  "reason": "We selected another candidate"
}
```

**Response:**
```json
{
  "message": "Application rejected successfully"
}
```

### Verify Acceptance
**POST** `/applications/verify`

**Request Body:**
```json
{
  "verificationCode": "A1B2C3D4E5F6G7H8I9J0"
}
```

**Response:**
```json
{
  "verified": true,
  "acceptance": {
    "studentName": "John Doe",
    "company": "Tech Startup Co.",
    "internship": "Frontend Developer",
    "duration": "2026-10-01 - 2026-12-31",
    "status": "Accepted"
  }
}
```

### Confirm Acceptance
**POST** `/applications/confirm` *(Protected)*

**Request Body:**
```json
{
  "acceptanceId": "uuid"
}
```

**Response:**
```json
{
  "message": "Acceptance confirmed successfully"
}
```

---

## ✅ Placement Endpoints

### Mark Internship Complete
**POST** `/placements/mark-complete` *(Protected)*

**Request Body:**
```json
{
  "placementId": "uuid"
}
```

**Response:**
```json
{
  "message": "Internship marked as complete",
  "completionRecord": {
    "completionRecordId": "uuid",
    "pdfUrl": "/uploads/completion-...-....pdf",
    "completedAt": "2026-12-31T23:59:59Z"
  }
}
```

---

## 🎯 Complete Workflow Example

### 1. Student Registers
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"pass123","firstName":"John","lastName":"Doe","role":"student"}'
```

### 2. Student Browses Internships
```bash
curl http://localhost:5000/api/internships?search=frontend
```

### 3. Student Applies
```bash
curl -X POST http://localhost:5000/api/applications/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"internshipId":"<internship-id>","coverLetter":"I am interested..."}'
```

### 4. Employer Reviews and Accepts
```bash
curl -X POST http://localhost:5000/api/applications/accept \
  -H "Authorization: Bearer <employer-token>" \
  -H "Content-Type: application/json" \
  -d '{"applicationId":"<application-id>"}'
```

### 5. Student/Company Verifies Acceptance
```bash
curl -X POST http://localhost:5000/api/applications/verify \
  -H "Content-Type: application/json" \
  -d '{"verificationCode":"A1B2C3D4E5F6G7H8I9J0"}'
```

### 6. Company Confirms Verification
```bash
curl -X POST http://localhost:5000/api/applications/confirm \
  -H "Authorization: Bearer <employer-token>" \
  -H "Content-Type: application/json" \
  -d '{"acceptanceId":"<acceptance-id>"}'
```

### 7. Internship Completes
```bash
curl -X POST http://localhost:5000/api/placements/mark-complete \
  -H "Authorization: Bearer <employer-token>" \
  -H "Content-Type: application/json" \
  -d '{"placementId":"<placement-id>"}'
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided" or "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Something went wrong"
}
```

---

## Status Codes
- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server-side error
