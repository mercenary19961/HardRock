# HardRock - Project Structure

## Overview

HardRock is a digital marketing agency website built as a modern full-stack monolithic SPA. It features a public-facing landing page with bilingual support (English/Arabic), a contact form system with integrations, and an admin dashboard for managing contacts and team members.

## Architecture

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 + TypeScript 5
- **Routing**: Inertia.js 2.0 (server-side routing with client-side components)
- **Styling**: Tailwind CSS 3 + Framer Motion
- **Build**: Vite 7
- **Database**: MySQL 8.0
- **Hosting**: Railway (backend), Cloudflare (CDN)

---

## Current Features

### Public Website
- **Landing Page**: Fully functional with all sections
  - Navbar with language/theme toggles
  - Hero section with animations (Framer Motion)
  - Services showcase carousel
  - "Why HardRock" value proposition section
  - Contact form with validation
  - Footer with company info
  - WhatsApp floating button
- **Internationalization**: Full English/Arabic support with RTL layout
- **Theme System**: Light/dark mode toggle (localStorage persisted)
- **Smooth Scrolling**: Lenis integration
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Analytics**: Google Tag Manager, GA4, Facebook Pixel

### Contact Form System
- Client-side and server-side validation
- 8 service categories selection
- Async job processing via Laravel Queue
- Email notifications (Resend SMTP)
- ClickUp task creation integration
- Facebook Pixel lead tracking
- Rate limiting: 5 requests/minute per IP

### Authentication System
- Laravel Breeze with Inertia.js
- Login with animated characters
- Forgot password / Reset password flows
- Session-based authentication (database driver)
- Admin role support (`is_admin` flag)

### Admin Dashboard
- **Stats Overview**: Total contacts, new this week, quick actions
- **Contact Management**: View, filter, delete contact submissions
- **Team Management** (Admin-only):
  - Create/edit/delete team members
  - Assign admin privileges
  - Role-based access control
- Dark mode support
- Responsive design

---

## Directory Structure

```
hardrock/
├── app/
│   ├── Console/Commands/         # CLI commands (CreateAdminUser)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/            # Authentication controllers
│   │   │   ├── Dashboard/       # Admin dashboard controllers
│   │   │   └── ContactController.php
│   │   ├── Middleware/          # AdminMiddleware, HandleInertiaRequests
│   │   └── Requests/            # Form request validation
│   ├── Jobs/                    # ProcessContactSubmission
│   ├── Models/                  # User, Contact
│   ├── Services/                # FacebookMarketingService
│   └── Providers/
├── resources/
│   ├── css/
│   │   └── app.css             # Tailwind + custom utilities
│   └── js/
│       ├── app.tsx             # Inertia entry point
│       ├── bootstrap.ts        # Axios configuration
│       ├── i18n.ts             # i18next setup
│       ├── components/
│       │   ├── ui/             # Reusable UI (Button, Input, Label, Checkbox, Banner)
│       │   ├── landing/        # Landing page sections
│       │   ├── SmoothScroll.tsx
│       │   ├── ThemeToggle.tsx
│       │   ├── LanguageSwitcher.tsx
│       │   └── animated-characters-login-page.tsx
│       ├── contexts/
│       │   └── ThemeContext.tsx
│       ├── layouts/
│       │   └── DashboardLayout.tsx
│       ├── pages/
│       │   ├── Landing.tsx
│       │   ├── Auth/           # Login, ForgotPassword, ResetPassword
│       │   └── Dashboard/      # Index, Contacts, Users
│       ├── types/              # TypeScript definitions
│       ├── locales/            # i18n translations (en/, ar/)
│       └── lib/                # Utility functions (cn)
├── routes/
│   ├── web.php                 # Main web routes
│   └── auth.php                # Authentication routes
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
├── config/
├── public/
│   └── images/                 # Logo files, assets
├── docs/                       # Documentation
├── vite.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── composer.json
```

---

## Database Schema

### users
```sql
- id (bigint, primary key)
- name (string)
- email (string, unique)
- email_verified_at (timestamp, nullable)
- password (string, hashed)
- is_admin (boolean, default: false)
- remember_token (string, nullable)
- created_at, updated_at (timestamps)
```

### contacts
```sql
- id (bigint, primary key)
- personal_name (string)
- company_name (string, nullable)
- phone_number (string)
- email (string)
- services (json array)
- more_details (text, nullable)
- created_at, updated_at (timestamps)
```

### sessions
```sql
- id (string, primary key)
- user_id (bigint, nullable, foreign key)
- ip_address (string)
- user_agent (text)
- payload (longtext)
- last_activity (integer)
```

### password_reset_tokens
```sql
- email (string, primary key)
- token (string)
- created_at (timestamp)
```

