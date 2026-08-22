# HardRock - Codebase Context for Claude

> **📍 Doc sync:** CLAUDE.md last synced to commit `df164d4` — 2026-08-22 15:31 (Sat) [`hero-frog-tracker`; only the navbar going fully transparent over the hero is uncommitted].

This document provides comprehensive context about the HardRock codebase to help Claude understand and work with the project effectively.

---

## Project Overview

**HardRock** is a digital marketing agency website built as a modern full-stack monolithic SPA using Laravel + React + Inertia.js architecture.

### Key URLs
- Production: https://hardrock-co.com
- Admin Panel: https://hardrock-co.com/admin

### Business Purpose
- Showcase digital marketing services
- Generate leads via contact form
- Manage contact submissions and team members via admin panel

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
│       │   │   ├── HeroFrog.tsx        # Cursor-tracked character backdrop (desktop only)
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
| GET | /services | - (closure) | 301 → /services/branding (query string preserved; bare URL was an indexed duplicate) |
| GET | /services/{slug} | - (closure) | Service detail page |
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

### Admin Routes (Authenticated)
| Method | URI | Name | Description |
|--------|-----|------|-------------|
| GET | /admin | admin.index | Admin panel home |
| GET | /admin/contacts | admin.contacts.index | Contacts list |
| DELETE | /admin/contacts/{id} | admin.contacts.destroy | Delete contact |

### API Routes (External)
| Method | URI | Name | Description |
|--------|-----|------|-------------|
| POST | /api/leads | api.leads.store | Breeze AI agent lead submission (API key auth, 30/min rate limit) |

### Admin-Only Routes
| Method | URI | Name | Description |
|--------|-----|------|-------------|
| GET | /admin/users | admin.users.index | Team members list |
| POST | /admin/users | admin.users.store | Create team member |
| PUT | /admin/users/{id} | admin.users.update | Update team member |
| DELETE | /admin/users/{id} | admin.users.destroy | Delete team member |

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

## Landing Hero — cursor-tracked character

> **Status: WIP on branch `hero-frog-tracker`, not merged.** Replaces the static
> `hero-icon.webp` chevron on DESKTOP ONLY. Nothing about the mobile hero changes.

**Files:** `resources/js/components/landing/HeroFrog.tsx` (new) ·
`resources/js/components/landing/Hero.tsx` (mounts it, hides the chevron/glow/wave at
`lg`) · `public/images/frog/f000..f058.webp` (59 frames, 1.5 MB)

A character in the hero turns his head to follow the visitor's cursor. The cursor is
drawn as a mosquito, so the reason he is watching is legible.

### It is a stack of stills, not a video

🔑 The source is an MP4, but seeking it measured **~68 ms per jump** — far too slow to
track a pointer, because a normal H.264 export only carries a keyframe every couple of
seconds and the decoder has to walk forward from the last one. Stills have no decoder:
moving between poses is an opacity change. They also work in Safari, where video
`currentTime` scrubbing is unreliable, and they let the dead holds in the clip be
dropped at build time rather than sat through at runtime.

Frames are all in the DOM from first paint and only their opacity changes. Swapping a
single `src` would decode on demand and stutter on the first pass through the sweep.

### Extracting frames from a new render

The source is 30 fps. Sample at the native frame rate, keep the video's **temporal
order**, and select frames on *monotonic pose progress* — a frame earns its place only
if the head has actually advanced since the last kept one, measured as pixel distance
over the head region. That single rule drops the holds at either end, the stall in the
middle, and any small backward step. From FROG_3: **128 native frames → 59 kept.**

🔴 **Do NOT sort frames by a computed "head angle".** An earlier version scored each
frame by where the dark eye-pixels sat inside the head's bounding box and sorted on
that. The proxy is noisy, and in the tail it put genuinely different poses in the wrong
order — on screen the head turned, snapped back, and turned again. The video's own
order *is* the rotation order; nothing needs inferring.

⚠️ **Do not pad the sequence by duplicating frames.** A duplicate carries no new pose,
so it parks one image over more cursor travel — a dead spot, not smoother motion.

### Mapping

**ABSOLUTE**: cursor x maps straight onto a pose, so where he looks always corresponds
to where the visitor actually is. The usual implementation of this effect accumulates
mouse deltas instead, which drifts — acceptable for an abstract shape, fatal for a face.

