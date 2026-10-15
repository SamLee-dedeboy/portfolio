<script lang="ts">
  import { fade } from "svelte/transition";
  import { cubicOut, cubicIn } from "svelte/easing";
  import { tick } from "svelte";
  import { rnd, knotPoints, runPath } from "../thread";
  import { charSchedule, READ } from "../prosody";

  /** True once the visitor has found all four stitches on the page. */
  export let complete = false;

  let open = false;

  // ──────────────────────────────────────────────────────────────
  //  Paste the poem text between the backticks below.
  //  Keep one line per line, and leave a blank line between stanzas.
  // ──────────────────────────────────────────────────────────────
  const poemText = `
Our deepest fear is not that we are inadequate.
Our deepest fear is that we are powerful beyond measure.
It is our light not our darkness that most frightens us.
We ask ourselves, who am I to be brilliant, gorgeous, talented and fabulous?

Actually, who are you not to be?
You are a child of God.
Your playing small does not serve the world.
There’s nothing enlightened about shrinking so that other people won’t feel insecure around you.

We were born to make manifest the glory of God that is within us.

It’s not just in some of us; it’s in everyone.
And as we let our own light shine,
we unconsciously give other people permission to do the same.

As we are liberated from our own fear,
Our presence automatically liberates others.`;
  const attribution = "— Marianne Williamson";

  // Passages to emphasize in red. A line is highlighted when it falls inside
  // one of these — robust to however the passage is broken across lines.
  const HIGHLIGHT_PASSAGES = [
    "We ask ourselves, who am I to be brilliant, gorgeous, talented and fabulous?",
    "And as we let our own light shine, we unconsciously give other people permission to do the same.",
  ];
  const isHighlighted = (line: string) => {
    const t = line.trim();
    return t.length > 0 && HIGHLIGHT_PASSAGES.some((p) => p.includes(t));
  };

  // Build a flat list of lines with stanza boundaries. A new stanza starts
  // after a blank line; the first line of each stanza gets a thread node.
  $: flatLines = (() => {
    const stanzas = poemText.trim().split(/\n\s*\n/);
    const out: {
      text: string;
      chars: string[];
      stanzaStart: boolean;
      isAttr: boolean;
      highlight: boolean;
    }[] = [];
    stanzas.forEach((stanza) => {
      stanza.split("\n").forEach((text, li) => {
        out.push({
          text,
          chars: Array.from(text),
          stanzaStart: li === 0,
          isAttr: false,
          highlight: isHighlighted(text),
        });
      });
    });
    out.push({
      text: attribution,
      chars: Array.from(attribution),
      stanzaStart: false,
      isAttr: true,
      highlight: false,
    });
    return out;
  })();

  let textEl: HTMLElement;
  let overlayEl: HTMLElement;
  let btnEl: HTMLElement; // the paper tag the letter grows out of
  let lineEls: HTMLElement[] = [];
  let threadEl: SVGPathElement; // full thread path, for measuring

  let contentHeight = 0;
  let lineTops: number[] = [];
  let lineHeights: number[] = [];
  let charStart: number[][] = []; // per line: ms (from line start) each char begins
  let lineStartT: number[] = []; // ms at which the thread reaches each line

  let progress = 0; // 0..1 along the thread path
  let knotSeed = 1; // re-rolled on every open so no two readings knot alike
  let playing = false;
  let dragging = false;
  let rafId = 0;
  let lastT = 0;

  // ── pacing (see prosody.ts) ────────────────────────────────────
  const EMPHASIS_RATE = 1.15; // the red lines read a little slower
  const READ_RATE = 1; // overall tempo: <1 reads faster, >1 slower
  const FADE_MS = READ.fade;
  const KNOT_MS = 1100;
  const GAP_MS_PER_PX = 10;

  // ── thread geometry ────────────────────────────────────────────
  // Compact mode (phones): narrower thread column, smaller knots and type.
  let compact = false;
  $: CX = compact ? 12 : 16; // thread x inside its column
  $: THREAD_W = compact ? 40 : 60;
  // Knots are prolate trochoids: the curve a pen traces when drawing a loop.
  // r sets the vertical pace, d the loop reach; d > r makes it cross itself.
  $: KNOT_R = compact ? 3.4 : 4.3;
  $: KNOT_D = compact ? 9 : 12;
  const KNOT_SAMPLES = 44;

  let threadD = "";
  let pathLen = 0;
  let sampleMaxY: number[] = []; // running max-y along the path
  let segLen: number[] = [];
  let segDur: number[] = [];
  let phaseLen: number[] = [];
  let phaseDur: number[] = [];
  let totalLen = 0;
  let totalTime = 0;

  // Needle: sits at the thread's end and points along the path tangent.
  let hx = CX;
  let hy = 0;
  let hAngle = 90;
  $: if (threadEl && pathLen) {
    const s = Math.min(pathLen, Math.max(0, progress * pathLen));
    const p = threadEl.getPointAtLength(s);
    hx = p.x;
    hy = p.y;
    const a0 = Math.min(Math.max(0, s - 2), Math.max(0, pathLen - 4));
    const a = threadEl.getPointAtLength(a0);
    const b = threadEl.getPointAtLength(Math.min(pathLen, a0 + 4));
    hAngle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  }

  // Time is the master clock: playback advances it, scrubbing maps path
  // progress back onto it, and every character fades in from its own moment.
  $: elapsedNow = totalLen ? progressToElapsed(progress) : 0;
  $: lineLocalT = flatLines.map((_, i) => elapsedNow - (lineStartT[i] ?? 0));
  $: maskDash = pathLen || 1e6;
  $: maskOffset = pathLen ? pathLen * (1 - progress) : 1e6;

  // ── the trigger is a paper tag: a slip of the letter's stock with a
  // pointed end and an eyelet the thread passes through. The path is the
  // button; the label sits on the tag.
  let btnW = 0;
  let btnH = 0;
  function roundedPoly(pts: [number, number][], r: number): string {
    const n = pts.length;
    const f = (v: number) => v.toFixed(2);
    const P = (i: number) => pts[((i % n) + n) % n];
    let d = "";
    for (let i = 0; i < n; i++) {
      const prev = P(i - 1), cur = P(i), next = P(i + 1);
      const v1 = [prev[0] - cur[0], prev[1] - cur[1]];
      const v2 = [next[0] - cur[0], next[1] - cur[1]];
      const l1 = Math.hypot(v1[0], v1[1]) || 1;
      const l2 = Math.hypot(v2[0], v2[1]) || 1;
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const a = [cur[0] + (v1[0] / l1) * rr, cur[1] + (v1[1] / l1) * rr];
      const b = [cur[0] + (v2[0] / l2) * rr, cur[1] + (v2[1] / l2) * rr];
      d += (i === 0 ? "M " : "L ") + `${f(a[0])} ${f(a[1])} `;
      d += `Q ${f(cur[0])} ${f(cur[1])} ${f(b[0])} ${f(b[1])} `;
    }
    return d + "Z";
  }
  function tagPoints(w: number, h: number, inset: number): [number, number][] {
    const apex = h * 0.52; // how far the pointed end reaches
    const i = inset;
    return [
      [i * 1.6, h / 2],
      [apex, i],
      [w - i, i],
      [w - i, h - i],
      [apex, h - i],
    ];
  }
  $: tagD = btnW && btnH ? roundedPoly(tagPoints(btnW, btnH, 0), 5) : "";
  $: tagRuleD = btnW && btnH ? roundedPoly(tagPoints(btnW, btnH, 3.5), 3) : "";
  $: eyeX = btnH ? btnH * 0.36 : 0;
  $: eyeY = btnH / 2;
  // thread: comes in from the left, makes one loop, and passes through the eyelet
  $: threadMotifD = btnH
    ? `M ${(-34).toFixed(1)} ${(eyeY + 2).toFixed(1)} ` +
      `C ${-28} ${eyeY + 2} ${-25} ${eyeY - 6} ${-20} ${eyeY - 5} ` +
      `C ${-15} ${eyeY - 4} ${-15} ${eyeY + 4} ${-20} ${eyeY + 3} ` +
      `C ${-24} ${eyeY + 2} ${-22} ${eyeY - 3} ${-17} ${eyeY - 1} ` +
      `C ${-12} ${eyeY + 1} ${-6} ${eyeY} ${eyeX.toFixed(1)} ${eyeY.toFixed(1)}`
    : "";

  async function measure() {
    await tick();
    if (!textEl) return;
    contentHeight = textEl.scrollHeight;
    const els = lineEls.filter(Boolean);
    lineTops = els.map((el) => el.offsetTop);
    lineHeights = els.map((el) => el.offsetHeight);
    // Build each line's character timeline from the reading model.
    const starts: number[][] = [];
    const lineDur = flatLines.map((it) => {
      const rate = (it.highlight ? EMPHASIS_RATE : 1) * READ_RATE;
      const sch = charSchedule(it.chars, rate);
      starts.push(sch.starts);
      return sch.total;
    });
    charStart = starts;
    // Time to travel a vertical run: each covered line contributes its share
    // of typing time; uncovered gap pixels move at a steady pace.
    const runDuration = (y0: number, y1: number) => {
      let dur = 0;
      let covered = 0;
      for (let i = 0; i < lineTops.length; i++) {
        const a = Math.max(y0, lineTops[i]);
        const b = Math.min(y1, lineTops[i] + lineHeights[i]);
        if (b > a) {
          dur += (lineDur[i] * (b - a)) / Math.max(1, lineHeights[i]);
          covered += b - a;
        }
      }
      return dur + Math.max(0, y1 - y0 - covered) * GAP_MS_PER_PX;
    };

    // Knots sit centred in the gap above each new paragraph.
    const knotCentres: number[] = [];
    for (let i = 1; i < flatLines.length; i++) {
      if (!flatLines[i].stanzaStart || !els[i]) continue;
      const mt = parseFloat(getComputedStyle(els[i]).marginTop) || 0;
      knotCentres.push(lineTops[i] - mt / 2);
    }

    const f = (n: number) => n.toFixed(2);
    type Seg = { type: "run" | "knot"; y0: number; y1: number; dur: number };
    const segs: Seg[] = [];
    let d = `M ${CX} 0`;
    let y = 0;
    const sl: number[] = [];
    const sd: number[] = [];
    knotCentres.forEach((Yc, k) => {
      const pts = knotPoints(Yc, knotSeed + k * 7, CX, KNOT_R, KNOT_D, KNOT_SAMPLES);
      const yIn = pts[0].y;
      if (yIn > y) {
        const dur = runDuration(y, yIn);
        d += runPath(y, yIn, knotSeed + 101 + k * 3, CX);
        sl.push(yIn - y);
        sd.push(dur);
        segs.push({ type: "run", y0: y, y1: yIn, dur });
        y = yIn;
      }
      let len = 0;
      for (let i = 1; i < pts.length; i++) {
        d += ` L ${f(pts[i].x)} ${f(pts[i].y)}`;
        len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      }
      sl.push(len);
      sd.push(KNOT_MS);
      segs.push({ type: "knot", y0: y, y1: pts[pts.length - 1].y, dur: KNOT_MS });
      y = pts[pts.length - 1].y;
    });
    if (contentHeight > y) {
      const dur = runDuration(y, contentHeight);
      d += runPath(y, contentHeight, knotSeed + 977, CX);
      sl.push(contentHeight - y);
      sd.push(dur);
      segs.push({ type: "run", y0: y, y1: contentHeight, dur });
    }
    // When does the thread reach a given y? (lines never sit inside knots)
    const timeAtY = (yy: number) => {
      let acc = 0;
      for (const sg of segs) {
        if (yy <= sg.y0) return acc;
        if (sg.type === "run" && yy < sg.y1) return acc + runDuration(sg.y0, yy);
        acc += sg.dur;
      }
      return acc;
    };
    lineStartT = lineTops.map((top) => timeAtY(top));
    threadD = d;
    segLen = sl;
    segDur = sd;

    phaseLen = [];
    phaseDur = [];
    let aL = 0;
    let aT = 0;
    for (let i = 0; i < sl.length; i++) {
      phaseLen[i] = aL;
      phaseDur[i] = aT;
      aL += sl[i];
      aT += sd[i];
    }
    totalLen = aL;
    totalTime = aT;

    await tick(); // let <path d={threadD}> render before measuring it
    if (threadEl) {
      pathLen = threadEl.getTotalLength();
      const N = 480;
      const arr = new Array(N + 1);
      let maxy = 0;
      for (let i = 0; i <= N; i++) {
        const py = threadEl.getPointAtLength((i / N) * pathLen).y;
        if (py > maxy) maxy = py;
        arr[i] = maxy;
      }
      sampleMaxY = arr;
    }
  }

  // Map between elapsed time and path progress via the schedule.
  function progressToElapsed(p: number): number {
    const target = Math.min(totalLen, Math.max(0, p * totalLen));
    if (target <= 0) return 0;
    if (target >= totalLen) return totalTime;
    let k = segLen.findIndex((_, i) => target < phaseLen[i] + segLen[i]);
    if (k < 0) k = segLen.length - 1;
    const fr = (target - phaseLen[k]) / segLen[k];
    return phaseDur[k] + fr * segDur[k];
  }
  function elapsedToProgress(e: number): number {
    if (e <= 0 || !totalLen) return 0;
    if (e >= totalTime) return 1;
    let k = segDur.findIndex((_, i) => e < phaseDur[i] + segDur[i]);
    if (k < 0) k = segDur.length - 1;
    const fr = (e - phaseDur[k]) / segDur[k];
    return (phaseLen[k] + fr * segLen[k]) / totalLen;
  }

  function stopPlay() {
    playing = false;
    cancelAnimationFrame(rafId);
  }

  // Gently scroll the overlay so the needle never runs off the bottom.
  function keepNeedleInView() {
    if (!overlayEl || !threadEl || !pathLen) return;
    const ny =
      threadEl.getBoundingClientRect().top +
      threadEl.getPointAtLength(progress * pathLen).y;
    const limit = overlayEl.clientHeight * 0.7;
    if (ny > limit) overlayEl.scrollTop += (ny - limit) * 0.18;
  }

  function startPlay() {
    stopPlay();
    if (!totalTime || !totalLen) return;
    playing = true;
    let elapsed = progressToElapsed(progress);
    lastT = performance.now();
    const step = (t: number) => {
      if (!playing) return;
      elapsed += t - lastT;
      lastT = t;
      progress = elapsedToProgress(elapsed);
      keepNeedleInView();
      if (elapsed >= totalTime) {
        progress = 1;
        playing = false;
        return;
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
  }

  // The letter grows out of the paper tag (and shrinks back into it on close):
  // a FLIP from the tag's on-screen box to the letter's final box.
  function growFromTag(node: HTMLElement) {
    const reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    const to = node.getBoundingClientRect();
    const from = btnEl ? btnEl.getBoundingClientRect() : to;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const sx = from.width / Math.max(1, to.width);
    const sy = from.height / Math.max(1, to.height);
    return {
      duration: reduce ? 0 : 560,
      easing: cubicOut,
      css: (t: number, u: number) =>
        `transform: translate(${dx * u}px, ${dy * u}px) ` +
        `scale(${1 + (sx - 1) * u}, ${1 + (sy - 1) * u}); ` +
        `opacity: ${Math.min(1, 0.35 + t)};`,
    };
  }

  async function openLetter() {
    compact = window.innerWidth < 640;
    open = true;
    progress = 0;
    knotSeed = 1 + Math.floor(Math.random() * 1e6);
    await measure();
    if (overlayEl) overlayEl.scrollTop = 0;
    // font/layout may settle a frame later
    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(measure);
    }
    // playback begins when the paper has landed — see on:introend
  }

  function close() {
    open = false;
    stopPlay();
  }
  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }

  // Scrub: put the thread end at the cursor's height (first point along the
  // path that reaches that y), so dragging feels direct even through knots.
  function seekFromClientY(clientY: number) {
    if (!textEl) return;
    const rect = textEl.getBoundingClientRect();
    const targetY = clientY - rect.top;
    if (!sampleMaxY.length) {
      progress = Math.min(1, Math.max(0, targetY / rect.height));
      return;
    }
    if (targetY >= contentHeight) {
      progress = 1;
      return;
    }
    let lo = 0;
    let hi = sampleMaxY.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sampleMaxY[mid] >= targetY) hi = mid;
      else lo = mid + 1;
    }
    progress = lo / (sampleMaxY.length - 1);
  }
  function onThreadPointerDown(e: PointerEvent) {
    stopPlay();
    dragging = true;
    seekFromClientY(e.clientY);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  }
  function onThreadPointerMove(e: PointerEvent) {
    if (dragging) seekFromClientY(e.clientY);
  }
  function onThreadPointerUp() {
    if (!dragging) return;
    dragging = false;
    // Resume from where the user left off (loop if at the end).
    if (progress >= 0.999) progress = 0;
    startPlay();
  }
