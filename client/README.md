# Job Application Tracker – Client

This folder contains the frontend of the Job Application Tracker application. It was developed using React and Vite to provide a simple and responsive interface where users can manage their job applications, companies, and interviews.

---

## What the Client Does

The frontend allows users to:

* create an account and log in
* manage companies they are applying to
* add, edit, and delete job applications
* keep track of interviews
* search and sort records
* view a dashboard summary
* access protected pages after login

The client communicates with the backend API to store and retrieve data.

---

## Technologies Used

* React
* Vite
* React Router DOM
* Mantine UI
* Mantine Notifications
* Tabler Icons
* JavaScript

---

## Features

### User Authentication

* Register new users
* Login existing users
* Store login information in local storage
* Restrict access to protected pages

### Dashboard

* Show total number of job applications
* Show interviews, offers, and rejections
* Display a quick overview of recent activity

### Companies

* Add company details
* Edit company information
* Delete companies
* Search and sort companies
* Validate website links

### Applications

* Add job applications
* Edit and delete applications
* Search by role, notes, or status
* Sort applications by date or salary
* Show status using badges

### Interviews

* Add interview information
* Update interview details
* Delete interviews
* Search and sort interview records
* Display interview outcomes

### Interface

* Responsive layout
* Sidebar navigation
* Light and dark mode
* Notification messages for user actions

---

## Folder Structure

```bash
client/
│── public/
│── src/
│   ├── api/
│   │   ├── axios.js
│   │   └── config.js
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── OutcomeBadge.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── StatusBadge.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Applications.jsx
│   │   ├── Companies.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Interviews.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│── .env
│── .gitignore
│── eslint.config.js
│── index.html
│── package-lock.json
│── package.json
│── README.md
│── vite.config.js
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the client folder:

```bash
cd client
```

Install all required packages:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

By default, the project will run on:

```bash
http://localhost:5173
```

---

## Environment Variable

Create a `.env` file inside the client folder and add:

```env
VITE_BASE_API=http://localhost:5000/api
```

For deployment, this can be changed to the production API URL.

Example:

```env
VITE_BASE_API=https://your-domain.com/assessment02/api
```

---

## Useful Commands

Run the development server:

```bash
npm run dev
```

Build the project for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

---

## Routes

The main routes in the application are:

* `/login`
* `/register`
* `/dashboard`
* `/companies`
* `/applications`
* `/interviews`

Most routes are protected and require the user to be logged in.

---

## API Configuration

The frontend uses a base API URL stored in the environment variable.

Example:

```js
const API_BASE_URL = import.meta.env.VITE_BASE_API || "/assessment02/api";
```

---

## Notes

* The frontend depends on the backend server to work correctly.
* Make sure the backend is running before using the client.
* Update the API URL in the `.env` file before deployment.

---

## Author
Amisha Patel


