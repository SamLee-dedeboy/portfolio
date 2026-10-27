<script lang="ts">
  import { theme } from "../theme";
  import { Sun, Moon } from "lucide-svelte";

  $: dark = $theme === "black";
</script>

<button
  type="button"
  class="theme-switch"
  role="switch"
  aria-checked={dark}
  aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
  title={dark ? "Light mode" : "Dark mode"}
  on:click={() => theme.toggle()}
>
  <span class="icon" class:shown={!dark} aria-hidden="true"><Moon size={16} strokeWidth={2} /></span>
  <span class="icon" class:shown={dark} aria-hidden="true"><Sun size={16} strokeWidth={2} /></span>
</button>

<style>
  .theme-switch {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    flex: none;
    border-radius: 9999px;
    border: 1px solid color-mix(in srgb, var(--text-3) 35%, transparent);
    background: var(--bg-surface);
    color: var(--text-2);
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      border-color 0.15s ease;
  }

  .theme-switch:hover {
    color: var(--pair-color);
    border-color: color-mix(in srgb, var(--pair-color) 55%, transparent);
  }

  .theme-switch:focus-visible {
    outline: 2px solid var(--pair-color);
    outline-offset: 2px;
  }

  .icon {
    grid-area: 1 / 1;
    display: inline-flex;
    opacity: 0;
    transform: rotate(-60deg) scale(0.6);
    transition:
      opacity 0.2s ease,
      transform 0.25s ease;
  }

  .icon.shown {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .icon {
      transition: none;
    }
  }
</style>
