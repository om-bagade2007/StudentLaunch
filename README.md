<p align="center">
  <img src="docs/studentlaunch-banner.jpg" alt="StudentLaunch — A Flora Education Society Initiative" width="100%" />
</p>

<h1 align="center">StudentLaunch</h1>

<p align="center">
  <em>A Flora Education Society Initiative</em><br />
  Discover internships, hackathons, scholarships, courses, and competitions matched to your profile.
</p>

---

## Overview

StudentLaunch helps students find the opportunities that fit them. Students create a profile with their skills, interests, and education. The platform then recommends matching opportunities, lets them bookmark the ones they like, and links to learning resources and interview preparation guides.

## Features

- **Authentication**: email and password sign-up and login with Firebase Auth. Error messages are written for users.
- **Student profile**: saves skills, interests, and education details, which drive the recommendations.
- **Dashboard**
  - **Recommended**: opportunities ranked by how well they match the student's profile
  - **All Opportunities**: the full list of internships, hackathons, scholarships, and competitions
  - **My Bookmarks**: saved opportunities
- **Courses**: a separate tab with course opportunities, pulled from the API
- **Tutorials**: a curated library of learning resources
- **Interview Guidance**: curated interview preparation material
- **Opportunity details**: a modal that shows the full details of an opportunity and lets the student bookmark it

## Tech Stack

| Layer    | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router        |
| Backend  | Node.js, Express 5, Firebase Admin SDK               |
| Auth     | Firebase Authentication                              |
| Database | Cloud Firestore                                      |
| Hosting  | Vercel (static UI + serverless API) or Docker/Cloud Run |

## Project Structure

```
StudentLaunch/
├── api/                  # Vercel serverless entry (wraps the Express app)
├── backend/
│   ├── app.js            # Express app and route registration
│   ├── server.js         # Standalone server (local / Docker)
│   ├── firebaseAdmin.js  # Firebase Admin initialization
│   ├── middleware/       # requireAuth (verifies Firebase ID tokens)
│   ├── routes/           # profile, opportunities, recommendations, bookmarks
│   └── scripts/seed.js   # Seeds sample opportunities
├── frontend/
│   └── src/
│       ├── pages/        # Home, Auth, Profile, Dashboard, Courses, Tutorials, Interview Guidance
│       ├── components/   # Navbar, OpportunityCard, OpportunityModal, ResourceLibrary, ...
│       ├── context/      # AuthContext
│       └── data/         # Curated tutorials and interview resources
├── scripts/dev.mjs       # Runs frontend and backend together
├── docs/                 # README assets
├── vercel.json
└── Dockerfile
```

## API Reference

All routes are under `/api`. Routes marked 🔒 need a `Authorization: Bearer <Firebase ID token>` header.

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/opportunities`              | List opportunities (filterable)      |
| GET    | `/api/opportunities/:id`          | Get one opportunity                  |
| GET    | `/api/profile` 🔒                 | Get the current user's profile       |
| POST   | `/api/profile` 🔒                 | Create or update the profile         |
| GET    | `/api/recommendations` 🔒         | Opportunities that match the profile |
| GET    | `/api/bookmarks` 🔒               | List bookmarks                       |
| POST   | `/api/bookmarks` 🔒               | Add a bookmark                       |
| DELETE | `/api/bookmarks/:opportunityId` 🔒 | Remove a bookmark                   |

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project with Authentication (Email/Password) and Firestore turned on
- A Firebase service account key

### Environment Variables

Copy the example files and fill in your Firebase values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**Backend (`backend/.env`)**

| Variable                   | Description                                  |
| -------------------------- | -------------------------------------------- |
| `PORT`                     | API port (default `8080`)                    |
| `FRONTEND_ORIGIN`          | Allowed CORS origin                          |
| `FIREBASE_SERVICE_ACCOUNT` | The service account JSON, as a single line   |
| `DEMO_USER_UID`            | Optional: UID of a demo account              |

**Frontend (`frontend/.env.local`)**

| Variable                            | Description                               |
| ----------------------------------- | ----------------------------------------- |
| `VITE_API_URL`                      | API base URL (leave empty for same origin) |
| `VITE_FIREBASE_API_KEY`             | Firebase web config                       |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase web config                       |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase web config                       |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase web config                       |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web config                       |
| `VITE_FIREBASE_APP_ID`              | Firebase web config                       |
| `VITE_DEMO_PASSWORD`                | Optional: password for the demo account   |

### Install and Run

```bash
npm ci --prefix frontend
npm ci --prefix backend

# Seed sample opportunities into Firestore
npm run seed --prefix backend

# Start frontend (http://localhost:5173) and backend (http://localhost:8080) together
npm run dev
```

In development, Vite proxies `/api` requests to the backend.

## Deployment

### Vercel

`vercel.json` builds the frontend into `backend/public` and serves it as static files. Requests to `/api/*` go to the serverless function in `api/index.js`, which wraps the Express app. Set the environment variables above in the Vercel project settings, for every environment you deploy to.

### Docker / Cloud Run

The image builds the frontend, copies it into `backend/public`, and serves the API and UI from one process.

```bash
docker build -t studentlaunch .
docker run --rm -p 8080:8080 --env-file backend/.env studentlaunch
```

Cloud Run needs `PORT` and `FIREBASE_SERVICE_ACCOUNT` to be set.

## Scripts

| Command                          | Description                           |
| -------------------------------- | ------------------------------------- |
| `npm run dev`                    | Run the frontend and backend together |
| `npm run build`                  | Build the frontend for production     |
| `npm start`                      | Start the backend server              |
| `npm run seed --prefix backend`  | Seed sample opportunities             |

---

<p align="center">Built by the Flora Education Society</p>
