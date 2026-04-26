# HabitTrack

HabitTrack is a full-stack **Habit Tracker + Daily Journal** web app built as a premium SaaS-style experience.

##  Features

- JWT authentication (`register` / `login`)
- Daily + weekly habits with reorder, color, icon, and reminders
- Daily journal with autosave
- Calendar history view with per-day completion indicators
- Statistics dashboard with streaks and completion trends
- Dark mode + light mode
- Offline/localStorage fallback when the API or MongoDB is unavailable
- PWA-ready frontend with installable service worker
- Export/import JSON data

##  Stack

- **Frontend:** React + Vite + Tailwind CSS + Zustand + Framer Motion + Recharts
- **Backend:** Node.js + Express + MongoDB + Mongoose + JWT

##  Project structure

```text
frontend/   React client
backend/    Express API
.env.example shared environment example
```

##  Run locally

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

##  API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/habits`
- `POST /api/habits/:id/toggle`
- `POST /api/habits/reorder`
- `GET/PUT /api/entries/:date`
- `GET /api/entries`
- `GET /api/stats/overview`

##  Demo / fallback mode

If MongoDB or the backend is unavailable, the frontend falls back to local demo storage.

**Demo credentials:**

- Email: `demo@habittrack.app`
- Password: `demo12345`

##  Déployer toute l’application

J’ai préparé le dépôt pour un déploiement **full-stack** simple sur **Render** : le backend Express sert aussi le frontend React construit en production.

### Option recommandée : Render + MongoDB Atlas

#### 1) Créez la base de données
- Ouvrez **MongoDB Atlas**
- Créez un cluster gratuit
- Copiez l’URI de connexion dans `MONGODB_URI`

#### 2) Déployez sur Render
Le fichier `render.yaml` est déjà prêt.

- poussez le repo sur GitHub
- allez sur **Render**
- cliquez sur **New +** → **Blueprint**
- sélectionnez ce dépôt
- ajoutez la variable `MONGODB_URI`
- laissez `JWT_SECRET` être généré automatiquement

Render exécutera automatiquement :

```bash
npm install && npm run install:all && npm run build
```

puis démarrera l’app avec :

```bash
npm run start
```

#### 3) Ouvrez l’URL Render
Vous aurez une seule URL publique pour toute l’application.

### Option GitHub Pages

Le projet est configuré pour publier le **frontend seul** sur GitHub Pages via GitHub Actions.

```text
https://rachadelbaraka.github.io/HabitTrack/
```

Pour l’activer :

1. poussez ce dépôt sur GitHub
2. ouvrez **Settings → Pages**
3. dans **Source**, choisissez **GitHub Actions**
4. poussez ensuite sur la branche `main`

> Sur GitHub Pages, l’application bascule automatiquement en mode local/offline si aucun backend externe (`VITE_API_URL`) n’est configuré.

## 💡 Notes

- Daily habits reset automatically because completion is tracked by date.
- Weekly habits are tracked by the start of the week.
- Export/import works with JSON from the Settings page.
