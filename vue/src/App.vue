<script setup lang="ts">
import Playground from "./views/components/Playground.vue"
import Page from "./views/components/Page.vue"
import { Ref, ref } from "vue"
const show_page: Ref<boolean> = ref(true)

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    toggleFullScreen();
  }
}, false);

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
</script>
<template>
  <div class="h-screen flex px-10 pt-10">
    <div class="basis-[30%] h-full flex flex-col p-10 border border-black items-center"> 
      <div class="w-[60%] aspect-square border border-black rounded-full">  </div>
    </div>
    <div class="overflow-scroll h-full flex-grow border border-black">
      <Page v-if="show_page"></Page>
      <Playground v-else/>
    </div>
  </div>
</template>

<style>
.section {
  padding: 2%;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
}

.section-content {
  display: flex;
  flex-direction: column;
  text-align: left;
  /* width: 100%; */
}

.slot-header-container {
  border-bottom: solid 1px black;
}

.slot-header {
  font-weight: bold;
}

.expand {
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  /* transform: scale(1.1); */
  /* transform-origin: center; */
}


@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
