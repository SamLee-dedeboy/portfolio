<script>
  import ExpandableProject from "../components/ExpandableProject.svelte";
</script>

<ExpandableProject
  imageSrc="JT.png"
  imageAlt="Just Transition - TEMP MARKER"
  title="Just Transition in the Delta"
  description="A cross-campus research team Investigating adaptation strategies in the Sacramento-San Joaquin Delta under conditions of drought, salinity and sea-level rise"
  link="https://delta-just-transitions-ucdavis.hub.arcgis.com/"
  linkText="Page"
>
  <div
    slot="expandedContent"
    class="flex flex-col border-t border-gray-200 text-sm"
  >
    <div>
      <h3 class="text-sm">
        Latest News:
        <p class="ml-2">
          - We will be holding an exhibition at <a
            href="https://www.sfestuary.org/state-of-the-estuary-conference/"
            >State of the Estuary Conference</a
          >
          in San Francisco on October 27-29, 2025!
        </p>
      </h3>
    </div>
    <div class="mt-2">
      <div class="text-sm italic">Past Events:</div>
      <div class="flex flex-col divide-y gap-y-2">
        <div
          class="flex flex-col outline outline-2 outline-gray-300 rounded px-2 pb-2 mt-2"
        >
          <p class="ml-auto right-0 italic text-gray-600 text-xs">June, 2025</p>
          <div class="font-semibold flex gap-x-2">
            <span>
              We held a second public workshop at the Jean Harvie Community
              Center with ~50 local residents, community leaders, and relevant
              stakeholders.
            </span>
          </div>

          <div class="flex gap-x-2 items-end">
            <div class="flex flex-col py-1 gap-y-1">
              <div class="flex gap-x-2">
                -
                <span>
                  We collected participants' <strong>mental model </strong> on the
                  salinity and water allocation, and visualize the results on-site
                  with an interactive visualization tool.
                </span>
              </div>
              <div class="flex gap-x-2">
                -
                <span>
                  These data are analyzed by the social science team to
                  summarize public opinions and insights.
                </span>
              </div>
              <strong class="italic"> How it works: </strong>
              <div class="flex gap-x-2">
                -
                <span>
                  Participants <strong> draw </strong> their mental models on a piece
                  of paper, and then we scan it to create a digital version of their
                  model using image recognition and visualization tools.
                </span>
              </div>
              <p class="italic text-gray-700">
                A hand-drawn mental model (not the same as the right one):
              </p>
              <img
                src="hand_drawn_mm.png"
                alt="hand drawn mental model"
                class="h-[15rem] rounded-md"
              />
            </div>
            <img
              src="mm.png"
              alt="mental model visualization"
              class="h-[30rem] mt-2 rounded-md"
            />
          </div>
        </div>
        <div class="flex flex-col gap-y-2">
          <div
            class="flex flex-col outline outline-2 outline-gray-300 rounded px-2 py-1 mt-2 gap-y-1"
          >
            <p class="ml-auto right-0 italic text-gray-600 text-xs">
              June, 2024
            </p>
            <div class="font-semibold flex gap-x-2">
              <span>
                We held the first workshop at the Big Break visitors center with
                ~40 participants.
              </span>
            </div>
            <div class="flex gap-x-2">
              -
              <span>
                We created an interactive visualization tool to present the
                pilot interview results that initiated the project.
              </span>
            </div>
            <div class="flex gap-x-2">
              <a
                target="”_blank”"
                class="a-button"
                href="https://samlee-dedeboy.github.io/CaDelta">Live Demo</a
              >
              <span class="italic text-gray-700 mt-0.5">
                (best on 1920x1080 screen)
              </span>
            </div>
            <span class="italic text-gray-700 mt-2">
              Interface Screenshot:
            </span>
            <img src="cadelta.png" alt="CaDelta" class="rounded-md" />
          </div>
        </div>
      </div>
    </div>
  </div>
</ExpandableProject>
