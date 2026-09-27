# StudentLaunch

<p align="center">
  <img src="assets/studentlaunch-logo.png" alt="StudentLaunch logo" width="640" />
</p>

**Find your next opportunity.** StudentLaunch helps students discover internships, hackathons, scholarships, competitions, and learning resources matched to their interests and skills.

## What you can do

- Create an account or sign in with Firebase Authentication. A demo sign-in option is available when configured.
- Build a student profile with education, skills, interests, and preferred opportunity categories.
- Browse opportunities, filter by category or skill, view details, and save bookmarks.
- Get recommendations ranked by skill and category overlap with your profile.
- Browse Firestore-backed course listings, plus curated tutorials and interview preparation guides with topic filters and external learning links.

## Tech stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **API:** Node.js, Express
- **Authentication:** Firebase Authentication
- **Data:** Firestore via Firebase Admin SDK
- **Deployment:** Vercel configuration is provided in `vercel.json`; a Dockerfile is also included.

## Run locally

### Requirements

- Node.js 22.12 or newer
- A Firebase project with Email/Password Authentication enabled and Firestore created

### Configure environment

Create local environment files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

On Windows PowerShell, use `Copy-Item` in place of `cp` if needed.

Set `FIREBASE_SERVICE_ACCOUNT` in `backend/.env` to the Firebase service-account JSON for your project. Keep this private key server-side and never commit it. Fill in the `VITE_FIREBASE_*` values in `frontend/.env.local` with the Firebase web app configuration. These values are embedded in the client build; do not put a service-account key or other server secret in a `VITE_*` variable.

The demo login is optional. To enable it, create `demo@studentlaunch.app` as an Email/Password user in Firebase Authentication, set `VITE_DEMO_PASSWORD` in `frontend/.env.local`, and restart the frontend. The demo account also needs a profile document in Firestore (`profiles/{uid}`) to receive profile-based recommendations. `DEMO_USER_UID` is available in the backend example environment for that account's UID.

### Start the app

From the repository root:

```bash
npm run dev
```

This starts the Express API on `http://localhost:8080` and the Vite frontend on `http://localhost:5173`. Vite proxies `/api` requests to the local backend. Open the frontend URL in your browser.

To build the frontend for deployment:

```bash
npm run build
```

Vite writes the build to `backend/public`, as configured in `frontend/vite.config.js`.

## API overview

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `GET /api/health` | Public | Health check (`{"ok":true}`) |
| `GET /api/opportunities` | Public | List opportunities; accepts `category` and `skill` filters |
| `GET /api/opportunities/:id` | Public | Get one opportunity |
| `GET /api/profile` | Signed in | Read the current user's profile |
| `POST /api/profile` | Signed in | Create or update the current user's profile |
| `GET /api/recommendations` | Signed in | Get opportunities ranked against the user's profile |
| `GET /api/bookmarks` | Signed in | List saved opportunities |
| `POST /api/bookmarks` | Signed in | Save an opportunity (`{ "opportunityId": "..." }`) |
| `DELETE /api/bookmarks/:opportunityId` | Signed in | Remove a saved opportunity |

Protected endpoints expect a Firebase ID token in `Authorization: Bearer <token>`. The browser client obtains and attaches this token automatically.

## Project structure

```text
backend/
  app.js                 Express app and API routes
  server.js              Local development server
  api/                   Backend function entry points
  middleware/            Firebase token authentication
  routes/                Profile, opportunity, recommendation, bookmark APIs
  scripts/seed.js        Sample opportunity and demo-profile seed data
frontend/
  src/pages/             Home, auth, dashboard, profile, courses, tutorials, guidance
  src/components/        Navigation, opportunity cards, resource library, form controls
  public/                App logo mark
assets/
  studentlaunch-logo.png Full StudentLaunch logo artwork
api/index.js             Vercel Express function entry point
vercel.json              Vercel build and route configuration
Dockerfile               Multi-stage frontend/backend container build
```

## Sample data

`backend/scripts/seed.js` contains 21 sample opportunities and supports `--force` to proceed when the Firestore `opportunities` collection is already populated. It also supports `--profile-only` for the demo profile. The seed script currently needs to be aligned with the lazy Firebase Admin export (`getDb()`) before these commands can run; do not rely on it until that is corrected.

## Deployment notes

Vercel serves the frontend build from `backend/public` and routes `/api/*` requests to the function in `api/index.js`. Configure the frontend Firebase variables for the deployment build and set `FIREBASE_SERVICE_ACCOUNT` as a server-side environment variable in the deployment environment. Redeploy after changing frontend `VITE_*` values because Vite embeds them during the build.

The Dockerfile builds the frontend and backend image. For a container deployment, provide the Firebase service-account environment variable at runtime and the required Firebase web configuration as Docker build arguments. Confirm the container's static-file serving setup before using it as a production deployment target.
