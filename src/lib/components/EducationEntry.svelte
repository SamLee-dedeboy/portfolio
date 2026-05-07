<script lang="ts">
  export let school = "";
  export let address = "";
  export let time_period = "";
</script>

<div class="flex flex-col">
  <span class="school italic">{school}</span>
  <span class="text-end meta">{address}</span>
  <span class="text-end meta">{time_period}</span>
</div>

<style>
  .school { color: var(--text-1); }
  .meta   { color: var(--text-3); }
</style>
