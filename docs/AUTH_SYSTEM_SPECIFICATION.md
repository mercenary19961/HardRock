# HardRock Authentication System Specification

This document provides a complete specification for recreating the Login, Forgot Password, and Reset Password pages with identical design and backend functionality.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Brand Colors & Design System](#brand-colors--design-system)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Page Specifications](#page-specifications)
   - [Login Page](#login-page)
   - [Forgot Password Page](#forgot-password-page)
   - [Reset Password Page](#reset-password-page)
6. [UI Components](#ui-components)
7. [Database Schema](#database-schema)
8. [API Routes](#api-routes)
9. [Security Features](#security-features)

---

## Technology Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.2+)
- **Authentication**: Laravel Breeze with Inertia.js
- **Session Management**: Laravel session-based authentication
- **Password Hashing**: bcrypt (Laravel's default)
- **Email**: Laravel Mail for password reset emails

### Frontend
- **Framework**: React 18+ with TypeScript
- **Routing**: Inertia.js (server-side routing with client-side components)
- **Styling**: Tailwind CSS 3+ with custom configuration
- **UI Components**: Radix UI primitives (Label, Checkbox)
- **Class Utilities**: `class-variance-authority` (cva) + `clsx` + `tailwind-merge`

### Build Tools
- **Bundler**: Vite
- **Package Manager**: npm/pnpm

---

## Brand Colors & Design System

### Brand Colors
```css
/* Primary brand colors */
--brand-purple: #704399;  /* Main accent color for buttons, links */
--brand-red: #C93727;     /* Secondary brand color */
```

### Character Colors (Login Page Animation)
```css
/* Animated character colors */
--purple-character: #6C3FF5;
--black-character: #2D2D2D;
--orange-character: #FF9B6B;
--yellow-character: #E8D754;
```

### CSS Variables (Light Mode)
```css
:root {
  --background: 0 0% 100%;           /* White */
  --foreground: 222.2 84% 4.9%;      /* Near black */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;      /* Dark blue-gray */
  --primary-foreground: 210 40% 98%; /* Light gray */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;      /* Red */
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

### CSS Variables (Dark Mode)
```css
.dark {
  --background: 222.2 84% 4.9%;      /* Near black */
  --foreground: 210 40% 98%;         /* Light gray */
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

### Typography
```javascript
fontFamily: {
  sans: ['Figtree', ...defaultTheme.fontFamily.sans],
  tajawal: ['Tajawal', 'sans-serif'],
  cairo: ['Cairo', 'sans-serif'],
  poppins: ['Poppins', 'sans-serif'],
  'sf-pro': ['SF Pro', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Segoe UI', 'sans-serif'],
}
```

---

## Backend Architecture

### User Model

**File**: `app/Models/User.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }
}
```

### Authentication Controllers

#### AuthenticatedSessionController
**File**: `app/Http/Controllers/Auth/AuthenticatedSessionController.php`

Handles:
- `create()` - Display login form via Inertia
- `store(LoginRequest $request)` - Authenticate user, regenerate session, redirect to dashboard
- `destroy(Request $request)` - Logout user, invalidate session, regenerate CSRF token

```php
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();
    return redirect()->intended(route('dashboard.index', absolute: false));
}

public function destroy(Request $request): RedirectResponse
{
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login');
}
```

#### PasswordResetLinkController
**File**: `app/Http/Controllers/Auth/PasswordResetLinkController.php`

Handles:
- `create()` - Display forgot password form
- `store(Request $request)` - Validate email, send password reset link

```php
public function store(Request $request): RedirectResponse
{
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink($request->only('email'));

    if ($status == Password::RESET_LINK_SENT) {
        return back()->with('status', __($status));
    }

    throw ValidationException::withMessages([
        'email' => [trans($status)],
    ]);
}
```

#### NewPasswordController
**File**: `app/Http/Controllers/Auth/NewPasswordController.php`

Handles:
- `create(Request $request)` - Display reset password form with token
- `store(Request $request)` - Validate token, update password, redirect to login

```php
public function store(Request $request): RedirectResponse
{
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user) use ($request) {
            $user->forceFill([
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(60),
            ])->save();

            event(new PasswordReset($user));
        }
    );

    if ($status == Password::PASSWORD_RESET) {
        return redirect()->route('login')->with('status', __($status));
    }

    throw ValidationException::withMessages([
        'email' => [trans($status)],
    ]);
}
```

### Login Request (Validation + Rate Limiting)

**File**: `app/Http/Requests/Auth/LoginRequest.php`

```php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
```

---

## Frontend Architecture

### Utility Function

**File**: `resources/js/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Inertia.js Form Hook Usage

All auth pages use Inertia's `useForm` hook:

```typescript
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
});
```

---

## Page Specifications

### Login Page

**File**: `resources/js/pages/Auth/Login.tsx`

#### Layout
- **Desktop**: Two-column grid layout (50/50)
  - Left: Purple gradient background with animated characters
  - Right: White/dark background with login form
- **Mobile**: Single column with form only (characters hidden)

#### Props Interface
```typescript
interface User {
    id: number;
    name: string;
    email: string;
}
```

#### Form Fields
| Field | Type | Placeholder | Required | AutoComplete |
|-------|------|-------------|----------|--------------|
| email | email | admin@hardrock-co.com | Yes | email |
| password | password | •••••••• | Yes | current-password |
| remember | checkbox | - | No | - |

#### Form State
```typescript
const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
});
```

#### Submit Handler
```typescript
const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('login'));
};
```

#### Authenticated User View
When user is already authenticated, show:
- Welcome message with user's name
- "Go to Dashboard" button (links to `/dashboard`)
- "Sign out and use a different account" link (POST to `/logout`)

#### Design Specifications

**Left Panel (Desktop Only)**
- Background: `bg-gradient-to-br from-brand-purple/90 via-brand-purple to-brand-purple/80`
- Logo: White logo (`/images/logo-white.png`), height 32px (h-8)
- Title: "Login Page" text, 4xl size, white, positioned next to logo
- Footer links: Privacy Policy, Terms of Service, Contact (link to `/#contact`)
- Decorative: Grid pattern overlay, blur circles

**Right Panel (Form)**
- Background: `bg-background` (uses CSS variable)
- Max width: 420px
- Logo (mobile only): Shows light/dark logo based on theme, h-10
- Title: "Welcome back!" (h1, 3xl, bold)
- Subtitle: "Please enter your details" (muted-foreground, sm)

**Input Styling**
- Height: 48px (h-12)
- Background: `bg-background`
- Border: `border-border/60`
- Focus border: `focus:border-brand-purple`
- Rounded: Default (md)

**Button Styling**
- Height: 48px (h-12)
- Background: `bg-brand-purple`
- Hover: `hover:bg-brand-purple/90`
- Text: White, base size, font-medium
- Full width

**Password Toggle Button**
- Position: Absolute, right-3, vertically centered
- Icons: Eye/EyeOff inline SVGs (size-5)

**Remember Me**
- Checkbox with label "Remember for 30 days"
- Placed inline with "Forgot password?" link

**Forgot Password Link**
- Text: "Forgot password?"
- Color: `text-brand-purple`
- Hover: underline
- Links to: `/forgot-password`

**Footer**
- Text: "Team access only" (muted, sm, centered)
- Mobile: Shows Privacy, Terms, Contact links

---

### Animated Characters (Login Page)

**File**: `resources/js/components/ui/animated-characters-login-page.tsx`

#### Overview
The login page features four animated cartoon characters that:
1. Follow mouse movement with their eyes
2. Lean/skew their bodies toward the mouse
3. Blink randomly (purple and black characters have full eyelids)
4. React to user typing (purple grows taller, looks at black character)
5. React to password visibility (all look away when password is visible)
6. Purple character occasionally "peeks" at visible password

#### Character Specifications

| Character | Shape | Color | Dimensions | Position | Z-Index |
|-----------|-------|-------|------------|----------|---------|
| Purple | Tall rectangle | #6C3FF5 | 180×400px | left: 70px | 1 |
| Black | Tall rectangle | #2D2D2D | 120×310px | left: 240px | 2 |
| Orange | Semi-circle | #FF9B6B | 240×200px | left: 0px | 3 |
| Yellow | Rounded rectangle | #E8D754 | 140×230px | left: 310px | 4 |

#### Eye Components

**EyeBall Component** (Purple & Black characters)
```typescript
interface EyeBallProps {
  size?: number;           // Eyeball diameter
  pupilSize?: number;      // Pupil diameter
  maxDistance?: number;    // Max pupil movement
  eyeColor?: string;       // Default: "white"
  pupilColor?: string;     // Default: "black" (#2D2D2D)
  isBlinking?: boolean;    // Collapses to 2px line when true
  forceLookX?: number;     // Override X position
  forceLookY?: number;     // Override Y position
}
```

**Pupil Component** (Orange & Yellow characters)
```typescript
interface PupilProps {
  size?: number;           // Pupil diameter
  maxDistance?: number;    // Max movement distance
  pupilColor?: string;     // Default: "black"
  forceLookX?: number;     // Override X position
  forceLookY?: number;     // Override Y position
}
```

#### Animation States

1. **Default State**: Eyes follow mouse, bodies skew toward mouse
2. **Typing State**: Purple grows to 440px height, purple & black look at each other
3. **Password Hidden + Has Value**: Same as typing state (characters "focused")
4. **Password Visible + Has Value**: All characters look away (top-left), no body skew
5. **Peeking**: Purple occasionally peeks at the password field when visible

#### Blinking Effect
- Random interval: 3-5 seconds between blinks
- Blink duration: 150ms
- Implementation: EyeBall height collapses to 2px

#### Mouse Tracking Calculations
```typescript
const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return { faceX, faceY, bodySkew };
};
```

---

### Forgot Password Page

**File**: `resources/js/pages/Auth/ForgotPassword.tsx`

#### Layout
- Centered single-column layout
- Min-height: 100vh
- Max width: 420px
- Padding: 32px (p-8)
- Background: `bg-background`

#### Props Interface
```typescript
interface ForgotPasswordProps {
    status?: string;  // Success message from backend
}
```

#### Form Fields
| Field | Type | Placeholder | Required | AutoComplete |
|-------|------|-------------|----------|--------------|
| email | email | admin@hardrock-co.com | Yes | email |

#### Form State
```typescript
const { data, setData, post, processing, errors } = useForm({
    email: '',
});
```

#### Submit Handler
```typescript
const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('password.email'));
};
```

#### Design Specifications

**Logo Section**
- Dark mode: `/images/logo-white.png`
- Light mode: `/images/logo-black.webp`
- Height: 40px (h-10)
- Title: "Forgot Password" (3xl, font-semibold)
- Margin bottom: 48px (mb-12)

**Description**
- Text: "Enter your email address and we'll send you a link to reset your password."
- Style: `text-muted-foreground text-sm`
- Centered
- Margin bottom: 40px (mb-10)

**Success Message (when status exists)**
- Container: `mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`
- Text: `text-sm text-green-700 dark:text-green-400`

**Error Message**
- Text: `text-sm text-red-600 dark:text-red-400`

**Submit Button**
- Text: "Send Reset Link" (default) / "Sending..." (processing)
- Full width, h-12
- Background: `bg-brand-purple hover:bg-brand-purple/90`

**Back Link**
- Text: "← Back to Login"
- Color: `text-brand-purple`
- Hover: underline
- Position: Center, mt-8

---

### Reset Password Page

**File**: `resources/js/pages/Auth/ResetPassword.tsx`

#### Layout
- Identical to Forgot Password page layout

#### Props Interface
```typescript
interface ResetPasswordProps {
    token: string;   // Reset token from URL
    email: string;   // Pre-filled email from URL
}
```

#### Form Fields
| Field | Type | Placeholder | Required | AutoComplete | Disabled |
|-------|------|-------------|----------|--------------|----------|
| email | email | - | Yes | email | Yes |
| password | password | •••••••• | Yes | new-password | No |
| password_confirmation | password | •••••••• | Yes | new-password | No |

#### Form State
```typescript
const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
});
```

#### Submit Handler
```typescript
const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('password.store'), {
        onFinish: () => reset('password', 'password_confirmation'),
    });
};
```

#### Design Specifications

**Email Field**
- Pre-filled and disabled
- Background: `bg-muted` (indicates disabled state)

**Password Fields**
- Both have show/hide toggle buttons
- Independent visibility states (`showPassword`, `showPasswordConfirmation`)
- AutoFocus on new password field

**Password Toggle Icon (Inline SVG)**
```typescript
const Eye = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" className={className}>
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" className={className}>
        <path d="m2 2 20 20" />
        <path d="M6.71 6.71a10.75 10.75 0 0 0-4.648 5.639 1 1 0 0 0 0 .696 10.747 10.747 0 0 0 18.858 4.135" />
        <path d="M18 18a10.75 10.75 0 0 0 3.938-5.639 1 1 0 0 0 0-.696A10.75 10.75 0 0 0 12.001 2c-1.5 0-2.924.306-4.222.852" />
        <path d="M15.536 15.536a3 3 0 0 1-4.072-4.072" />
    </svg>
);
```

**Submit Button**
- Text: "Reset Password" (default) / "Resetting..." (processing)

---

## UI Components

### Button Component

**File**: `resources/js/components/ui/button.tsx`

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Input Component

**File**: `resources/js/components/ui/input.tsx`

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### Label Component

**File**: `resources/js/components/ui/label.tsx`

```typescript
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

### Checkbox Component

**File**: `resources/js/components/ui/checkbox.tsx`

```typescript
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

// Inline Check icon
const Check = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Password Reset Tokens Table

```sql
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);
```

### Sessions Table

```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    INDEX sessions_user_id_index (user_id),
    INDEX sessions_last_activity_index (last_activity)
);
```

---

## API Routes

**File**: `routes/auth.php`

### Public Routes (No Authentication Required)

| Method | URI | Name | Controller Method |
|--------|-----|------|-------------------|
| GET | /login | login | AuthenticatedSessionController@create |

### Guest Routes (Only Non-Authenticated)

| Method | URI | Name | Controller Method |
|--------|-----|------|-------------------|
| POST | /login | - | AuthenticatedSessionController@store |
| GET | /forgot-password | password.request | PasswordResetLinkController@create |
| POST | /forgot-password | password.email | PasswordResetLinkController@store |
| GET | /reset-password/{token} | password.reset | NewPasswordController@create |
| POST | /reset-password | password.store | NewPasswordController@store |

### Protected Routes (Authentication Required)

| Method | URI | Name | Controller Method |
|--------|-----|------|-------------------|
| GET | /verify-email | verification.notice | EmailVerificationPromptController |
| GET | /verify-email/{id}/{hash} | verification.verify | VerifyEmailController |
| POST | /email/verification-notification | verification.send | EmailVerificationNotificationController@store |
| GET | /confirm-password | password.confirm | ConfirmablePasswordController@show |
| POST | /confirm-password | - | ConfirmablePasswordController@store |
| PUT | /password | password.update | PasswordController@update |
| POST | /logout | logout | AuthenticatedSessionController@destroy |

---

## Security Features

### Rate Limiting
- **Login attempts**: Maximum 5 attempts per minute per email+IP combination
- **Email verification resend**: Maximum 6 requests per minute
- **Throttle key**: `email|ip_address` (transliterated, lowercase)

### Session Security
- Session regeneration on login
- Session invalidation on logout
- CSRF token regeneration on logout

### Password Security
- Bcrypt hashing (Laravel default)
- Password confirmation for sensitive operations
- Remember token regeneration on password reset

### Token Security
- Password reset tokens expire after 60 minutes
- Signed URLs for email verification
- Rate limiting on password reset requests (60 seconds between requests)

---

## Assets

### Logo Files
- `/images/logo-white.png` - White logo for dark backgrounds
- `/images/logo-black.webp` - Black logo for light backgrounds

---

## Dependencies

### NPM Packages
```json
{
  "@inertiajs/react": "^1.0.0",
  "@radix-ui/react-checkbox": "^1.0.0",
  "@radix-ui/react-label": "^2.0.0",
  "@radix-ui/react-slot": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

### Composer Packages
```json
{
  "laravel/framework": "^12.0",
  "inertiajs/inertia-laravel": "^1.0"
}
```

---

## Implementation Notes

1. **Registration Disabled**: User registration routes are commented out; only admin users can be created via console command: `php artisan admin:create {email} {password} {name=Admin}`

2. **Dark Mode**: The system supports dark mode via the `.dark` class on the document root. CSS variables automatically switch.

3. **Inertia.js Routing**: All routes use Inertia for server-side routing with React components. Use `route('name')` helper for generating URLs.

4. **Form Validation**: Backend validation errors are automatically passed to components via the `errors` object from `useForm`.

5. **Responsive Design**: Login page uses `lg:grid-cols-2` for desktop layout, hiding the animated characters panel on mobile.

6. **Autofill Styling**: Custom CSS handles browser autofill to maintain theme consistency.

---

## File Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/Auth/
│   │   │   ├── AuthenticatedSessionController.php
│   │   │   ├── ConfirmablePasswordController.php
│   │   │   ├── EmailVerificationNotificationController.php
│   │   │   ├── EmailVerificationPromptController.php
│   │   │   ├── NewPasswordController.php
│   │   │   ├── PasswordController.php
│   │   │   ├── PasswordResetLinkController.php
│   │   │   ├── RegisteredUserController.php
│   │   │   └── VerifyEmailController.php
│   │   ├── Middleware/
│   │   │   ├── AdminMiddleware.php
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/Auth/
│   │       └── LoginRequest.php
│   ├── Models/
│   │   └── User.php
│   └── Console/Commands/
│       └── CreateAdminUser.php
├── resources/
│   ├── css/
│   │   └── app.css
│   └── js/
│       ├── components/ui/
│       │   ├── button.tsx
│       │   ├── checkbox.tsx
│       │   ├── input.tsx
│       │   ├── label.tsx
│       │   └── animated-characters-login-page.tsx
│       ├── lib/
│       │   └── utils.ts
│       └── pages/Auth/
│           ├── Login.tsx
│           ├── ForgotPassword.tsx
│           └── ResetPassword.tsx
├── routes/
│   └── auth.php
├── config/
│   └── auth.php
├── database/migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 2025_12_18_093121_add_is_admin_to_users_table.php
│   └── 2025_12_22_084910_create_password_reset_tokens_table.php
└── tailwind.config.js
```
