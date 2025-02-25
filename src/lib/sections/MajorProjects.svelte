<script lang="ts">
  import ResearchProjectEntry from "../components/ResearchProjectEntry.svelte";

  /** define section coordinates */
  const top = -500 * 3;
  const left = (380 - 1500) * 3;
  const top_css = `${top}px`;
  const left_css = `${left}px`;
  const max_width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const max_height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  const activators = [
    {
      header: "start_to_project",
      label: "Projects",
      src: {
        x: 400,
        y: 300,
        width: 100,
        height: 50,
      },
      dst: {
        x: left,
        y: top + 300,
        width: 0,
        height: 0,
      },
      turning_point: {
        x: 400,
        y: top,
      },
    },
    // dst
    {
      header: "projects_to_start",
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

<!-- Major Projects -->
<div id="projects" class="section projects px-0.5 py-1 gap-y-2">
  <h2 class="section-header">Publications</h2>
  <div class="flex flex-col gap-y-2">
    <ResearchProjectEntry
      teaser_path="GreenMine-thumbnail.png"
      title="Visual Text Mining with Progressive Taxonomy Construction for Environmental Studies"
      authors={[
        "Sam Yu-Te Lee",
        "Cheng-Wei Hung",
        "Mei-Hua Yuan",
        "Kwan-Liu Ma",
      ]}
      publication="To Appear on IEEE PacificVis 2025"
      links={[
        ["PDF", "https://arxiv.org/abs/2502.05731"],
        ["Code", "https://github.com/SamLee-dedeboy/GreenMine"],
        ["Video", "https://www.youtube.com/watch?v=5zMf6OQsPqs"],
      ]}
    />
    <ResearchProjectEntry
      teaser_path="awesum.png"
      title="Towards Dataset-scale and Feature-oriented Evaluation of Text Summarization in Large Language Model Prompts"
      authors={[
        "Sam Yu-Te Lee",
        "Aryaman Bahukhandi",
        "Dongyu Liu",
        "Kwan-Liu Ma",
      ]}
      publication="IEEE VIS, 2024"
      links={[
        ["PDF", "https://ieeexplore.ieee.org/document/10669798"],
        ["Code", "https://github.com/SamLee-dedeboy/Awesum"],
        ["Video", "https://youtu.be/J1vw5pE9J-I"],
      ]}
    />

    <!-- Research Projects -->
    <ResearchProjectEntry
      teaser_path="hints.jpg"
      title="HINTs: Sensemaking on large collections of documents with Hypergraph visualization and Intelligent agents"
      authors={["Sam Yu-Te Lee", "Kwan-Liu Ma"]}
      publication="IEEE Transactions on Visualization and Computer Graphics (TVCG), September 2024"
      links={[
        ["PDF", "https://doi.org/10.1109/TVCG.2024.3459961"],
        ["Code", "https://github.com/SamLee-dedeboy/HINTs"],
        ["Video", "https://youtu.be/MHhZQ4C2lFY"],
      ]}
    />
    <ResearchProjectEntry
      teaser_path="nova.png"
      title="NOVA: A visual interface for assessing polarizing media coverage"
      authors={[
        "Keshav Dasu",
        "Sam Yu-Te Lee",
        "Ying-Cheng Chen",
        "Kwan-Liu Ma",
      ]}
      publication="arXiv, 2023"
      links={[
        ["PDF", "https://arxiv.org/abs/2403.00334"],
        ["Code", "https://github.com/SamLee-dedeboy/Nova"],
        ["Video", "https://youtu.be/8PsQjWpT3OE"],
        ["Demo", "https://samlee-dedeboy.github.io/Nova/"],
      ]}
    />
  </div>
  <!-- Other Projects -->
  <div class="flex flex-col">
    <h2 class="border-b-0">Projects</h2>
    <div class="flex flex-col divide-y">
      <div class="other-project">
        <h3>VisEngineering Guide</h3>
        <div class="text-gray-500">
          Open-Source Documentation of best practices in visualization
          engineering
        </div>
        <div class="links flex">
          <a
            target="”_blank”"
            class="a-button"
            href="https://samlees-organization.gitbook.io/visengineeringguide/"
            >Page</a
          >
        </div>
      </div>

      <div class="other-project">
        <h3>
          Visualizing the career evolution of an individual in the film
          industry.
        </h3>
        <div class="text-gray-500">
          Keywords: Scrollytelling, Automatic story generation
        </div>
        <div class="links flex">
          <a
            target="”_blank”"
            class="a-button"
            href="https://github.com/SamLee-dedeboy/CareerEvolution">Code</a
          >
        </div>
      </div>

      <div class="other-project">
        <h3 class="">
          Evaluating Readability of Graph Layouts with Graph Neural Networks
        </h3>
        <div class="text-gray-500">
          Keywords: Graph Layout, Graph Neural Networks, GAE
        </div>
        <div class="links flex">
          <a
            target="”_blank”"
            class="a-button"
            href="https://github.com/SamLee-dedeboy/graph_layout_GNN">Code</a
          >
        </div>
      </div>
      <div class="other-project">
        <h3 class="">
          Evaluating Empty Space Skipping methods in volume rendering
        </h3>
        <div class="text-gray-500">
          Keywords: Volume Rendering, Empty Space Skipping
        </div>
        <div class="links flex">
          <a
            target="”_blank”"
            class="a-button"
            href="https://github.com/SamLee-dedeboy/AdvancedVisPA">Code</a
          >
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .projects {
    /* top: v-bind('top_css');
  left: v-bind('left_css'); */
  }
  .other-project {
    @apply px-1 py-2 max-w-[60rem];
    & h3 {
      @apply italic;
    }
  }
  .links {
    @apply mt-1;
  }
</style>
