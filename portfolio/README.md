# Samuel AKINGENEYE — Portfolio

Full-stack portfolio with an admin dashboard CMS. Built with React + Vite (frontend) and Express + MongoDB (backend).

## Architecture

```
portfolio/
├── backend/          # Express REST API
│   ├── models/       # Mongoose schemas (User, Project, Certificate, Profile)
│   ├── routes/       # auth, projects, certificates, profile
│   ├── middleware/   # JWT auth, Multer/Cloudinary upload
│   ├── server.js
│   └── seed.js
└── frontend/         # React + Vite + Tailwind
    └── src/
        ├── components/   # Navbar, Footer, ProjectCard, CertificateCard, SkillBadge, DarkModeToggle
        ├── pages/        # Home, AdminLogin, AdminDashboard
        ├── contexts/     # ThemeContext (dark mode)
        └── services/     # api.js (Axios wrapper)
```

---

## ⚡ Local Setup (5 steps)

### 1 — Prerequisites

- Node.js 18 +
- MongoDB (local: `mongod`, or a free Atlas cluster)

### 2 — Clone & install

```bash
# Backend
cd portfolio/backend
cp .env.example .env       # fill in your values
npm install

# Frontend
cd ../frontend
cp .env.example .env       # optional for local dev (Vite proxy handles /api)
npm install
```

### 3 — Configure environment variables

Edit `backend/.env`:

| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string — generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `CLOUDINARY_*` | Leave blank to use local `uploads/` folder |
| `ADMIN_EMAIL` | Email for the seeded admin account |
| `ADMIN_PASSWORD` | Password for the seeded admin account |
| `FRONTEND_URL` | Allowed CORS origin (default `http://localhost:5173`) |

### 4 — Seed the database

```bash
cd backend
npm run seed
```

This creates the admin user, 3 featured projects, 7 certificates, and your profile bio.

### 5 — Run both servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev          # nodemon hot-reload on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev          # Vite dev server on port 5173
```

Open **http://localhost:5173**

---

## 🔐 Admin Panel

1. Navigate to **http://localhost:5173/admin/login**
2. Sign in with the credentials you set in `backend/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
3. Manage **Projects**, **Certificates**, and **Profile** from the tabbed dashboard
4. Click **"View site →"** in the header to preview live changes

> Token is stored in `localStorage` and expires after **7 days**.

---

## 🏗️ Production Build

### Frontend (Netlify)

```bash
cd frontend
npm run build        # outputs to frontend/dist/
```

**Netlify settings:**
- Base directory: `portfolio/frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

Add a `_redirects` file in `frontend/public/`:
```
/*  /index.html  200
```

### Backend (Render)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Root directory: `portfolio/backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env.example` in the Render dashboard

---

## 🎨 Customisation

### Colors / fonts

Edit `frontend/tailwind.config.js`:

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],  // swap font here
    },
    colors: {
      brand: {
        blue: '#3B82F6',   // ← change accent colour
        dark: '#0F172A',
        card: '#1E293B',
        light: '#F8FAFC',
      },
    },
  },
},
```

Then replace `blue-500` class references in components with your new colour.

### Dark mode

Dark mode defaults to the OS preference and can be toggled at runtime. The state persists to `localStorage` under the key `"theme"`.

---

## 💾 Backup current content

Before deploying the new site:

1. **Export MongoDB data:**
   ```bash
   mongodump --uri="$MONGODB_URI" --out ./backup-$(date +%Y%m%d)
   ```

2. **Restore:**
   ```bash
   mongorestore --uri="$MONGODB_URI" ./backup-20250101/
   ```

3. **Manual CSV export** (alternative): use [MongoDB Compass](https://www.mongodb.com/products/compass) → right-click collection → Export Collection.

---

## 📡 API Reference

All responses follow `{ success: boolean, data: any }` or `{ success: false, error: string }`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Get JWT token |
| GET | `/api/projects` | — | All projects (`?featured=true`) |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/certificates` | — | All certs (`?category=AI/ML`) |
| POST | `/api/certificates` | ✅ | Create cert |
| PUT | `/api/certificates/:id` | ✅ | Update cert |
| DELETE | `/api/certificates/:id` | ✅ | Delete cert |
| GET | `/api/profile` | — | Public profile |
| PUT | `/api/profile` | ✅ | Update profile |
| GET | `/api/health` | — | Health check |

✅ = requires `Authorization: Bearer <token>` header.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, react-router-dom v6, react-hot-toast, Axios |
| Backend | Node.js, Express 4, Mongoose 8, bcryptjs, jsonwebtoken, multer |
| Database | MongoDB (Atlas or local) |
| Image storage | Cloudinary (optional) / local uploads |
| Deployment | Netlify (frontend) + Render (backend) |
