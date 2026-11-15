import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: 'tests/consumer',
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: '../../.test-consumer',
    emptyOutDir: true,
    rollupOptions: {
      input: ['tests/consumer/index.html', 'tests/consumer/no-reset.css', 'tests/consumer/reset.css'],
      output: { assetFileNames: '[name][extname]' },
    },
  },
})
