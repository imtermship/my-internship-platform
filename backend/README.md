# Backend

Node.js + Express API server for MY Internship Platform

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Folder Structure

```
src/
├── server.js              # Express app entry
├── config/               # Configuration
├── database/             # Database connections & migrations
├── middleware/           # Auth, validation, error handling
├── routes/               # API routes
├── controllers/          # Business logic
├── models/               # Database queries
├── services/             # Business services (PDF, notifications)
└── utils/                # Helper functions
```

## API Endpoints

See `docs/API.md` for complete endpoint documentation
