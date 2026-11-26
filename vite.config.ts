import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    cssCodeSplit: true,
    lib: { entry: { index: 'src/index.ts', charts: 'src/charts.ts' }, formats: ['es'] },
    rollupOptions: { external: ['vue', 'reka-ui', /^echarts\//] },
  },
})
