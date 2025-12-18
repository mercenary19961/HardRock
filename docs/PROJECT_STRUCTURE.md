# Hard Rock - Project Structure

## Overview
Company profile website showcasing services and collecting client inquiries via contact form.

## Architecture
- **Backend**: Laravel 11 (PHP)
- **Frontend**: React 18 + TypeScript + Inertia.js
- **Styling**: Tailwind CSS + Framer Motion
- **Build**: Vite
- **Database**: MySQL

---

## Current Features

### ✅ Implemented
- **Landing Page**: Fully functional with all sections
  - Hero with animations
  - Services showcase
  - About section
  - Testimonials carousel
  - Technical capabilities
  - Contact section
  - Footer
- **Theme System**: Light/dark mode toggle
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, Open Graph, structured data

### 🚧 To Be Implemented
1. **Contact Form Backend**
   - Database table for storing inquiries
   - Email notification to sales team
   - Form validation
   - Success/error handling

2. **Admin Dashboard**
   - Simple authentication (for you only)
   - View submitted contact forms
   - Basic analytics (optional)

---

## Directory Structure

```
resources/js/
├── pages/
│   └── Landing.tsx              # Main landing page
│
├── components/
│   ├── landing/                 # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TechnicalCapabilities.tsx
│   │   ├── Contact.tsx          # Contact form (frontend only)
│   │   └── Footer.tsx
│   │
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── alert.tsx
│   │   └── [shadcn/ui components]
│   │
│   ├── ThemeToggle.tsx          # Dark/light mode
│   ├── SmoothScroll.tsx         # Lenis smooth scrolling
│   └── text-link.tsx
│
├── hooks/
│   └── use-mobile.ts            # Mobile device detection
│
├── lib/
│   └── utils.ts                 # Utility functions
│
├── types/
│   └── index.d.ts               # TypeScript definitions
│
├── routes/
│   └── index.ts                 # Frontend route constants
│
├── app.tsx                      # Inertia entry point
└── bootstrap.ts                 # Axios setup
```

---

## Database Schema

### Current Tables

**users** (for admin access only)
```sql
- id (bigint, primary key)
- name (string)
- email (string, unique)
- password (string)
- remember_token (string, nullable)
- timestamps
```

**sessions** (Laravel session management)
```sql
- id (string, primary key)
- user_id (bigint, nullable, foreign key)
- ip_address (string)
- user_agent (text)
- payload (longtext)
- last_activity (integer)
```

**cache**, **cache_locks** (Laravel caching)

**jobs**, **job_batches**, **failed_jobs** (Laravel queue system)

### To Be Created

**contact_inquiries** (or similar)
```sql
TODO: Define fields based on requirements
- id
- name
- email
- company (optional)
- phone (optional)
- service_interest
- message
- status (new, contacted, closed)
- timestamps
```

---

## Routes

### Frontend (Inertia)
```php
GET  /          → Landing page (public)
POST /contact   → Contact form submission (TODO)
GET  /admin     → Admin dashboard (authenticated, TODO)
```

### Authentication Routes
```php
# Laravel Breeze routes (in routes/auth.php)
GET  /login
POST /login
POST /logout
# Password reset routes (if needed)
```

---

## Configuration

### Environment Variables (.env)
```bash
APP_NAME=HardRock
APP_URL=http://localhost  # or your production URL

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hardrock
DB_USERNAME=root
DB_PASSWORD=

# Email (for contact form notifications)
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
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
php artisan db:seed  # if you create a seeder for admin user

# Generate app key
php artisan key:generate
```

### Development
```bash
# Start Laravel server
php artisan serve

# Start Vite dev server (separate terminal)
npm run dev
```

### Production Build
```bash
# Build frontend assets
npm run build

# Deploy to Railway/hosting
git push
```

---

## Next Steps (TODO)

### 1. Contact Form Implementation
- [ ] Create `ContactInquiry` model
- [ ] Create migration for `contact_inquiries` table
- [ ] Create `ContactController` with `store()` method
- [ ] Add validation rules
- [ ] Implement email notification (Mailable class)
- [ ] Update Contact.tsx to use Inertia form submission
- [ ] Add success/error feedback UI

### 2. Admin Dashboard (Simple)
- [ ] Create seeder for your admin user
- [ ] Create admin dashboard layout
- [ ] Create page to view contact inquiries
- [ ] Add basic filters (date, status)
- [ ] Add mark as contacted/closed functionality

### 3. Optional Enhancements
- [ ] Add reCAPTCHA to contact form
- [ ] Export inquiries to CSV
- [ ] Email templates customization
- [ ] Analytics integration

---

## Deployment

### Railway Configuration
- **Build Command**: `npm run build && php artisan optimize`
- **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`
- **Environment**: Set all .env variables in Railway dashboard

### Database
- Railway provides PostgreSQL (or use MySQL addon)
- Run migrations on first deploy: `php artisan migrate --force`

---

## Notes

- No user registration - admin access only
- Contact form submissions stored in database
- Email notifications sent to sales team
- Simple authentication using Laravel's built-in system
- No complex role/permission system needed
