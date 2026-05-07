<script lang="ts">
  import { copyTextToClipboard } from "../../utils";
  export let top = 0;
  export let left = 0;
  /** define section coordinates */
  // const top = -1000
  // const left = 380
  const top_css = `${top}px`;
  const left_css = `${left}px`;

  /** define activator coordinates */
  export const activators = [
    {
      header: "start_to_myself",
      label: "About Myself",
      src: {
        x: 700,
        y: 100,
        width: 120,
        height: 50,
      },
      dst: {
        label: "Back to start",
        x: left || 0 + 260,
        y: top,
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
      header: "myself_to_start",
      label: "Back to start",
      src: {
        x: left || 0 + 50,
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

<div class="section myself">
  <h2 class="section-header mb-1">About Myself</h2>
  <div class="content-container flex gap-x-2">
    <div class="profile-image-container w-32 h-32 sm:w-40 sm:h-40 shrink-0 self-center sm:self-start">
      <img
        src="profile_image.jpg"
        alt="profile"
        class="profile-image-primary w-32 h-32 sm:w-40 sm:h-40"
      />
      <img
        src="profile_image_hidden.jpg"
        alt="profile"
        class="profile-image-hidden hidden w-32 h-32 sm:w-40 sm:h-40"
      />
      <!-- <span class="whitespace-nowrap text-sm text-gray-400 italic"
        >Sam judging his own intro</span
      > -->
    </div>
    <div class="max-w-[40rem] flex flex-wrap shrink gap-y-1 gap-x-1">
      <div>
        I am a PhD candidate at the CS department of University of California,
        Davis, and a member of the
        <a target="_blank" href="https://vidi.cs.ucdavis.edu"> VIDI Lab</a>,
        advised by
        <a target="_blank" href="https://web.cs.ucdavis.edu/~ma/">
          Prof. Kwan-Liu Ma</a
        >. I am interested in Visual Text Analytics and Human-Computer
        Interaction.
        <span class="font-semibold italic"
          >More specifically, I investigate visualization and interface designs
          for data novices to do text analytics with Large Language Models.
        </span>
        <br />
        The best way to reach me is through email:
        <span
          class="copy-email inline-flex items-center gap-x-1 rounded-md px-1"
          tabindex="0"
          role="button"
          on:click={() => {
            copyTextToClipboard("ytlee@ucdavis.edu");
          }}
          on:keyup={() => {}}
        >
          ytlee@ucdavis.edu
          <svg
            class="not-check-icon w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <svg
            class="check-icon w-4 h-4 hidden"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m12 15 2 2 4-4" />
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </span>
        <div class="mt-5 italic" style="color: var(--text-1)">
          <div class="font-semibold text-[1.0rem] divide-y">
            <!-- (Currently working as a UX Research Intern at Microsoft. Welcome to
            Connect!) -->
            <p>Recent News:</p>
            <p class="ml-2">
              <span class="text-sm" style="color: var(--text-3)">
                [Nov 2025]
              </span>
              I will be presenting at
              <strong> VIS 2025 </strong>
              on our TVCG paper
              <a
                class="text-sm"
                target="_blank"
                href="https://doi.org/10.1109/TVCG.2024.3459961"
                >"HINTs: Sensemaking on large collections of documents with
                Hypergraph visualization and Intelligent agents".
              </a>
            </p>
            <p class="ml-2">
              <span class="text-sm" style="color: var(--text-3)">
                [Oct 2025]
              </span>
              <a
                class="text-sm"
                target="_black"
                href="https://samlee-dedeboy.github.io/JT_dashboard/"
                >Live Demo</a
              >
              We will participate in an exhibition at
              <a
                href="https://www.sfestuary.org/state-of-the-estuary-conference/"
                >State of the Estuary Conference</a
              >
              in San Francisco on October 27-29, 2025!
              <span class="italic text-sm" style="color: var(--text-2)">
                (Session: Transitions in the Delta: Exploring Adaptation and
                Salinity Management Through Participatory Scenario Planning)
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="flex gap-x-1 mt-1">
        <div>
          <a href="https://www.linkedin.com/in/sam-ytlee" target="_blank"
            ><img
              src="linkedin.svg"
              alt="linkedin"
              class="bg-white outline outline-1 outline-gray-300 shadow-md rounded-sm p-1 hover:bg-gray-200"
            /></a
          >
        </div>
        <a href="https://github.com/SamLee-dedeboy" target="_blank"
          ><img
            src="github.svg"
            alt="github"
            class="bg-white outline outline-1 outline-gray-300 shadow-md rounded-sm p-1 hover:bg-gray-200"
          /></a
        >
        <a
          href="https://scholar.google.com/citations?user=t3aBBfAAAAAJ&amp;hl=en&amp;oi=sra"
          target="_blank"
          ><img
            src="Google_Scholar_logo.svg"
            alt="Google Scholar"
            class="bg-white w-8 h-8 outline outline-1 outline-gray-300 shadow-md rounded-sm p-1 hover:bg-gray-200"
          /></a
        >
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .myself {
    top: --var("top_css");
    left: --var("left_css");
  }

  .paragraph {
  }

  .profile-image-container:hover {
    & .profile-image-hidden {
      display: inline;
    }
    & .profile-image-primary {
      display: none;
    }
  }

  .copy-email {
    color: var(--text-1);
    background: color-mix(in srgb, var(--text-1) 10%, transparent);
    outline: 1px solid color-mix(in srgb, var(--text-1) 25%, transparent);
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .copy-email:hover {
    background: color-mix(in srgb, var(--text-1) 18%, transparent);
  }

  .copy-email:focus {
    & .not-check-icon {
      display: none;
    }
    & .check-icon {
      display: inline;
    }
  }
  @media (max-width: 640px) {
    .content-container {
      flex-direction: column;
      row-gap: 0.25rem;
    }
  }
</style>
