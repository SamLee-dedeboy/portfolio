import { writable, derived } from "svelte/store";

// Which stitches on the margin thread a visitor has found. Persisted so the thread
// stays sewn when they come back.
const KEY = "stitches.v2";
export const STITCH_COUNT = 10;

function load(): Set<number> {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(arr) ? arr.filter((n) => typeof n === "number") : []);
  } catch {
    return new Set();
  }
}

export const found = writable<Set<number>>(
  typeof localStorage !== "undefined" ? load() : new Set(),
);

export function markFound(i: number) {
  found.update((s) => {
    if (s.has(i)) return s;
    const next = new Set(s);
    next.add(i);
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {
      /* storage unavailable — progress just won't persist */
    }
    return next;
  });
}

export const allFound = derived(found, (s) => s.size >= STITCH_COUNT);
