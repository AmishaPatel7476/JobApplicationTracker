# Job Application Tracker

A full-stack MERN web application developed for IFN666 Assessment 2.

The Job Application Tracker helps users manage job applications, companies, and interviews in one place. Users can register, log in securely, add companies, create applications, schedule interviews, and track their progress throughout the job search process.

---

## Features

- User registration and login with JWT authentication
- Protected routes for authenticated users only
- CRUD operations for companies
- CRUD operations for job applications
- CRUD operations for interviews
- Nested routes for company applications and application interviews
- Search, filter, sort, and pagination functionality
- Ownership protection so users can only access their own data
- Validation middleware for secure and accurate input
- Responsive frontend built with React and Mantine UI
- REST API built with Express and MongoDB
- Deployment using PM2 and Caddy on Linux server

---

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Mantine UI
- Mantine Notifications
- Tabler Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv

### Deployment

- PM2
- Caddy
- Linux Server

---

## Project Structure

JobApplicationTracker_API/
│
├── client/
│
├── server/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── applicationController.js
│   │   │   ├── authController.js
│   │   │   ├── companyController.js
│   │   │   └── interviewController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── ownershipMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── models/
│   │   │   ├── Application.js
│   │   │   ├── Company.js
│   │   │   ├── Interview.js
│   │   │   └── User.js
│   │   └── routes/
│   │       ├── applicationRoutes.js
│   │       ├── authRoutes.js
│   │       ├── companyRoutes.js
│   │       ├── index.js
│   │       └── interviewRoutes.js
│   ├── .env
│   ├── package.json
│   ├── README.md
│   └── server.js
│
├── Caddyfile
└── README.md

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd JobApplicationTracker_API

Install frontend dependencies
cd client
npm install

## Install frontend dependencies
cd ../server
npm install

## Install backend dependencies
cd ../server
npm install

## Environment Variables
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

##Create a .env.production file inside the client folder.
VITE_BASE_API=/assessment02/api

##Running the Application Locally
cd server
npm run dev

## Start frontend
cd client
npm run dev

##Frontend runs on:
http://localhost:5173

##Backend runs on:
http://localhost:5000

API Routes
Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Companies
GET /api/companies
POST /api/companies
GET /api/companies/:id
PUT /api/companies/:id
DELETE /api/companies/:id
GET /api/companies/:companyId/applications
POST /api/companies/:companyId/applications

Interviews
GET /api/interviews
POST /api/interviews
GET /api/interviews/:id
PUT /api/interviews/:id
DELETE /api/interviews/:id

##Search, Sort and Pagination
The backend supports:

Search by company name, role title, interview outcome, status, notes, and more
Sorting by newest, oldest, salary, and alphabetical order
Pagination using page and limit query parameters
Pagination metadata through custom headers:
X-Total-Count
X-Total-Pages
X-Current-Page
Link

## Validation and Security
Password hashing using bcryptjs
JWT authentication for protected routes
Ownership middleware to prevent unauthorized access
Validation middleware for forms and requests
Global error handling middleware
Protected API routes with Bearer token authentication

##Deployment

The application is deployed on a Linux server using PM2 and Caddy.

## Frontend URL
https://jacaranda03.ifn666.com/assessment02/

## API URL
https://jacaranda03.ifn666.com/assessment02/api

## PM2 Command
pm2 start server.js --name assessment02-api

## Build Frontend
cd client
npm run build

## Copy Frontend Build
sudo cp -r dist/* /var/www/assessment02/

## Caddy Configuration
## jacaranda03.ifn666.com {

    handle /assessment02/api* {
        uri strip_prefix /assessment02
        reverse_proxy localhost:5000
    }

    handle_path /assessment02/* {
        root * /var/www/assessment02
        try_files {path} /index.html
        file_server
    }
}

## Database Models
User
name
email
password
Company
name
industry
location
website
notes
user
Application
roleTitle
status
applicationDate
salaryExpectation
resumeVersion
notes
company
user
Interview
round
interviewDate
mode
outcome
notes
application
Author

Amisha Patel
IFN666 Assessment 2