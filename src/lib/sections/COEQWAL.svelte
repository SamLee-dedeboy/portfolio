<script>
  import ExpandableProject from "../components/ExpandableProject.svelte";
</script>

<ExpandableProject
  imageSrc="coeqwal_logo_outlines.svg"
  imageAlt="COEQWAL - TEMP MARKER"
  title="COEQWAL"
  description="Led by researchers from six UC campuses and California State University Sacramento, COEQWAL provides accessible online tools to help understand how California can support critical water needs in a changing climate. "
  link="https://live-coeqwal-ca.pantheon.berkeley.edu/"
  linkText="Page"
>
  <div
    slot="expandedContent"
    class="flex flex-col border-t border-gray-200 text-sm"
  >
    <div class="mt-2">
      We are building a accessible web-based policy analysis tool. The tool
      allows users to explore inequities in current water management strategies.
    </div>
    <p class="text-gray-600 italic">Ongoing work, to be continued.</p>
  </div>
</ExpandableProject>
