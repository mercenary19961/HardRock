# HardRock - Codebase Context for Claude

This document provides comprehensive context about the HardRock codebase to help Claude understand and work with the project effectively.

---

## Project Overview

**HardRock** is a digital marketing agency website built as a modern full-stack monolithic SPA using Laravel + React + Inertia.js architecture.

### Key URLs
- Production: https://hardrock-co.com
- Admin Dashboard: https://hardrock-co.com/dashboard

### Business Purpose
- Showcase digital marketing services
- Generate leads via contact form
- Manage contact submissions and team members via admin dashboard

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Backend Framework | Laravel | 12 |
| PHP Version | PHP | 8.2+ |
| Frontend Framework | React | 18 |
| Type System | TypeScript | 5 |
| Routing/SPA | Inertia.js | 2.0 |
| Styling | Tailwind CSS | 3 |
| Animations | CSS Keyframes (landing) + Framer Motion (Services page) | - |
| Build Tool | Vite | 7 |
| Database | MySQL | 8.0 |
| Queue Driver | Database | - |
| Session Driver | Database | - |

---

## Architecture Overview

### Monolithic SPA with Inertia.js

The application uses Inertia.js to bridge Laravel backend with React frontend:

1. **Server-side routing** - Laravel handles all routes
2. **Client-side rendering** - React renders all UI
3. **No API needed** - Inertia passes data as props to React components
4. **Form handling** - Inertia's `useForm` hook for form submissions

### Request Flow
```
Browser Request → Laravel Router → Controller → Inertia::render()
                                       ↓
                              React Component (receives props)
```

---

## Directory Structure

```
hardrock/
├── app/                              # Laravel backend
│   ├── Console/Commands/
│   │   └── CreateAdminUser.php       # php artisan admin:create
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/                 # Laravel Breeze auth controllers
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ContactController.php
│   │   │   │   └── UserController.php
│   │   │   ├── Api/
│   │   │   │   └── LeadController.php    # Breeze AI agent lead submissions
│   │   │   └── ContactController.php # Public contact form
│   │   ├── Middleware/
│   │   │   ├── AdminMiddleware.php   # Admin-only route protection
│   │   │   ├── ApiKeyMiddleware.php  # API key auth for external integrations
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/
│   │       └── Auth/LoginRequest.php
│   ├── Jobs/
│   │   └── ProcessContactSubmission.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Contact.php
│   │   └── Lead.php
│   └── Services/
│       └── FacebookMarketingService.php
│
├── resources/
│   ├── css/
│   │   └── app.css                   # Tailwind + custom CSS
│   └── js/
│       ├── app.tsx                   # Inertia entry point
│       ├── bootstrap.ts              # Axios setup
│       ├── i18n.ts                   # i18next configuration
│       │
│       ├── components/
│       │   ├── ui/                   # Reusable UI components
│       │   │   ├── button.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   ├── checkbox.tsx
│       │   │   ├── banner.tsx
│       │   │   ├── page-loader.tsx
│       │   │   └── expandable-service-selector.tsx
│       │   ├── landing/              # Landing page sections
│       │   │   ├── Navbar.tsx
│       │   │   ├── Hero.tsx
│       │   │   ├── WhyHardRock.tsx
│       │   │   ├── Services.tsx
│       │   │   ├── ClientsPartners.tsx  # Animated marquee belts with client/partner logos
│       │   │   ├── ContactUs.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── WhatsAppButton.tsx
│       │   ├── SmoothScroll.tsx      # Lenis smooth scrolling
│       │
│       ├── hooks/
│       │   └── useInView.ts          # IntersectionObserver hook for scroll animations
│       │   ├── ThemeToggle.tsx
│       │   ├── LanguageSwitcher.tsx
│       │   └── animated-characters-login-page.tsx
│       │
│       ├── contexts/
│       │   └── ThemeContext.tsx      # Dark/light mode
│       │
│       ├── layouts/
│       │   └── DashboardLayout.tsx   # Admin layout wrapper
│       │
│       ├── pages/
│       │   ├── Landing.tsx           # Main landing page
│       │   ├── Services.tsx          # Service detail pages (/services/{slug})
│       │   ├── Auth/
│       │   │   ├── Login.tsx
│       │   │   ├── ForgotPassword.tsx
│       │   │   └── ResetPassword.tsx
│       │   └── Dashboard/
│       │       ├── Index.tsx         # Dashboard home
│       │       ├── Contacts.tsx      # Contact management
│       │       └── Users.tsx         # Team management
│       │
│       ├── types/
│       │   └── index.d.ts
│       │
│       ├── locales/
│       │   ├── en/                   # English translations
│       │   └── ar/                   # Arabic translations
│       │
│       └── lib/
│           └── utils.ts              # cn() utility function
│
├── routes/
│   ├── web.php                       # Main routes
│   ├── api.php                       # API routes (Breeze AI)
│   └── auth.php                      # Auth routes
│
├── database/
│   └── migrations/
│
├── config/
│
└── public/
    └── images/
        ├── logo-white.png
        ├── logo-black.webp
        └── clients/
            ├── dark/               # White logos for dark theme
            └── light/              # Black logos for light theme
```

