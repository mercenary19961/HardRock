import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.mts', '.json'],
    },
    server: {
        host: 'localhost',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React - rarely changes
                    'vendor-react': ['react', 'react-dom'],
                    // Inertia.js
                    'vendor-inertia': ['@inertiajs/react'],
                    // UI components - Radix primitives
                    'vendor-radix': [
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-select',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-tooltip',
                        '@radix-ui/react-navigation-menu',
                        '@radix-ui/react-collapsible',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-toggle',
                        '@radix-ui/react-toggle-group',
                        '@radix-ui/react-avatar',
                    ],
                    // Animation library - large
                    'vendor-motion': ['framer-motion'],
                    // i18n - only used on landing page
                    'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
                },
            },
        },
    },
});
