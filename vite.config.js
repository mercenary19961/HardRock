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
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-i18next') && !id.includes('@inertiajs/react'))) {
                            return 'vendor-react';
                        }
                        if (id.includes('@inertiajs/react')) {
                            return 'vendor-inertia';
                        }
                        if (id.includes('@radix-ui')) {
                            return 'vendor-radix';
                        }
                        if (id.includes('framer-motion')) {
                            return 'vendor-motion';
                        }
                        if (id.includes('i18next') || id.includes('react-i18next')) {
                            return 'vendor-i18n';
                        }
                    }
                    // Group landing components into a shared chunk to avoid duplication
                    if (id.includes('components/landing/')) {
                        return 'landing-components';
                    }
                },
            },
        },
    },
});
