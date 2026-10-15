// Reading-aloud pacing shared by the letter and the margin-thread notes.
// Words take time by length; punctuation and line ends add breaths; every
// character then fades in from its own scheduled moment.

export const READ = {
  wordBase: 110, // ms per word
  perLetter: 42, // ms per letter in the word
  space: 40,
  comma: 240,
  semi: 360,
  end: 480, // . ? !
  dash: 420,
  lineBreak: 260, // breath at an unpunctuated line end
  lineEndExtra: 140, // on top of a sentence-ending pause
  fade: 260, // each character's fade-in
};

export type Schedule = { starts: number[]; total: number };

/** When each character of a line begins to appear (ms from line start). */
export function charSchedule(chars: string[], rate = 1): Schedule {
  const starts: number[] = [];
  let t = 0;
  let j = 0;
  while (j < chars.length) {
    if (chars[j] === "\n") {
      starts.push(t);
      t += READ.lineBreak * rate; // a line break is a breath, not a space
      j++;
      continue;
    }
    if (/\s/.test(chars[j])) {
      starts.push(t);
      t += READ.space * rate;
      j++;
      continue;
    }
    let k = j;
    while (k < chars.length && !/\s/.test(chars[k])) k++;
    const token = chars.slice(j, k);
    const letters = token.filter((c) => /[\p{L}\p{N}]/u.test(c)).length;
    const wordMs = (READ.wordBase + READ.perLetter * Math.max(1, letters)) * rate;
    const per = wordMs / token.length;
    for (let q = 0; q < token.length; q++) {
      starts.push(t);
      t += per;
    }
    const last = token[token.length - 1];
    const pause = /[.?!]/.test(last)
      ? READ.end
      : /[,]/.test(last)
        ? READ.comma
        : /[;:]/.test(last)
          ? READ.semi
          : /[—–]/.test(last)
            ? READ.dash
            : 0;
    t += pause * rate;
    j = k;
  }
  const tail = chars.length ? chars[chars.length - 1] : "";
  t += (/[.?!,;:]/.test(tail) ? READ.lineEndExtra : READ.lineBreak) * rate;
  return { starts, total: Math.max(t, READ.fade + 50) };
}
