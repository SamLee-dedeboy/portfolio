<script lang="ts">
  import ResearchProjectEntry from "../components/ResearchProjectEntry.svelte";
  import ExpandableProject from "../components/ExpandableProject.svelte";
  import JustTransition from "./JustTransition.svelte";
  import COEQWAL from "./COEQWAL.svelte";

  const notes: Record<string, string> = {
    vibeGuide: "As coding agents take over more implementation, developers risk losing the project understanding they need to question changes and remain responsible for the result. We built Vibe-GUIDE around a live, manipulable graph so people can follow how a project evolves and keep oversight grounded in the software itself.",
    coworker: "As AI becomes part of everyday teamwork, we need to ask what makes someone, or something, genuinely good to work with. We explore the AI-native workplace and responsible co-working, where useful collaboration still depends on human judgment, accountability, care, and making sure AI-assisted work does not create hidden costs for others.",
    voice: "Immersive network analysis offers plenty of visual space, but conventional menus can make authoring feel cumbersome and pull attention away from the data. We explored voice-primary interaction as a more fluid way to express complex changes, while recognizing that discoverability and ambiguity still need thoughtful support.",
    vibeViz: "Conversational AI makes creating and reading charts feel effortless, but visualization novices may not notice when a confident answer or polished chart is misleading. We call this emerging practice vibe visualizing, and we want its convenience to preserve human judgment rather than quietly encourage overreliance.",
    varify: "GraphRAG can ground chatbot answers in evidence, but simply showing citations or raw graph facts does not help experts spot subtle mismatches. We built VArify to make that evidence easier to inspect in context, giving people more agency to question responses instead of accepting apparent grounding at face value.",
    vizCopilot: "Enterprise chatbots can return answers that sound plausible while relying on context that misses what the user actually meant. We built VizCopilot to make context engineering visible and steerable, because appropriate reliance requires more than warning people about errors; it requires giving them practical control over what shapes the answer.",
    videe: "Coding agents can lower the barrier to text analytics, but letting them assemble an entire analysis can hide oversimplified plans, fragile connections, and hallucinations. We built VIDEE around Decomposition, Execution, and Evaluation so analysts can inspect and shape the work instead of surrendering consequential decisions to an autonomous pipeline.",
    greenmine: "Environmental experts need to trace complex relationships across growing document collections, yet their DPSIR taxonomy often develops only as they learn from the material. We built GreenMine to support progressive taxonomy construction, helping experts refine what they are looking for while keeping uncertainty and supporting evidence visible.",
    awesum: "Prompt evaluation becomes painfully ad hoc when a prompt must work across an entire collection and quality cannot be captured by one score. We built Awesum around feature-oriented evaluation, helping people examine concrete qualities such as complexity or formality and turn what they notice into clearer directions for refinement.",
    hints: "Text-analysis tools often force people to think in terms of model outputs rather than the questions they actually care about, creating a Model Alignment gap. We built HINTs to connect user goals, document organization, and visual exploration through hypergraphs and intelligent agents, making large collections easier to reason about on human terms.",
    nova: "Media bias is real, but people often disagree about where it appears because their backgrounds and beliefs shape what they see. We built NOVA to help readers compare their expectations with patterns in coverage, supporting self-assessment rather than trying to declare a single authoritative verdict or persuade them what to believe.",
  };

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
  <div class="flex flex-col gap-y-4">
    <div class="year-divider">2026</div>
    <ResearchProjectEntry
      teaser_path="VibeGUIDE.jpg"
      teaser_wide_path="VibeGUIDE-wide.jpg"
      contain={true}
      title="Vibe-GUIDE: A Graph-based User Interface in IDEs for Oversight in Vibe Coding"
      note={notes.vibeGuide}
      authors={[
        "Chifang Chou",
        "Sam Yu-Te Lee",
        "Rudrajit Choudhuri",
        "Kwan-Liu Ma",
      ]}
      publication="Preprint, Sept 2026"
      links={[
        ["PDF", "https://arxiv.org/abs/2609.23859"],
        ["Code", "https://github.com/chifangg/shared-representation"],
        ["Video", "https://www.youtube.com/watch?v=zhMmMYUJarw"],
      ]}
    />
    <ResearchProjectEntry
      teaser_path="CoworkerWheel.png"
      teaser_wide_path="CoworkerWheel-wide.jpg"
      title="What Makes a Great Co-Worker in an AI-Native Workplace?"
      note={notes.coworker}
      authors={[
        "Rudrajit Choudhuri",
        "Max Meijer",
        "Sam Yu-Te Lee",
        "Cinoo Lee",
        "Caolan Mannion",
        "Peter Jahn",
        "Anita Sarma",
        "Christian Bird",
        "Alice Ferng",
      ]}
      publication="Preprint, Sept 2026"
      links={[["PDF", "https://arxiv.org/abs/2609.13786"]]}
    />
    <ResearchProjectEntry
      teaser_path="VoiceInterface.png"
      title="A Design Study on Voice-based Interaction for Immersive Network Visualization and Analysis"
      note={notes.voice}
      authors={[
        "Sam Yu-Te Lee",
        "Hsin-Ai Chen",
        "Sarah Yuniar",
        "David Bauer",
        "Kwan-Liu Ma",
      ]}
      publication="To appear in IEEE ISMAR, 2026"
      links={[
        ["PDF", "https://arxiv.org/abs/2607.26526"],
        ["Code", "https://github.com/sarahayu/VR-Network-Visualization"],
        ["Video", "https://youtu.be/rK0J-Nk6_9E"],
      ]}
    />
    <ResearchProjectEntry
      teaser_path="VibeVisualizing.png"
      title="Vibe Visualizing: How Visualization Novices Try (and Fail) to Generate and Interpret Visualizations with Conversational AI"
      note={notes.vibeViz}
      authors={[
        "Sam Yu-Te Lee",
        "Yun-Hsin Kuo",
        "Chifang Chou",
        "Matthew Ward",
        "Xiwei Xuan",
        "Kwan-Liu Ma",
      ]}
      publication="Preprint, June 2026"
      links={[
        ["PDF", "https://arxiv.org/abs/2606.08914"],
        ["Video", "https://youtu.be/-uiad4dT83c"],
        ["Website", "https://vibe-visualizing.vercel.app/"],
      ]}
    />
    <ResearchProjectEntry
      teaser_path="VArify.png"
      contain={true}
      last_in_group={true}
      title="VArify: A Visual Analytics System for Verifying Knowledge Enhanced Large Language Model Responses in Food Science"
      note={notes.varify}
      authors={[
        "Sam Yu-Te Lee",
        "Yan To Linus Lam",
        "Manami Nakagawa",
        "Kwan-Liu Ma",
      ]}
      publication="Preprint, June 2026"
      links={[
        ["PDF", "https://arxiv.org/abs/2606.10177"],
        ["Code", "https://github.com/linuslyt/VArify"],
        ["Video", "https://youtu.be/K3tb-UGmtQY"],
      ]}
    />
    <div class="year-divider">2025</div>
    <ResearchProjectEntry
      teaser_path="VizCopilot.png"
      teaser_wide_path="VizCopilot-wide.jpg"
      title="VizCopilot: Fostering Appropriate Reliance on Enterprise Chatbots with Context Visualization"
      note={notes.vizCopilot}
      authors={[
        "Sam Yu-Te Lee",
        "Jingya Chen",
        "Albert Calzaretto",
        "Richard Lee",
        "Samir Passi",
        "Alice Ferng",
        "Mihaela Vorvoreanu",
      ]}
      publication="Preprint, Oct 2025"
      links={[
        ["PDF", "https://arxiv.org/abs/2510.11954"],
        ["Video", "https://youtu.be/QeiO71Vvvww"],
      ]}
    />
    <ResearchProjectEntry
      teaser_path="VIDEE.png"
      teaser_wide_path="VIDEE-wide.jpg"
      title="VIDEE: Visual and Interactive Decomposition, Execution, and Evaluation of Text Analytics with Intelligent Agents "
      note={notes.videe}
      authors={[
        "Sam Yu-Te Lee",
        "Chengyang Ji",
        "Shicheng Wen",
        "Lifu Huang",
        "Dongyu Liu",
        "Kwan-Liu Ma",
      ]}
      publication="Preprint, June 2025"
      links={[
        ["PDF", "https://arxiv.org/abs/2506.21582"],
        ["Code", "https://github.com/SamLee-dedeboy/VIDEE"],
        ["Video", "https://www.youtube.com/watch?v=vm67gmphnr0"],
      ]}
    />
    <ResearchProjectEntry
      teaser_path="GreenMine-thumbnail.png"
      last_in_group={true}
      title="Visual Text Mining with Progressive Taxonomy Construction for Environmental Studies"
      note={notes.greenmine}
      authors={[
        "Sam Yu-Te Lee",
        "Cheng-Wei Hung",
        "Mei-Hua Yuan",
        "Kwan-Liu Ma",
      ]}
      publication="IEEE PacificVis, 2025"
      links={[
        ["PDF", "https://ieeexplore.ieee.org/document/11021058"],
        ["Code", "https://github.com/SamLee-dedeboy/GreenMine"],
        ["Video", "https://www.youtube.com/watch?v=5zMf6OQsPqs"],
      ]}
    />
    <div class="year-divider">2024</div>
    <ResearchProjectEntry
      teaser_path="awesum.png"
      title="Towards Dataset-scale and Feature-oriented Evaluation of Text Summarization in Large Language Model Prompts"
      note={notes.awesum}
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
      last_in_group={true}
      title="HINTs: Sensemaking on large collections of documents with Hypergraph visualization and Intelligent agents"
      note={notes.hints}
      authors={["Sam Yu-Te Lee", "Kwan-Liu Ma"]}
      publication="IEEE Transactions on Visualization and Computer Graphics (TVCG), September 2024"
      links={[
        ["PDF", "https://doi.org/10.1109/TVCG.2024.3459961"],
        ["Code", "https://github.com/SamLee-dedeboy/HINTs"],
        ["Video", "https://youtu.be/MHhZQ4C2lFY"],
      ]}
    />
    <div class="year-divider">2023</div>
    <ResearchProjectEntry
      teaser_path="nova.png"
      last_in_group={true}
      title="NOVA: A visual interface for assessing polarizing media coverage"
      note={notes.nova}
      authors={[
        "Keshav Dasu",
        "Sam Yu-Te Lee",
        "Ying-Cheng Chen",
        "Kwan-Liu Ma",
      ]}
      publication="Preprint, 2023"
      links={[
        ["PDF", "https://arxiv.org/abs/2403.00334"],
        ["Code", "https://github.com/SamLee-dedeboy/Nova"],
        ["Video", "https://youtu.be/8PsQjWpT3OE"],
        ["Demo", "https://samlee-dedeboy.github.io/Nova/"],
      ]}
    />
  </div>
  <!-- Other Projects -->
  <div class="flex flex-col mt-4">
    <h2 class="border-b-0">Projects</h2>
    <div class="flex flex-col divide-y">
      <!-- <div class="other-project">
        <div class="flex gap-x-2">
          <a
            href="https://delta-just-transitions-ucdavis.hub.arcgis.com/"
            target="_blank"
          >
            <img
              src="JT.png"
              alt="Just Transition - TEMP MARKER"
              class="h-[6rem] w-auto mr-3 rounded-md object-contain"
            />
          </a>
          <div class="flex flex-col mt-2">
            <h3>Just Transition in the Delta - COMPONENT VERSION</h3>
            <div style="color: var(--text-3)">
              Investigating adaptation strategies in the Sacramento-San Joaquin
              Delta under conditions of drought, salinity and sea-level rise
              <div class="links inline-flex ml-2">
                <a
                  target="_blank"
                  class="a-button"
                  href="https://samlees-organization.gitbook.io/visengineeringguide/"
                  >Page</a
                >
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div class="other-project">
        <JustTransition />
      </div>
      <div class="other-project">
        <COEQWAL />
      </div>
      <div class="other-project">
        <div class="flex flex-col sm:flex-row gap-x-2 gap-y-2">
          <a
            href="https://github.com/SamLee-dedeboy/htmdoc"
            target="_blank"
            class="shrink-0"
          >
            <img
              src="htmdoc.png"
              alt="htmdoc"
              class="w-full sm:w-[18rem] h-auto rounded-md object-contain"
            />
          </a>
          <div class="flex flex-col mt-0.5 flex-1">
            <h4>htmdoc</h4>
            <div style="color: var(--text-3)">
              Edit any HTML file in your browser like a document. Built for
              surgical last-touch edits on AI-generated web pages.
            </div>
            <ul
              class="mt-2 flex flex-col gap-y-1 list-disc pl-5 text-sm"
              style="color: var(--text-3)"
            >
              <li>
                <strong style="color: var(--text-2)">One-click setup</strong> — a
                single script include or bookmarklet, no build step
              </li>
              <li>
                <strong style="color: var(--text-2)"
                  >Saves to disk automatically</strong
                > — every edit writes back to the file, with backups
              </li>
              <li>
                <strong style="color: var(--text-2)">Rich editing</strong> — text
                formatting, tables, lists, images, and find &amp; replace
              </li>
              <li>
                <strong style="color: var(--text-2)">Version history</strong> — roll
                back to any earlier version in one click
              </li>
            </ul>
            <div class="links flex" style="margin-top: auto;">
              <a
                target="_blank"
                class="a-button"
                href="https://github.com/SamLee-dedeboy/htmdoc">Code</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="other-project">
        <div class="flex flex-col sm:flex-row gap-x-2 gap-y-2">
          <a
            href="https://github.com/SamLee-dedeboy/VectorUI"
            target="_blank"
            class="shrink-0"
          >
            <img
              src="VectorUI.png"
              alt="VectorUI — text flowing around an SVG shape, a curve slider, and a PathFlow menu"
              class="w-full sm:w-[18rem] h-auto rounded-md object-contain"
            />
          </a>
          <div class="flex flex-col mt-0.5 flex-1">
            <h4>VectorUI</h4>
            <div style="color: var(--text-3)">
              A UI component library rendered entirely in SVG — shapes, not
              boxes, as the primary layout container. It escapes the rectilinear
              look of modern UI kits by making any closed path a container.
            </div>
            <ul
              class="mt-2 flex flex-col gap-y-1 list-disc pl-5 text-sm"
              style="color: var(--text-3)"
            >
              <li>
                <strong style="color: var(--text-2)">Shape as container</strong>
                — text wraps to an irregular silhouette's contour, not its bounding
                box
              </li>
              <li>
                <strong style="color: var(--text-2)">Layout along curves</strong
                >
                — a radial menu, clock face, or slider whose track <em>is</em> the
                transfer function, all from one primitive
              </li>
              <li>
                <strong style="color: var(--text-2)">Direct manipulation</strong
                >
                — drag handles for shape parameters; the edit UI and the runtime
                UI share the same geometry
              </li>
            </ul>
            <div class="links flex gap-x-1" style="margin-top: auto;">
              <a
                target="_blank"
                class="a-button"
                href="https://samlee-dedeboy.github.io/VectorUI/">Demo</a
              >
              <a
                target="_blank"
                class="a-button"
                href="https://github.com/SamLee-dedeboy/VectorUI">Code</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="other-project">
        <h4>VisEngineering Guide</h4>
        <div style="color: var(--text-3)">
          Open-Source Documentation of best practices in visualization
          engineering
        </div>
        <div class="links flex">
          <a
            target="_blank"
            class="a-button"
            href="https://samlees-organization.gitbook.io/visengineeringguide/"
            >Page</a
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
  .year-divider {
    @apply flex items-center gap-x-2 text-sm font-semibold mt-2;
    color: var(--text-2);
  }
  .year-divider::after {
    content: "";
    @apply flex-1 h-px;
    background-color: var(--text-3);
    opacity: 0.35;
  }
</style>
