# Job Application Tracker API

## Project Overview

The Job Application Tracker API is a RESTful backend application developed using Node.js, Express.js, MongoDB, and Mongoose.

The purpose of this application is to help users manage their job search process by tracking companies, job applications, and interviews in one place.

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

The application follows a layered architecture pattern to keep the code organised and maintainable.

* Routes handle incoming API requests
* Controllers contain the business logic
* Models define the MongoDB schemas and relationships
* Middleware handles authentication, error handling, and request validation
* MongoDB Atlas is used as the database

Folder structure:

```text
server/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── applicationController.js
│   │   └── interviewController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Application.js
│   │   └── Interview.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── index.js
│   └── server.js
│
├── API-collection.json
├── README.md
├── package.json
└── .env
```

---

## Relationships

The project includes the following relationships:

* One User can create many Companies
* One User can create many Applications
* One Company can have many Applications
* One Application belongs to one Company
* One Application can have many Interviews
* One Interview belongs to one Application

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-github-repository-link>
cd Job_Application_Tracker/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file in the server folder.

Example:

```env
PORT=5000
MONGO_URI=mongodb://username:password@host/jobtrack?ssl=true&replicaSet=atlas-p1muu7-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=your_super_secret_key
```

---

## Running the Project

Start the server:

```bash
npm run dev
```

If successful, the terminal should display:

```bash
Server running on port 5000
Database connected successfully
```

---

## Authentication Routes

### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "name": "Amisha",
  "email": "amisha@example.com",
  "password": "123456"
}
```

### Login User

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "amisha@example.com",
  "password": "123456"
}
```

### Get Logged In User

```http
GET /api/auth/me
```

Header:

```text
Authorization: Bearer YOUR_TOKEN
```

---

## Company Routes

### Create Company

```http
POST /api/companies
```

Request Body:

```json
{
  "name": "Canva",
  "industry": "Design Software",
  "location": "Sydney",
  "website": "https://www.canva.com",
  "notes": "Strong frontend roles"
}
```

### Get All Companies

```http
GET /api/companies
```

### Search Companies

```http
GET /api/companies?search=FinTech
```

### Sort Companies

```http
GET /api/companies?sort=alphabetical
```

### Paginate Companies

```http
GET /api/companies?page=1&limit=5
```

### Get Company By ID

```http
GET /api/companies/:id
```

### Update Company

```http
PUT /api/companies/:id
```

### Delete Company

```http
DELETE /api/companies/:id
```

---

## Application Routes

### Create Application

```http
POST /api/applications
```

Request Body:

```json
{
  "roleTitle": "Frontend Developer",
  "status": "Applied",
  "applicationDate": "2026-04-14",
  "salaryExpectation": 85000,
  "resumeVersion": "Resume V1",
  "notes": "Applied through LinkedIn",
  "company": "COMPANY_ID"
}
```

### Nested Route Example

```http
POST /api/companies/:companyId/applications
```

### Get All Applications

```http
GET /api/applications
```

### Search Applications

```http
GET /api/applications?search=Frontend
```

### Filter Applications by Status

```http
GET /api/applications?status=Applied
```

### Sort Applications

```http
GET /api/applications?sort=salaryHigh
```

### Paginate Applications

```http
GET /api/applications?page=1&limit=5
```

### Get Application By ID

```http
GET /api/applications/:id
```

### Update Application

```http
PUT /api/applications/:id
```

### Delete Application

```http
DELETE /api/applications/:id
```

---

## Interview Routes

### Create Interview

```http
POST /api/interviews
```

Request Body:

```json
{
  "round": "Technical",
  "interviewDate": "2026-04-20",
  "mode": "Online",
  "outcome": "Pending",
  "notes": "First technical round",
  "application": "APPLICATION_ID"
}
```

### Get All Interviews

```http
GET /api/interviews
```

### Search Interviews

```http
GET /api/interviews?search=Technical
```

### Get Interview By ID

```http
GET /api/interviews/:id
```

### Update Interview

```http
PUT /api/interviews/:id
```

### Delete Interview

```http
DELETE /api/interviews/:id
```

---

## Features Implemented

* JWT authentication
* Protected routes
* CRUD operations
* Nested routes
* MongoDB Atlas integration
* Search functionality
* Sorting functionality
* Pagination functionality
* Error handling middleware
* Relationship mapping using Mongoose populate

---

## Middleware Used

The application uses the following middleware:

* `authMiddleware.js` to protect routes and verify JWT tokens
* `errorMiddleware.js` to standardise error responses
* Express built-in JSON middleware to parse incoming request bodies

---

## API Testing

The API was tested using Hoppscotch.

Recommended testing order:

1. Register user
2. Login user
3. Copy token
4. Create company
5. Create application
6. Create interview
7. Test search, sorting, and pagination
8. Test update and delete routes

---

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test the application
5. Submit a pull request

---

## Reporting Issues

If you find a bug or issue:

1. Check if the issue already exists
2. Provide clear steps to reproduce the problem
3. Include screenshots or error messages if possible
4. Describe the expected and actual behaviour

---

## Author

Amisha Patel
IFN666 Assignment Project