---

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| name | string | |
| email | string | Unique |
| email_verified_at | timestamp | Nullable |
| password | string | Bcrypt hashed |
| is_admin | boolean | Default: false |
| remember_token | string | Nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### contacts
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| personal_name | string | |
| company_name | string | Nullable |
| phone_number | string | |
| email | string | |
| services | json | Array of selected services |
| more_details | text | Nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### leads
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| first_name | string | |
| last_name | string | |
| phone_number | string | |
| email | string | Nullable |
| service_interest | string | Nullable |
| source | string | Default: 'breeze' |
| created_at | timestamp | |
| updated_at | timestamp | |

### sessions
Laravel session storage (database driver).

### password_reset_tokens
Password reset token storage.

### jobs, job_batches, failed_jobs
Laravel queue system tables.

---

## Routes

### Public Routes
| Method | URI | Controller | Description |
|--------|-----|------------|-------------|
| GET | / | - | Landing page (Inertia) |
| GET | /services/{slug?} | - (closure) | Service detail page (defaults to 'branding') |
| POST | /contact | ContactController@store | Contact form submission |

#### Valid Service Slugs
`social-media`, `paid-ads`, `seo`, `pr-social-listening`, `branding`, `software-ai`

### Auth Routes (Guest Only)
| Method | URI | Name | Description |
|--------|-----|------|-------------|
| GET | /login | login | Login page |
| POST | /login | - | Authenticate |
| GET | /forgot-password | password.request | Forgot password page |
| POST | /forgot-password | password.email | Send reset link |
| GET | /reset-password/{token} | password.reset | Reset password page |
| POST | /reset-password | password.store | Process reset |

### Auth Routes (Authenticated)
| Method | URI | Name | Description |
|--------|-----|------|-------------|
| POST | /logout | logout | Logout user |

### Dashboard Routes (Authenticated)
| Method | URI | Name | Description |
|--------|-----|------|-------------|
| GET | /dashboard | dashboard.index | Dashboard home |
| GET | /dashboard/contacts | dashboard.contacts | Contacts list |
| DELETE | /dashboard/contacts/{id} | dashboard.contacts.destroy | Delete contact |

### API Routes (External)
| Method | URI | Name | Description |
|--------|-----|------|-------------|
| POST | /api/leads | api.leads.store | Breeze AI agent lead submission (API key auth, 30/min rate limit) |

### Admin-Only Routes
| Method | URI | Name | Description |
|--------|-----|------|-------------|
| GET | /dashboard/users | dashboard.users | Team members list |
| POST | /dashboard/users | dashboard.users.store | Create team member |
| PUT | /dashboard/users/{id} | dashboard.users.update | Update team member |
| DELETE | /dashboard/users/{id} | dashboard.users.destroy | Delete team member |

---

## Key Patterns & Conventions

### Frontend Patterns

#### Inertia.js Form Handling
```tsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
});

const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('login'));
};
```

#### Theme Context Usage
```tsx
import { useTheme } from '@/contexts/ThemeContext';

const { isDarkMode, toggleTheme } = useTheme();
```

#### Internationalization
```tsx
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();
const isRTL = i18n.language === 'ar';
```

