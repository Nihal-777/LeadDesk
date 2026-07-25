<<<<<<< HEAD
# LeadDesk Mini 💼

LeadDesk Mini is a modern, production-ready, full-stack MERN application built to capture, organize, and manage business client leads from a single premium, glassmorphic admin dashboard. 

Featuring real-time search, status filtering, budget analytics, CSV data exports, persistent dark mode support, and strict input validation.

---

## Tech Stack

### Frontend
- **React 19** - UI composition
- **Vite** - Bundler and dev server
- **TypeScript** - Strict typing
- **Tailwind CSS** - Fluid, responsive styling
- **React Router DOM v6** - Route declarations & guards
- **React Hook Form** - Accessible form validations
- **Zod** - Form schema validation
- **Axios** - HTTP client service layer
- **TanStack Query (React Query) v5** - Cache synchronization, mutations, and pagination states
- **Recharts** - Responsive SVG charts (Status distribution & Budget breakdowns)
- **Framer Motion** - Micro-animations
- **React Hot Toast** - Contextual toast notifications
- **Lucide Icons** - Modern UI icons

### Backend
- **Node.js** & **Express.js** - Rest API framework
- **TypeScript** - Backend type safety
- **MongoDB Atlas** & **Mongoose** - Document store & ODM schema modelling
- **JWT Authentication** - Secure admin session token validation (7-day expiry)
- **bcryptjs** - Salted password hashing (Windows-installation safe)
- **Helmet** - Express security HTTP headers
- **CORS** - Configurable cross-origin request policies
- **Express Rate Limit** - Brute-force & API DDoS prevention
- **Express Validator** - Sanitized request validation middleware
- **Morgan** - Clean server logging

---

## Folder Structure

```text
LeadDesk-Mini/
 ├── client/
 │    ├── src/
 │    │    ├── assets/       # Static assets
 │    │    ├── components/   # Protected routes and premium UI kits (Button, Card, Input, Select, Dialog, Skeleton)
 │    │    ├── context/      # AuthContext & ThemeContext
 │    │    ├── layouts/      # Visual structure wrappers
 │    │    ├── pages/        # Home (Landing), Login, Dashboard, NotFound
 │    │    ├── services/     # Axios client configuration (JWT interceptors)
 │    │    ├── types/        # TS interfaces
 │    │    ├── App.tsx       # Routing and providers mounting
 │    │    └── main.tsx      # React bootstrap
 │    ├── package.json
 │    └── vite.config.ts
 ├── server/
 │    ├── src/
 │    │    ├── config/       # MongoDB config
 │    │    ├── controllers/  # authController, leadController
 │    │    ├── middleware/   # JWT verification, express-validator handler, global error handler
 │    │    ├── models/       # Admin and Lead schemas
 │    │    ├── routes/       # Auth and Lead endpoints
 │    │    ├── validators/   # Request schemas (authValidator, leadValidator)
 │    │    ├── app.ts        # Express setup (CORS, Helmet, Morgan, Rate Limiting)
 │    │    └── server.ts     # DB connection and entry start
 │    ├── package.json
 │    └── tsconfig.json
 └── README.md
```

---

## Environment Variables

### Frontend (`client/.env`)
Create a `.env` file in the `client/` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
Create a `.env` file in the `server/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/leaddesk-mini # Set MONGODB_URI to Atlas string in production
JWT_SECRET=super_secret_jwt_key_123456!@#
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## Installation & Running Locally

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance running, or MongoDB Atlas connection string)

### Steps

1. **Clone & Open Project**
   ```bash
   cd Digital Heros
   ```

2. **Setup and Start Backend**
   ```bash
   cd server
   # Create and fill .env
   cp .env.example .env
   
   # Install dependencies
   npm install
   
   # Run local server
   npm run dev
   ```
   *Note: On boot, if the database is empty, the server automatically seeds a default administrator:*
   - **Email:** `admin@leaddesk.com`
   - **Password:** `AdminPass123!`

3. **Setup and Start Frontend**
   ```bash
   # Open another terminal session
   cd client
   # Create and fill .env
   cp .env.example .env
   
   # Install dependencies
   npm install
   
   # Run Vite development server
   npm run dev
   ```

4. **Verify Application**
   - Access the Public Landing Page at `http://localhost:5173`.
   - Submit leads through the capture form (budget options: Under $500, $500–$1000, $1000–$5000, Above $5000).
   - Go to `http://localhost:5173/login` to log into the Admin Dashboard using the seeded credentials.

---

## Database Schemas

### Admin
```typescript
{
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true } // bcrypt hashed
}
```

### Lead
```typescript
{
  name: { type: String, required: true, minlength: 3, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  budget: { type: String, required: true },
  message: { type: String, required: true, minlength: 20 },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New', required: true },
  createdAt: { type: Date, default: Date.now }
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new admin profile.
- `POST /api/auth/login` - Authenticate admin & retrieve a 7-day JWT.
- `GET /api/auth/me` - Validate active token & return admin info. *(Protected)*

### Leads
- `POST /api/leads` - Publicly register client inquiries.
- `GET /api/leads` - Retrieve paginated, searched, and status-filtered leads. *(Protected)*
- `GET /api/leads/search` - Live search leads by name/email matching a query string. *(Protected)*
- `PATCH /api/leads/:id` - Instantly change a lead's pipeline status stage. *(Protected)*
- `DELETE /api/leads/:id` - Permanently delete a lead record. *(Protected)*

---

## Deployment Guide

### Frontend (Vercel)
1. Install Vercel CLI or connect GitHub repository to Vercel dashboard.
2. Configure settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add Environment Variable:
   - `VITE_API_URL` pointing to your hosted Express endpoint.

### Backend (Render)
1. Connect GitHub repository to Render dashboard.
2. Create a new **Web Service**.
3. Configure settings:
   - **Build Command:** `cd server && npm install && npm run build`
   - **Start Command:** `cd server && npm run start`
4. Add Environment Variables:
   - `PORT=10000`
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_atlas_connection_string`
   - `JWT_SECRET=your_production_secret`
   - `CLIENT_URL=your_vercel_frontend_url`

---

## Future Improvements
1. **Interactive Email Dispatcher** - Email notifications directly to admins on new lead capture.
2. **Column Customization** - Allow sorting and showing/hiding specific fields.
3. **Advanced Status History** - Log updates, indicating which administrator changed a lead's status and when.

---

## Footer License
Built for [Digital Heroes](https://digitalheroes.com) Training Task
=======
# LeadDesk.
>>>>>>> c5b11243fe0a3e992e63acb51351677c0b9d3d9c
