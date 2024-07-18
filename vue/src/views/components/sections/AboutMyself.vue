<template>
<!-- About Myself -->
<div class='section myself w-fit h-fit'>
    <h2 class="section-header w-fit"> About Myself </h2>
    <div class="section-content w-fit flex">
        <div>
            I am a phd student at the CS department of University of California, Davis, 
            <br>
            and a member of the <a href="https://vidi.cs.ucdavis.edu"> VIDi Lab </a>, advised by <a> Prof. Kwan-Liu Ma </a>.
            <br>
            My research interest is in text visualization.
        </div>
    </div>
    <!-- first part -->
    <!-- <div class="section-content w-fit">  
        <div class=slot-header-container>
            <span class=slot-header> Fanatic product creator.  </span>
        </div>
        <span class=paragraph> Creating things is my main motivation for working in the industry and I am willing to go all out for a project.
            <br> I have learned all kinds of languages and frameworks for my projects, including but not limited to: </span>
        <ul class=bullets>
            <li class=slot-bullet> Web Development (Vue.js, d3.js, Flask, WebGL, ES6): </li>
                <ul class=subbullets> 
                    <li> d3.js + Vue.js: <a href=https://github.com/SamLee-dedeboy/MediaBias> https://github.com/SamLee-dedeboy/MediaBias </a> </li>
                    <li> d3.js + Vue.js: <a href=https://github.com/SamLee-dedeboy/CareerEvolution> https://github.com/SamLee-dedeboy/CareerEvolution </a> </li>
                    <li> WebGL + ES6: <a href=https://github.com/SamLee-dedeboy/AdvancedVisPA> https://github.com/SamLee-dedeboy/AdvancedVisPA </a> </li>
                </ul>
            <li class=slot-bullet> Deep Learning (NLP, GAE): </li>
                <ul class=subbullets> 
                    <li> NLP: <a href=https://github.com/SamLee-dedeboy/MediaBias> https://github.com/SamLee-dedeboy/MediaBias </a> </li>
                    <li> GAE: <a href=https://github.com/SamLee-dedeboy/graph_layout_GNN> https://github.com/SamLee-dedeboy/graph_layout_GNN </a> </li>
                </ul>
            <li class=slot-bullet> Mobile Development (iOS) and Test Automation (Android): </li>
                <ul class=subbullets> 
                    <li> iOS: <a href=https://github.com/SamLee-dedeboy/GlobalMetro> https://github.com/SamLee-dedeboy/GlobalMetro </a> </li>
                    <li> Android: Quality Assurance Engineer at Migo (2021.2 - 2021.8)</li>
                </ul>
            <li class=slot-bullet> Desktop Application Development (JavaFX, .NET): </li>
                <ul class=subbullets> 
                    <li> JavaFX <a href=https://github.com/SamLee-dedeboy/java-GourdBrothers> https://github.com/SamLee-dedeboy/java-GourdBrothers </a> </li>
                    <li> .NET <a href=https://github.com/SamLee-dedeboy/Graphics> https://github.com/SamLee-dedeboy/Graphics </a> </li>
                </ul>
        </ul>
        <span> Actively looking for SWE positions related to visualization.  </span>
    </div> -->
</div>
</template>

<script setup lang=ts>
const props = defineProps({
    top: Number,
    left: Number,
})
/** define section coordinates */
// const top = -1000
// const left = 380 
const top_css = `${props.top}px`
const left_css = `${props.left}px`

/** define activator coordinates */
const activators = [
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
            x: props.left || 0 + 260,
            y: props.top,
            width: 0,
            height: 0,
        },
        turning_point: {
            x: 700,
            y: top,
        }
    },
    // dst
    {
        header: "myself_to_start",
        label: "Back to start",
        src: {
            x: props.left || 0 + 50,
            y: props.top,
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
    // top, left,
    activators,
})
</script>

<style scoped>
.myself {
  top: v-bind('top_css');
  left: v-bind('left_css');
}

.paragraph {
    top: 20px;
}
</style>