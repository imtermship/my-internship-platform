# Backend Setup Instructions

## Install Dependencies
```bash
cd backend
npm install
```

## Environment Variables
Create `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/my_internship
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5000
```

## Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`