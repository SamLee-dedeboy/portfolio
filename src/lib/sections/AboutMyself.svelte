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
  <div class="flex gap-x-2">
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
    <div class="max-w-[40rem] flex flex-wrap shrink justify-center">
      <div>
        I'm Sam Yu-Te Lee! I am a phd student at the CS department of University
        of California, Davis, and a member of the <a
          target="”_blank”"
          href="https://vidi.cs.ucdavis.edu"
        >
          VIDI Lab</a
        >, advised by
        <a target="”_blank”" href="https://web.cs.ucdavis.edu/~ma/">
          Prof. Kwan-Liu Ma</a
        >. I am interested in Visual Text Analytics and Human-Computer
        Interaction. The best way to reach me is through email:
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
</style>
