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

<div class="flex max-h-[10rem]">
  {#if teaser_path}
    <img src={teaser_path} alt="teaser" class="max-w-[15rem] max-h-full" />
  {/if}
  <div class="research-project flex flex-col">
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
</style>
