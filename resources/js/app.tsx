import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Import pages directly
const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`];
        if (!page) {
            console.error('Available pages:', Object.keys(pages));
            throw new Error(`Page not found: ./pages/${name}.tsx. Available: ${Object.keys(pages).join(', ')}`);
        }
        // @ts-ignore
        return page.default;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
