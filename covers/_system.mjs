// THE SYSTEM. Decided BEFORE any element exists, and every element instantiated from it.
//
// 2026-08-05, Sotiris: "try to create an ecosystem - not just a thing - that's the missing point."
// He was right, and the diagnosis is precise: every check in _critique.mjs counts INVENTORY
// (how many sizes, how many colours, how many overlaps) and not one of them asks whether any
// element RELATES to any other. A poster can clear the whole floor while its headline, legend,
// ribbon and numeral each look like a different designer made them.
//
// One correction to his framing, because it changes the fix: the failure was never speed. Twelve
// concepts and five render passes is not rushing. It was ORDER - elements were designed one at a
// time and assembled, rather than derived from a system. So the fix is sequencing, not slowness,
// and this file is the sequence: nothing gets a value that is not declared here.

/* ---------------------------------------------------------------- TYPE: one ratio, no exceptions
   Base 30 because FLOOR_FEED.minSmallestType is 30 - below that LinkedIn's ~3x downscale turns
   type into decoration. Ratio 1.5 (a perfect fifth). Five arbitrary sizes read as five decisions;
   five sizes off one ratio read as one decision applied five times. That is the whole difference. */
export const RATIO = 1.5;
export const SCALE = [30, 45, 68, 102, 152, 228];

/* ------------------------------------------------------------------- SPACE: one unit, multiplied */
export const UNIT = 8;
export const SPACE = [8, 16, 24, 32, 48, 64, 96, 128];

/* ------------------------------------------------- FACES: he asked for more than one. Each has a
   JOB. A fourth face with no job is decoration; a fourth face with a job is a voice. */
export const FACES = {
  argument: `'Playfair Display', serif`,      // the claim. Display only, once per canvas.
  machine:  `'Archivo Narrow', sans-serif`,   // labels, numerals, anything the system says.
  human:    `'Geist', sans-serif`,            // body copy. The reading voice.
  verdict:  `'Bricolage Grotesque', sans-serif`, // exactly ONE mark on the canvas. The answer.
};

/* ------------------------------------------------------------------------------------- PALETTE
   Not "five colours" - a stated relationship. Three warm inks on one hue axis (ember darkens to
   clay darkens to ink) plus a single cool note reserved for the machine. Any sixth value has to
   justify itself against that sentence, which is what stops a palette becoming a swatch pile. */
export const INK = {
  paper: '#F2EDE4',   // ground
  ink:   '#1A1512',   // the darkest point of the warm axis
  ember: '#C4570A',   // the accent. 4.2:1 on paper - large type and grounds only.
  clay:  '#7E3F1F',   // ember, darkened and desaturated. Refusal.
  slate: '#33403F',   // the one cool note. The machine, and only the machine.
};

/* ------------------------------------------------------------- GEOMETRY: one weight, one corner */
export const STROKE = 3;
export const RADIUS = 0;

// Roles, so the coherence gate can check that colour carries meaning rather than mood.
export const ROLE = {
  person:  { bg: INK.paper, fg: INK.ink,   num: INK.ember },
  machine: { bg: INK.slate, fg: INK.paper, num: INK.ember },
  gate:    { bg: INK.ember, fg: INK.paper, num: INK.ink   },
};
