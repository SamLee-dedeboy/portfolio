<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { fade } from "svelte/transition";
  import { knotPoints, runPath, rnd } from "../thread";
  import { charSchedule, READ } from "../prosody";
  import { found, markFound, allFound, trailActive } from "../stitches";

  // ── the trail ──────────────────────────────────────────────────
  // Nine knots on a thread that runs down the page's margin. Each holds a
  // line or two; together they walk the poem's arc and hand the thread to
  // the letter at the bottom of the page.
  type Quote = { text: string; film: string; raw?: boolean };
  type Stitch = {
    anchor: string; // the <h2> this knot sits beside
    offset: number; // px below that heading
    quotes: Quote[];
  };

  const STITCHES: Stitch[] = [
    {
      anchor: "About Myself",
      offset: 380,
      quotes: [
        { text: "“What do you wanna do?” — “I wanna be a shepherd.”", film: "Good Will Hunting", raw: true },
        {
          text: "You got a bullshit answer for everybody. But I ask you a very simple question, and you can't give me a straight answer. Because you don't know.",
          film: "Good Will Hunting",
        },
      ],
    },
    {
      anchor: "Publications",
      offset: 130,
      quotes: [{ text: "It must be exciting to be a fighter, to be totally free.", film: "Crouching Tiger, Hidden Dragon" }],
    },
    {
      anchor: "Publications",
      offset: 620,
      quotes: [
        {
          text: "“You already know what I’m going to tell you.” — “I’m not the One.”",
          film: "The Matrix",
          raw: true,
        },
      ],
    },
    {
      anchor: "Publications",
      offset: 1110,
      quotes: [
        { text: "You're sittin' on a winning lottery ticket…", film: "Good Will Hunting" },
        { text: "…it'd be an insult to us if you're still here in twenty years.", film: "Good Will Hunting" },
      ],
    },
    {
      anchor: "Publications",
      offset: 1600,
      quotes: [
        { text: "You'll never have that kind of relationship in a world where you're afraid to take the first step.", film: "Good Will Hunting" },
      ],
    },
    { anchor: "Projects", offset: 140, quotes: [{ text: "I can only show you the door. You have to walk through it.", film: "The Matrix" }] },
    {
      anchor: "Projects",
      offset: 620,
      quotes: [
        {
          text: "“When will I know I’m ready?” — “You won’t. It’s a leap of faith. That’s all it is, Miles. A leap of faith.”",
          film: "Spider-Verse",
          raw: true,
        },
      ],
    },
    {
      anchor: "Education",
      offset: 40,
      quotes: [
        { text: "Being the One is just like being in love. No one can tell you you're in love — you just know it.", film: "The Matrix" },
      ],
    },
    {
      anchor: "Education",
      offset: 175,
      quotes: [
        {
          text: "Everyone keeps telling me how my story is supposed to go. Nah, Imma do my own thing.",
          film: "Across the Spider-Verse",
        },
      ],
    },
  ];

  // ── geometry ───────────────────────────────────────────────────
  let host: HTMLElement;
  let guideEl: SVGPathElement;
  let W = 0;
  let H = 0;
  let edgeExtra = 0; // from the wrapper's right edge to the paper's (#app) right edge
  let compact = false;
  let pathD = "";
  let pathLen = 0;
  let knots: { x: number; y: number }[] = [];
  let knotExit: number[] = []; // path length at each knot's exit (actual units)
  let ready = false; // first paint done → later sewing animates
  const seed = 1 + Math.floor(Math.random() * 1e6);

  async function measure() {
    if (!host) return;
    const rect = host.getBoundingClientRect();
    W = rect.width;
    H = host.offsetHeight;
    const appRect = document.getElementById("app")?.getBoundingClientRect();
    edgeExtra = appRect ? Math.max(0, appRect.right - rect.right) : 0;
    // The trail needs a real margin to live in; without one it isn't shown.
    compact = window.innerWidth < 980;
    trailActive.set(!compact);
    if (compact) return;
    const x = W + 28; // in the margin
    const R = 4.4;
    const D = 12.5;

    const heads = Array.from(document.querySelectorAll("h2"));
    let prev = -Infinity;
    const ys = STITCHES.map((st) => {
      const h = heads.find((el) => (el.textContent || "").trim().startsWith(st.anchor));
      if (!h) return null;
      // keep knots in page order with room between them
      const y = Math.max(h.getBoundingClientRect().top - rect.top + st.offset, prev + 72);
      prev = y;
      return y;
    });

    // The thread ends where the letter's tag picks it up.
    const tag = document.querySelector(".fear-btn") as HTMLElement | null;
    const tr = tag?.getBoundingClientRect();
    // Exactly where the tag's own thread begins on screen (the tag is rotated
    // and its SVG offset, so read the drawn start point rather than the box).
    let endX = tr ? tr.left - rect.left - 34 : x;
    let endY = tr ? tr.top - rect.top + tr.height / 2 + 2 : H - 40;
    const tagThread = document.querySelector(".fear-stitch-thread") as SVGPathElement | null;
    let tail: { x: number; y: number }[] = []; // the tag's loop, in host coords
    if (tagThread && tagThread.getTotalLength() > 0) {
      const ctm = tagThread.getScreenCTM();
      if (ctm) {
        const L = tagThread.getTotalLength();
        const N = 48;
        for (let k = 0; k <= N; k++) {
          const q = tagThread.getPointAtLength((k / N) * L);
          const sp = new DOMPoint(q.x, q.y).matrixTransform(ctm);
          tail.push({ x: sp.x - rect.left, y: sp.y - rect.top });
        }
        endX = tail[0].x;
        endY = tail[0].y;
      }
    }
    const tagBottom = tr ? tr.bottom - rect.top : endY + 16;

    const f = (n: number) => n.toFixed(2);
    const startY = 0; // the thread hangs from the top of the page
    let d = `M ${f(x)} ${f(startY)}`;
    let y = startY;
    let len = 0; // analytic length so far
    const exits: number[] = [];
    const kp: { x: number; y: number }[] = [];
    ys.forEach((Yc, i) => {
      if (Yc == null) return;
      const pts = knotPoints(Yc, seed + i * 7, x, R, D);
      d += runPath(y, pts[0].y, seed + 101 + i * 3, x);
      len += pts[0].y - y;
      for (let k = 1; k < pts.length; k++) {
        d += ` L ${f(pts[k].x)} ${f(pts[k].y)}`;
        len += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y);
      }
      exits.push(len);
      kp.push({ x, y: Yc });
      y = pts[pts.length - 1].y;
    });
    // Down the margin, under the tag, past its left end, then a U-turn back
    // so the thread arrives at the tag's own thread moving the same way.
    const cubicLen = (p0: number[], p1: number[], p2: number[], p3: number[]) => {
      let l = 0;
      let px = p0[0], py = p0[1];
      for (let k = 1; k <= 32; k++) {
        const t = k / 32, u = 1 - t;
        const bx = u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0];
        const by = u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1];
        l += Math.hypot(bx - px, by - py);
        px = bx; py = by;
      }
      return l;
    };
    const turnY = Math.max(y + 24, endY - 70);
    d += runPath(y, turnY, seed + 977, x);
    len += turnY - y;
    const under = tagBottom + 22;
    const P1 = [endX - 58, under]; // below and left of the tag, heading left
    const A = [[x, turnY], [x, under + 40], [endX + 60, under + 6], P1];
    const B = [P1, [endX - 112, under - 4], [endX - 104, endY], [endX, endY]];
    d += ` C ${f(A[1][0])} ${f(A[1][1])} ${f(A[2][0])} ${f(A[2][1])} ${f(A[3][0])} ${f(A[3][1])}`;
    d += ` C ${f(B[1][0])} ${f(B[1][1])} ${f(B[2][0])} ${f(B[2][1])} ${f(B[3][0])} ${f(B[3][1])}`;
    len += cubicLen(A[0], A[1], A[2], A[3]) + cubicLen(B[0], B[1], B[2], B[3]);
    // …and on through the tag's loop into the eyelet, as one continuous stroke.
    for (let k = 1; k < tail.length; k++) {
      d += ` L ${f(tail[k].x)} ${f(tail[k].y)}`;
      len += Math.hypot(tail[k].x - tail[k - 1].x, tail[k].y - tail[k - 1].y);
    }
    pathD = d;
    knots = kp;
    await tick();
    if (guideEl) {
      pathLen = guideEl.getTotalLength();
      const scale = len ? pathLen / len : 1; // analytic → actual units
      knotExit = exits.map((e) => e * scale);
    }
    if (!ready) requestAnimationFrame(() => requestAnimationFrame(() => (ready = true)));
  }

  let ro: ResizeObserver | undefined;
  const onResize = () => measure();
  onMount(() => {
    measure();
    ro = new ResizeObserver(() => measure());
    ro.observe(host);
    (document as any).fonts?.ready?.then(measure);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    const t = setTimeout(measure, 800); // late images / fonts
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onResize);
    };
  });
  onDestroy(() => {
    ro?.disconnect();
    if (typeof window !== "undefined") window.removeEventListener("resize", onResize);
    cancelAnimationFrame(noteRaf);
  });

  // ── interaction ────────────────────────────────────────────────
  let openIdx: number | null = null;
  let hoverIdx: number | null = null;
  let tagHover = false; // hovering the letter's tag sews the thread all the way to it
  let peelDone = false; // the peel overlay is removed once it has played
  let peelTimer: ReturnType<typeof setTimeout> | undefined;

  function toggle(i: number) {
    if (openIdx === i) {
      openIdx = null;
      return;
    }
    startNoteClock();
    openIdx = i;
    markFound(i);
    peelDone = false;
    clearTimeout(peelTimer);
    peelTimer = setTimeout(() => (peelDone = true), PEEL_MS + 80);
  }
  function closeNow() {
    openIdx = null;
  }
  function onKey(e: KeyboardEvent, i: number) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(i);
    }
  }
  function onWindowKey(e: KeyboardEvent) {
    if (e.key === "Escape") closeNow();
  }
  // the tag lives in another component; watch pointer/focus crossing it
  function onWindowOver(e: Event) {
    const t = e.target as Element | null;
    if (t?.closest?.(".fear-btn")) tagHover = true;
  }
  function onWindowOut(e: MouseEvent | FocusEvent) {
    const t = e.target as Element | null;
    if (!t?.closest?.(".fear-btn")) return;
    const to = (e as MouseEvent).relatedTarget as Element | null;
    if (!to?.closest?.(".fear-btn")) tagHover = false;
  }
  function onWindowClick(e: MouseEvent) {
    if (openIdx == null) return;
    const t = e.target as Element | null;
    if (t?.closest(".st-knot, .st-note")) return;
    closeNow();
  }

  // ── the note reads itself aloud, like the letter ───────────────
  let noteT0 = 0;
  let noteElapsed = 0;
  let noteRaf = 0;
  function startNoteClock() {
    cancelAnimationFrame(noteRaf);
    noteT0 = performance.now();
    noteElapsed = 0;
    const step = (t: number) => {
      noteElapsed = t - noteT0;
      if (openIdx != null && noteElapsed < noteTotal + 400) noteRaf = requestAnimationFrame(step);
    };
    noteRaf = requestAnimationFrame(step);
  }
  const NOTE_RATE = 0.85;
  const QUOTE_GAP = 520;
  $: noteQuotes =
    openIdx != null
      ? STITCHES[openIdx].quotes.map((q) => ({
          ...q,
          // an exchange breaks at the dash, so the reply sits on its own line
          chars: Array.from(
            q.raw ? q.text.replace(/\s\u2014\s/g, "\n\u2014 ") : `“${q.text}”`,
          ),
        }))
      : [];
  $: noteSched = (() => {
    let t = 0;
    let t0 = REVEAL_DELAY;
    return noteQuotes.map((q) => {
      const sch = charSchedule(q.chars, NOTE_RATE);
      const start = t + t0;
      t0 = 0;
      t = start + sch.total + QUOTE_GAP;
      return { start, starts: sch.starts, end: start + sch.total };
    });
  })();
  $: noteTotal = noteSched.length ? noteSched[noteSched.length - 1].end : 0;
  const op = (t: number) => Math.min(1, Math.max(0, t / READ.fade));

  // ── the note is a hole torn in the page ───────────────────────
  let noteW = 0;
  let noteH = 0;
  const PAD = 10; // how far the tear may stray outside the text box
  // The tear's top, left and bottom are jagged; its right side is the page's
  // own edge, so the fill runs straight there and the rim/shadow stop short.
  function tornPaths(w: number, h: number, sd: number): { fill: string; open: string } {
    const pts: [number, number][] = [];
    const step = 11;
    let n = 0;
    const jag = () => (rnd(sd + n++) - 0.5) * 7;
    for (let x = w; x >= 0; x -= step) pts.push([x, jag()]); // top, right → left
    for (let y = step; y <= h; y += step) pts.push([jag(), y]); // left, down
    for (let x = step; x <= w; x += step) pts.push([x, h + jag()]); // bottom, left → right
    const f = ([x, y]: [number, number]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
    const open = "M " + pts.map(f).join(" L ");
    const fill = open + ` L ${w.toFixed(1)} ${h.toFixed(1)} L ${w.toFixed(1)} 0 Z`;
    return { fill, open };
  }
  $: tear =
    noteW && noteH && openIdx != null
      ? tornPaths(noteW, noteH, seed + 31 * (openIdx + 1))
      : { fill: "", open: "" };
  // The peel is a corner fold: the piece lifts at its top-right corner and
  // folds diagonally over itself (its pale back showing) until it has turned
  // clear of the hole — like turning the corner of a page.
  const PEEL_MS = 1300;
  const REVEAL_DELAY = 520; // the quote starts reading once the corner has lifted
  const easeFold = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function foldGeometry(w: number, h: number, p: number) {
    const D = Math.hypot(w, h) || 1;
    const d = [-w / D, h / D]; // from the top-right corner toward bottom-left
    const u = [-d[1], d[0]]; // along the fold line
    const t = p * D;
    const C = [w + d[0] * t, d[1] * t]; // a point on the fold line
    const L = 4 * D;
    // the part still lying flat: beyond the fold line (SVG user space)
    const keep: number[][] = [
      [C[0] + u[0] * L, C[1] + u[1] * L],
      [C[0] - u[0] * L, C[1] - u[1] * L],
      [C[0] - u[0] * L + d[0] * L, C[1] - u[1] * L + d[1] * L],
      [C[0] + u[0] * L + d[0] * L, C[1] + u[1] * L + d[1] * L],
    ];
    // reflection across the fold line: P' = P − 2((P−C)·n)n with n = d
    const [nx, ny] = d;
    const cn = C[0] * nx + C[1] * ny;
    const a = 1 - 2 * nx * nx, b = -2 * nx * ny, c = -2 * nx * ny, dd = 1 - 2 * ny * ny;
    const e = 2 * cn * nx, f = 2 * cn * ny;
    const px = (n: number) => n.toFixed(2);
    return {
      keepSvg: keep.map(([x, y]) => `${px(x)},${px(y)}`).join(" "),
      // the same half-plane in the peel element's own coordinates (user + PAD)
      keepCss: keep.map(([x, y]) => `${px(x + PAD)}px ${px(y + PAD)}px`).join(", "),
      // the reflection as a CSS matrix about the element's top-left corner
      matrixCss: `matrix(${[a, b, c, dd, e + PAD - (a * PAD + c * PAD), f + PAD - (b * PAD + dd * PAD)].map((v) => v.toFixed(4)).join(", ")})`,
      crease: { x: C[0], y: C[1], deg: (Math.atan2(d[1], d[0]) * 180) / Math.PI, len: L },
    };
  }
  $: foldP = easeFold(Math.min(1, Math.max(0, noteElapsed / PEEL_MS)));
  $: foldG = foldGeometry(noteW || 1, noteH || 1, foldP);
  $: foldFade = foldP < 0.72 ? 1 : Math.max(0, 1 - (foldP - 0.72) / 0.28);

  $: sewnTarget = $allFound
    ? pathLen
    : Math.max(0, ...[...$found].map((i) => knotExit[i] ?? 0));
  $: sewnOffset = pathLen ? pathLen - sewnTarget : 1e6;
  // hovering a knot sews provisionally from the thread's current end through it
  $: hoverTarget = tagHover
    ? pathLen
    : hoverIdx != null
      ? Math.max(sewnTarget, knotExit[hoverIdx] ?? 0)
      : sewnTarget;
  $: hoverOffset = pathLen ? pathLen - hoverTarget : 1e6;
  let prevHover = 0;
  let hoverDur = 0;
  $: {
    const delta = Math.abs(hoverTarget - prevHover);
    hoverDur = ready ? Math.min(1600, Math.max(350, (delta / 1400) * 1000)) : 0;
    prevHover = hoverTarget;
  }
  let prevTarget = 0;
  let sewnDur = 0;
  $: {
    const delta = Math.abs(sewnTarget - prevTarget);
    sewnDur = ready ? Math.min(2800, Math.max(500, (delta / 700) * 1000)) : 0;
    prevTarget = sewnTarget;
  }
  // one credit per note; films listed once each, in order
  $: noteCredit =
    openIdx != null
      ? [...new Set(STITCHES[openIdx].quotes.map((q) => q.film))].join(" \u00b7 ")
      : "";
  $: noteLeft = openIdx != null && knots[openIdx] ? Math.max(8, knots[openIdx].x - 312) : 8;
  $: noteWidth = Math.max(240, W + edgeExtra - noteLeft); // out to the paper's edge
  $: noteTop = openIdx != null && knots[openIdx] ? knots[openIdx].y - 26 : 0;
</script>

<svelte:window
  on:keydown={onWindowKey}
  on:click={onWindowClick}
  on:mouseover={onWindowOver}
  on:mouseout={onWindowOut}
  on:focusin={onWindowOver}
  on:focusout={onWindowOut}
/>

<div class="stitches" bind:this={host}>
  {#if !compact}
  <svg class="st-svg" width={W || 1} height={H || 1} viewBox="0 0 {W || 1} {H || 1}" aria-hidden="true">
    <defs>
      <mask id="stitches-sewn" maskUnits="userSpaceOnUse" x="-80" y="-80" width={W + 160} height={H + 160}>
        <path
          d={pathD}
          fill="none"
          stroke="#fff"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="stroke-dasharray:{pathLen || 1e6}; stroke-dashoffset:{sewnOffset}; transition-duration:{sewnDur}ms;"
        />
      </mask>
      <mask id="stitches-hover" maskUnits="userSpaceOnUse" x="-80" y="-80" width={W + 160} height={H + 160}>
        <path
          d={pathD}
          fill="none"
          stroke="#fff"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="stroke-dasharray:{pathLen || 1e6}; stroke-dashoffset:{hoverOffset}; transition-duration:{hoverDur}ms;"
        />
      </mask>
    </defs>
    <path class="st-guide" d={pathD} bind:this={guideEl} />
    <g mask="url(#stitches-hover)">
      <path class="st-cord-shadow" d={pathD} />
      <path class="st-cord" d={pathD} />
      <path class="st-twist" d={pathD} />
    </g>
    <g mask="url(#stitches-sewn)">
      <path class="st-cord-shadow" d={pathD} />
      <path class="st-cord" d={pathD} />
      <path class="st-twist" d={pathD} />
    </g>
  </svg>

  {#each knots as k, i}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <svg
      class="st-knot"
      class:found={$found.has(i)}
      class:open={openIdx === i}
      style="left:{k.x - 30}px; top:{k.y - 30}px;"
      width="60"
      height="60"
      viewBox="{k.x - 30} {k.y - 30} 60 60"
      role="button"
      tabindex="0"
      aria-label="Stitch {i + 1}"
      aria-expanded={openIdx === i}
      on:click|stopPropagation={() => toggle(i)}
      on:keydown={(e) => onKey(e, i)}
      on:mouseenter={() => (hoverIdx = i)}
      on:mouseleave={() => (hoverIdx = null)}
      on:focus={() => (hoverIdx = i)}
      on:blur={() => (hoverIdx = null)}
    >
      <circle class="st-hit" cx={k.x + 10} cy={k.y} r="26" />
    </svg>
  {/each}

  {#if openIdx != null}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <aside
      class="st-note"
      style="left:{noteLeft}px; top:{noteTop}px; width:{noteWidth}px;"
      bind:clientWidth={noteW}
      bind:clientHeight={noteH}
      transition:fade={{ duration: 140 }}
    >
      <svg
        class="st-tear"
        style="left:{-PAD}px; top:{-PAD}px;"
        width={noteW + PAD * 2}
        height={noteH + PAD * 2}
        viewBox="{-PAD} {-PAD} {noteW + PAD * 2} {noteH + PAD * 2}"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="st-tear-clip"><path d={tear.fill} /></clipPath>
          <filter id="st-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="table" tableValues="0 0.55" /></feComponentTransfer>
          </filter>
          <filter id="st-edge-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          <!-- texture and shadow dissolve toward the paper's edge, where the
               hole simply becomes the desk -->
          <linearGradient id="st-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#fff" />
            <stop offset="0.55" stop-color="#fff" />
            <stop offset="1" stop-color="#000" />
          </linearGradient>
          <mask id="st-fade-mask" maskUnits="userSpaceOnUse" x={-PAD} y={-PAD} width={noteW + PAD * 2} height={noteH + PAD * 2}>
            <rect x={-PAD} y={-PAD} width={noteW + PAD * 2} height={noteH + PAD * 2} fill="url(#st-fade)" />
          </mask>
        </defs>
        <!-- the layer underneath the page -->
        <path class="st-under" d={tear.fill} />
        <g mask="url(#st-fade-mask)">
          <g clip-path="url(#st-tear-clip)">
            <rect class="st-grain" x={-PAD} y={-PAD} width={noteW + PAD * 2} height={noteH + PAD * 2} filter="url(#st-grain)" />
            <!-- the page's torn edge casts a shadow into the hole -->
            <path class="st-edge-shadow" d={tear.open} filter="url(#st-edge-blur)" />
          </g>
          <!-- fibrous rim of the tear -->
          <path class="st-rim" d={tear.open} />
        </g>
      </svg>
      <!-- the torn-off piece of page, turning over from its top-right corner.
           Three layers so each frame is cheap: the flat remainder (a simple
           clip), a static gradient for the crease, and the folded part as an
           element whose content never changes — only its transform does, so
           its shadow is blurred once and composited. -->
      {#if !peelDone}
        <div class="st-peel" style="left:{-PAD}px; top:{-PAD}px; width:{noteW + PAD * 2}px; height:{noteH + PAD * 2}px;">
          <svg
            class="st-flat"
            width={noteW + PAD * 2}
            height={noteH + PAD * 2}
            viewBox="{-PAD} {-PAD} {noteW + PAD * 2} {noteH + PAD * 2}"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="st-peel-clip"><path d={tear.fill} /></clipPath>
              <clipPath id="st-keep"><polygon points={foldG.keepSvg} /></clipPath>
              <linearGradient id="st-crease-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#000" stop-opacity="0" />
                <stop offset="0.5" stop-color="#000" stop-opacity="0.22" />
                <stop offset="1" stop-color="#000" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g clip-path="url(#st-peel-clip)">
              <g clip-path="url(#st-keep)">
                <path class="st-flap-paper" d={tear.fill} />
                <path class="st-flap-rim" d={tear.open} />
                <!-- the fold's shadow across the flat part -->
                <rect
                  x="-8"
                  y={-foldG.crease.len}
                  width="16"
                  height={foldG.crease.len * 2}
                  fill="url(#st-crease-grad)"
                  transform="translate({foldG.crease.x.toFixed(2)} {foldG.crease.y.toFixed(2)}) rotate({foldG.crease.deg.toFixed(2)})"
                />
              </g>
            </g>
          </svg>
          <!-- the folded-over part: the back of the sheet, mirrored across the fold -->
          <div class="st-foldclip" style="clip-path: polygon({foldG.keepCss}); opacity:{foldFade};">
            <svg
              class="st-foldsvg"
              style="transform:{foldG.matrixCss};"
              width={noteW + PAD * 2}
              height={noteH + PAD * 2}
              viewBox="{-PAD} {-PAD} {noteW + PAD * 2} {noteH + PAD * 2}"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="st-fold-tear"><path d={tear.fill} /></clipPath>
              </defs>
              <g clip-path="url(#st-fold-tear)">
                <path class="st-flap-back" d={tear.fill} />
                <path class="st-flap-rim" d={tear.open} />
              </g>
            </svg>
          </div>
        </div>
      {/if}
      {#each noteQuotes as q, j (openIdx + ":" + j)}
        <figure class="st-quote st-body">
          <blockquote
            >{#each q.chars as ch, c}{#if ch === "\n"}<br />{:else}<span
                  class="ch"
                  style="opacity:{op(noteElapsed - noteSched[j].start - noteSched[j].starts[c])}">{ch}</span
                >{/if}{/each}</blockquote
          >
        </figure>
      {/each}
      <p class="st-credit st-body" style="opacity:{op(noteElapsed - noteTotal + 120)}">{noteCredit}</p>
    </aside>
  {/if}
  {/if}
</div>

<style lang="postcss">
  .stitches {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
  }
  .st-svg {
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
  }
  .st-guide {
    fill: none;
    stroke: color-mix(in srgb, var(--text-3) 38%, transparent);
    stroke-width: 1;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  /* twine: shadow, strand, flecks — the same three layers on the thread
     and on every tied knot, so the texture never breaks at a loop */
  .st-cord-shadow {
    fill: none;
    stroke: color-mix(in srgb, var(--text-1) 12%, transparent);
    stroke-width: 3.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform: translate(0.6px, 1.1px);
  }
  .st-cord {
    fill: none;
    stroke: color-mix(in srgb, var(--text-3) 80%, var(--theme-color));
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .st-twist {
    fill: none;
    stroke: color-mix(in srgb, var(--theme-color) 82%, var(--text-1));
    stroke-width: 0.9;
    stroke-linecap: round;
    stroke-dasharray: 2 3;
    opacity: 0.8;
  }
  .st-svg mask path {
    transition-property: stroke-dashoffset;
    transition-timing-function: ease-in-out;
  }

  /* knots */
  .st-knot {
    position: absolute;
    overflow: visible;
    pointer-events: all;
    cursor: pointer;
    outline: none;
  }
  .st-hit {
    fill: transparent;
  }
  /* hover is drawn by the thread itself: see #stitches-hover */
  .st-knot:focus-visible .st-hit {
    stroke: var(--pair-color);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }
  @media (prefers-reduced-motion: reduce) {
    .st-svg mask path {
      transition: none;
    }
    .st-peel {
      display: none;
    }
  }

  /* the note: a hole torn in the page, something found underneath */
  .st-note {
    position: absolute;
    width: 296px;
    max-width: calc(100vw - 24px);
    padding: 1rem 1.15rem 0.85rem;
    pointer-events: all;
    z-index: 20;
    color: var(--text-1);
    font-family:
      "ITC Kabel", "Kabel", "ITC Kabel Std", "Josefin Sans", sans-serif;
  }
  .st-body {
    max-width: 300px;
  }
  /* the peel: a corner fold, driven per frame from the note's clock */
  .st-peel {
    position: absolute;
    pointer-events: none;
    z-index: 3;
    /* the mirrored piece swings far outside while it turns; keep that from
       counting as page overflow (it would flash a horizontal scrollbar) */
    overflow: clip;
  }
  .st-flat {
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
  }
  .st-foldclip {
    position: absolute;
    inset: 0;
    will-change: clip-path, opacity;
  }
  .st-foldsvg {
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    transform-origin: 0 0;
    will-change: transform;
    /* content is static, so this is blurred once and then just composited */
    filter: drop-shadow(-3px 4px 5px rgba(0, 0, 0, 0.3));
  }
  .st-flap-back {
    /* the back of the sheet: a touch paler than its face */
    fill: color-mix(in srgb, var(--bg-surface) 82%, #fff);
  }
  .st-flap-paper {
    fill: var(--bg-surface);
  }
  .st-flap-rim {
    fill: none;
    stroke: color-mix(in srgb, var(--bg-surface) 55%, #fff);
    stroke-width: 1.2;
    stroke-linejoin: round;
  }
  .st-tear {
    position: absolute;
    overflow: visible;
    pointer-events: none;
    z-index: -1;
  }
  .st-under {
    /* the page is a sheet (#app) lying on the desk (body): tearing the sheet
       shows the desk, so this is exactly the body's colour */
    fill: var(--theme-color);
  }
  .st-grain {
    opacity: 0.16;
    mix-blend-mode: multiply;
  }
  .st-edge-shadow {
    fill: none;
    stroke: rgba(0, 0, 0, 0.42);
    stroke-width: 9;
  }
  .st-rim {
    fill: none;
    stroke: color-mix(in srgb, var(--bg-surface) 55%, #fff);
    stroke-width: 1.4;
    stroke-linejoin: round;
  }
  .st-body {
    position: relative; /* above the tear (z -1), below the peel (z 3) */
  }
  .st-quote {
    margin: 0 0 0.7rem;
  }
  .st-quote:last-child {
    margin-bottom: 0;
  }
  .st-quote blockquote {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.55;
  }
  .ch {
    transition: none;
  }
  .st-credit {
    margin: 0.35rem 0 0;
    text-align: right;
    font-size: 0.68rem;
    font-style: italic;
    letter-spacing: 0.04em;
    color: var(--text-3);
  }
</style>
