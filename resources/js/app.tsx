import '../css/app.css';
import './bootstrap';
import './i18n'; // Initialize i18n

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Import Landing page eagerly (always needed on home page)
import Landing from '@/pages/Landing';

// Lazy load auth pages (code splitting - only loads when needed)
const Login = lazy(() => import('@/pages/Auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'));

// Lazy load dashboard pages
const DashboardIndex = lazy(() => import('@/pages/Dashboard/Index'));
const DashboardContacts = lazy(() => import('@/pages/Dashboard/Contacts'));

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Map of page names to components
const pages: Record<string, any> = {
    'Landing': Landing,
    'Auth/Login': Login,
    'Auth/ForgotPassword': ForgotPassword,
    'Auth/ResetPassword': ResetPassword,
    'Dashboard/Index': DashboardIndex,
    'Dashboard/Contacts': DashboardContacts,
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = pages[name];
        if (!page) {
            console.error('Available pages:', Object.keys(pages));
            console.error('Requested page:', name);
            throw new Error(`Page not found: ${name}. Available: ${Object.keys(pages).join(', ')}`);
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-black"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div></div>}>
                    <App {...props} />
                </Suspense>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