### jobs, job_batches, failed_jobs
Laravel queue system tables for async job processing.

---

## Routes

### Public Routes
```
GET  /                    → Landing page
POST /contact             → Contact form submission (rate-limited)
```

### Authentication Routes
```
GET  /login               → Login page
POST /login               → Authenticate user
GET  /forgot-password     → Password reset request page
POST /forgot-password     → Send reset link
GET  /reset-password/{token} → Password reset form
POST /reset-password      → Process password reset
POST /logout              → Logout (authenticated)
```

### Dashboard Routes (Authenticated)
```
GET  /dashboard           → Dashboard home
GET  /dashboard/contacts  → Contact submissions list
DELETE /dashboard/contacts/{id} → Delete contact
```

### Admin-Only Routes
```
GET    /dashboard/users      → Team members list
POST   /dashboard/users      → Create team member
PUT    /dashboard/users/{id} → Update team member
DELETE /dashboard/users/{id} → Delete team member
```

---

## Configuration

### Environment Variables (.env)
```bash
# Application
APP_NAME=HardRock
APP_URL=https://hardrock-co.com

# Database
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=hardrock
DB_USERNAME=
DB_PASSWORD=

# Email (Resend)
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@hardrock-co.com

# ClickUp Integration
CLICKUP_API_KEY=
CLICKUP_LIST_ID=

# Facebook/META Integration
FACEBOOK_PIXEL_ID=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_ACCESS_TOKEN=
FACEBOOK_AD_ACCOUNT_ID=

# Google Analytics
# Configured inline in Landing.tsx
# GTM: GTM-TJTKSH9J
# GA4: G-TFQFC7Q08R
```

---

## Development Workflow

### Setup
```bash
# Install dependencies
composer install
npm install

# Setup database
php artisan migrate
php artisan db:seed

# Generate app key
php artisan key:generate
```

### Development
```bash
# Start Laravel server
php artisan serve

# Start Vite dev server (separate terminal)
npm run dev

# Start queue worker (for contact form processing)
php artisan queue:work
```

### Production Build
```bash
npm run build
php artisan optimize
```

### Create Admin User
```bash
php artisan admin:create admin@hardrock-co.com password "Admin Name"
```

---

## External Integrations

### ClickUp
- Creates tasks from contact form submissions
- Configured via `CLICKUP_API_KEY` and `CLICKUP_LIST_ID`

### Facebook/META
- Pixel tracking for page views and lead events
- Marketing API for campaign management (see META_API_INTEGRATION.md)

### Email (Resend)
- Transactional emails for contact notifications
- Password reset emails

### Google Analytics & Tag Manager
- GTM container: GTM-TJTKSH9J
- GA4 measurement: G-TFQFC7Q08R
- Tracks page views and form submissions

---

## Key Files Reference

### Backend
- `app/Http/Controllers/ContactController.php` - Contact form handling
- `app/Http/Controllers/Dashboard/` - Dashboard controllers
- `app/Jobs/ProcessContactSubmission.php` - Async contact processing
- `app/Services/FacebookMarketingService.php` - META API integration
- `app/Http/Middleware/AdminMiddleware.php` - Admin authorization

### Frontend
- `resources/js/pages/Landing.tsx` - Main landing page
- `resources/js/pages/Auth/Login.tsx` - Login with animated characters
- `resources/js/pages/Dashboard/` - Admin dashboard pages
- `resources/js/components/landing/ContactUs.tsx` - Contact form
- `resources/js/contexts/ThemeContext.tsx` - Theme management
- `resources/js/i18n.ts` - Internationalization config

### Configuration
- `vite.config.js` - Vite build config with code splitting
- `tailwind.config.js` - Tailwind with brand colors and custom fonts
- `tsconfig.json` - TypeScript configuration

---

## Security Features

- CSRF protection (Laravel + Inertia)
- Rate limiting on contact form (5/min per IP)
- Login rate limiting (5 attempts/min per email+IP)
- Password hashing (Bcrypt)
- Session-based authentication with database driver
- Admin middleware for protected routes
- Self-protection in user management (can't delete/demote yourself)

---

## Performance Optimizations

- Code splitting via Vite (React, Inertia, Radix, Motion, i18n chunks)
- Image preloading on landing page
- Smooth scroll with Lenis
- Framer Motion for optimized animations
- WebP format for images
- Cloudflare CDN

---

## Notes

- User registration is disabled - admin users created via CLI command
- Contact form submissions stored in database + sent via email + create ClickUp tasks
- Simple `is_admin` boolean for authorization (no complex permissions needed)
- All frontend uses React/TypeScript with Inertia.js (no Blade views)