⚠️ Two cleverer schemes were tried and both made it worse, so plain linear is
deliberate:
- **Pivoting the head-on frame onto his screen position** is geometrically right, but
  the current footage *ends* at head-on, so everything past him froze — a third of the
  hero dead.
- **Mirroring frames to fake the missing half** left the opposite corner uncovered
  (reflecting about his axis moves the image off its own box) and flipped the lapel-pin
  logo.

⚠️ **Check the direction empirically after any re-harvest.** Whether frame 0 is the
screen-left extreme depends on how the sequence was built; a sorted harvest needed
reversing and a temporal one does not. Getting this wrong has inverted the hero twice.
Screenshot the two extremes and look — pixel metrics for "which way is he facing" have
been unreliable here.

### Three modes: track, idle, return

Which pose is painted is decided by a small state machine inside the effect; `renderPose`
just paints whatever float it is handed, and `poseRef` is how the modes hand off to each
other.

- **track** — the absolute mapping above. One rAF per mousemove, no loop.
- **settle** — 200ms after the pointer stops, a 160ms ease onto the nearest whole frame
  so he never rests on a blend. Unconditional, including under reduced motion: it is a
  correction rather than decoration. Any movement abandons it, and because tracking is
  absolute the half-frame difference never shows.
- **idle** — after `IDLE_AFTER` (1s) with no movement, the mosquito fades out and he
  sweeps the room for it: ONE unbroken cosine across the full range, end to end and back
  (`SWEEP_MS`, 2.4s each way), forever. Runs a continuous rAF.

  🔴 **No targets, no holds, no randomness — that was tried and it looked wrong.** The
  first version picked random poses and held on each; every hold was a stop, every stop
  showed one frame in isolation, and the result read as a video being scrubbed rather
  than a head turning. Sweeping the whole range means the only thing on screen is
  motion, which is also the one condition under which the cross-fade blur is invisible.

  ⚠️ **A cosine, not a linear ping-pong.** Reversing a constant velocity at the ends
  snaps; a cosine arrives at each extreme with zero velocity. He also enters the sweep
  at `acos(1 - 2·pose/SPAN)`, the phase matching where his head already is, so the hunt
  starts from his current pose instead of jumping to an end. Verified numerically: entry
  jump 7e-15 poses, range exactly 0..58, two reversals per round trip, peak speed 0.61
  poses per frame at 60fps (so adjacent frames are always cross-faded, never skipped).
- **return** — the first mousemove brings the mosquito straight back and eases the head
  from wherever the search left it onto the pointer over `RETURN_MS` (260ms), then hands
  back to track.

⚠️ **The return target is re-read every frame, not fixed when the return starts.** A
visitor who keeps moving would otherwise be chased to a position they had already left,
and the head would arrive somewhere stale before snapping.

⚠️ **The mosquito is the only pointer over the hero** (Hero hides the native arrow), so
an idle frog means the visitor briefly has no pointer at all. That is why the return is
triggered by the first mousemove rather than by any timer, and why the mosquito's
opacity is restored in the same frame as the movement.

