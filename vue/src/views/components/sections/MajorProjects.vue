<template>
<!-- Major Projects -->
<div id="projects" class='section projects'>
    <h2 class=section-header> Major Projects </h2>
    <!-- first part -->
    <div class=section-content>  
        <div class=slot-header-container>
            <span class=slot-header> Career Evolution Visualization </span>
        </div>
        <ul class=bullets>
            <li class=slot-bullet> Using scrollytelling design to visualize the career evolution of an actor or filmmaker, which can be a director, writer or producer. </li>
            <li class=slot-bullet> Skills used: Scraping and preprocessing (beautifulsoup, python), Front-end Development (Vue.js, HTML/CSS), Interactive Visualization (D3.js), Back-end Development (Flask) </li>
            <li class=slot-bullet> Repo: https://github.com/SamLee-dedeboy/CareerEvolution </li>
        </ul>
    </div>
    <!-- second part -->
    <div class=section-content>  
        <div class=slot-header-container>
            <span class=slot-header> Evaluating Graph Layout Readability with GNN </span>
        </div>
        <ul class=bullets>
            <li class=slot-bullet> Evaluates graph layout readability using GNN, as an alternative to CNNs. </li>
            <li class=slot-bullet> The evaluation is based on reconstruction accuracy of GAEs. </li>
            <li class=slot-bullet> Skills used: Pytorch Geometric (PyG) for building GAEs, python for data processing and analysis. </li>
            <li class=slot-bullet> Repo: https://github.com/SamLee-dedeboy/graph_layout_GNN </li>
        </ul>
    </div>
    <!-- third part -->
    <div class=section-content>  
        <div class=slot-header-container>
            <span class=slot-header> Empty Space Skipping methods evaluation in volume rendering </span>
        </div>
        <ul class=bullets>
            <li class=slot-bullet> Developed a system to support interactive volumetric data visualization and performance testing </li>
            <li class=slot-bullet> Implemented and evaluated three empty space skipping methods: (1) Approximated geometry, (2) Octree-based skipping and (3) SparseLeap, proposed by Hadwiger et al., 2017. </li>
            <li class=slot-bullet> Skills used: WebGL, GLSL </li>
            <li class=slot-bullet> Repo: https://github.com/SamLee-dedeboy/AdvancedVisPA </li>
        </ul>
    </div>
</div>
</template>

<script setup lang=ts>
import * as vue from "vue"
/** define section coordinates */
const top = -500*3
const left = (380 - 1500)*3
const top_css = `${top}px`
const left_css = `${left}px`
const max_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const max_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const activators = 
[
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
        }
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
    }
]

defineExpose({
    top,
    left,
    activators,
})

</script>

<style scoped>
.projects {
  top: v-bind('top_css');
  left: v-bind('left_css');
}
</style>