import './app.css'
import App from './App.svelte'
import { theme } from './lib/theme'

theme.init()

const app = new App({
  target: document.getElementById('app')!,
})

export default app
