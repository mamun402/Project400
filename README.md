# MU CSE Society (Full‑Stack MERN App)

A full‑stack web application for **MU CSE Society** with separate **frontend (React/Vite)** and **backend (Node/Express + MongoDB)**.

- **Frontend (Front/)**: React SPA with routing for public pages, user accounts, and admin panel pages.
- **Backend (Back/)**: Express API with authentication flows, email notifications, role/permission handling, CRUD for society content (blogs, gallery, notices, events, FAQs, team, alumni, missions), and user/book rental features.

---

## Features

### User side
- Signup with **email verification**.
- Login guarded by email verification + admin approval workflow.
- Password reset and password-change OTP via email.
- Profile management (including profile image upload).
- View and manage reading/rent book requests and records.
- Membership / donation request flows.

### Admin side
- Admin login and route protection.
- Role-based **permissions** (UI authorization driven by backend role permissions endpoint).
- Content management:
  - Blogs (add/edit/delete)
  - Gallery (add/edit/delete)
  - Notices (add/edit/delete + email notifications)
  - Events (add/update/delete)
  - Testimonials
  - Team members
  - Alumni
  - Mission statement
  - FAQs
- Approve/reject/promote members.

### Uploads & media
- Multiple upload handlers (images) storing files under backend upload folders.
- Public image access via Express static routing.

---

## Tech Stack

- **Frontend**: React, React Router, Vite, TailwindCSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer, Multer
- **Email**: Nodemailer templates under `Back/utils/`

---

## Repository Structure

```text
Project400/
├─ Back/                     # Express + MongoDB backend
│  ├─ index.js               # Server entry + middleware + routes
│  ├─ RouteHandler/        # Express route modules
│  ├─ Scheema/             # Mongoose models (schemas)
│  ├─ MiddleWears/        # Authentication/authorization middleware
│  ├─ utils/               # Email templates + mailer
│  └─ uploads/            # Uploaded media
│
└─ Front/                   # React frontend
   ├─ src/
   │  ├─ Component/         # Page components
   │  ├─ App.jsx             # Routes + top-level app wiring
   │  └─ ...
   ├─ index.html
   ├─ vite.config.js
   └─ package.json
```

---

## Prerequisites

- Node.js (LTS recommended)
- MongoDB Atlas (or local MongoDB with a valid connection string)
- SMTP credentials for sending emails (Nodemailer)

---

## Setup & Run

### 1) Backend

```bash
cd Back
npm install
npm run start
```

Backend listens on: **http://localhost:5000**

### 2) Frontend

```bash
cd Front
npm install
npm run dev
```

Frontend runs on the Vite dev server (commonly **http://localhost:5173**).

### 3) Verify connections
- Frontend calls backend APIs at **`http://localhost:5000`**.
- Ensure CORS is enabled in backend (`cors()` is used in `Back/index.js`).

---

## Environment Variables

The repo includes `.env` files under `Back/` and `Front/` (paths in `.gitignore`). Populate them with required values.

### Backend (`Back/.env`) (commonly required)
- MongoDB connection string (the code currently shows a MongoDB Atlas URI in `Back/index.js`).
- `JWT_SECRET`
- Email settings used by `Back/utils/mailer.js` / email templates, typically:
  - `EMAIL_USER`
  - SMTP host/port/user/pass (exact keys depend on your `mailer.js` implementation)

### Frontend (`Front/.env`)
- `VITE_ADMIN_LOGIN_PATH` (used to mount admin login route in `Front/src/App.jsx`)

> Note: Backend code also uses `process.env.CLIENT_URL` for generating links in emails.

---

## API Endpoints (high level)

Backend routes are mounted in `Back/index.js`:

- `/Singup` → user signup handler
- `/SingUpAdmin` → admin login + admin actions
- `/Upload` → file/report upload handlers
- `/Auth` → email verification + password reset/OTP flows
- `/uploads` → static serving for uploaded images

Also used by frontend:
- `GET /SingUpAdmin/geRoletPermissions?role=<role>`

---

## Frontend Routes (high level)

In `Front/src/App.jsx`, the app routes include:

Public:
- `/` Home
- `/committee`
- `/event`
- `/blogs`
- `/notice`
- `/verify-email`
- `/login`
- `/forgot-password`
- `/reset-password/:email/:token`
- `/signup`

User protected (based on `localStorage` flags):
- `/profile`
- `/editProfile/:id`
- `/addnewblogs`, `/addnewevents`, `/addnewegallerys`, `/addnewtestimonial`, `/addnewnotices` (admin/editor-style pages gated in UI)

Admin:
- `VITE_ADMIN_LOGIN_PATH` (default `/secure/admin-panel-2024`)
- `/adminhome`
- `/editnotice/:id`, `/editblogs/:id`, `/editgallery/:id`

---

## Database

Backend uses MongoDB with **Mongoose** models located in `Back/Scheema/`.

Key collections include:
- `User` (accounts)
- `Admin` (admin login)
- Content collections (Blog/Gallery/Notice/Event/Team/Alumni/Mission/Testimonial/FAQ)
- Rental & engagement collections (RentBook, membership, donations, etc.)

---

## Deployment Notes

- Recommended: host frontend and backend separately.
- Update `CLIENT_URL` and image base URLs in backend code for production.
- Add proper CORS configuration for the production frontend origin.

---

## License

All rights reserved.

---

## Acknowledgements

Built for the **MU CSE Society** project.

