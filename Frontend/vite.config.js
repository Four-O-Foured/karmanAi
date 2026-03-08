import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('three')) return 'vendor-three';
                        if (id.includes('framer-motion')) return 'vendor-framer-motion';
                        if (id.includes('@tanstack')) return 'vendor-tanstack';
                        if (id.includes('react-markdown') || id.includes('remark') || id.includes('micromark')) return 'vendor-markdown';
                        if (id.includes('lucide-react')) return 'vendor-lucide';
                        return 'vendor-core';
                    }
                }
            }
        }
    },
    esbuild: {
        drop: ['console', 'debugger'],
    }
})
