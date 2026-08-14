import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'firebase-vendor',
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              priority: 30,
            },
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run)[\\/]/,
              priority: 20,
            },
            {
              name: 'lucide-vendor',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 15,
            },
            {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})