#### Page Props Type
```tsx
interface PageProps {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}
```

### Backend Patterns

#### Controller Response (Inertia)
```php
return Inertia::render('Dashboard/Index', [
    'stats' => $stats,
    'recentContacts' => $recentContacts,
]);
```

#### Form Validation
```php
$validated = $request->validate([
    'email' => 'required|email|unique:users,email',
    'password' => 'required|min:8',
]);
```

#### Middleware Registration
```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
        'api.key' => \App\Http\Middleware\ApiKeyMiddleware::class,
    ]);
})
```

---

## External Integrations

### ClickUp
- **Purpose**: Create tasks from contact submissions
- **Trigger**: ProcessContactSubmission job
- **Config**: `CLICKUP_API_KEY`, `CLICKUP_LIST_ID`

### Facebook/META
- **Pixel**: Tracks PageView and Lead events
- **Marketing API**: Campaign management (FacebookMarketingService)
- **Config**: `FACEBOOK_PIXEL_ID`, `FACEBOOK_APP_ID`, `FACEBOOK_ACCESS_TOKEN`, `FACEBOOK_AD_ACCOUNT_ID`

### Email (Resend)
- **Purpose**: Contact notifications, password reset
- **Config**: SMTP settings in `.env`

### Breeze AI Agent
- **Purpose**: Receive leads from AI voice agent via n8n workflow
- **Endpoint**: `POST /api/leads`
- **Auth**: API key via `X-API-Key` header or Bearer token
- **Config**: `BREEZE_API_KEY`
- **Data**: first_name, last_name, phone_number, email (optional), service_interest

### Google Analytics
- **GTM**: GTM-TJTKSH9J
- **GA4**: G-TFQFC7Q08R
- **Location**: Inline in Landing.tsx

---

## Services

### Contact Form Service
8 available service categories:
1. Paid Ads
2. Social Media
3. SEO
4. Branding
5. PR
6. Q&Q Research
7. Software & AI
8. Social Listening

### Contact Submission Flow
1. User submits form (client validation)
2. Server validates (rate limited: 5/min/IP)
3. Contact saved to database
4. Job dispatched to queue
5. Job processes:
   - Sends email notification
   - Creates ClickUp task
   - Fires Facebook Pixel lead event

---

## Brand & Design System

### Brand Colors
```css
--brand-purple: #704399
--brand-red: #C93727
```

### Character Colors (Login Animation)
```css
--purple-character: #6C3FF5
--black-character: #2D2D2D
--orange-character: #FF9B6B
--yellow-character: #E8D754
```

### Fonts
- Primary: Figtree
- Arabic: Tajawal, Cairo
- English accent: Poppins, SF Pro

### UI Component Library
- Based on Radix UI primitives
- CVA (class-variance-authority) for variants
- cn() utility for class merging (clsx + tailwind-merge)

---

## Development Commands

### Setup
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Development
```bash
php artisan serve          # Laravel server
npm run dev                # Vite dev server
php artisan queue:work     # Queue worker
```

### Production
```bash
npm run build
php artisan optimize
```

### Admin User
```bash
php artisan admin:create email@example.com password "Name"
```

---

## Security Considerations

### Implemented
- CSRF protection (Laravel + Inertia)
- Rate limiting (contact form, login)
- Password hashing (Bcrypt)
- Session management (database driver)
- Admin middleware for protected routes
- Self-protection in user management
- API key authentication for external integrations

### Login Rate Limiting
- 5 attempts per minute
- Key: `email|ip_address`
- Lockout with countdown

### Contact Form Rate Limiting
- 5 requests per minute per IP

### API Rate Limiting
- 30 requests per minute (leads endpoint)

---

## Common Tasks

### Adding a New Page

1. Create controller method returning Inertia::render()
2. Add route in routes/web.php
3. Create React page component in resources/js/pages/
4. If dashboard page, wrap with DashboardLayout

### Adding Translations

