# dit_frontend

VoteSphere - Secure Digital Voting Platform Frontend

Built with **Vite + React + TypeScript + Tailwind CSS**

## ✅ Setup Complete

The frontend is now fully configured with:
- ✅ Vite (fast build tool)
- ✅ React 18 + TypeScript
- ✅ Tailwind CSS v3.4.1 (properly configured)
- ✅ React Router v6
- ✅ React Hook Form + Zod validation
- ✅ Axios for API calls
- ✅ Shadcn/ui components (Button, Input, Card, Label)
- ✅ Protected routes
- ✅ Role-based routing

## 🚀 Running the Project

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run on `http://localhost:3063`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # UI components (Button, Input, Card, Label)
│   │   ├── auth/            # Login component
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Page components
│   │   ├── LoginPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── OfficerDashboard.tsx
│   │   └── CandidateDashboard.tsx
│   ├── services/            # API service layer
│   │   └── api.ts
│   ├── lib/                 # Utilities
│   │   └── utils.ts
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.ts           # Vite configuration
```

## 🎨 Features

- **Single Login Page** - Routes to different dashboards based on user role
- **Protected Routes** - Authentication required
- **Role-Based Access** - Admin, Officer, Candidate dashboards
- **Modern UI** - Tailwind CSS with Shadcn/ui components
- **Type Safety** - Full TypeScript support
- **Fast Development** - Vite HMR (Hot Module Replacement)

## 🔧 Configuration

### Environment Variables

### Environment Variables

The `.env` file is included in this repository with production settings:
```env
VITE_API_URL=http://64.23.169.136:5656/api
```

### API Configuration

- Frontend: `http://localhost:3063` (development)
- Backend API: `http://64.23.169.136:5656/api` (production)
- The API base URL can be configured via `VITE_API_URL` environment variable

## 📝 Notes

- All Tailwind CSS v3.4.1 (no v4 conflicts)
- PostCSS properly configured
- No build errors
- Ready for development!
