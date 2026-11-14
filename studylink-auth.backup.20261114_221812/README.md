# StudyLink Authentication System

A complete, production-ready authentication system for the StudyLink peer tutoring platform. Built with modern full-stack architecture following the approved Software Requirements Specification (SRS) for Caraga State University.

## 🏗️ Architecture

### Frontend
- **React 18** + **TypeScript** + **Vite** - Modern, fast development
- **Tailwind CSS** - Utility-first styling with custom dark-mode design system
- **shadcn/ui** - Accessible, customizable component library
- **React Router v6** - Client-side routing with protected routes
- **React Hook Form** + **Zod** - Type-safe form validation
- **Lucide React** - Beautiful, consistent icons

### Backend
- **Node.js** + **Express** + **TypeScript** - Robust API server
- **Prisma ORM** + **MySQL** - Type-safe database operations
- **bcryptjs** - Secure password hashing (cost factor 12)
- **JWT** - Stateless authentication with access/refresh tokens
- **HTTP-only Cookies** - Secure session management
- **Helmet** + **CORS** + **Rate Limiting** - Security hardening

### Testing
- **Vitest** + **React Testing Library** - Unit/integration tests
- **Playwright** - End-to-end browser testing

## 🎨 Design System

### Dark Mode Palette (Dribbble-inspired)
| Color | Hex | Usage |
|-------|-----|-------|
| Main Background | `#0B0D12` | Page background |
| Secondary Background | `#11141C` | Panels, cards |
| Card Background | `#171B25` | Form cards |
| Input Background | `#202532` | Form inputs |
| Primary Accent | `#7775F5` | Primary buttons, links |
| Secondary Accent | `#5C8DFF` | Hover states, gradients |
| Primary Text | `#F5F6FA` | Headings, body text |
| Secondary Text | `#9CA3B4` | Descriptions, placeholders |
| Border | `#2A3040` | Input borders, dividers |
| Success | `#22C55E` | Success states |
| Error | `#EF4444` | Error states |

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Responsive**: Fluid scaling across breakpoints

### Layout
- **Desktop (≥1024px)**: Split-screen with brand panel (50%) + form panel (50%)
- **Tablet (768-1023px)**: Centered form panel, brand panel hidden
- **Mobile (<768px)**: Full-width centered form, compact spacing

## 🔐 Authentication Features

### Login (`/login`)
- CSU email validation (`@csu.edu.ph`)
- Password with show/hide toggle
- Remember me (30-day vs 7-day session)
- Forgot password link
- Social login placeholders (Google, GitHub)
- Loading states and error handling

### Registration (`/register`) - 3 Steps
1. **Personal Info**: Full name, CSU email, Course/Program
2. **Role Selection**: Tutee / Tutor / Both (visual cards)
3. **Password**: Strength meter, requirements checklist, confirmation
- Keyboard-navigable role cards
- Step-by-step progress indicator
- Back navigation preserves data
- Duplicate email prevention

### Forgot Password (`/forgot-password`)
- CSU email validation
- Secure reset token generation (1-hour expiry)
- Email enumeration prevention
- Resend link capability
- Back to login navigation

### Session Management
- Access tokens: 15-minute expiry
- Refresh tokens: 7-day (30-day with remember me)
- Automatic token refresh
- Secure HTTP-only cookies
- Session revocation on password reset
- Logout clears all tokens

### Role-Based Access Control
| Role | Description | Permissions |
|------|-------------|-------------|
| `TUTEE` | Needs tutoring | Find tutors, request sessions |
| `TUTOR` | Provides tutoring | Manage profile, accept/decline requests |
| `BOTH` | Both roles | Full student + tutor features |
| `ADMIN` | System admin | User management (backend only) |

## 📁 Project Structure

```
studylink-auth/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AuthLayout.tsx # Split-screen layout
│   │   ├── BrandPanel.tsx # Branding + illustration
│   │   ├── FormInput.tsx  # Reusable form input
│   │   ├── PasswordInput.tsx # Password with toggle + strength
│   │   ├── RoleSelector.tsx # Role selection cards
│   │   ├── PrimaryButton.tsx # Action buttons
│   │   ├── ProtectedRoute.tsx # Route guards
│   │   └── index.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   └── useAuth.tsx    # Auth context + state
│   ├── services/
│   │   ├── api.ts         # HTTP client
│   │   └── authService.ts # Auth API calls
│   ├── utils/
│   │   ├── index.ts       # Helpers (cn, date, email)
│   │   └── validation.ts  # Zod schemas + password strength
│   ├── types/
│   │   └── auth.ts        # TypeScript types
│   ├── styles/
│   │   └── globals.css    # Tailwind + custom styles
│   ├── test/
│   │   └── setup.ts       # Test configuration
│   ├── App.tsx            # Routing
│   └── main.tsx           # Entry point
├── server/
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Development data
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── health.ts
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── .env               # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── e2e/
│   └── auth.spec.ts       # Playwright E2E tests
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Clone and Install

```bash
# Frontend
cd studylink-auth
npm install

