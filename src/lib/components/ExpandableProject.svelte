<script lang="ts">
  export let imageSrc: string;
  export let imageAlt: string;
  export let title: string;
  export let description: string;
  export let link: string = "";
  export let linkText: string = "Page";

  let isExpanded = false;

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }
</script>

<div class="flex flex-col">
  <div class="flex flex-col sm:flex-row gap-x-2 gap-y-2">
    <!-- Image with optional link -->
    {#if link}
      <a href={link} target="_blank" class="shrink-0">
        <img
          src={imageSrc}
          alt={imageAlt}
          class="w-full sm:w-[18rem] h-auto rounded-md object-contain"
        />
      </a>
    {:else}
      <img
        src={imageSrc}
        alt={imageAlt}
        class="h-[6rem] w-auto rounded-md object-contain shrink-0"
      />
    {/if}

    <div class="flex flex-col mt-0.5 flex-1">
      <div class="flex items-center justify-between">
        <h4>{title}</h4>
      </div>

      <div style="color: var(--text-3)">
        {description}
        {#if link}
          <div class="links inline-flex ml-2">
            <a target="_blank" class="a-button" href={link}>
              {linkText}
            </a>
          </div>
        {/if}
      </div>

      <!-- Expandable content -->
    </div>
  </div>
  <button
    on:click={toggleExpanded}
    class="expand-button mt-2 ml-2 w-fit py-1 px-2 transition-colors"
    aria-label={isExpanded ? "Collapse" : "Expand"}
  >
    {isExpanded ? "Hide" : "See more"}
  </button>
  {#if isExpanded}
    <slot name="expandedContent">
      <!-- Default content if no slot is provided -->
      <p class="italic" style="color: var(--text-3)">No expanded content provided</p>
    </slot>
  {/if}
</div>

<style lang="postcss">
  .expand-button {
    @apply text-sm font-mono leading-none cursor-pointer select-none;
    color: var(--text-link);
  }

  .expanded-content {
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
