import '../css/app.css';
import './bootstrap';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PageLoader } from '@/components/ui/page-loader';
import { lazy } from 'react';

// Only eagerly import the landing page (most common entry point)
import Landing from '@/pages/Landing';

// Lazy-load all other pages — they won't add to initial bundle
const Login = lazy(() => import('@/pages/Auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'));
const DashboardIndex = lazy(() => import('@/pages/Dashboard/Index'));
const DashboardContacts = lazy(() => import('@/pages/Dashboard/Contacts'));
const DashboardUsers = lazy(() => import('@/pages/Dashboard/Users'));
const Services = lazy(() => import('@/pages/Services'));

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Map of page names to components
const pages: Record<string, any> = {
    'Landing': Landing,
    'Auth/Login': Login,
    'Auth/ForgotPassword': ForgotPassword,
    'Auth/ResetPassword': ResetPassword,
    'Dashboard/Index': DashboardIndex,
    'Dashboard/Contacts': DashboardContacts,
    'Dashboard/Users': DashboardUsers,
    'Services': Services,
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
                <PageLoader />
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: false,
});
