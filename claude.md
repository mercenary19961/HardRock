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
| SSR | Inertia SSR + ReactDOMServer (Node renderer) | - |
| Node Runtime (SSR) | Node | 20+ |
| Styling | Tailwind CSS | 3 |
| Animations | CSS Keyframes (landing) + Framer Motion (Services page) | - |
| Build Tool | Vite | 7 |
| Package Manager | pnpm | 10 |
| Database | MySQL | 8.0 |
| Queue Driver | Database | - |
| Session Driver | Database | - |
| Production Host | Railway (Railpack + FrankenPHP) | - |

---

## Architecture Overview

### Monolithic SPA with Inertia.js + SSR

The application uses Inertia.js to bridge Laravel backend with React frontend, with Server-Side Rendering enabled in production for SEO:

1. **Server-side routing** - Laravel handles all routes
2. **SSR rendering** - Production: Laravel POSTs page data to a Node SSR sidecar which renders the React tree to HTML; Googlebot sees full content + crawlable links on first paint
3. **Client-side hydration** - Browser receives SSR HTML and React hydrates on top
4. **No API needed** - Inertia passes data as props to React components
5. **Form handling** - Inertia's `useForm` hook for form submissions

### Request Flow (production with SSR)
```
Browser Request → Laravel Router → Controller → Inertia::render()
                                       ↓
                              [Inertia middleware POSTs page payload to
                               http://hardrock-ssr.railway.internal:13714]
                                       ↓
                              Node SSR renders React → HTML string
                                       ↓
                              Laravel injects HTML into Blade template → Response
                                       ↓
                              Browser receives populated HTML, React hydrates
```

### Local dev (no SSR)
Local `composer dev` runs Vite + PHP only. SSR is opt-in locally via `INERTIA_SSR_ENABLED=true` + `php artisan inertia:start-ssr` in another terminal. Day-to-day frontend iteration does not need SSR.

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
│       ├── app.tsx                   # Client entry point (hydrateRoot when SSR HTML present)
│       ├── ssr.tsx                   # SSR entry point (Node, eager imports, ReactDOMServer)
│       ├── bootstrap.ts              # Axios setup (window-guarded for SSR safety)
│       ├── i18n.ts                   # i18next setup — initI18n(language) + setLanguageCookie()
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

const { theme, toggleTheme, setTheme } = useTheme();
const isLightMode = theme === 'light';
```

Theme is initialized from a `theme` cookie (read server-side in `HandleInertiaRequests`, passed as the `appearance.theme` Inertia prop, fed into `<ThemeProvider initialTheme={...}>` in `app.tsx`). Toggling writes the cookie via `document.cookie` so the next request renders the correct `<html class>` server-side. Do **not** introduce a localStorage path — it would reintroduce hydration mismatches.

#### Internationalization
```tsx
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();
const isRTL = i18n.language === 'ar';
```

i18n is initialized in `app.tsx` and `ssr.tsx` via `initI18n(appearance.language)` using the language read from the `language` cookie. Switching language is done via `LanguageSwitcher` which calls `i18n.changeLanguage(...)` then `setLanguageCookie(...)` — the latter both writes the cookie and updates `<html lang>` and `<html dir>` for RTL/LTR. Browser language auto-detection is intentionally disabled (deterministic SSR per URL).

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

#### Shared props (HandleInertiaRequests)
Every Inertia response automatically includes:
- `auth.user` — current authenticated user or null
- `appearance.theme` — `'light'` or `'dark'` from the `theme` cookie (defaults `'dark'`)
- `appearance.language` — `'en'` or `'ar'` from the `language` cookie (defaults `'en'`); also sets Laravel's locale via `app()->setLocale()`
- `ziggy` — Ziggy route table + current location (needed so `route('name')` resolves during SSR render)

Read these via the page props in any component. Don't bypass them by reading cookies directly in React.

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
pnpm install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Development (no SSR — fast iteration)
```bash
composer dev               # runs php artisan serve + queue:listen + vite concurrently
# OR run them separately:
php artisan serve
pnpm dev
php artisan queue:work
```
SSR is **off** by default locally. The site works fully — only Googlebot would see an empty body. Phase out via the SSR test workflow below if you need to verify SSR-specific behavior.

### Local SSR test workflow
```bash
# Terminal 1
INERTIA_SSR_ENABLED=true php artisan serve

# Terminal 2
php artisan inertia:start-ssr

# After any code change in resources/js/
pnpm build                 # rebuilds both client + ssr bundles
```

### Production build
```bash
pnpm build                 # = vite build && vite build --ssr
                           # → public/build/ (client) + bootstrap/ssr/ssr.js (SSR)
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
- Ensure both `php artisan serve` and `pnpm dev` are running

**Queue jobs not processing**
- Run `php artisan queue:work`
- Check `failed_jobs` table for errors

**Admin routes return 403**
- Verify user has `is_admin = true`
- Clear route cache: `php artisan route:clear`

**Dark mode / language not persisting**
- Check the `theme` and `language` cookies in DevTools → Application → Cookies (NOT localStorage; we migrated)
- Ensure `<html class>`, `<html lang>`, `<html dir>` are correct on first paint (server-rendered from cookies in `app.blade.php`)
- If first paint is wrong: `HandleInertiaRequests::share()` is the source of truth — verify cookie names match

### SSR-specific Issues