</script>

<svelte:window
  on:keydown={onKeydown}
  on:resize={() => {
    compact = window.innerWidth < 640;
    if (open) measure();
  }}
/>

<button
  type="button"
  class="fear-btn"
  class:is-open={open}
  class:complete={complete}
  bind:this={btnEl}
  bind:clientWidth={btnW}
  bind:clientHeight={btnH}
  on:click={openLetter}
>
  <svg
    class="fear-paper"
    viewBox="0 0 {btnW || 1} {btnH || 1}"
    width={btnW || 1}
    height={btnH || 1}
    aria-hidden="true"
  >
    <g class="fear-paper-g">
      <path class="fear-paper-fill" d={tagD} />
      <path class="fear-paper-rule" d={tagRuleD} />
      <circle class="fear-eyelet-ring" cx={eyeX} cy={eyeY} r="4.6" />
      <circle class="fear-eyelet" cx={eyeX} cy={eyeY} r="2.6" />
      <!-- geometry only: the page's margin thread draws this loop as one stroke -->
      <path class="fear-stitch-thread" d={threadMotifD} />
    </g>
  </svg>
  <span class="fear-btn-content">What's our deepest fear</span>
</button>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="fear-overlay"
    role="presentation"
    bind:this={overlayEl}
    on:click={close}
    transition:fade={{ duration: 320 }}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
      class="letter"
      role="dialog"
      aria-modal="true"
      aria-label="A letter"
      on:click|stopPropagation
      transition:growFromTag
      on:introend={startPlay}
    >
      <button
        type="button"
        class="letter-close"
        aria-label="Close"
        in:fade={{ delay: 380, duration: 220 }}
        out:fade={{ duration: 120 }}
        on:click={close}>&times;</button
      >
      <div
        class="letter-body"
        in:fade={{ delay: 360, duration: 320, easing: cubicIn }}
        out:fade={{ duration: 140 }}
      >
        <div class="poem" bind:this={textEl}>
          {#each flatLines as item, i}
            <p
              class="line"
              class:stanza-start={item.stanzaStart}
              class:attribution={item.isAttr}
              class:highlight={item.highlight}
              bind:this={lineEls[i]}
            >{#each item.chars as ch, j}<span
                  class="ch"
                  style="opacity:{Math.min(
                    1,
                    Math.max(
                      0,
                      ((lineLocalT[i] ?? -1) - (charStart[i]?.[j] ?? 0)) /
                        FADE_MS,
                    ),
                  )}">{ch}</span
                >{/each}</p>
          {/each}
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <svg
          class="thread"
          class:grabbing={dragging}
          width={THREAD_W}
          height={contentHeight}
          viewBox="0 0 {THREAD_W} {contentHeight}"
          style="touch-action:none;"
          role="slider"
          aria-label="Reading progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(progress * 100)}
          on:pointerdown={onThreadPointerDown}
          on:pointermove={onThreadPointerMove}
          on:pointerup={onThreadPointerUp}
          on:pointercancel={onThreadPointerUp}
        >
          <defs>
            <mask
              id="fear-thread-reveal"
              maskUnits="userSpaceOnUse"
              x="-20"
              y="-40"
              width="100"
              height={contentHeight + 80}
            >
              <path
                d={threadD}
                fill="none"
                stroke="#fff"
                stroke-width="10"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="stroke-dasharray:{maskDash}; stroke-dashoffset:{maskOffset};"
              />
            </mask>
          </defs>
          <path class="measure" d={threadD} bind:this={threadEl} />
          <line class="guide" x1={CX} y1="0" x2={CX} y2={contentHeight} />
          <g mask="url(#fear-thread-reveal)">
            <path class="cord-shadow" d={threadD} />
            <path class="cord" d={threadD} />
            <path class="cord-twist" d={threadD} />
          </g>
          <g class="needle" transform="translate({hx} {hy}) rotate({hAngle})">
            <circle class="needle-halo" cx="10" cy="0" r="14" />
            <g class="needle-art">
              <path class="needle-shadow" d="M -3.5 0 L 26 0" />
              <path
                class="needle-body"
                d="M -4.5 0 Q -4.5 -2 -2.4 -2 L 13 -1.5 L 27 0 L 13 1.5 L -2.4 2 Q -4.5 2 -4.5 0 Z"
              />
              <path class="needle-gleam" d="M -1.5 -0.85 L 14 -0.6" />
              <ellipse class="needle-eye" cx="0.8" cy="0" rx="2.6" ry="0.9" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  /* trigger: a paper tag — the path is the button, the thread runs
     through its eyelet */
  .fear-btn {
    @apply select-none cursor-pointer;
    position: relative;
    display: inline-block;
    margin-left: 34px; /* balance the thread that trails off to the left */
    padding: 0.62rem 1.1rem 0.62rem 40px;
    font-family:
      "ITC Kabel", "Kabel", "ITC Kabel Std", "Josefin Sans", sans-serif;
    font-size: 0.86rem;
    font-style: italic;
    letter-spacing: 0.02em;
    line-height: 1;
    color: #5e4328;
    background: none;
    border: 0;
    transform: rotate(-1.5deg);
    transition: color 0.18s ease;
  }
  .fear-btn.is-open {
    opacity: 0;
    transition: opacity 0.12s ease;
    pointer-events: none;
  }
  .fear-btn:not(.is-open) {
    transition:
      opacity 0.25s ease 0.4s,
      color 0.18s ease;
  }
  .fear-btn:focus-visible {
    outline: none;
  }
  .fear-paper {
    position: absolute;
    inset: 0;
    overflow: visible;
    pointer-events: none;
    filter: drop-shadow(0 2px 2.5px rgba(0, 0, 0, 0.22));
  }
  .fear-paper-g {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.18s ease;
  }
  .fear-paper-fill {
    fill: #faf4e6;
    stroke: rgba(120, 95, 60, 0.6);
    stroke-width: 1;
    stroke-linejoin: round;
    transition: stroke 0.18s ease;
  }
  .fear-paper-rule {
    fill: none;
    stroke: rgba(120, 95, 60, 0.3);
    stroke-width: 0.5;
  }
  .fear-eyelet-ring {
    fill: none;
    stroke: rgba(120, 95, 60, 0.45);
    stroke-width: 0.7;
  }
  .fear-eyelet {
    fill: var(--theme-color, #fff); /* a hole: the page shows through */
    stroke: rgba(120, 95, 60, 0.75);
    stroke-width: 0.8;
  }
  .fear-btn-content {
    position: relative;
  }
  .fear-btn:hover,
  .fear-btn:focus-visible {
    color: #3a2f22;
  }
  .fear-btn:hover .fear-paper-g,
  .fear-btn:focus-visible .fear-paper-g {
    transform: translateY(-1px);
  }
  .fear-btn:hover .fear-paper-fill,
  .fear-btn:focus-visible .fear-paper-fill {
    stroke: rgba(120, 95, 60, 0.9);
  }
  /* the tag's thread is drawn by the page's margin thread (FourStitches)
     as one continuous stroke; this path only supplies the geometry */
  .fear-stitch-thread {
    fill: none;
    stroke: none;
  }
  .fear-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    padding: 1rem 1.5rem;
    background: rgba(20, 16, 10, 0.55);
    backdrop-filter: blur(2px);
  }

  .letter {
    position: relative;
    width: 100%;
    max-width: 46rem;
    margin: auto;
    padding: 2.5rem 2.25rem 2.25rem 2.75rem;
    background: #faf4e6;
    color: #3a2f22;
    border-radius: 2px;
    font-family:
      "ITC Kabel", "Kabel", "ITC Kabel Std", "Josefin Sans", sans-serif;
    box-shadow:
      0 24px 60px -16px rgba(0, 0, 0, 0.55),
      0 2px 6px rgba(0, 0, 0, 0.12),
      inset 0 0 0 1px rgba(120, 95, 60, 0.18);
  }
  /* letterpress double rule */
  .letter::before,
  .letter::after {
    content: "";
    position: absolute;
    pointer-events: none;
  }
  .letter::before {
    inset: 10px;
    border: 1px solid rgba(120, 95, 60, 0.28);
  }
  .letter::after {
    inset: 14px;
    border: 0.5px solid rgba(120, 95, 60, 0.18);
  }

  .letter-close {
    position: absolute;
    top: 8px;
    right: 14px;
    z-index: 1;
    font-size: 1.5rem;
    line-height: 1;
    color: rgba(90, 70, 45, 0.55);
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  .letter-close:hover {
    color: #3a2f22;
  }

  .letter-body {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .poem {
    flex: 1;
    min-width: 0;
  }
  .line {
    margin: 0;
    font-size: 1.08rem;
    line-height: 1.68;
    letter-spacing: 0.012em;
    text-align: left;
  }
  .ch {
    /* opacity is driven per frame; no transition so scrubbing stays exact */
    transition: none;
  }
  .stanza-start:not(:first-child) {
    margin-top: 1.85rem; /* room for a knot in the gap */
  }
  .highlight {
    color: #c23b2b;
  }
  .attribution {
    margin: 1.4rem 0 0;
    text-align: right;
    font-size: 0.95rem;
    font-style: italic;
    letter-spacing: 0.02em;
    color: rgba(90, 70, 45, 0.85);
  }

  /* ── thread + needle ───────────────────────────────────────── */
  .thread {
    display: block;
    flex-shrink: 0;
    cursor: grab;
    overflow: visible;
  }
  .thread.grabbing {
    cursor: grabbing;
  }
  .measure {
    fill: none;
    stroke: none;
  }
  .guide {
    stroke: rgba(94, 67, 40, 0.12);
    stroke-width: 1;
  }
  .cord-shadow {
    fill: none;
    stroke: rgba(70, 48, 24, 0.18);
    stroke-width: 3.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform: translate(0.6px, 1.1px);
  }
  .cord {
    fill: none;
    stroke: #5e4328;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .cord-twist {
    fill: none;
    stroke: #d9b27a;
    stroke-width: 0.9;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 2 3;
    opacity: 0.7;
  }
  @media (max-width: 640px) {
    .fear-overlay {
      padding: 0.75rem 0.5rem;
    }
    .letter {
      padding: 2rem 0.9rem 1.75rem 1.1rem;
    }
    .letter::before {
      inset: 7px;
    }
    .letter::after {
      inset: 10px;
    }
    .letter-body {
      gap: 0.6rem;
    }
    .line {
      font-size: 0.98rem;
      line-height: 1.6;
      letter-spacing: 0.006em;
    }
    .stanza-start:not(:first-child) {
      margin-top: 1.5rem;
    }
    .attribution {
      margin-top: 1.1rem;
      font-size: 0.88rem;
    }
  }

  /* idle "breathing" halo says: this is something you can grab */
  .needle-halo {
    fill: #c9a070;
    filter: blur(2.5px); /* soft glow, not a disc */
    opacity: 0.2;
    transform-box: fill-box;
    transform-origin: center;
    animation: needle-breathe 2.6s ease-in-out infinite;
    transition: opacity 0.2s ease;
  }
  @keyframes needle-breathe {
    0%,
    100% {
      opacity: 0.1;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.28;
      transform: scale(1.1);
    }
  }
  .needle-art {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.18s ease;
  }
  .thread:hover .needle-halo {
    animation: none;
    opacity: 0.36;
    transform: scale(1.12);
  }
  .thread:hover .needle-art {
    transform: scale(1.07);
  }
  .thread.grabbing .needle-halo {
    animation: none;
    opacity: 0.44;
    transform: scale(0.95);
  }
  .thread.grabbing .needle-art {
    transform: scale(1.1);
  }
  @media (prefers-reduced-motion: reduce) {
    .needle-halo {
      animation: none;
      opacity: 0.25;
    }
  }
  .needle-shadow {
    stroke: rgba(40, 30, 15, 0.26);
    stroke-width: 4;
    stroke-linecap: round;
    transform: translate(0.6px, 1.4px);
  }
  .needle-body {
    fill: #b6bcc4;
    stroke: #3f464f;
    stroke-width: 0.8;
    stroke-linejoin: round;
  }
  .needle-gleam {
    stroke: rgba(255, 255, 255, 0.75);
    stroke-width: 0.6;
    stroke-linecap: round;
  }
  .needle-eye {
    fill: #faf4e6;
    stroke: #3f464f;
    stroke-width: 0.7;
  }
</style>
