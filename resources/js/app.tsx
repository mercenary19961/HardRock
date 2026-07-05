import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PageLoader } from '@/components/ui/page-loader';
import { initI18n, type AppLanguage } from './i18n';

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
    // Public page titles already carry full branding and must stay identical to
    // the Blade $serviceSeo titles (see app.blade.php) — SSR emits a second
    // <title> alongside Blade's, so any divergence shows crawlers two different
    // titles. Hardcoded suffix (not VITE_APP_NAME): each Railway service bakes
    // its own bundle and their env vars can silently diverge.
    title: (title) => {
        if (!title) return 'HardRock';
        return title.includes('HardRock') ? title : `${title} - HardRock`;
    },
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
