🛒 Grocery Store – Full Stack Web Application

A full-stack grocery store web application built with ReactJS, Node.js (Express), MySQL, and Prisma ORM.
The application supports user authentication, shopping cart functionality, order management, and an admin dashboard for product and order management.

🚀 Tech Stack
Frontend

ReactJS (Functional Components & Hooks)

Axios

CSS (Custom styling)

Backend

Node.js

Express.js

Prisma ORM

JWT Authentication

Database

MySQL

✨ Features
User

User registration & login (JWT authentication)

Browse products

Add/remove items from cart

Place orders

View order history

Admin

Secure admin login

Product management (Create, Read, Update, Delete)

Stock level indicators (low-stock warning)

View all user orders

Revenue dashboard

📂 Project Structure
grocery-store-app/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── App.js
│   └── package.json
└── README.md

🔐 Environment Variables

Create a .env file inside the backend directory:

DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/grocerydb"
JWT_SECRET="your_jwt_secret"
PORT=4000


Replace USERNAME and PASSWORD with your MySQL credentials.

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/minnpaingsoe-maker/grocery-store-app.git
cd grocery-store-app

2️⃣ Backend Setup
cd backend
npm install

Prisma setup
npx prisma generate
npx prisma migrate dev --name init
npm run seed

Start backend server
npm run dev


Backend will run on:

http://localhost:4000

3️⃣ Frontend Setup

Open a new terminal:

cd client
npm install
npm start


Frontend will run on:

http://localhost:3000


Optional (if React strict mode causes issues):

npm run start:no-strict

🧪 Admin Access

To access the Admin Dashboard:

Login using an admin account (created via seed or database)

Admin-only routes are protected using middleware

📸 Screenshots (Optional but Recommended)

Add screenshots of:

Home page

Admin dashboard

Product management

Orders page

(Employers love this.)

📌 Future Improvements

Product search & filters

Pagination

Order status management

Deployment (Render / Railway / Vercel)

👨‍💻 Author

Minn Paing Soe
Aspiring Full-Stack Developer
GitHub: https://github.com/minnpaingsoe-maker

⭐ Notes for Employers

This project demonstrates:

Full-stack development skills

RESTful API design

Authentication & authorization

Database schema design

Admin dashboard implementation