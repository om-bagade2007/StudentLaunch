# StudentLaunch

Platform for students to discover internships, hackathons, scholarships, courses, and competitions matched to their profile.

## Layout

- `frontend/` — React + Vite + Tailwind UI
- `backend/` — Express API + static hosting for the built UI
- `Dockerfile` — multi-stage build for Cloud Run

## Local development

1. Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env.local`. Fill in Firebase values.
2. Backend: `cd backend && npm start` (listens on `PORT`, default 8080)
3. Seed sample opportunities: `cd backend && npm run seed`
4. Frontend: `cd frontend && npm run dev` (http://localhost:5173)

## Docker / Cloud Run

The image builds the frontend, copies it into `backend/public`, and serves API + UI from one process.

```bash
docker build -t studentlaunch .
docker run --rm -p 8080:8080 --env-file backend/.env studentlaunch
```

Cloud Run must set `PORT` (the server already reads `process.env.PORT`) and `FIREBASE_SERVICE_ACCOUNT`.
