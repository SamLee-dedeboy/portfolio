<template>
<!-- Education -->
<div class='section education'>
    <h2 class=section-header> Education </h2>
    <!-- first part -->
    <div class=section-content>  
        <div class=slot-header-container>
            <span class=slot-header> University of California, Davis </span>
            <span class=time-period> Sept 2021 &#8212 Mar 2023</span>
        </div>
        <ul class=bullets>
            <li class=slot-bullet> Master of Science in Computer Science </li>
            <li class=slot-bullet> Working on master’s thesis under the instruction of Prof. Kwan-Liu Ma </li>
            <li class=slot-bullet> Lab: Visualization and Interface Design Innovation (VIDI) Lab</li>
            <li class=slot-bullet> Coursework: Advanced Visualization, AI for visualization, Information Visualization, etc. </li>
        </ul>
    </div>
    <!-- second part -->
    <div class=section-content>  
        <div class=slot-header-container>
            <span class=slot-header> Nanjing, University, China </span>
            <span class=time-period> Sept 2016 &#8212 June 2020</span>
        </div>
        <ul class=bullets>
            <li class=slot-bullet> Bachelor of Science in Computer Science </li>
            <li class=slot-bullet> Awards: Annual Scholarship for Taiwan Students (2017-2020) </li>
        </ul>
    </div>
</div>
</template>

<script setup lang=ts>
/** define section coordinates */
const top = -500
const left = 380 + 1500
const top_css = `${top}px`
const left_css = `${left}px`

/** define activator coordinates */
const activators = [
    // src
    {
        header: "start_to_edu",
        label: "Education",
        src: {
            label: "Education",
            x: 1000,
            y: 300,
            width: 100,
            height: 50,
        },
        dst: {
            label: "Back to start",
            x: left + 600,
            y: top + 250,
            width: 0,
            height: 0,
        },
        // turning_point: {
        //     x: 1000,
        //     y: top,
        // }
        
    },
    // dst
    {
        header: "edu_to_start",
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
    }
]
defineExpose({
    top,
    left,
    activators,
})
</script>

<style scoped>
.education {
  top: v-bind('top_css');
  left: v-bind('left_css');
}
</style>