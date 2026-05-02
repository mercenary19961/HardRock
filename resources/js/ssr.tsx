import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { route } from 'ziggy-js';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { initI18n, type AppLanguage } from './i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob<{ default: any }>('./pages/**/*.tsx', { eager: true });

interface Appearance {
    theme: 'light' | 'dark';
    language: AppLanguage;
}

function readAppearance(initialPageProps: any): Appearance {
    const shared = initialPageProps?.appearance;
    return {
        theme: shared?.theme === 'light' ? 'light' : 'dark',
        language: shared?.language === 'ar' ? 'ar' : 'en',
    };
}

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => {
            const path = `./pages/${name}.tsx`;
            const mod = pages[path];
            if (!mod) {
                throw new Error(`Page not found: ${name}. Available: ${Object.keys(pages).join(', ')}`);
            }
            return mod.default;
        },
        setup: ({ App, props }) => {
            // Make route() resolve correctly during SSR using Ziggy data shared via Inertia.
            const ziggy = (page.props as any).ziggy;
            (globalThis as any).route = (name?: any, params?: any, absolute?: boolean) =>
                route(name, params, absolute, {
                    ...ziggy,
                    location: new URL(ziggy.location),
                });

            const appearance = readAppearance(page.props);
            initI18n(appearance.language);

            return (
                <ThemeProvider initialTheme={appearance.theme}>
                    <App {...props} />
                </ThemeProvider>
            );
        },
    }),
);
