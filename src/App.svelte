<script lang="ts">
  import AboutMyself from "./lib/sections/AboutMyself.svelte";
  import Education from "./lib/sections/Education.svelte";
  import MajorProjects from "./lib/sections/MajorProjects.svelte";
  import ThemeToggler from "./lib/components/ThemeToggler.svelte";
  // import WorkExperience from "./lib/sections/WorkExperience.svelte";

  const lastUpdated = __LAST_UPDATED__;
</script>

<ThemeToggler />
<div class="flex flex-col gap-y-3 justify-center">
  <header class="flex flex-wrap items-center gap-y-1 font-semibold w-full pr-[5rem]">
    <h1 class="text-[1.4rem] sm:text-[2rem] font-semibold leading-tight">
      Sam (Yu-Te) Lee's Portfolio
    </h1>
    <span
      class="ml-auto text-xs sm:text-sm not-italic font-normal"
      style="color: var(--text-3)">Last Updated: {lastUpdated}</span
    >
  </header>

  <!-- Add SEO-friendly content with target keywords -->
  <section class="sr-only">
    <h2>Sam Yu-Te Lee - Visualization Researcher at UC Davis</h2>
    <p>
      Portfolio of Sam Yu-Te Lee (sam yute lee), PhD student and researcher at
      University of California, Davis (UC Davis, UCD). Specializing in Visual
      Text Analytics, Human-Computer Interaction (HCI), Human-AI Interaction,
      and Agentic systems.
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
