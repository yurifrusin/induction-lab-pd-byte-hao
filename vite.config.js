import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub project Pages sites are served from /<repository>/.
  // Keep relative paths locally so the packaged build remains portable.
  base: process.env.GITHUB_ACTIONS ? '/induction-lab-pd-byte-hao/' : './',
  plugins: [react()],
})