**Production body is ~32–42 KB instead of ~80–100 KB**
- HardRock can't reach hardrock-ssr. Check:
  1. `INERTIA_SSR_ENABLED=true` and `INERTIA_SSR_URL=http://hardrock-ssr.railway.internal:13714` are set on the HardRock service
  2. hardrock-ssr service is **Online** in the Railway canvas
  3. hardrock-ssr deploy logs show `Inertia SSR server started.` (not crashing)
- Inertia falls back to client-only rendering when SSR is unreachable, which is what produces the smaller body.

**hardrock-ssr crashes with `ERR_MODULE_NOT_FOUND`**
- A package needed at SSR runtime is in `devDependencies` and got pruned by `pnpm prune --prod`. Move it to `dependencies` in `package.json`, regenerate `pnpm-lock.yaml` (`pnpm install --lockfile-only`), commit, redeploy.
- React, react-dom, @inertiajs/react, axios MUST stay in `dependencies` for this reason.

**Hydration mismatches in browser console**
- Usually means SSR rendered something different than the client expects on first render. Common causes:
  - Reading `window`/`document`/`localStorage` during render (must be in `useEffect`)
  - Theme/language state diverging — `<ThemeProvider initialTheme>` and `initI18n(language)` must use the same values the server rendered (i.e. from `appearance` Inertia prop)

**`route('name')` errors in SSR-rendered components**
- Ziggy data is shared via the `ziggy` Inertia prop and rebound to `globalThis.route` inside `ssr.tsx`. If you're seeing route errors, confirm `HandleInertiaRequests::share()` includes the `ziggy` key.

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
| Theme Context | resources/js/contexts/ThemeContext.tsx |
| i18n Config | resources/js/i18n.ts |
| Client Entry (hydrate) | resources/js/app.tsx |
| SSR Entry (Node) | resources/js/ssr.tsx |
| SSR Build Output | bootstrap/ssr/ssr.js (gitignored, built by `pnpm build`) |
| Inertia SSR Config | config/inertia.php |
| Inertia Shared Props | app/Http/Middleware/HandleInertiaRequests.php |
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

# Inertia SSR (production only — set on the HardRock service in Railway)
INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://hardrock-ssr.railway.internal:13714
```

---

## Production Deployment (Railway)

The site runs on **Railway** with the **Railpack** builder producing a **FrankenPHP** image. There is no Nixpacks config — Railway auto-detects the project as Laravel via Railpack and runs the build/start steps for you. Do not add a `nixpacks.toml` expecting it to be honored; Railpack uses its own auto-detection.

### Services in the Railway project
| Service | Role | Start command |
|---------|------|---------------|
| `HardRock` | Main web service (FrankenPHP serving www.hardrock-co.com) | Auto (Railpack default) |
| `hardrock-ssr` | Inertia SSR Node renderer | `node bootstrap/ssr/ssr.js` (custom) |
| `hardrock-worker` | Queue worker | `php artisan queue:work` |
| `MySQL` | Database | (managed by Railway) |

### How SSR is wired
- `hardrock-ssr` exposes only a **private** domain: `hardrock-ssr.railway.internal` on port `13714` (Inertia's default port, hardcoded in `resources/js/ssr.tsx`)
- HardRock has env vars `INERTIA_SSR_ENABLED=true` and `INERTIA_SSR_URL=http://hardrock-ssr.railway.internal:13714`
- Each request to HardRock: PHP renders the page payload, POSTs it to the SSR service, gets back HTML, injects it into the Blade template, returns to the browser
- If hardrock-ssr is down or unreachable, Inertia falls back to client-only rendering (degraded SEO but service stays up)

### Build phase (both web services)
Both HardRock and hardrock-ssr run identical builds (same repo, same Railpack auto-detection):
1. `composer install --no-dev --optimize-autoloader`
2. `pnpm install --frozen-lockfile`
3. `pnpm build` → produces `public/build/` (client) AND `bootstrap/ssr/ssr.js` (SSR bundle)
4. `php artisan config:cache && route:cache && view:cache`
5. `pnpm prune --prod --ignore-scripts` → strips devDependencies

This is why React/react-dom/@inertiajs/react/axios MUST be in `dependencies` — they're externalized in the SSR bundle and need to survive prune.

### Deploy / config flow
- Code change: push to `main` → both HardRock and hardrock-ssr auto-redeploy in parallel
- Variable change on HardRock: HardRock auto-redeploys
- Variable change on hardrock-ssr: hardrock-ssr auto-redeploys
- Manual redeploy: Service → Deployments → three-dot menu → Redeploy

### Verifying SSR in production
```bash
curl -s -A "Googlebot" --compressed https://www.hardrock-co.com/services/seo | wc -c
# Expected: ~80,000–100,000  (was ~908 pre-SSR)

curl -s -A "Googlebot" --compressed https://www.hardrock-co.com/ | grep -oE 'href="/services/[^"]+"' | sort -u | wc -l
# Expected: 6
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
| **SSR for full-body crawl** | ✅ Done (2026-05-02) | `resources/js/ssr.tsx` + `hardrock-ssr` Railway service. Body went from ~908 B to 70–100 KB; all 6 service hrefs visible to Googlebot on every page |
| Server-rendered `<html lang dir class>` | ✅ Done | `resources/views/app.blade.php` reads `theme` + `language` cookies |

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

> **Last updated:** 2026-05-02 — based on commit `82ea43a` (*Inertia SSR rollout: separate Railway service, cookie-based appearance, full server-rendered body for crawlers*)
