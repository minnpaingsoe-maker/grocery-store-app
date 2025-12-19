Grocery Store - Fullstack Starter
=================================

Structure:
- backend/  (Node.js + Express + Prisma + MySQL)
- client/   (React single-page app for customer + admin)

Quick start (after extracting):
1. Backend:
   cd backend
   copy .env.example to .env and update DATABASE_URL and JWT_SECRET
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev

2. Client:
   cd client
   npm install
   npm start

Notes:
- The project does not include node_modules. Install dependencies with npm install in each folder.
- For admin actions use a user with role='admin' in the database (you can create via /auth/register then update role in DB).
