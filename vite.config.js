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
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: '192.168.1.9',
        },
    },
});
