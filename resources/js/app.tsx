import '../css/app.css';
import './bootstrap';
import './i18n'; // Initialize i18n

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Explicitly import pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Auth/Login';
import AdminContacts from '@/pages/Admin/Contacts';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Map of page names to components
const pages: Record<string, any> = {
    'Landing': Landing,
    'Auth/Login': Login,
    'Admin/Contacts': AdminContacts,
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
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
