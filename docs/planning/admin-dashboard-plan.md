# Admin Dashboard Implementation Plan

**Project**: HardRock Agency Admin Panel
**Purpose**: View and manage contact form submissions
**Tech Stack**: Laravel + React/TypeScript + Inertia.js + Tailwind CSS
**Access**: Single admin user only (you)

---

## 📋 Requirements Clarification

### Frontend Framework
- ✅ **React + TypeScript** for ALL frontend pages (including login)
- ✅ **Inertia.js** for routing and data flow
- ✅ **Tailwind CSS** for styling
- ❌ **NO Laravel Blade views** - pure React/TS

### Authentication
- Use Laravel Breeze **backend only** (API routes, controllers)
- Create custom React/TS login page (no Blade)
- Keep it simple: email + password

---

## 🎯 Implementation Phases

### Phase 1: Authentication & Authorization Setup (30-45 min)

#### 1.1 Database Setup
**File**: `database/migrations/xxxx_add_is_admin_to_users_table.php`
```php
Schema::table('users', function (Blueprint $table) {
    $table->boolean('is_admin')->default(false);
});
```

**File**: `database/seeders/AdminSeeder.php`
- Create admin user with your email
- Set password
- Set `is_admin = true`

**Commands**:
```bash
php artisan make:migration add_is_admin_to_users_table
php artisan make:seeder AdminSeeder
php artisan migrate
php artisan db:seed --class=AdminSeeder
```

#### 1.2 Middleware
**File**: `app/Http/Middleware/IsAdmin.php`
```php
public function handle(Request $request, Closure $next)
{
    if (!auth()->check() || !auth()->user()->is_admin) {
        return redirect()->route('home');
    }
    return $next($request);
}
```

**Register in**: `bootstrap/app.php`
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\IsAdmin::class,
    ]);
})
```

---

### Phase 2: Backend - Controllers & Routes (45-60 min)

#### 2.1 Directory Structure
```
app/Http/Controllers/Admin/
├── DashboardController.php
└── ContactController.php
```

#### 2.2 Dashboard Controller
**File**: `app/Http/Controllers/Admin/DashboardController.php`

**Features**:
- Total contacts count
- Contacts this week
- Contacts this month
- Recent 5 submissions

**Return**:
```php
return Inertia::render('Admin/Dashboard', [
    'totalContacts' => $totalContacts,
    'contactsThisWeek' => $contactsThisWeek,
    'contactsThisMonth' => $contactsThisMonth,
    'recentContacts' => $recentContacts,
]);
```

#### 2.3 Contact Controller
**File**: `app/Http/Controllers/Admin/ContactController.php`

**Methods**:
- `index()` - List all contacts (paginated, searchable)
- `show($id)` - View single contact
- `destroy($id)` - Delete contact

**Features**:
- Pagination (15 per page)
- Search by: name, email, company
- Sort by: created_at (desc)
- Soft deletes (optional)

#### 2.4 Routes
**File**: `routes/web.php`

```php
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;

// Admin routes (protected)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('contacts')->name('contacts.')->group(function () {
        Route::get('/', [AdminContactController::class, 'index'])->name('index');
        Route::get('/{contact}', [AdminContactController::class, 'show'])->name('show');
        Route::delete('/{contact}', [AdminContactController::class, 'destroy'])->name('destroy');
    });
});
```

---

### Phase 3: Frontend - React/TypeScript Pages (2-3 hours)

#### 3.1 Page Structure
```
resources/js/pages/
├── Admin/
│   ├── Dashboard.tsx              # /admin
│   └── Contacts/
│       ├── Index.tsx              # /admin/contacts
│       └── Show.tsx               # /admin/contacts/:id
└── Auth/
    └── Login.tsx                  # /login
