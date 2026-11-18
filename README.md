# Quotation Builder (Single Vercel Application)

A full-stack responsive web application for managing and printing quotations, customers, and firm settings.

Built with **React + Vite + Tailwind CSS** (Frontend) and **Express + MongoDB/Mongoose** (Backend) unified into a **single, serverless Vercel application**.

---

## Architecture

This project is structured as a unified monorepo deployed as a single Vercel project:

- **Frontend (`src/`, `index.html`)**: Built statically via Vite (`npm run build`) into `dist/`.
- **Backend API (`api/index.js`, `api/_lib/`)**: Deployed as Vercel Serverless Functions mapped under `/api/*`.
- **Shared Domain**: Since both frontend and backend are served from the same domain on Vercel, cookies (JWT refresh token) and API requests are same-origin, eliminating cross-origin CORS problems.

```
├── api/                     # Vercel serverless function entry & backend logic
│   ├── index.js             # Express app serverless entry point
│   └── _lib/                # Helpers excluded from standalone function routing
│       ├── controllers/     # Route business logic (auth, quotations, customers, etc.)
│       ├── middleware/      # JWT auth and permissions
│       ├── models/          # Mongoose data schemas
│       ├── routes/          # Express route declarations
│       ├── dev-server.js    # Local backend runner for npm run dev
│       └── seed.js          # Database seed script
├── src/                     # React frontend source code
│   ├── api/axios.js         # Axios client using relative baseURL ("")
│   ├── components/          # Reusable UI components
│   ├── context/             # AuthContext state provider
│   ├── pages/               # Views (Dashboard, Quotations, Customers, Settings)
│   └── styles/              # Global & print stylesheets
├── index.html               # Main HTML entry
├── vite.config.js           # Vite configuration with /api proxy for local dev
├── tailwind.config.cjs      # Tailwind CSS configuration
├── vercel.json              # Vercel single-app routing configuration
└── package.json             # Root unified dependencies and scripts
```

---

## Local Development

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your MongoDB URI and secrets:

```bash
cp .env.example .env
```

Example `.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quotation-builder
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Seed the Database
Populates initial sample firm, user, customers, and quotations:
```bash
npm run seed
```
*Default login:* `admin@panchavati.com` / `Admin@123`

### 4. Run Locally
Run both frontend and backend concurrently:
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5001 (proxied through Vite at `http://localhost:5173/api`)

Or run them individually:
- `npm run dev:client` (Vite dev server)
- `npm run dev:server` (Nodemon Express server)

---

## Deploying to Vercel

1. Import this repository in [Vercel](https://vercel.com).
2. Framework Preset: **Vite** (or **Other**).
3. Root Directory: `./` (leave default).
4. Add the following **Environment Variables** in project settings:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`
5. Click **Deploy**. Vercel will automatically build the React frontend and deploy the Express API to serverless functions under `/api/*`.
