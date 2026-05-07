import { writable } from 'svelte/store'

export type Theme = 'black' | 'slate' | 'forest' | 'wine' | 'white' | 'mint' | 'Eggshell' | 'NavyPink'  // extend this union when adding themes

export interface ThemeDef {
  name: Theme
  scheme: 'dark' | 'light'
}

export const THEMES: ThemeDef[] = [
  { name: 'black',     scheme: 'dark'  },
  { name: 'slate',    scheme: 'dark'  },
  { name: 'forest',   scheme: 'dark'  },
  { name: 'wine',     scheme: 'dark'  },
  { name: 'white',    scheme: 'light' },
  { name: 'mint',     scheme: 'light' },
  { name: 'Eggshell',   scheme: 'light' },
  { name: 'NavyPink', scheme: 'light' },
]
function getDefaultTheme(): Theme {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const scheme = prefersDark ? 'dark' : 'light'
  const candidates = THEMES.filter(t => t.scheme === scheme)
  if (candidates.length === 0) return 'black'
  return candidates[Math.floor(Math.random() * candidates.length)].name
}

function createThemeStore() {
  const { subscribe, set } = writable<Theme>('black')

  function apply(t: Theme) {
    document.documentElement.dataset.theme = t
    const def = THEMES.find(x => x.name === t)
    if (def) document.documentElement.dataset.scheme = def.scheme
    set(t)
  }

  return {
    subscribe,
    set: apply,
    init() { apply(getDefaultTheme()) },
    cycle(current: Theme) {
      const idx = THEMES.findIndex(t => t.name === current)
      apply(THEMES[(idx + 1) % THEMES.length].name)
    },
  }
}

export const theme = createThemeStore()
