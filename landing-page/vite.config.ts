import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import openGraph from 'vite-plugin-open-graph'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    openGraph({
      basic: {
        type: 'website',
        title: 'Gnosis Guild',
        description: 'Zodiac Pilot — Batch and simulate transactions',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Gnosis Guild',
        description: 'Zodiac Pilot — Batch and simulate transactions',
      },
    }),
  ],
  build: {
    manifest: true,
  },
})
