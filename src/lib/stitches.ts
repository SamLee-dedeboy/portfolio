import { writable, derived } from "svelte/store";

// Which stitches on the margin thread the visitor has found in this visit.
// Deliberately not persisted: a refresh starts the trail fresh.
export const STITCH_COUNT = 9;

export const found = writable<Set<number>>(new Set());

export function markFound(i: number) {
  found.update((s) => {
    if (s.has(i)) return s;
    const next = new Set(s);
    next.add(i);
    return next;
  });
}

export const allFound = derived(found, (s) => s.size >= STITCH_COUNT);

/** Whether the margin trail is rendered at all — it needs a real margin, so
 *  narrow viewports (phones, small tablets) go without it. */
export const trailActive = writable(false);
