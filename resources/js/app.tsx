import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PageLoader } from '@/components/ui/page-loader';
import { initI18n, type AppLanguage } from './i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob<{ default: any }>('./pages/**/*.tsx');

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
    resolve: async (name) => {
        const path = `./pages/${name}.tsx`;
        const importer = pages[path];
        if (!importer) {
            throw new Error(`Page not found: ${name}. Available: ${Object.keys(pages).join(', ')}`);
        }
        const mod = await importer();
        return mod.default;
    },
    setup({ el, App, props }) {
        const appearance = readAppearance(props);
        initI18n(appearance.language);

        const tree = (
            <ThemeProvider initialTheme={appearance.theme}>
                <PageLoader />
                <App {...props} />
            </ThemeProvider>
        );

        if (el.hasChildNodes()) {
            hydrateRoot(el, tree);
        } else {
            createRoot(el).render(tree);
        }
    },
    progress: false,
});
