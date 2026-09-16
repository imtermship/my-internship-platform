# Getting Started with MY Internship Platform

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/imtermship/my-internship-platform.git
cd my-internship-platform
```

### 2. Setup Database
```bash
# Create database
creatdb my_internship

# Run SQL schema (from docs/DATABASE.md)
psql my_internship < database-schema.sql
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL
npm run dev
```

Backend runs on: `http://localhost:5000`

### 4. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 5. Test the App

**Register as Student:**
- Go to `http://localhost:3000/auth/login`
- Click "Register" (when implemented)
- Fill form: Email, Password, Role=Student
- Browse internships dashboard

**Register as Employer:**
- Go to `http://localhost:3000/auth/login`
- Role=Employer
- Access `http://localhost:3000/employer/dashboard`

## Project Structure

```
my-internship-platform/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express app entry
│   │   ├── config/
│   │   │   └── database.js           # PostgreSQL connection
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js               # Auth endpoints
│   │   │   ├── internships.js        # Internship endpoints
│   │   │   ├── applications.js       # Application endpoints
│   │   │   ├── placements.js         # Placement/completion endpoints
│   │   │   └── ...
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth business logic
│   │   │   ├── internshipController.js
│   │   │   ├── applicationController.js  # Accept/reject/verify
│   │   │   └── completionController.js   # PDF, completion
│   │   ├── database/
│   │   │   └── schema.md             # Database design
│   │   └── utils/
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── login.jsx         # Login page
│   │   │   ├── student/
│   │   │   │   └── internships.jsx   # Student dashboard
│   │   │   ├── employer/
│   │   │   │   └── dashboard.jsx     # Employer dashboard
│   │   │   ├── _app.jsx              # App wrapper
│   │   │   └── index.jsx             # Home/internship grid
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navigation
│   │   │   ├── Sidebar.jsx           # Employer sidebar
│   │   │   ├── InternshipCard.jsx    # Internship listing card
│   │   │   ├── ApplicationCard.jsx   # Application item
│   │   │   ├── ApplicationModal.jsx  # Apply form
│   │   │   ├── ApplicationReviewModal.jsx  # Accept/reject UI
│   │   │   ├── MetricCard.jsx        # Stats card
│   │   │   └── QuickActionCard.jsx   # Action button card
│   │   ├── lib/
│   │   │   ├── api.js                # API client & endpoints
│   │   │   ├── authStore.js          # Auth state (Zustand)
│   │   │   └── stores.js             # Internship/app state
│   │   ├── styles/
│   │   │   └── globals.css           # Tailwind + custom
│   │   └── tailwind.config.js        # Color system
│   ├── package.json
│   ├── .env.example
│   ├── next.config.js
│   ├── tsconfig.json
│   └── README.md
│
├── docs/
│   ├── API.md                        # Complete API docs
│   ├── DATABASE.md                   # Database setup
│   ├── ARCHITECTURE.md               # System design
│   └── GETTING_STARTED.md            # This file
│
└── README.md                         # Project overview
```

## Key Endpoints

### Authentication
```
POST   /api/auth/register      - User registration
POST   /api/auth/login         - User login
GET    /api/auth/verify        - Verify token (protected)
```

### Internships
```
GET    /api/internships        - List all internships
GET    /api/internships/:id    - Get internship details
POST   /api/internships        - Create internship (employer)
PUT    /api/internships/:id    - Update internship (employer)
```

### Applications
```
GET    /api/applications       - Get my applications
POST   /api/applications/submit        - Submit application
POST   /api/applications/accept        - Accept application
POST   /api/applications/reject        - Reject application
POST   /api/applications/verify        - Verify acceptance code
POST   /api/applications/confirm       - Confirm acceptance verification
```

### Placements
```
POST   /api/placements/mark-complete  - Complete internship
```

## Testing Workflow

### Test Accept/Reject Flow
```bash
# 1. Register employer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"employer@test.com","password":"pass123","firstName":"Company","lastName":"Co","role":"employer"}'

# 2. Register student
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"pass123","firstName":"John","lastName":"Doe","role":"student"}'

# 3. Create internship (employer token)
curl -X POST http://localhost:5000/api/internships \
  -H "Authorization: Bearer <employer-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Frontend Dev","description":"Build web apps","location":"Remote","workMode":"remote","startDate":"2026-10-01","endDate":"2026-12-31","durationWeeks":12,"salary":500}'

# 4. Apply (student token)
curl -X POST http://localhost:5000/api/applications/submit \
  -H "Authorization: Bearer <student-token>" \
  -H "Content-Type: application/json" \
  -d '{"internshipId":"<id>","coverLetter":"I love this role"}'

# 5. Accept (employer token)
curl -X POST http://localhost:5000/api/applications/accept \
  -H "Authorization: Bearer <employer-token>" \
  -H "Content-Type: application/json" \
  -d '{"applicationId":"<id>"}'

# Response includes: verificationCode, qrCode, pdfUrl

# 6. Verify with code
curl -X POST http://localhost:5000/api/applications/verify \
  -H "Content-Type: application/json" \
  -d '{"verificationCode":"<code>"}'

# 7. Confirm (employer)
curl -X POST http://localhost:5000/api/applications/confirm \
  -H "Authorization: Bearer <employer-token>" \
  -H "Content-Type: application/json" \
  -d '{"acceptanceId":"<id>"}'
```

## Common Issues

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Solution: Ensure PostgreSQL is running
```bash
psql postgres  # Test connection
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### CORS Error
The backend is configured to accept requests from `http://localhost:3000`. Update if needed in `backend/src/server.js`

## Next Steps

1. **Complete Institution Dashboard**
   - View placements
   - View completion records
   - Auto-notifications

2. **Add Student Profile Management**
   - Education info
   - Skills
   - CV upload

3. **Add Company Profile Management**
   - Company verification
   - Company details
   - Logo upload

4. **Email Notifications**
   - Acceptance emails
   - Completion emails
   - Application status updates

5. **Admin Dashboard**
   - User management
   - Company verification
   - Dispute handling

6. **Implement AI Matching** (Future)
   - Student-to-internship recommendations
   - Skill gap analysis
   - Career guidance

## Support

For questions or issues:
1. Check `docs/API.md` for API details
2. Check `docs/DATABASE.md` for database setup
3. Check `docs/ARCHITECTURE.md` for system design
4. Open an issue on GitHub
