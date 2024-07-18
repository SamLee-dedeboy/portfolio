<script lang="ts">
  export let school = "";
  export let address = "";
  export let time_period = "";
</script>

<div class="flex flex-col">
  <span class="italic">{school}</span>
  <span class="text-end">{address}</span>
  <span class="text-end">{time_period}</span>
</div>
