# Job Application Tracker API

## Project Overview

The Job Application Tracker API is a RESTful backend application developed using Node.js, Express.js, MongoDB, and Mongoose.

Purpose of the Application

The Job Application Tracker API is a RESTful backend application developed for IFN666 Assessment 02. The purpose of this application is to help users manage and organise their job search process in one place.

Searching for jobs often involves applying to multiple companies, keeping track of application statuses, remembering interview dates, and storing notes about each opportunity. Without a structured system, it can become difficult to manage large numbers of applications and interviews.

This application solves that problem by allowing users to create an account and securely log in to their own personalised dashboard. Once logged in, users can store information about companies they are interested in, create job applications linked to those companies, and record interviews related to specific applications.

The application includes:

* User authentication with JWT
* CRUD operations for Companies
* CRUD operations for Applications
* CRUD operations for Interviews
* Relationships between Companies, Applications, and Interviews
* Search, sorting, and pagination
* Protected routes using middleware
* MongoDB Atlas database connection

---

## Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* nodemon
* Hoppscotch for API testing

---

## Application Architecture

The application follows a layered architecture:

- `server.js` is the main entry point
- `src/routes` contains API route definitions
- `src/controllers` contains business logic
- `src/models` contains Mongoose schemas and database models
- `src/middleware` contains custom middleware for authentication, validation, error handling, and ownership protection
- `src/config/db.js` handles MongoDB connection

Folder structure:

```text
server/
│
<<<<<<< HEAD
├── API-collection.json
├── README.md
├── package.json
├── server.js
│
└── src/
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   ├── applicationController.js
    │   ├── authController.js
    │   ├── companyController.js
    │   └── interviewController.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   ├── ownershipMiddleware.js
    │   └── validationMiddleware.js
    │
    ├── models/
    │   ├── Application.js
    │   ├── Company.js
    │   ├── Interview.js
    │   └── User.js
    │
    └── routes/
        ├── applicationRoutes.js
        ├── authRoutes.js
        ├── companyRoutes.js
        ├── interviewRoutes.js
        └── index.js

## Features

## Core Features

- User registration and login
- JWT authentication
- Protected routes
- CRUD operations for companies
- CRUD operations for applications
- CRUD operations for interviews
- Nested routes for applications inside companies
- Nested routes for interviews inside applications
- MongoDB relationships using Mongoose references

## Additional Features Attempted
- Authentication
- Input validation
- Search and sort
- Pagination
- Advanced middleware

## Setup

1. Install dependencies:
   npm install

Main dependencies:
bcryptjs
cors
dotenv
express
jsonwebtoken
mongoose
nodemon

2. Create `.env` file from example:
   copy .env.example .env

3. Update environment values in `.env`.

## Environment Variables
Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

4. Run in development:
   npm run dev

5. Run in production:
   npm start

## Deployment
The application is designed to be deployed to the IFN666 web server using Caddy and PM2.

Example API URL:
https://jacaranda03.ifn666.com/assessment02/api

Example PM2 command:
pm2 start server.js --name assessment02-api

Example Caddy configuration:

jacaranda03.ifn666.com {
    handle /assessment02/api/* {
        reverse_proxy localhost:5000
    }
}

## Data Model

The application includes four Mongoose models:

User
- name
- email
- password

Company
- name
- industry
- location
- website
- notes
- user reference

Application
- roleTitle
- status
- applicationDate
- salaryExpectation
- notes
- company reference
- user reference

Interview
- round
- interviewDate
- mode
- outcome
- notes
- application reference

## Relationships
- One user can have many companies
- One user can have many applications
- One company can have many applications
- One application can have many interviews

## API Endpoints

## Authentication Endpoints
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

## Company Endpoints
GET    /api/companies
GET    /api/companies/:id
POST   /api/companies
PUT    /api/companies/:id
DELETE /api/companies/:id

## Company Nested Routes
GET    /api/companies/:companyId/applications
POST   /api/companies/:companyId/applications

## Application Endpoints
GET    /api/applications
GET    /api/applications/:id
POST   /api/applications
PUT    /api/applications/:id
DELETE /api/applications/:id

## Application Nested Routes
GET    /api/applications/:applicationId/interviews

## Interview Endpoints
GET    /api/interviews
GET    /api/interviews/:id
POST   /api/interviews
PUT    /api/interviews/:id
DELETE /api/interviews/:id

## Authentication
Authentication is implemented using JWT.

Users can:
- Register
- Login
- Receive a JWT token
- Access protected routes

## Protected routes require the token to be included in the request header:
Authorization: Bearer <token>

## Input Validation

The API includes custom validation middleware for:
- Required fields
- Email format
- Password length
- Website URL format
- Salary validation
- Required interview fields

Examples:
Password must be at least 6 characters
Salary cannot be negative
Website URLs must begin with http:// or https://

## Search and Sort
Search and sort are implemented on the "get all" endpoints.

## Company Search and Sort
- Search by name, industry, location
- Sort by newest
- Sort by oldest
- Sort alphabetically ascending
- Sort alphabetically descending

## Application Search and Sort
- Search by role title, status, resume version, notes
- Filter by status
- Sort by newest
- Sort by oldest
- Sort by salary high to low
- Sort by salary low to high

## Interview Search and Sort
- Search by round and outcome
- Sort by newest
- Sort by oldest

##Pagination
Pagination is implemented on all "get all" routes.

## Pagination includes:
- page query parameter
- limit query parameter
- HTTP response headers:
- X-Total-Count
- X-Total-Pages
- X-Current-Page
- Link

The Link header provides navigation links for:
First page
Previous page
Next page
Last page

## Middleware
The application uses several middleware components:

1. Authentication middleware
- Verifies JWT tokens
- Protects private routes

2. Validation middleware
- Validates request body data
- Prevents invalid inputs

3. Ownership middleware
- Ensures users can only access their own resources

4. Error middleware
- Handles application errors consistently
- Returns proper status codes and messages

## Notes

- JWT is required for protected routes.
- Users can only access their own data.
- Search, sort, and pagination are supported.
- Validation prevents invalid input.
- Error handling returns proper status codes.
- MongoDB and Mongoose are used for the database.
- CORS is enabled for frontend integration.
