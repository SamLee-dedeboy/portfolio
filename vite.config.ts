import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { execSync } from 'child_process'

function getLastCommitDate(): string {
  try {
    return execSync('git log -1 --format=%cd --date=format:"%m/%d/%Y"')
      .toString().trim()
  } catch {
    return new Date().toLocaleDateString('en-US')
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: '/portfolio/',
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
  define: {
    __LAST_UPDATED__: JSON.stringify(getLastCommitDate()),
  },
})
