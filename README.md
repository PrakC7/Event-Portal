# NIET Event Portal

## Project Overview

The NIET Event Portal is a full-stack web application for managing campus events at NIET. It allows students to register, get verified, discover events, and enroll based on eligibility, while admins can create events, verify students, and manage attendance records.

## Features

* Student registration with ID card upload for verification
* Domain-restricted signup using @niet.co.in email addresses
* Admin approval and rejection flow for student accounts
* Role-based login and dashboard routing (Admin and Student)
* Browse, search, and filter upcoming events
* Branch-wise eligibility checks during enrollment
* Enrollment tracking per event
* Admin tools to create, delete, and monitor events
* Attendance CSV export for enrolled students
* Automatic cleanup of expired events and related enrollments

## Technologies Used

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS 4
* React Hook Form + Zod validation
* bcryptjs for password hashing
* Lucide React icons and Framer Motion
* File-based JSON data storage (src/lib/db.json)

## Project Structure

```text
niet-event-portal/
|-- src/
|   |-- app/
|   |   |-- page.tsx
|   |   |-- events/page.tsx
|   |   |-- dashboard/page.tsx
|   |   |-- admin/page.tsx
|   |   |-- login/page.tsx
|   |   |-- signup/page.tsx
|   |   |-- api/
|   |       |-- auth/login/route.ts
|   |       |-- auth/signup/route.ts
|   |       |-- events/enroll/route.ts
|   |       |-- admin/events/route.ts
|   |       |-- admin/users/route.ts
|   |       |-- admin/verify/route.ts
|   |       |-- admin/enrollments/route.ts
|   |-- components/
|   |   |-- Navbar.tsx
|   |   |-- Footer.tsx
|   |-- lib/
|       |-- db.ts
|       |-- db.json
|       |-- utils.ts
|-- package.json
|-- tsconfig.json
|-- next.config.ts
|-- README.md
```

## How to Run the Project

1. Clone the repository.
2. Open the project folder.
3. Install dependencies:
	npm install
4. Start the development server:
	npm run dev
5. Open http://localhost:3000 in your browser.

## How It Works

1. A student signs up with full name, student ID, NIET email, password, and ID card image.
2. The account is created with pending status and must be approved by an admin.
3. Admin reviews student requests in the verification panel and approves or rejects them.
4. Approved users can log in and are redirected by role:
	* Admin users go to the Admin Dashboard.
	* Student users go to the Student Dashboard.
5. Admin creates events and defines allowed branches.
6. Students can enroll only in eligible events.
7. Admin can view enrollments, cancel specific enrollments, export attendance CSV, and optionally clear enrollment records.

## API Routes (Summary)

* POST /api/auth/signup: Register student account (pending verification)
* POST /api/auth/login: Authenticate user and return role-based user info
* GET /api/admin/users: List students for verification
* POST /api/admin/verify: Approve or reject student registration
* GET /api/admin/events: List events
* POST /api/admin/events: Create new event
* DELETE /api/admin/events: Delete event
* GET /api/admin/enrollments: Fetch enrollments by event or user
* DELETE /api/admin/enrollments: Cancel one enrollment or clear event enrollments
* POST /api/events/enroll: Enroll student into an eligible event

## Important Notes

* This project currently uses a JSON file as a local data store.
* Passwords are stored as bcrypt hashes.
* On Vercel, the app uses /tmp/db.json at runtime, which is temporary storage.
* For production use, replace file storage with a real database.

## Future Improvements

* Integrate a production database (PostgreSQL or MongoDB)
* Add JWT or NextAuth-based secure authentication
* Upload ID card images to cloud storage (S3 or Cloudinary)
* Add role-based middleware for route protection
* Add email notifications for verification status
* Add test coverage for API routes and UI flows

## Author

PrakC7

## Purpose

This project is created for academic submission and learning purposes.

