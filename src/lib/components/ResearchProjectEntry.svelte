<script lang="ts">
  export let title: string = "";
  export let authors: string[] = [];
  export let publication: string = "";
  export let links: [string, string][] = [];
  export let teaser_path: string | undefined = undefined;
  $: highlighted_authors = authors
    .map((author) => {
      if (author === "Sam Yu-Te Lee") {
        return `<span class="me">${author}</span>`;
      } else {
        return author;
      }
    })
    .join(", ");
</script>

<div class="flex gap-x-2 pt-1">
  {#if teaser_path}
    <div
      class="teaser-container rounded-sm outline-double outline-gray-300 outline-1 relative"
    >
      <img src={teaser_path} alt="teaser" class="teaser max-w-[8rem]" />
      <img
        src={teaser_path}
        alt="teaser"
        class="teaser-large hidden pointer-events-none max-w-[24rem] absolute top-0 -left-2 z-10 outline-1 outline-double outline-black rounded-sm"
      />
    </div>
  {/if}
  <div
    class="research-project flex flex-col border-b border-gray-300 justify-between"
  >
    <h3>{title}</h3>
    <div class="author">
      {@html highlighted_authors}
    </div>
    <div class="publication">{publication}</div>
    <div class="links flex gap-x-1">
      {#each links as [label, href]}
        <a target="”_blank”" class="a-button" {href}>{label}</a>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .research-project {
    @apply px-1 py-2 max-w-[60rem];
    & h3 {
      @apply italic;
    }
    & .author,
    & .publication {
      @apply text-gray-500;
    }
    & .publication {
      @apply text-[0.8rem];
    }
    & .me {
      @apply font-bold;
      color: rgb(232, 160, 15);
    }
  }
  .teaser-container:hover {
    & .teaser-large {
      @apply block;
    }
  }
</style>
