<script lang="ts">
  import { theme, THEMES, type Theme } from "../theme";
  import { slide } from "svelte/transition";
  import { ChevronDown } from "lucide-svelte";

  let open = typeof window !== "undefined" && window.innerWidth >= 640;

  $: darkThemes = THEMES.filter((t) => t.scheme === "dark");
  $: lightThemes = THEMES.filter((t) => t.scheme === "light");

  const THEME_COLORS: Record<Theme, { bg: string; fg: string }> = {
    black:    { bg: "#1B262A", fg: "#fed701" },
    slate:    { bg: "#1a2030", fg: "#7eb8e6" },
    forest:   { bg: "#162620", fg: "#f0f0f0" },
    wine:     { bg: "#1c1018", fg: "#f0f0f0" },
    white:    { bg: "#e4f2ff", fg: "#1B262A" },
    mint:     { bg: "#dfebd9", fg: "#8a7258" },
    Eggshell: { bg: "#faebd7", fg: "#1B262A" },
    NavyPink: { bg: "#fad6ea", fg: "#254c95" },
  };
</script>

<div class="theme-toggler z-10">
  <button
    class="toggle-header"
    on:click={() => (open = !open)}
    aria-label="Toggle theme picker"
  >
    <span class="current">{$theme}</span>
    <span class="arrow" class:open
      ><ChevronDown size={14} strokeWidth={2.25} /></span
    >
  </button>

  {#if open}
    <div class="groups" transition:slide={{ duration: 200 }}>
      <div class="group">
        <span class="label">Dark</span>
        {#each darkThemes as t}
          <button
            class="theme-btn"
            class:active={$theme === t.name}
            style="--btn-bg:{THEME_COLORS[t.name].bg};--btn-fg:{THEME_COLORS[t.name].fg};"
            on:click={() => theme.set(t.name)}
            aria-label="Switch to {t.name} theme">{t.name}</button
          >
        {/each}
      </div>

      <div class="group">
        <span class="label">Light</span>
        {#each lightThemes as t}
          <button
            class="theme-btn"
            class:active={$theme === t.name}
            style="--btn-bg:{THEME_COLORS[t.name].bg};--btn-fg:{THEME_COLORS[t.name].fg};"
            on:click={() => theme.set(t.name)}
            aria-label="Switch to {t.name} theme">{t.name}</button
          >
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .theme-toggler {
    position: fixed;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
    width: 4.5rem;
    background: var(--bg-surface);
    border: 1px solid color-mix(in srgb, var(--text-3) 30%, transparent);
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  @media (min-width: 640px) {
    .theme-toggler {
      top: 1rem;
      right: 1rem;
    }
  }

  .toggle-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.35rem 0.6rem;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    color: var(--text-2);
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .toggle-header:hover {
    background: color-mix(in srgb, var(--text-3) 15%, transparent);
  }

  .current {
    color: var(--pair-color);
  }

  .arrow {
    display: inline-flex;
    align-items: center;
    opacity: 0.6;
    transition: transform 0.2s ease;
  }

  .arrow.open {
    transform: rotate(180deg);
  }

  .groups {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.25rem 0.2rem 0.5rem;
    border-top: 1px solid color-mix(in srgb, var(--text-3) 20%, transparent);
  }

  .group {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .label {
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-3);
    padding: 0 0.25rem;
  }

  .theme-btn {
    font-size: 0.72rem;
    font-weight: 500;
    text-transform: capitalize;
    padding: 0.2rem 0.6rem;
    border-radius: 0.3rem;
    border: none;
    cursor: pointer;
    color: var(--text-2);
    background: transparent;
    text-align: left;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      transform 0.15s ease;
  }

  .theme-btn.active {
    background: var(--theme-color);
    color: var(--pair-color);
  }

  .theme-btn:not(.active):hover {
    background: var(--btn-bg);
    color: var(--btn-fg);
    transform: translateX(2px);
  }

  .theme-btn.active:hover {
    filter: brightness(1.1);
  }
</style>
