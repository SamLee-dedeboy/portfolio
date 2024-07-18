<script setup lang="ts">
import AboutMyself from './sections/AboutMyself.vue';
import Education from './sections/Education.vue';
import MajorProjects from './sections/MajorProjects.vue';
import WorkExperience from './sections/WorkExperience.vue';
</script>
<template>
    <div class="flex flex-col items-left">
        <AboutMyself />
        <MajorProjects/>
        <!-- <WorkExperience/> -->
        <Education/>
    </div>
</template>