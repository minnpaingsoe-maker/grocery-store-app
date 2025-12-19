Backend (Node.js + Express + Prisma + MySQL)
------------------------------------------

1. Copy .env.example to .env and update DATABASE_URL and JWT_SECRET.
2. From backend/ run: npm install
3. Initialize Prisma client and database:
   npx prisma generate
   npx prisma migrate dev --name init
4. Start server:
   npm run dev