1. Add keys to resources/js/locales/en/*.json
2. Add Arabic translations to resources/js/locales/ar/*.json
3. Use `t('namespace.key')` in components

### Adding Dashboard Feature

1. Add controller in app/Http/Controllers/Dashboard/
2. Add routes (with appropriate middleware)
3. Create page component
4. Add navigation link in DashboardLayout.tsx

---

## Troubleshooting

### Common Issues

**Vite not loading assets**
- Ensure both `php artisan serve` and `npm run dev` are running

**Queue jobs not processing**
- Run `php artisan queue:work`
- Check `failed_jobs` table for errors

**Admin routes return 403**
- Verify user has `is_admin = true`
- Clear route cache: `php artisan route:clear`

**Dark mode not persisting**
- Check localStorage for 'theme' key
- Ensure ThemeProvider wraps the app

---

## File Locations Quick Reference

| Feature | File(s) |
|---------|---------|
| Landing Page | resources/js/pages/Landing.tsx |
| Services Page | resources/js/pages/Services.tsx |
| Service Selector | resources/js/components/ui/expandable-service-selector.tsx |
| Contact Form | resources/js/components/landing/ContactUs.tsx |
| Contact Processing | app/Jobs/ProcessContactSubmission.php |
| Clients & Partners Section | resources/js/components/landing/ClientsPartners.tsx |
| Login Page | resources/js/pages/Auth/Login.tsx |
| Login Animation | resources/js/components/animated-characters-login-page.tsx |
| Dashboard Layout | resources/js/layouts/DashboardLayout.tsx |
| Theme Toggle | resources/js/components/ThemeToggle.tsx |
| Language Switcher | resources/js/components/LanguageSwitcher.tsx |
| i18n Config | resources/js/i18n.ts |
| Tailwind Config | tailwind.config.js |
| Vite Config | vite.config.js |
| Routes | routes/web.php, routes/auth.php |
| Admin Middleware | app/Http/Middleware/AdminMiddleware.php |
| Facebook Service | app/Services/FacebookMarketingService.php |
| Scroll Animations Hook | resources/js/hooks/useInView.ts |
| CSS Animations | resources/css/app.css |
| Marquee Belt Animations | resources/css/app.css |
| Service Translations (en) | resources/js/locales/en/serviceDetail.json |
| Service Translations (ar) | resources/js/locales/ar/serviceDetail.json |
| Client/Partner Logos (dark) | public/images/clients/dark/ |
| Client/Partner Logos (light) | public/images/clients/light/ |
| Breeze AI Lead Controller | app/Http/Controllers/Api/LeadController.php |
| API Key Middleware | app/Http/Middleware/ApiKeyMiddleware.php |
| Lead Model | app/Models/Lead.php |
| API Routes | routes/api.php |

---

## Environment Variables

```bash
# Required
APP_NAME=HardRock
APP_URL=https://hardrock-co.com
APP_KEY=

DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@hardrock-co.com

# Integrations
CLICKUP_API_KEY=
CLICKUP_LIST_ID=

FACEBOOK_PIXEL_ID=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_ACCESS_TOKEN=
FACEBOOK_AD_ACCOUNT_ID=

# Breeze AI Agent
BREEZE_API_KEY=

# Queue & Session
QUEUE_CONNECTION=database
SESSION_DRIVER=database
```

---

## SEO Implementation

### Current Status (Implemented)

| Element | Status | Location |
|---------|--------|----------|
| Meta title & description | ✅ Done | `resources/views/app.blade.php` |
| Landing page descriptive title | ✅ Done | `resources/js/pages/Landing.tsx` |
| LocalBusiness Schema | ✅ Done | `resources/views/partials/structured-data.blade.php` |
| ProfessionalService Schema | ✅ Done | `resources/views/partials/structured-data.blade.php` |
| FAQPage Schema | ✅ Done | `resources/views/partials/structured-data.blade.php` |
| SiteNavigationElement Schema | ✅ Done | `resources/views/partials/structured-data.blade.php` |
| ItemList Schema | ✅ Done | `resources/views/partials/structured-data.blade.php` |
| Service Schema (per service page) | ✅ Done | `resources/js/pages/Services.tsx` |
| BreadcrumbList Schema (service pages) | ✅ Done | `resources/js/pages/Services.tsx` |
| Open Graph / Twitter cards | ✅ Done | `resources/views/app.blade.php` |
| Service-specific OG images | ✅ Done | `resources/js/pages/Services.tsx` |
| Hreflang tags (en/ar) | ✅ Done | `resources/views/app.blade.php` |
| Sitemap with all pages | ✅ Done | `public/sitemap.xml` |
| robots.txt | ✅ Done | `public/robots.txt` |
| Service pages meta descriptions | ✅ Done | `resources/js/pages/Services.tsx` |
| Geo meta tags | ✅ Done | `resources/views/app.blade.php` |
| Image alt text | ✅ Done | All components |
| Heading hierarchy (single h1 per page) | ✅ Done | Hero=h1, Services/ContactUs=h2 |
| Crawlable navigation links | ✅ Done | Service buttons use `<a href>`, CTAs use `<a href>` |
| Auth/Dashboard noindex | ✅ Done | All Auth + Dashboard pages |
| Footer social links aria-labels | ✅ Done | `resources/js/components/landing/Footer.tsx` |
| Cookie consent (CookieYes) | ✅ Done | `resources/views/app.blade.php` |

### TODO: When Adding News/Blog Section

#### 1. Database & Backend
- [ ] Create `posts` migration (title, slug, content, excerpt, featured_image, author_id, published_at, meta_description)
- [ ] Create `Post` model with SEO fields
- [ ] Create `PostController` with CRUD operations
- [ ] Add blog routes: `/news`, `/news/{slug}`

#### 2. Sitemap Updates
- [ ] Convert static `public/sitemap.xml` to dynamic Laravel route
- [ ] Auto-generate sitemap entries for all blog posts
- [ ] Include `<lastmod>` based on post updated_at
- [ ] Add image sitemap entries for featured images

#### 3. Schema Markup for Blog
- [ ] Add `Article` or `BlogPosting` schema for each post
- [ ] Add `BreadcrumbList` schema for navigation
- [ ] Add `AggregateRating` schema if implementing post ratings

#### 4. Meta Tags for Blog Posts
- [ ] Dynamic `<title>` per post: `{Post Title} | HardRock Blog`
- [ ] Dynamic `<meta name="description">` from post excerpt
- [ ] Dynamic Open Graph tags (og:title, og:description, og:image)
- [ ] Dynamic canonical URL per post
- [ ] Add `article:published_time` and `article:author` meta tags

#### 5. Content Strategy for Local SEO
Target these keyword themes in blog posts:
- "digital marketing in Jordan"
- "social media marketing Amman"
- "SEO tips for Jordanian businesses"
- "marketing trends MENA region"
- "how to grow business in Jordan"
- Case studies featuring local clients

#### 6. External Actions (Not Code)
- [ ] Submit updated sitemap to Google Search Console
- [ ] Set up Google Business Profile with posts
- [ ] Build backlinks from Jordanian directories and publications
- [ ] Collect Google reviews from clients
- [ ] Register with local business directories

### SEO File Locations

| File | Purpose |
|------|---------|
| `resources/views/app.blade.php` | Global meta tags, hreflang, OG tags, CookieYes |
| `resources/views/partials/structured-data.blade.php` | JSON-LD schema markup (uses `@@` for Blade escaping of `@`) |
| `public/sitemap.xml` | XML sitemap (currently static, update `lastmod` dates when content changes) |
| `public/robots.txt` | Crawler directives |
| `resources/js/pages/Services.tsx` | Service page meta descriptions, dynamic OG images, Service + Breadcrumb JSON-LD schemas |
| `resources/js/pages/Landing.tsx` | Landing page title |
| `resources/js/components/landing/Hero.tsx` | Only h1 on landing page (one per language) |
| `resources/js/components/landing/Footer.tsx` | Social links with aria-labels |

---

## Related Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Project overview and structure
- [AUTH_SYSTEM_SPECIFICATION.md](./AUTH_SYSTEM_SPECIFICATION.md) - Detailed auth system docs
- [META_API_INTEGRATION.md](./META_API_INTEGRATION.md) - Facebook/META integration guide
- [planning/admin-dashboard-plan.md](./planning/admin-dashboard-plan.md) - Dashboard implementation notes

---

> **Last updated:** 2026-04-13 — based on commit `c7a1f1f` (*Add API endpoint for Breeze AI agent lead submissions*)