# Backend
cd server
npm install
```

### 2. Configure Environment

```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your database credentials
```

Required `.env` variables:
```env
DATABASE_URL="mysql://user:password@localhost:3306/studylink"
JWT_SECRET="your-super-secret-key-min-32-chars"
REFRESH_TOKEN_SECRET="your-refresh-secret-min-32-chars"
FRONTEND_URL="http://localhost:5173"
```

### 3. Setup Database

```bash
cd server

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed development data
npm run prisma:seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend (port 3001)
cd server
npm run dev

# Terminal 2 - Frontend (port 5173)
cd ..
npm run dev
```

Open http://localhost:5173

## 🧪 Testing

### Unit Tests
```bash
# Frontend
npm run test

# Backend
cd server && npm run test
```

### E2E Tests
```bash
# Install Playwright browsers (first time)
npx playwright install

# Run tests
npm run test:e2e
```

### Test Accounts (after seeding)
| Email | Password | Role |
|-------|----------|------|
| maria.santos@csu.edu.ph | password123 | Tutee |
| juan.delacruz@csu.edu.ph | password123 | Both |
| anna.rodriguez@csu.edu.ph | password123 | Both |
| pedro.garcia@csu.edu.ph | password123 | Tutee |
| lisa.fernandez@csu.edu.ph | password123 | Both |
| admin@csu.edu.ph | admin123 | Admin |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/revoke-sessions` | Revoke all sessions |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/health/ready` | Readiness probe |

## 🔒 Security Features

- **Password Hashing**: bcrypt with cost factor 12
- **Token Storage**: HTTP-only, Secure, SameSite=Lax cookies
- **Rate Limiting**: 100 req/15min general, 20 req/15min auth
- **Input Validation**: Zod schemas on both frontend and backend
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Protection**: Helmet headers, React auto-escaping
- **CSRF Protection**: SameSite cookies + Origin validation
- **Email Enumeration Prevention**: Generic error messages
- **Token Rotation**: Refresh token rotation on use
- **Secure Headers**: Helmet.js with CSP

## 🎯 SRS Compliance

### Functional Requirements
- ✅ **FR-01**: Account registration with role selection (Tutee/Tutor/Both)
- ✅ **FR-13**: Admin management via backend-only authorization

### Non-Functional Requirements
| NFR | Implementation |
|-----|----------------|
| **NFR-01 Performance** | Vite optimized build, lazy loading, <3s load |
| **NFR-02 Security** | bcrypt, HTTP-only cookies, RBAC, validation |
| **NFR-03 Authenticated Access** | Protected routes, session validation |
| **NFR-04 Usability** | Clear labels, validation messages, keyboard nav |
| **NFR-05 Compatibility** | Responsive Tailwind, tested on major browsers |
| **NFR-06 Reliability** | Error boundaries, graceful error handling |
| **NFR-07 Data Integrity** | Zod validation, Prisma constraints |
| **NFR-08 Admin Security** | No public admin registration |
| **NFR-09 Maintainability** | Component architecture, TypeScript |
| **NFR-10 Scalability** | Stateless auth, connection pooling |
| **NFR-11 Error Handling** | User-friendly messages, field-level validation |
| **NFR-12 Backup** | Documented Prisma migration strategy |

## 🔧 Backend Integration Points

All API calls in `src/services/authService.ts`:

```typescript
// Login → POST /api/auth/login
login(credentials)

// Register → POST /api/auth/register
register(data)

// Logout → POST /api/auth/logout
logout()

// Forgot Password → POST /api/auth/forgot-password
forgotPassword(data)

// Reset Password → POST /api/auth/reset-password
resetPassword(data)

// Get Current User → GET /api/auth/me
getCurrentUser()

// Refresh Token → POST /api/auth/refresh
refreshToken()
```

## 📦 Production Deployment

### Frontend
```bash
npm run build
# Deploy dist/ to static hosting (Vercel, Netlify, etc.)
```

### Backend
```bash
cd server
npm run build
# Deploy dist/ to Node.js hosting (Railway, Render, etc.)
# Set NODE_ENV=production
# Use strong JWT secrets (32+ chars)
# Configure production MySQL
# Set up SSL/TLS
```

### Database
```bash
# Run migrations on production
npx prisma migrate deploy

# Optional: Prisma Accelerate for connection pooling
```

## 📝 Development Notes

### Adding New Fields to Registration
1. Update `RegisterFormData` in `src/types/auth.ts`
2. Add validation in `src/utils/validation.ts`
3. Update `SignUp.tsx` form
4. Update backend `registerSchema` in `server/src/routes/auth.ts`
5. Update Prisma schema if persisting

### Customizing Design
- Colors: `tailwind.config.js` → `theme.extend.colors`
- Spacing: `tailwind.config.js` → `theme.extend.spacing`
- Components: `src/components/ui/*.tsx`
- Global styles: `src/styles/globals.css`

### Database Changes
```bash
cd server
# Edit prisma/schema.prisma
npm run prisma:migrate dev --name migration_name
npm run prisma:generate
```

## 📄 License

Educational project for Caraga State University - Software Engineering 1

## 🤝 Contributing

1. Follow the existing code style (ESLint + Prettier)
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass before PR

---

**Built with ❤️ for CSU Students**  
*Learn Together. Grow Together.*