```

#### 3.2 Component Structure
```
resources/js/components/
├── Admin/
│   ├── AdminLayout.tsx           # Shared layout for admin pages
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── Header.tsx                # Top header with logout
│   ├── StatsCard.tsx             # Dashboard statistics card
│   └── ContactsTable.tsx         # Contacts data table
└── (existing landing components...)
```

#### 3.3 Layouts
**File**: `resources/js/layouts/AdminLayout.tsx`

**Features**:
- Sidebar with navigation (Dashboard, Contacts)
- Header with user info + logout button
- Dark mode support (using existing ThemeContext)
- Responsive design (collapsible sidebar on mobile)

**Structure**:
```tsx
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
```

#### 3.4 Dashboard Page
**File**: `resources/js/pages/Admin/Dashboard.tsx`

**Props Interface**:
```tsx
interface DashboardProps {
    totalContacts: number;
    contactsThisWeek: number;
    contactsThisMonth: number;
    recentContacts: Contact[];
}
```

**Features**:
- 3 stat cards (total, this week, this month)
- Recent 5 submissions table
- Quick actions (View all contacts button)

#### 3.5 Contacts Index Page
**File**: `resources/js/pages/Admin/Contacts/Index.tsx`

**Props Interface**:
```tsx
interface ContactsIndexProps {
    contacts: {
        data: Contact[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters?: {
        search?: string;
    };
}
```

**Features**:
- Search input (name, email, company)
- Contacts table with columns:
  - Name
  - Company
  - Email
  - Phone
  - Services (count)
  - Date
  - Actions (View, Delete)
- Pagination controls
- Delete confirmation modal

#### 3.6 Contact Show Page
**File**: `resources/js/pages/Admin/Contacts/Show.tsx`

**Props Interface**:
```tsx
interface ContactShowProps {
    contact: Contact;
}
```

**Features**:
- Full contact details card
- Services list (badges)
- More details (textarea content)
- Action buttons (Back, Delete)
- Formatted date/time

#### 3.7 Login Page
**File**: `resources/js/pages/Auth/Login.tsx`

**Features**:
- Centered card design
- HardRock logo/branding
- Email input
- Password input
- Remember me checkbox
- Login button with loading state
- Error messages (Inertia errors)
- Redirect to `/admin` after login

**Styling**: Match your landing page aesthetic (gradient buttons, etc.)

---

### Phase 4: TypeScript Interfaces (15 min)

**File**: `resources/js/types/admin.ts`

```typescript
export interface Contact {
    id: number;
    personal_name: string;
    company_name: string | null;
    phone_number: string;
    email: string;
    services: string[];
    more_details: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DashboardStats {
    totalContacts: number;
    contactsThisWeek: number;
    contactsThisMonth: number;
    recentContacts: Contact[];
}
```

---

### Phase 5: Authentication Routes (30 min)

#### 5.1 Update Auth Routes
**File**: `routes/web.php`

```php
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Login routes
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

// Logout route
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
```

#### 5.2 Update Login Controller
**File**: `app/Http/Controllers/Auth/AuthenticatedSessionController.php`

Update `create()` method:
```php
public function create()
{
    return Inertia::render('Auth/Login');
}
```

Update `store()` method - redirect admin to dashboard:
```php
public function store(LoginRequest $request)
{
    $request->authenticate();
    $request->session()->regenerate();

    // Redirect admin to dashboard, others to home
    if (auth()->user()->is_admin) {
        return redirect()->intended(route('admin.dashboard'));
    }

    return redirect()->intended(route('home'));
}
```

---

### Phase 6: UI Components (1-1.5 hours)

#### 6.1 Stats Card Component
**File**: `resources/js/components/Admin/StatsCard.tsx`

```tsx
interface StatsCardProps {
    title: string;
    value: number;
    icon?: ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                {icon && <div className="text-brand-purple">{icon}</div>}
            </div>
        </div>
    );
}
```

#### 6.2 Contacts Table Component
**File**: `resources/js/components/Admin/ContactsTable.tsx`

**Features**:
- Responsive table
- Action buttons (View, Delete)
- Services badges
- Date formatting
- Empty state

---

### Phase 7: Security & Polish (30-45 min)

#### 7.1 Security Checklist
- ✅ CSRF protection (built-in Laravel)
- ✅ XSS protection (React escapes by default)
- ✅ Admin middleware on all routes
- ✅ Rate limiting on login (Laravel default: 5 attempts/min)
- ✅ Delete confirmation before destroying records
- ✅ Session timeout (Laravel default: 120 min)

#### 7.2 UX Enhancements
- Loading states on all actions
- Success/error toast notifications
- Delete confirmation modal
- Smooth page transitions (Inertia)
- Responsive design (mobile-friendly)
- Dark mode support

#### 7.3 Add Toast Notifications
Use existing notification pattern from ContactUs.tsx or create reusable component.

---

## 📁 Complete File Structure

```
Backend (PHP):
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   └── ContactController.php
│   │   │   └── Auth/
│   │   │       └── AuthenticatedSessionController.php (update)
│   │   └── Middleware/
│   │       └── IsAdmin.php
│   └── Models/
│       └── Contact.php (existing)
├── database/
│   ├── migrations/
│   │   └── xxxx_add_is_admin_to_users_table.php
│   └── seeders/
│       └── AdminSeeder.php
└── routes/
    └── web.php (update)

Frontend (React/TS):
├── resources/js/
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Contacts/
│   │   │       ├── Index.tsx
│   │   │       └── Show.tsx
│   │   ├── Auth/
│   │   │   └── Login.tsx
│   │   └── Landing.tsx (existing)
│   ├── layouts/
│   │   └── AdminLayout.tsx
│   ├── components/
│   │   └── Admin/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       ├── StatsCard.tsx
│   │       └── ContactsTable.tsx
│   └── types/
│       └── admin.ts
```

---

## ⏱️ Time Estimates

### Full Implementation: 5-6 hours
1. Auth setup (DB, middleware, seeder): **45 min**
2. Backend controllers: **1 hour**
3. Frontend pages (Dashboard, Contacts Index/Show): **2.5 hours**
4. Login page: **30 min**
5. UI components (Sidebar, Table, Cards): **1 hour**
6. Polish & testing: **45 min**

### Minimal MVP: 2.5-3 hours
1. Auth setup: **30 min**
2. Backend controllers (basic): **45 min**
3. Login page: **30 min**
4. Dashboard (stats only): **30 min**
5. Contacts list (basic table, no search): **45 min**

---

## ✅ Pre-Implementation Checklist

Before starting, confirm:
- [ ] **Admin email address** for seeding
- [ ] **Version**: Full or MVP?
- [ ] **Delete functionality**: With confirmation modal?
- [ ] **Search/filter**: Include in first version?
- [ ] **Keep Laravel Breeze auth controllers**: Yes (we need them for login)
- [ ] **Dark mode**: Support admin panel dark mode?

---

## 🚀 Implementation Order

### Step 1: Database & Auth (Backend)
1. Migration: `is_admin` column
2. Seeder: Admin user
3. Middleware: `IsAdmin`
4. Run migrations and seed

### Step 2: Backend Controllers
1. `DashboardController.php`
2. `Admin/ContactController.php`
3. Update routes

### Step 3: TypeScript Types
1. Create `types/admin.ts`
2. Define interfaces

### Step 4: Admin Layout
1. Create `AdminLayout.tsx`
2. Create `Sidebar.tsx`
3. Create `Header.tsx`

### Step 5: Login Page
1. Create `Auth/Login.tsx`
2. Update `AuthenticatedSessionController`
3. Test login flow

### Step 6: Dashboard
1. Create `Admin/Dashboard.tsx`
2. Create `StatsCard.tsx`
3. Test with real data

### Step 7: Contacts Management
1. Create `Contacts/Index.tsx`
2. Create `ContactsTable.tsx`
3. Create `Contacts/Show.tsx`
4. Add delete functionality
5. Test CRUD operations

### Step 8: Polish
1. Add loading states
2. Add notifications
3. Test responsive design
4. Test dark mode
5. Security review

---

## 📝 Notes

### Why NOT use Spatie Permission?
- Only 1 admin user (you)
- Simple `is_admin` boolean is sufficient
- Less overhead, faster
- Can upgrade later if needed

### Why React/TS for Login (not Blade)?
- Consistent tech stack
- Better UX with Inertia
- Easier to customize
- Matches your existing setup

### Authentication Flow
1. User visits `/login`
2. Inertia renders `Auth/Login.tsx` (React)
3. Form submits to Laravel controller
4. Controller validates & logs in
5. Redirects to `/admin` (if admin) or `/` (if regular user)
6. Protected routes check `auth` + `admin` middleware

---

## 🔧 Environment Variables

Add to `.env`:
```env
# Admin seeder
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

---

## 🎨 Design Notes

### Color Scheme
- Use existing brand colors (purple/red gradient)
- Match landing page aesthetic
- Dark mode support

### Typography
- Same fonts as landing page
- Consistent sizing hierarchy

### Components
- Reuse ThemeContext for dark mode
- Consistent button styling
- Loading states with spinners
- Toast notifications for actions

---

## 🧪 Testing Checklist

After implementation:
- [ ] Can login with admin account
- [ ] Cannot login with non-admin account
- [ ] Dashboard shows correct stats
- [ ] Can view contacts list
- [ ] Pagination works
- [ ] Search works (if implemented)
- [ ] Can view single contact
- [ ] Can delete contact
- [ ] Delete confirmation shows
- [ ] Logout works
- [ ] Redirects work correctly
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Notifications work

---

## 📚 Resources

- [Inertia.js Docs](https://inertiajs.com/)
- [Laravel Authentication](https://laravel.com/docs/authentication)
- [React TypeScript](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated**: December 18, 2024
**Status**: Planning Complete - Ready for Implementation
