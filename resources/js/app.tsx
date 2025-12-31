import '../css/app.css';
import './bootstrap';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PageLoader } from '@/components/ui/page-loader';

// Import all pages eagerly (vendor chunks handle code splitting)
import Landing from '@/pages/Landing';
import Login from '@/pages/Auth/Login';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';
import DashboardIndex from '@/pages/Dashboard/Index';
import DashboardContacts from '@/pages/Dashboard/Contacts';
import DashboardUsers from '@/pages/Dashboard/Users';

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
