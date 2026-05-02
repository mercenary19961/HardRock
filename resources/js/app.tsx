import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PageLoader, SuspenseLoader } from '@/components/ui/page-loader';
import { lazy, Suspense } from 'react';
import { initI18n, type AppLanguage } from './i18n';

import Landing from '@/pages/Landing';

const Login = lazy(() => import('@/pages/Auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'));
const DashboardIndex = lazy(() => import('@/pages/Dashboard/Index'));
const DashboardContacts = lazy(() => import('@/pages/Dashboard/Contacts'));
const DashboardUsers = lazy(() => import('@/pages/Dashboard/Users'));
const Services = lazy(() => import('@/pages/Services'));
const Consultation = lazy(() => import('@/pages/Consultation'));

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages: Record<string, any> = {
    'Landing': Landing,
    'Auth/Login': Login,
    'Auth/ForgotPassword': ForgotPassword,
    'Auth/ResetPassword': ResetPassword,
    'Dashboard/Index': DashboardIndex,
    'Dashboard/Contacts': DashboardContacts,
    'Dashboard/Users': DashboardUsers,
    'Services': Services,
    'Consultation': Consultation,
};

interface Appearance {
    theme: 'light' | 'dark';
    language: AppLanguage;
}

function readAppearance(setupProps: any): Appearance {
    const shared = setupProps?.initialPage?.props?.appearance;
    return {
        theme: shared?.theme === 'light' ? 'light' : 'dark',
        language: shared?.language === 'ar' ? 'ar' : 'en',
    };
}

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
        const appearance = readAppearance(props);
        initI18n(appearance.language);

        const root = createRoot(el);

        root.render(
            <ThemeProvider initialTheme={appearance.theme}>
                <PageLoader />
                <Suspense fallback={<SuspenseLoader />}>
                    <App {...props} />
                </Suspense>
            </ThemeProvider>
        );
    },
    progress: false,
});
