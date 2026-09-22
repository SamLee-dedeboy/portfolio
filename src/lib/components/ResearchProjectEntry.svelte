<script lang="ts">
  import { slide } from "svelte/transition";

  export let title: string = "";
  export let authors: string[] = [];
  export let publication: string = "";
  export let links: [string, string][] = [];
  /** Square thumbnail — shown in the collapsed row (cropped to a square). */
  export let teaser_path: string | undefined = undefined;
  /** Optional wide thumbnail. Providing it puts the entry in Layout B:
   * expanded, the wide image is shown full-width on top. */
  export let teaser_wide_path: string | undefined = undefined;
  /** Fit the whole (uncropped) thumbnail inside the collapsed square instead
   * of cropping it to fill. */
  export let contain: boolean = false;
  /** Last entry in its year group — drop the bottom divider line. */
  export let last_in_group: boolean = false;
  export let note: string = "";

  let expanded = false;
  $: canExpand = !!note;
  $: isLayoutB = !!teaser_wide_path;

  $: highlighted_authors = authors
    .map((author) => {
      if (author === "Sam Yu-Te Lee") {
        return `<span class="me">${author}</span>`;
      } else {
        return author;
      }
    })
    .join(", ");

  $: teaserSrc =
    expanded && isLayoutB && teaser_wide_path ? teaser_wide_path : teaser_path;
  $: teaserImgClass = !expanded
    ? contain
      ? "w-[8rem] h-[8rem] object-contain"
      : "w-[8rem] h-[8rem] object-cover"
    : isLayoutB
      ? "w-full h-auto"
      : "w-[18rem] h-auto";

  function toggle() {
    if (canExpand) expanded = !expanded;
  }
</script>

<div
  class="content-container flex flex-col gap-y-2 sm:flex-row sm:flex-wrap {expanded
    ? 'gap-x-2'
    : 'sm:gap-x-6'}"
  class:border-b={!last_in_group && !expanded}
  class:border-gray-300={!expanded}
  class:pb-2={!expanded}
  class:is-expanded={expanded}
>
  {#if teaser_path}
    <button
      type="button"
      class="teaser-container appearance-none border-0 p-0 block overflow-hidden rounded-sm outline-double outline-gray-300 outline-1 shrink-0 self-start {isLayoutB &&
      expanded
        ? 'w-full'
        : 'w-fit'}"
      class:can-expand={canExpand}
      class:bg-white={contain}
      class:bg-transparent={!contain}
      disabled={!canExpand}
      aria-expanded={canExpand ? expanded : undefined}
      title={canExpand ? (expanded ? "Collapse" : "Click to expand") : undefined}
      on:click={toggle}
    >
      <img
        src={teaserSrc}
        alt="teaser"
        class="teaser transition-all duration-200 ease-out {teaserImgClass}"
      />
    </button>
  {/if}
  <div class="research-project flex flex-col flex-1 min-w-0">
    <h4>{title}</h4>
    <div class="author">
      {@html highlighted_authors}
    </div>
    <div class="publication">{publication}</div>
    <div class="links flex gap-x-1 mt-auto pt-1 items-center flex-wrap">
      {#each links as [label, href]}
        <a target="_blank" class="a-button" {href}>{label}</a>
      {/each}
      {#if canExpand}
        <button type="button" class="detail-toggle" on:click={toggle}>
          {expanded ? "hide" : "detail"}
        </button>
      {/if}
    </div>
  </div>
  {#if expanded && note}
    <div class="note-callout w-full sm:basis-full" transition:slide|local>
      <p class="note-label">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-3.5 h-3.5"
          aria-hidden="true"
        >
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path
            d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"
          />
        </svg>
        the idea
      </p>
      <p class="note-text">{note}</p>
    </div>
  {/if}
</div>

<style lang="postcss">
  .research-project {
    @apply max-w-[60rem];
    & .author,
    & .publication {
      color: var(--text-3);
    }
    & .publication {
      @apply text-[0.8rem];
    }
    & .me {
      @apply font-bold;
      color: var(--pair-color);
    }
  }
  .note-callout {
    @apply mt-2 rounded-xl px-4 py-3;
    background: color-mix(in srgb, var(--pair-color) 12%, var(--bg-surface));
  }
  .note-label {
    @apply flex items-center gap-x-1 text-xs font-semibold mb-1;
    color: var(--pair-color);
  }
  .note-text {
    @apply text-sm leading-relaxed;
    color: var(--text-1);
  }
  .is-expanded {
    @apply rounded-xl p-3 sm:p-4;
    border: 1.5px solid color-mix(in srgb, var(--pair-color) 55%, transparent);
    background: color-mix(in srgb, var(--pair-color) 4%, transparent);
  }
  .can-expand {
    cursor: pointer;
  }
  .detail-toggle {
    @apply text-sm font-mono leading-none cursor-pointer select-none ml-1 py-1 px-2;
    color: var(--text-link, var(--pair-color));
  }
  .detail-toggle:hover {
    text-decoration: underline;
  }
</style>
