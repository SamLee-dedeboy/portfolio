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
  <h2 class="section-header">About Myself</h2>
  <div class="content-container flex gap-x-2">
    <div class="profile-image-container w-40 h-40 shrink-0">
      <img
        src="profile_image.jpg"
        alt="profile"
        class="profile-image-primary w-40 h-40"
      />
      <img
        src="profile_image_hidden.jpg"
        alt="profile"
        class="profile-image-hidden hidden w-40 h-40"
      />
      <!-- <span class="whitespace-nowrap text-sm text-gray-400 italic"
        >Sam judging his own intro</span
      > -->
    </div>
    <div class="max-w-[40rem] flex flex-wrap shrink gap-y-1 gap-x-1">
      <div>
        I am a PhD <span class="line-through relative"
          >student <span class="absolute bottom-full left-1/2 -translate-x-1/2"
            >Candidate <span
              class="absolute bottom-1/2 left-[105%] text-[0.7rem] text-gray-600"
              >11/15/2024</span
            ></span
          ></span
        >
        at the CS department of University of California, Davis, and a member of
        the
        <a target="”_blank”" href="https://vidi.cs.ucdavis.edu"> VIDI Lab</a>,
        advised by
        <a target="”_blank”" href="https://web.cs.ucdavis.edu/~ma/">
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
          class="copy-email inline-flex items-center gap-x-1 bg-stone-100 outline outline-1 outline-gray-100 rounded-md px-0.5 hover:bg-green-100"
          tabindex="0"
          role="button"
          on:click={() => {
            copyTextToClipboard("ytlee@ucdavis.edu");
          }}
          on:keyup={() => {}}
        >
          ytlee@ucdavis.edu
          <img src="copy.svg" alt="copy" class="not-check-icon w-4 h-4" />
          <img
            src="copy-check.svg"
            alt="copy"
            class="check-icon w-4 h-4 hidden"
          />
        </span>
        <div class="mt-5 italic text-gray-700">
          <div class="font-semibold text-[1.2rem]">
            I am looking for an internship position for summer 2025.
          </div>
          My recent works have been around human-AI collaboration and large language
          models, and have led multiple projects on this subject. If your organization
          is seeking a self-motivated and collaborative intern, I’d love to connect!
        </div>
      </div>
      <div class="flex gap-x-1">
        <div>
          <a href="https://www.linkedin.com/in/sam-ytlee" target="”_blank”"
            ><img
              src="linkedin.svg"
              alt="linkedin"
              class="outline outline-1 outline-gray-300 shadow-md rounded-sm p-1 hover:bg-gray-200"
            /></a
          >
        </div>
        <a href="https://github.com/SamLee-dedeboy" target="”_blank”"
          ><img
            src="github.svg"
            alt="github"
            class="outline outline-1 outline-gray-300 shadow-md rounded-sm p-1 hover:bg-gray-200"
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
