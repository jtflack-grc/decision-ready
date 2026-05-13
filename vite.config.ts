import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project sites are served from https://<user>.github.io/<repo>/
// When publishing, set GITHUB_REPOSITORY_NAME to the repo name (e.g. fair-quant-work) and build.
// See docs/github-pages.md
const repo = process.env.GITHUB_REPOSITORY_NAME?.trim()
const base = repo ? `/${repo}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