🔴 **Idling is gated three ways, and all three matter:** `prefers-reduced-motion` (a head
that turns on its own forever is exactly what that setting is for; tracking still works,
since that is a response to the visitor's own input), an IntersectionObserver on the
wrapper (an rAF loop running on a section nobody has scrolled to is a battery leak), and
`mode === 'track'` (never interrupt a return). He also starts hunting on a fresh load
without any pointer ever being seen, which is the common case.

### Blending, and its cost

Adjacent frames are cross-faded by the sub-frame fraction, otherwise the step is ~24 px
of cursor travel per pose and each one is visible landing.

⚠️ A cross-fade is a double exposure: at 50/50 it costs about **15% of the head's edge
detail**, which reads as blur. That cost is inherent and does not shrink with frame
count — an earlier measurement suggesting it did had sampled the stalled region, where
adjacent frames were near-duplicates. What *can* be reduced is the time spent near
50/50, which is why the fraction is eased with a smoothstep rather than used raw.
Removing the softness properly needs more real poses over the same rotation.

🔑 **He must never come to REST on a blend.** In motion the double exposure is invisible;
parked on it, the hero holds a permanently soft frame and it reads exactly like a video
paused between keyframes. The idle sweep never stops, so the only place he genuinely
comes to rest is a still pointer: 200ms after it stops he eases onto the nearest whole
frame (`SETTLE_AFTER` / `SETTLE_MS`). The nudge is at most half a pose, under a degree
of rotation, so it is invisible as movement.

📊 **Measured, so don't go hunting for "the blurry frames".** Sharpness across all 59
(variance of the Laplacian over the head region, located by taking the bounding box of
the top decile of inter-frame movement) spans just **1.47x** end to end: worst frame 83%
of median, best
121%, and the even/odd alternation visible in the numbers averages out to ~4%. **No
individual frame is meaningfully soft.** A mid-blend rest costs about as much as the
single worst frame in the set and stacks on top of whatever frame it lands between, so
snapping to whole frames is the entire fix; curating a list of "sharp" frames to stop on
would buy almost nothing.

### Mobile, tablets and RTL

🔴 **`lg:` is NOT the test for "has this character" — use the `desktop-pointer:`
variant.** An iPad in landscape is 1024px+ with no pointer, so the component returns
`null` there while any `lg:`-keyed styling still fires. That combination shipped briefly
and left iPads with a hero that had no artwork at all and, in the light theme, white
copy on a white background. Everything the character affects is therefore keyed to a
custom screen in `tailwind.config.js`:

```js
'desktop-pointer': { raw: '(hover: hover) and (pointer: fine) and (min-width: 1024px)' }
```

- **Deliberately CSS, not the JS hook.** A media query is right on first paint; a
  hydration-time boolean would flash the wrong hero on every load. `usePrecisePointer`
  carries the identical query and decides only whether to MOUNT the character (and to
  hide the cursor, which must not happen before the mosquito exists). **Change one
  string and you must change the other.**
- **What it gates:** the wave (`hidden lg:block desktop-pointer:hidden`), the chevron,
  the copy going white, and the RTL column swap. Anything a pointerless screen must keep
  stays on `lg:`, so the original desktop hero survives intact on an iPad.
- **Mobile is untouched** either way: no payload, no listener, no frames in the DOM.
- 🔴 **Arabic needs `desktop-pointer:col-start-2` on the text column.** Under RTL the
  FIRST grid child is the RIGHT column — which is where the character stands — so the
  copy landed on his face and was unreadable. Placing it in column two puts it back on
  the left visually while the Arabic text inside still reads right-to-left. It is keyed
  to the character's own condition because with no character there is nothing to dodge,
  and the original layout deliberately put the Arabic copy on the right. Below `lg` the
  grid is single-column, so mobile is unaffected either way.
- ⚠️ **The `lg:hidden` on the dark-mode purple glow is a no-op**, left as found.
  `dark:block` compiles to `:is(.dark *)` at specificity 0-2-0 and outranks `lg:hidden`
  at 0-1-0, so the glow still washes over the character in dark mode. Realising the
  original intent needs `dark:desktop-pointer:hidden` (0-2-0 inside a media query); it
  is a visual change to the current desktop hero, so it was left for a deliberate call.
- A gradient scrim sits under the copy. The backdrop measures 12:1 against white, so
  white was fine — but the brand's purple-to-red gradient on "Digital Solutions" all but
  vanished against purple. Darkening the copy side keeps the gradient rather than
  recolouring it for one breakpoint.

### Known limitation

🔴 **The footage has never contained a turn to the viewer's RIGHT.** Across three
renders the sweep runs profile-left → head-on and stops. The mapping therefore spreads
what exists evenly across the width, so he is not strictly looking *at* the cursor when
it sits on him. **A render covering both sides makes this exact code correct with no
change.** The brief for it: one continuous head turn, full profile facing the viewer's
left all the way to full profile facing the viewer's right, both ends full profile,
never turning back, no blinks, over about 4 seconds.

⚠️ A blink is not a blink here. Cursor position maps to a frame, so a blink becomes a
permanently closed-eyed patch of the page rather than something that flashes past.

### Not built

Audio. A synthesised mosquito whine that rises as the cursor nears his face is written
and tested in the prototype but deliberately left out of the site: browsers block audio
until a user gesture, and WCAG 2.2.2 requires a stop control for anything over three
seconds, so it needs a visible toggle and its own decision.

### The native cursor is hidden over the hero

The mosquito is the pointer, so the arrow is switched off for the section — otherwise
the visitor sees two cursors. `Hero` puts `cursor-none [&_*]:cursor-none` on the section
on exactly the condition that mounts the character.

🔑 **The condition is shared, via `usePrecisePointer()`.** Hiding the cursor where the
character does not render would leave a visitor with no pointer at all, so the media
query (`hover: hover` + `pointer: fine` + `min-width: 1024px`) lives in one hook that
both components read. Never let those two decisions drift apart.

⚠️ **`cursor-none` alone is not enough — the descendant rule is load-bearing.** `cursor`
inherits, but a link carries `cursor: pointer` from the UA stylesheet as a declaration
*on the element*, and a declared value always beats an inherited one, so the hero CTA
kept its arrow. `[&_*]:cursor-none` fixes it because an author rule outranks the UA
stylesheet at any specificity.

⚠️ **The mosquito hides under the top 80 px** (`NAV_HEIGHT`). The navbar is transparent
now, so it would otherwise show through the bar next to the real arrow — which the nav
keeps, because its links need a click affordance.

🔴 **The mosquito lives in its OWN layer at `z-20`, not with the frames.** The hero's
content column is `relative z-10`, so anything painted alongside the backdrop goes under
it: over the CTA, whose gradient is opaque, the mosquito disappeared completely and the
visitor was left with no pointer at all. The layer is `absolute inset-0` on the same
section, so the coordinates need no adjustment, `overflow-hidden` still clips it to the
hero, and `pointer-events-none` keeps the CTA clickable through it. **Anything else that
must be visible over the copy belongs in that layer too.**

🔑 **`posRef` holds VIEWPORT coordinates, and `scroll` repaints.** Storing hero-relative
coordinates let the mosquito ride up with the section during a wheel-scroll and sit
where the pointer was not. That was merely odd before; with the native cursor hidden it
strands the visitor without a pointer until they jiggle the mouse.

The CTA has no pointer cursor as a result; its hover scale and shadow are the whole
affordance. If that ever reads as broken, restore `cursor-pointer` on that one anchor
rather than dropping the section rule.

---

## Navbar — transparent over the hero, scrim elsewhere

The bar has no solid background anywhere. It takes one of two backgrounds depending on
what is behind it:

- **Over the hero: none at all** (`bg-transparent`). The hero is the thing meant to be
  looked at, and any wash across the top of it is a band the eye reads as a bar. Nothing
  is needed because the bar's contents are already matched to that backdrop.
- **Everywhere else: a top-to-bottom gradient** (`from-*/90 via-*/45 to-transparent`)
  that fades out before its own bottom edge, so it carries the logo and links over
  whatever scrolls underneath without ever drawing a line across the page.

⚠️ **No `backdrop-blur`, deliberately.** Blur stops dead at the bottom of the nav box
while the colour keeps fading, which leaves a visible horizontal seam — the exact
artifact the transparent bar was meant to remove.

🔴 **`overHero` exists because the light theme is wrong over the hero art.** Wherever the
character renders, the hero backdrop is the dark render in BOTH themes (the hero copy is
already forced to `desktop-pointer:text-white` for the same reason). Black light-theme
nav content disappears into it; past the hero the page is white again, where white nav
content is just as invisible. So the flag is measured from `#hero`'s bottom edge against
the bar height, and it drives the background choice plus two `desktop-pointer:`-only
overrides: white links, and the white logo swapped in for the black one.

⚠️ **With no scrim over the hero, those two overrides are the ONLY thing keeping the bar
legible there.** They are not dressing — drop them and the light theme puts a black logo
on dark art.

⚠️ **Those overrides are keyed to `desktop-pointer:`, never to `lg:`.** An iPad gets the
original light hero, so a width-keyed rule would paint a white logo onto a white
background there. Same trap as the hero itself, one component further out.

⚠️ **It is seeded from the URL (`usePage().url === '/'`), not from a measurement.**
Measuring first would flash a black logo over the dark art on every light-theme landing
load, for as long as hydration takes. The scroll handler then refines it, and pages
without a `#hero` never set it.

⚠️ Specificity, if you touch these classes: `dark:` (a class selector, 0-2-0) outranks
any screen variant (0-1-0) regardless of source order, so the overrides only ever bite
in the light theme. That is intended — the dark theme is already dark. Screen variants
beat plain utilities by SOURCE ORDER instead, and `desktop-pointer` is declared in
`extend.screens`, so it lands after both the base utilities and `lg:`. Verify that
ordering in the built CSS if you ever reorder the screens.

⚠️ **Content now scrolls under the bar on `/services` and `/consultation`** (both start
their content at `pt-20`, so only scrolled content reaches it). Accepted trade-off of
"always transparent"; the scrim's opaque top edge is what keeps the links readable.

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
4. If admin page, wrap with DashboardLayout

### Adding Translations

1. Add keys to resources/js/locales/en/*.json
2. Add Arabic translations to resources/js/locales/ar/*.json
3. Use `t('namespace.key')` in components

### Adding Admin Feature

> Note: URLs live under `/admin/...` with route names `admin.*`, but internal folder/class names (`Dashboard/`, `DashboardController`, `DashboardLayout`) were intentionally kept to avoid an unnecessary autoload/imports refactor.

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

### Foundation Gotchas (hard-won, don't re-debug)

**Literal `${APP_NAME}` in every SSR title (found 2026-07-05, cost ~2 months of failed indexing)**
- *Symptom:* raw SSR HTML had a second `<title>` ending in the literal string `- ${APP_NAME}` on every page. Invisible to humans — the HardRock service's client bundle had the correct value, so hydration fixed the tab title. Only crawlers ever saw it.
- *Root cause:* Railway does **not** interpolate `${VAR}` in variables (its reference syntax is `${{...}}`). `VITE_APP_NAME="${APP_NAME}"` copied from `.env.example` onto **hardrock-ssr** got baked as a literal into `bootstrap/ssr/ssr.js` at build time. Each Railway service builds its **own** bundle from its **own** env vars, so HardRock (correct) and hardrock-ssr (broken) silently diverged.
- *Fix:* Railway vars set to literal `HardRock` on both services (2026-07-05), and the `title:` callback in `app.tsx`/`ssr.tsx` no longer reads `VITE_APP_NAME` at all — suffix is hardcoded, so per-service env divergence can't recreate this.

**Two `<title>` tags per page (Blade + Inertia SSR)**
- *Symptom:* every SSR'd page has two title tags: Blade's `<title inertia>` and the one `@inertiaHead` injects from the page's `<Head title>`.
- *Root cause:* standard Inertia SSR behavior when the Blade root template also declares a title. Harmless **only if both are identical** — Google may pick either.
- *Fix/rule:* Blade `$serviceSeo` in `app.blade.php` is the source of truth (it survives SSR-fallback mode). `SERVICE_TITLES` in `Services.tsx` and the Landing `<Head title>` MUST mirror it exactly. When changing any page title, change it in BOTH places.

**Spoofed-Googlebot curl returns 403 (Cloudflare)**
- *Symptom:* `curl -A "Googlebot" https://www.hardrock-co.com/...` → 403, `Server: cloudflare`. Looks like Googlebot is blocked; it isn't.
- *Root cause:* Cloudflare verifies real Googlebot by IP range and blocks impostors. Our own verification commands were the impostor.
- *Fix:* use a browser UA for curl checks (see "Verifying SSR in production"); use GSC URL Inspection live test to see what real Googlebot gets.

**Bare `/services` was a sitewide duplicate of `/services/branding`**
- *Symptom:* navbar linked every page to `/services?from=nav`; the slug route's `?slug = 'branding'` default served identical content at a second self-canonical URL, competing in Google's index.
- *Fix:* `/services` now 301s to `/services/branding` (query preserved) and the navbar links to the real URL. Don't reintroduce optional-slug rendering.

---

## File Locations Quick Reference

| Feature | File(s) |
|---------|---------|
| Landing Page | resources/js/pages/Landing.tsx |
| Services Page | resources/js/pages/Services.tsx |
| Service Selector | resources/js/components/ui/expandable-service-selector.tsx |
| Contact Form | resources/js/components/landing/ContactUs.tsx |
| Hero Character (cursor-tracked) | resources/js/components/landing/HeroFrog.tsx + public/images/frog/ |
| Desktop-pointer test (mount + cursor) | resources/js/hooks/usePrecisePointer.ts |
| Desktop-pointer test (all styling) | `desktop-pointer` screen in tailwind.config.js |
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
# NOTE: do NOT use -A "Googlebot" — Cloudflare verifies real Googlebot by IP and
# returns 403 to spoofed Googlebot UAs from anywhere else. Use a browser UA:
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

curl -s -A "$UA" --compressed https://www.hardrock-co.com/services/seo | wc -c
# Expected: ~80,000–100,000  (was ~908 pre-SSR; ~32–42 KB means client-only fallback)

curl -s -A "$UA" --compressed https://www.hardrock-co.com/ | grep -oE 'href="/services/[^"]+"' | sort -u | wc -l
# Expected: 6

curl -s -A "$UA" --compressed https://www.hardrock-co.com/services/seo | grep -oE '<title[^>]*>[^<]*</title>'
# Expected: TWO title tags (Blade + SSR) with IDENTICAL text and no ${APP_NAME} literal
```
To check what real Googlebot sees (past Cloudflare), use GSC → URL Inspection → Test live URL.

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
| Auth/Admin noindex | ✅ Done | `app.blade.php` checks paths starting with `admin` or `login` |
| Footer social links aria-labels | ✅ Done | `resources/js/components/landing/Footer.tsx` |
| Cookie consent (CookieYes) | ✅ Done | `resources/views/app.blade.php` |
| **SSR for full-body crawl** | ✅ Done (2026-05-02) | `resources/js/ssr.tsx` + `hardrock-ssr` Railway service. Body went from ~908 B to 70–100 KB; all 6 service hrefs visible to Googlebot on every page |
| Server-rendered `<html lang dir class>` | ✅ Done | `resources/views/app.blade.php` reads `theme` + `language` cookies |
| Unified Blade/SSR titles (killed `${APP_NAME}` literal) | ✅ Done (2026-07-05) | `SERVICE_TITLES` in `Services.tsx` + title callbacks in `app.tsx`/`ssr.tsx` mirror `$serviceSeo` in `app.blade.php` |
| Bare `/services` duplicate removed (301) | ✅ Done (2026-07-05) | `routes/web.php` + `Navbar.tsx` links to `/services/branding?from=nav` |

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

> **Last updated:** 2026-08-22 (later) — Navbar has no solid background anywhere: fully transparent while it sits over the hero, a top-to-bottom scrim elsewhere; the native cursor is hidden over the hero so the mosquito is the only pointer; a new `desktop-pointer` screen variant replaces every `lg:` rule that assumed the character was on screen, which is what gives an iPad in landscape the original chevron hero back instead of an empty hero with white-on-white copy; the language switcher now shows a translate glyph plus `AR`/`EN` rather than a globe plus `عربي`; and the character now hunts for the mosquito after one still second, sweeping the full range end to end and back on a cosine (track / settle / idle / return state machine, gated on reduced-motion and on the hero being on screen), rests only on whole frames, and paints the mosquito in a `z-20` layer so it no longer vanishes behind the CTA. All on `hero-frog-tracker`: the scrim and cursor landed in `28f7067`, the variant and the switcher in `77a47fa`, the idle hunt in `f45cd06` and `df164d4`; only the navbar going fully transparent over the hero is still uncommitted. Three traps recorded above: a link's UA `cursor: pointer` beats an inherited `cursor: none`, so the descendant rule is required; `lg:` is not a test for "has a pointer"; and the light theme has to borrow the dark theme's nav colours while the bar sits over the character art, seeded from the URL so it does not flash. Same day — Landing hero: cursor-tracked character (branch `hero-frog-tracker`, WIP, not merged). Desktop-only frame-sequence hero replacing the static chevron; mobile untouched by construction. See "Landing Hero" above for the extraction rules and the four traps that cost real time: sorting frames by a computed head-angle proxy scrambles the tail, mirroring to fake the missing half leaves the frame uncovered, RTL puts the copy on top of the character without `lg:col-start-2`, and frame direction must be verified by screenshot rather than by metric. Previous: 2026-07-05 — GSC indexing fixes: unified Blade/SSR titles (killed literal `${APP_NAME}` baked into hardrock-ssr's bundle from an uninterpolated Railway var), 301'd bare `/services` duplicate, bumped sitemap lastmod, documented Cloudflare 403 on spoofed-Googlebot curls. Previous: 2026-05-04, commit `47197b9` (/dashboard → /admin rename).
