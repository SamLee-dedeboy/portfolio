<template>
  <div class="playground-container" style="background:white">
    <svg id=playground></svg>
    <div class=page-container top=0 left=0> 
      <WorkExperience ref=work :top="-1000" :left="380" />
      <Education ref=education />
      <MajorProject ref=project />
      <AboutMyself ref=myself />
      <div class=intro> 
        You're at Sam Lee's portfolio world!
      </div>
      <div class=hint> Use &#8592 &#8593 &#8594 &#8595 to move! 
        <br> 
        <h4>Have fun!</h4>
      </div>
      <div class=footnote>
        More features coming soon!
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
import * as d3 from "d3"
import { Ref, ref} from "vue"
import * as vue from "vue"
import { Controller } from "./Controller"
import WorkExperience from "./sections/WorkExperience.vue"
import Education from "./sections/Education.vue"
import MajorProject from "./sections/MajorProjects.vue"
import AboutMyself from "./sections/AboutMyself.vue"

const work: Ref< null | { activators: any }> = ref(null)
const education: Ref< null | { activators: any }> = ref(null)
const project: Ref< null | { activators: any }> = ref(null)
const myself: Ref< null | { activators: any }> = ref(null)
const max_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const max_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
const intro_x = max_width/2.5 + "px"
const intro_y = max_height/2.7 + "px"
const hint_x = max_width/2.3 + "px"
const hint_y = max_height/2.5 + "px"
const footnote_x = max_width/2.4 + "px"
const footnote_y = max_height*0.9 + "px"
vue.onMounted(()=> {
    const controller = new Controller(
        "playground", 
        [work.value?.activators, education.value?.activators, project.value?.activators, myself.value?.activators].flat(),
        // [education.value.activators, myself.value.activators].flat(),
      )
    controller.init()
})

</script>

<style scoped>
/** Page */
.page-container {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 670px;
}

.intro {
  position: absolute;
  left: v-bind('intro_x');
  top: v-bind('intro_y');
  width: max-content;
}

.hint {
  position: absolute;
  left: v-bind('hint_x');
  top: v-bind('hint_y');
  width: max-content;
}

.footnote {
  position: absolute;
  left: v-bind('footnote_x');
  top: v-bind('footnote_y');
  width: max-content;

}
/** Section - general */
.section {
  position: absolute;
  width: 100%;
  padding: 2%;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
}

.time-period {
  width: fit-content;
  right: 2%;
  position: absolute;
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

</style>

