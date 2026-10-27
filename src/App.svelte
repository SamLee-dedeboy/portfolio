<script lang="ts">
  import AboutMyself from "./lib/sections/AboutMyself.svelte";
  import Education from "./lib/sections/Education.svelte";
  import MajorProjects from "./lib/sections/MajorProjects.svelte";
  import ThemeToggler from "./lib/components/ThemeToggler.svelte";
  import DeepestFear from "./lib/components/DeepestFear.svelte";
  import FourStitches from "./lib/components/FourStitches.svelte";
  import { allFound } from "./lib/stitches";
  // import WorkExperience from "./lib/sections/WorkExperience.svelte";

  const lastUpdated = __LAST_UPDATED__;
</script>

<div class="page flex flex-col gap-y-3 justify-center">
  <FourStitches />
  <header class="flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold w-full">
    <h1 class="text-[1.4rem] sm:text-[2rem] font-semibold leading-tight">
      Sam (Yu-Te) Lee's Portfolio
    </h1>
    <span
      class="ml-auto text-xs sm:text-sm not-italic font-normal"
      style="color: var(--text-3)">Last Updated: {lastUpdated}</span
    >
    <ThemeToggler />
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

  <!-- Coda: a quiet sign-off for whoever reads all the way to the end. -->
  <footer class="coda">
    <p class="coda-lead">if you've read this far —</p>
    <DeepestFear complete={$allFound} />
  </footer>
</div>

<style>
  .page {
    position: relative; /* the margin thread positions against this */
  }
  .coda {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5rem;
    padding: 2.5rem 0 3rem;
    border-top: 1px solid
      color-mix(in srgb, var(--text-3) 30%, transparent);
  }
  .coda-lead {
    margin: 0 0 0.6rem;
    font-size: 0.8rem;
    font-style: italic;
    letter-spacing: 0.02em;
    color: var(--text-3);
  }

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
