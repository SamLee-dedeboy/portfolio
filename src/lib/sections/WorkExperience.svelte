<script lang="ts">
  /** define section coordinates */
  const top = 1500 + 1000;
  // const left = 380
  const left = 0;
  const top_css = `${top}px`;
  const left_css = `${left}px`;

  /** define activator coordinates */
  const activators = [
    {
      header: "start_to_work",
      label: "Work Experience",
      src: {
        label: "Work Experience",
        x: 700,
        y: 550,
        width: 150,
        height: 50,
      },
      dst: {
        label: "Back to start",
        x: left + 300,
        y: top + 480,
        width: 0,
        height: 0,
      },
      turning_point: {
        x: 700,
        y: top,
      },
    },
    // dst
    {
      header: "work_to_start",
      label: "Back to start",
      src: {
        x: left + 50,
        y: top,
        width: 100,
        height: 20,
      },
      dst: {
        x: 400,
        y: 0,
        width: 0,
        height: 0,
      },
      // turning_point: {
      //     x: 1000,
      //     y: top,
      // }
    },
  ];
</script>

<!-- Work Experience -->
<div class="section work">
  <h2 class="section-header">Work Experience</h2>
  <!-- first part -->
  <div class="section-content">
    <div class="slot-header-container">
      <span class="slot-header"> Graduate Student Researcher </span>
      &#8212
      <span class="slot-subheader"> University of California, Davis</span>
      <span class="time-period"> July 2022 &#8212 present</span>
    </div>
    <ul class="bullets">
      <li class="slot-bullet">
        Developed an interactive visualization system to facilitate the
        generation of hypotheses on biases in mainstream media’s coverage of a
        topic, combining visual analytics, visual storytelling and natural
        language processing.
      </li>
      <li class="slot-bullet">
        Submitted to PacificVis 2023 as co-author and is currently being
        reviewed.
      </li>
      <li class="slot-bullet">
        Lab: Visualization and Interface Design Innovation (VIDI) Lab
      </li>
      <li class="slot-bullet">Advisor: Prof. Kwan-Liu Ma</li>
      <li class="slot-bullet">
        Repo: https://github.com/SamLee-dedeboy/MediaBias
      </li>
    </ul>
  </div>
  <!-- second part -->
  <div class="section-content">
    <div class="slot-header-container">
      <span class="slot-header"> Quality Assurance Engineer </span>
      &#8212
      <span class="slot-subheader"> Migo, Taiwan </span>
      <span class="time-period"> Feb 2021 &#8212 Aug 2021</span>
    </div>
    <ul class="bullets">
      <li class="slot-bullet">
        Responsible for developing an automatic quality assurance pipeline for
        an Android App from scratch.
      </li>
      <li class="slot-bullet">
        Additionally, created automatically generated test reports with
        customizable visualizations for daily and history test results.
      </li>
    </ul>
  </div>
  <!-- third part -->
  <div class="section-content">
    <div class="slot-header-container">
      <span class="slot-header"> Back-end Development Intern</span>
      &#8212
      <span class="slot-subheader"> Hundsun, China </span>
      <span class="time-period"> July 2019 &#8212 Sept 2019</span>
    </div>
    <ul class="bullets">
      <li class="slot-bullet">
        Participated in the development of an API call converter service, which
        converts external API calls to internal API calls, and return the result
        as if no internal API exists. The purpose is to prevent exposing
        internal APIs to clients to ensure security and expandability.
      </li>
      <li class="slot-bullet">
        Developed a light-weight tool that expands customizable expressions into
        XML tags.
      </li>
    </ul>
  </div>
</div>

<style lang="postcss">
  .work {
    /* top: v-bind('top_css');
  left: v-bind('left_css'); */
  }
</style>
