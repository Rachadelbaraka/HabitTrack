# HabitTrack

HabitTrack is a full-stack **Habit Tracker + Daily Journal** web app built as a premium SaaS-style experience.

## ✨ Features

- JWT authentication (`register` / `login`)
- Daily + weekly habits with reorder, color, icon, and reminders
- Daily journal with autosave
- Calendar history view with per-day completion indicators
- Statistics dashboard with streaks and completion trends
- Dark mode + light mode
- Offline/localStorage fallback when the API or MongoDB is unavailable
- PWA-ready frontend with installable service worker
- Export/import JSON data

## 🧱 Stack

- **Frontend:** React + Vite + Tailwind CSS + Zustand + Framer Motion + Recharts
- **Backend:** Node.js + Express + MongoDB + Mongoose + JWT

## 📁 Project structure

```text
frontend/   React client
backend/    Express API
.env.example shared environment example
```

## 🚀 Run locally

### 1) Configure environment

Copy the example files into each app:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2) Start MongoDB

Use a local MongoDB instance or Docker. Example default URI already matches:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/habittrack
```

### 3) Install dependencies

```bash
npm install
npm run install:all
```

### 4) Start the app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 🔐 API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/habits`
- `POST /api/habits/:id/toggle`
- `POST /api/habits/reorder`
- `GET/PUT /api/entries/:date`
- `GET /api/entries`
- `GET /api/stats/overview`

## 🧪 Demo / fallback mode

If MongoDB or the backend is unavailable, the frontend falls back to local demo storage.

**Demo credentials:**

- Email: `demo@habittrack.app`
- Password: `demo12345`

## 🌍 Déploiement sur GitHub Pages

Le projet est maintenant configuré pour publier automatiquement le **frontend** sur GitHub Pages via GitHub Actions.

### URL prévue

```text
https://rachadelbaraka.github.io/HabitTrack/
```

### Activation

1. Poussez vos changements sur la branche `main`
2. Ouvrez **GitHub > Settings > Pages**
3. Dans **Build and deployment**, choisissez **GitHub Actions**
4. Le workflow `.github/workflows/deploy-pages.yml` fera le build et le déploiement automatiquement

### Important

- **GitHub Pages héberge seulement le frontend statique**
- Le backend `Express + MongoDB` ne peut pas tourner sur GitHub Pages
- En l’état, le site fonctionnera donc très bien en **mode hors ligne / démo**
- Si vous voulez l’auth et la base en ligne, il faudra déployer le backend séparément sur **Render**, **Railway**, **Vercel Functions** ou un VPS, puis renseigner `VITE_API_URL`

## 💡 Notes

- Daily habits reset automatically because completion is tracked by date.
- Weekly habits are tracked by the start of the week.
- Export/import works with JSON from the Settings page.
