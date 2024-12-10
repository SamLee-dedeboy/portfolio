<script lang="ts">
  import AboutMyself from "./lib/sections/AboutMyself.svelte";
  import Education from "./lib/sections/Education.svelte";
  import MajorProjects from "./lib/sections/MajorProjects.svelte";
  // import WorkExperience from "./lib/sections/WorkExperience.svelte";
</script>

<div class="flex flex-col gap-y-3 justify-center">
  <div class="flex font-semibold text-[2rem] italic text-gray-700 w-full">
    Sam Yu-Te Lee's Portfolio
    <span class="ml-auto right-0 text-sm text-gray-500">
      Last Updated: 12/10/2024</span
    >
  </div>
  <AboutMyself />
  <MajorProjects />
  <Education />
  <!-- <WorkExperience /> -->
</div>

<style>
</style>
