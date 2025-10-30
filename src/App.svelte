<script lang="ts">
  import AboutMyself from "./lib/sections/AboutMyself.svelte";
  import Education from "./lib/sections/Education.svelte";
  import MajorProjects from "./lib/sections/MajorProjects.svelte";
  // import WorkExperience from "./lib/sections/WorkExperience.svelte";
</script>

<div class="flex flex-col gap-y-3 justify-center">
  <header class="flex font-semibold text-[2rem] italic text-gray-700 w-full">
    <h1 class="text-[2rem] font-semibold italic text-gray-700">
      Sam Yu-Te Lee's Portfolio
    </h1>
    <span class="ml-auto right-0 text-sm text-gray-500">
      Last Updated: 10/30/2025</span
    >
  </header>

  <!-- Add SEO-friendly content with target keywords -->
  <section class="sr-only">
    <h2>Sam Yu-Te Lee - Visualization Researcher at UC Davis</h2>
    <p>
      Portfolio of Sam Yu-Te Lee (sam yute lee), PhD student and researcher at
      University of California, Davis (UC Davis, UCD). Specializing in Visual
      Text Analytics, Human-Computer Interaction, and Agentic systems.
    </p>
  </section>

  <AboutMyself />
  <MajorProjects />
  <Education />
  <!-- <WorkExperience /> -->
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
