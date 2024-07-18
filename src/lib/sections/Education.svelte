<script lang="ts">
  import EducationEntry from "../components/EducationEntry.svelte";

  /** define section coordinates */
  const top = -500;
  const left = 380 + 1500;
  const top_css = `${top}px`;
  const left_css = `${left}px`;

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
    },
  ];
</script>

<!-- Education -->
<div class="section education">
  <h2 class="">Education</h2>
  <div class="section-content flex flex-col">
    <div class="flex flex-col divide-y">
      <!-- <h3 class="mr-1">Graduate</h3> -->
      <EducationEntry
        school="PhD in Computer Science, University of California, Davis"
        address="Davis, California, USA"
        time_period="April 2023 &#8212 Current"
      ></EducationEntry>
      <EducationEntry
        school="Master of Computer Science, University of California, Davis"
        address="Davis, California, USA"
        time_period="Sept 2021 &#8212 Mar 2023"
      ></EducationEntry>
      <EducationEntry
        school="Bachelor of Science in Computer Science, Nanjing University (南京大學)"
        address="Nanjing, Jiangsu, China"
        time_period="Sept 2016 &#8212 June 2020"
      ></EducationEntry>
      <EducationEntry
        school="Jinling High School (金陵中學)"
        address="Nanjing, Jiangsu, China"
        time_period="Sept 2013 &#8212 June 2016"
      ></EducationEntry>

      <EducationEntry
        school="Middle School Affiliated to Nanjing University of Aeronautics and Astronautics (南京航空航天大學附屬初級中學)"
        address="Nanjing, Jiangsu, China"
        time_period="Sept 2010 &#8212 June 2013"
      ></EducationEntry>
    </div>
  </div>
  <div class="flex flex-col">
    <!-- <h3 class="mr-1">
      Elementary School
    </h3> -->
    <div class="flex flex-col divide-y relative">
      <span
        class="font-normal text-[0.8rem] absolute left-[calc(100%+1rem)] top-1/2 w-full"
        >(Yes I went to three different elementary schools)</span
      >
      <EducationEntry
        school="Nanjing Daguang Road Elementary School (南京市大光路小學)"
        address="Nanjing, Jiangsu, China"
        time_period="Sept 2008 &#8212 June 2010"
      ></EducationEntry>
      <EducationEntry
        school="Shanghai United International School (上海協和雙語學校)"
        address="Shanghai, China"
        time_period="Sept 2006 &#8212 June 2008"
      ></EducationEntry>
      <EducationEntry
        school="Xinghua Elementary School (興華國小)"
        address="Taipei, Taiwan"
        time_period="Sept 2004 &#8212 June 2006"
      ></EducationEntry>
      <!-- <h3 class="mr-1">Kindergarten</h3> -->
      <EducationEntry
        school="??? Kindergarten"
        address="Taipei, Taiwan"
        time_period="rumor has it that I skipped a year in kindergarten"
      ></EducationEntry>
    </div>
  </div>
  <!-- <div class="flex flex-col">
    <h3 class="mr-1">My Whole Life</h3>
    <div class="flex flex-wrap">
      <span> -&nbspRaised and Taught beautifully by my parents,&nbsp </span>
      <span> Sept 1997 &#8212 Current </span>
    </div>
  </div> -->
</div>

<style scoped>
  .education {
    top: v-bind("top_css");
    left: v-bind("left_css");
  }
  span {
  }
</style>
