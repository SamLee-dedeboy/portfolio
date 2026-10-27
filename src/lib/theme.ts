import { writable } from 'svelte/store'

export type Theme = 'black' | 'white'

export interface ThemeDef {
  name: Theme
  scheme: 'dark' | 'light'
}

export const THEMES: ThemeDef[] = [
  { name: 'black', scheme: 'dark' },
  { name: 'white', scheme: 'light' },
]

const STORAGE_KEY = 'theme'

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'black' || v === 'white' ? v : null
  } catch {
    return null
  }
}

function getDefaultTheme(): Theme {
  const stored = readStored()
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'black' : 'white'
}

function createThemeStore() {
  const { subscribe, set } = writable<Theme>('black')
  let current: Theme = 'black'

  function apply(t: Theme, persist = true) {
    current = t
    document.documentElement.dataset.theme = t
    const def = THEMES.find((x) => x.name === t)
    if (def) document.documentElement.dataset.scheme = def.scheme
    set(t)
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, t)
      } catch {
        /* storage unavailable */
      }
    }
  }

  return {
    subscribe,
    set: apply,
    init() {
      apply(getDefaultTheme(), false)
      // Follow the OS until the visitor picks a theme themselves.
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          if (!readStored()) apply(e.matches ? 'black' : 'white', false)
        })
    },
    toggle() {
      apply(current === 'black' ? 'white' : 'black')
    },
  }
}

export const theme = createThemeStore()
