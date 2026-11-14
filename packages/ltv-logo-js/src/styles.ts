import { COLORS, LOGO_CLASS, MAX_SIZE, STYLE_ELEMENT_ID } from './constants.js';
import type { LogoLetter } from './constants.js';

interface Shape {
  transform: string;
  x: string;
  y: string;
}

/** Offset in SVG user units, used with the CSS `translate` property. */
type Offset = readonly [x: number, y: number];

interface LetterStyle {
  color: string;
  /** Resting transform (the brand mark pose), also the 40% pulse keyframe. */
  transform: string;
  /** Transform at 0% / 80% / 100% of the pulse animation. */
  transformTo: string;
  /** Long bar (`rect:first-child`) and short bar (`rect:last-child`). */
  shapes: [Shape, Shape];
  /** Where the letter comes from in `assemble` (+ tilt in degrees). */
  enter: { from: Offset; rotate: number; delay: number };
  /** Drift target and period for `float`. */
  float: { to: Offset; duration: number };
  /** Delay for `wave`. */
  waveDelay: number;
  /** Offset on hover / focus for `hover`. */
  spread: Offset;
}

const LONG_BAR_WIDTH = '100px';
const SHORT_BAR_WIDTH = '60px';
const BAR_HEIGHT = '20px';
const BAR_RADIUS = '10px';
const GLOBAL_OFFSET = '-10px';
const PULSE_DURATION = '1.5s';

/** Strong ease-out: entrances and hover feedback. */
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
/** Strong ease-in-out: on-screen movement (wave). */
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

const LETTERS: Record<LogoLetter, LetterStyle> = {
  L: {
    color: COLORS.blue,
    transform: 'translate(10px, 33px)',
    transformTo: 'translate(20px, 33px)',
    shapes: [
      {
        transform:
          'translate(42px, 42px) rotate(-135deg) translate(-42px, -42px)',
        x: '-7px',
        y: '32px'
      },
      {
        transform:
          'translate(57px, 86px) rotate(-45deg) translate(-57px, -86px)',
        x: '27px',
        y: '76px'
      }
    ],
    enter: { from: [-48, 0], rotate: -12, delay: 0 },
    float: { to: [-3, 4], duration: 3.6 },
    waveDelay: 0,
    spread: [-5, 0]
  },
  T: {
    color: COLORS.green,
    transform: 'translate(67px, 72px)',
    transformTo: 'translate(49px, 63px)',
    shapes: [
      {
        transform:
          'translate(42px, 42px) rotate(135deg) translate(-42px, -42px)',
        x: '-7px',
        y: '32px'
      },
      {
        transform:
          'translate(57px, 56px) rotate(45deg) translate(-57px, -56px)',
        x: '27px',
        y: '46px'
      }
    ],
    enter: { from: [28, 40], rotate: -12, delay: 180 },
    float: { to: [3, 3], duration: 3.9 },
    waveDelay: 240,
    spread: [4, 4]
  },
  V: {
    color: COLORS.yellow,
    transform: 'translate(57px, 16px)',
    transformTo: 'translate(49px, 34px)',
    shapes: [
      {
        transform:
          'translate(71px, 42px) rotate(135deg) translate(-71px, -42px)',
        x: '21px',
        y: '32px'
      },
      {
        transform:
          'translate(28px, 56px) rotate(45deg) translate(-28px, -56px)',
        x: '-1px',
        y: '46px'
      }
    ],
    enter: { from: [36, -36], rotate: 12, delay: 90 },
    float: { to: [3, -4], duration: 4.2 },
    waveDelay: 120,
    spread: [4, -4]
  }
};

/** Scale + offset for each `size-N` class (index 0 → size-1). */
const SIZE_TRANSFORMS: readonly string[] = [
  'scale(0.1) translate(-1400px, -740px)',
  'scale(0.2) translate(-620px, -340px)',
  'scale(0.3) translate(-360px, -200px)',
  'scale(0.4) translate(-240px, -140px)',
  'scale(0.5) translate(-160px, -100px)',
  'scale(0.6) translate(-110px, -70px)',
  'scale(0.7) translate(-80px, -50px)',
  'scale(0.8) translate(-50px, -30px)',
  'scale(0.9) translate(-20px, -20px)',
  'scale(1) translate(-10px, -10px)'
];

const ORDER: readonly LogoLetter[] = ['L', 'T', 'V'];
const root = `svg.${LOGO_CLASS}`;
const variant = (name: string) => `${root}.logo-anim-${name}`;
const px = ([x, y]: Offset) => `${x}px ${y}px`;
const ms = (value: number) => `${value}ms`;

function rule(selector: string, declarations: Record<string, string>): string {
  const body = Object.entries(declarations)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

function keyframes(
  name: string,
  frames: Record<string, Record<string, string>>
): string {
  const body = Object.entries(frames)
    .map(([offset, declarations]) => {
      const lines = Object.entries(declarations)
        .map(([prop, value]) => `    ${prop}: ${value};`)
        .join('\n');
      return `  ${offset} {\n${lines}\n  }`;
    })
    .join('\n');
  return `@keyframes ${name} {\n${body}\n}`;
}

// ---------------------------------------------------------------------------
// Original logo + `pulse` animation
// ---------------------------------------------------------------------------

function pulseKeyframes(letter: LogoLetter): string {
  const { transform, transformTo } = LETTERS[letter];
  return keyframes(`logo-am-${letter}`, {
    '0%, 80%, 100%': { transform: transformTo },
    '40%': { transform }
  });
}

function letterRules(letter: LogoLetter): string[] {
  const { color, transform, shapes } = LETTERS[letter];
  const base = `${root} .logo-wrapper .${letter}`;
  return [
    rule(base, {
      fill: `var(--ltv-logo-${letter.toLowerCase()}, ${color})`,
      transform,
      animation: `logo-am-${letter} ${PULSE_DURATION} infinite ease-in-out both`
    }),
    ...shapes.map((shape, i) =>
      rule(`${base} rect:${i === 0 ? 'first-child' : 'last-child'}`, {
        transform: shape.transform,
        x: shape.x,
        y: shape.y
      })
    )
  ];
}

// ---------------------------------------------------------------------------
// Extra animations. They animate the individual `translate` / `scale` /
// `rotate` properties and `opacity`, which compose with each letter's
// positioning `transform`, so every animation settles on the brand pose.
// ---------------------------------------------------------------------------

function variantKeyframes(letter: LogoLetter): string[] {
  const { enter, float } = LETTERS[letter];
  return [
    keyframes(`logo-assemble-${letter}`, {
      from: {
        opacity: '0',
        translate: px(enter.from),
        rotate: `${enter.rotate}deg`,
        scale: '0.9'
      },
      to: { opacity: '1', translate: '0px 0px', rotate: '0deg', scale: '1' }
    }),
    keyframes(`logo-float-${letter}`, {
      '0%, 100%': { translate: '0px 0px' },
      '50%': { translate: px(float.to) }
    })
  ];
}

function variantRules(letter: LogoLetter): string[] {
  const { enter, float, waveDelay } = LETTERS[letter];
  const assemble = `logo-assemble-${letter} 800ms ${EASE_OUT} ${ms(enter.delay)} both`;
  const floating = (delay: number) =>
    `logo-float-${letter} ${float.duration}s ease-in-out ${ms(delay)} infinite`;
  const sel = (name: string) => `${variant(name)} .logo-wrapper .${letter}`;
  return [
    rule(sel('assemble'), { animation: assemble }),
    rule(sel('float'), { animation: floating(0) }),
    rule(sel('intro'), {
      animation: `${assemble}, ${floating(enter.delay + 1000)}`
    }),
    rule(sel('wave'), {
      animation: `logo-wave 1.4s ${EASE_IN_OUT} ${ms(waveDelay)} infinite both`
    })
  ];
}

function hoverRule(letter: LogoLetter): string {
  const { spread } = LETTERS[letter];
  return rule(
    `${variant('hover')}:hover .logo-wrapper .${letter}, :focus-visible > ${variant('hover')} .logo-wrapper .${letter}`,
    { translate: px(spread) }
  );
}

function variantStyles(): string[] {
  const letters = `${root} .logo-wrapper .logo-letter`;
  return [
    ...ORDER.flatMap(variantKeyframes),
    keyframes('logo-wave', {
      '0%, 60%, 100%': { translate: '0px 0px', scale: '1' },
      '30%': { translate: '0px -12px', scale: '1.04' }
    }),
    keyframes('logo-fade-pulse', {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.55' }
    }),
    keyframes('logo-fade-in', {
      from: { opacity: '0' },
      to: { opacity: '1' }
    }),
    // Scale / rotate letters around their own centre. The letters' own
    // `transform` is a pure translation, so the origin does not move them.
    rule(letters, {
      'transform-box': 'fill-box',
      'transform-origin': 'center'
    }),
    ...ORDER.flatMap(variantRules),
    rule(
      `${variant('none')} .logo-wrapper .logo-letter, ${variant('hover')} .logo-wrapper .logo-letter`,
      { animation: 'none' }
    ),
    // Hover / focus spread: only for precise pointers (touch fires false
    // hovers on tap) and only when the user has not asked for less motion.
    `@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {\n${[
      rule(`${variant('hover')} .logo-wrapper .logo-letter`, {
        transition: `translate 240ms ${EASE_OUT}`
      }),
      ...ORDER.map(hoverRule)
    ]
      .map(indent)
      .join('\n')}\n}`,
    // Reduced motion: no movement. Loaders keep a gentle opacity pulse so the
    // "busy" state stays visible; entrances become a short fade. Selectors
    // list each variant so they out-rank (or tie and follow) the rules above.
    `@media (prefers-reduced-motion: reduce) {\n${[
      rule(
        [
          letters,
          ...['pulse', 'wave'].map(
            (n) => `${variant(n)} .logo-wrapper .logo-letter`
          )
        ].join(', '),
        { animation: 'logo-fade-pulse 2s ease-in-out infinite both' }
      ),
      rule(
        ['assemble', 'intro']
          .map((n) => `${variant(n)} .logo-wrapper .logo-letter`)
          .join(', '),
        { animation: `logo-fade-in 300ms ${EASE_OUT} both` }
      ),
      rule(
        ['float', 'hover', 'none']
          .map((n) => `${variant(n)} .logo-wrapper .logo-letter`)
          .join(', '),
        { animation: 'none' }
      )
    ]
      .map(indent)
      .join('\n')}\n}`
  ];
}

const indent = (css: string) =>
  css
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

/**
 * Builds the complete stylesheet for the logo. The same CSS is published as
 * `ltv-logo-js/style.css`.
 */
export function buildStyles(): string {
  const blocks: string[] = [
    ...ORDER.map(pulseKeyframes),
    ...SIZE_TRANSFORMS.slice(0, MAX_SIZE).map((transform, i) =>
      rule(`${root}.size-${i + 1}`, { transform })
    ),
    rule(`${root} .logo-wrapper`, {
      transform: `translate(${GLOBAL_OFFSET}, ${GLOBAL_OFFSET})`
    }),
    rule(`${root} .logo-wrapper .logo-letter rect:first-child`, {
      width: LONG_BAR_WIDTH,
      height: BAR_HEIGHT,
      rx: BAR_RADIUS
    }),
    rule(`${root} .logo-wrapper .logo-letter rect:last-child`, {
      width: SHORT_BAR_WIDTH,
      height: BAR_HEIGHT,
      rx: BAR_RADIUS
    }),
    ...ORDER.flatMap(letterRules),
    ...variantStyles()
  ];
  return `${blocks.join('\n')}\n`;
}

/** The logo stylesheet as a string. */
export const styles: string = buildStyles();

/**
 * Adds the logo stylesheet to `document.head` once. Safe to call many times
 * and a no-op outside the browser (SSR, workers).
 *
 * @param doc target document; defaults to the global `document`.
 * @returns the `<style>` element, or `null` when no document is available.
 */
export function injectStyles(doc?: Document | null): HTMLStyleElement | null {
  if (doc === undefined) doc = globalThis.document;
  if (!doc) return null;
  const existing = doc.getElementById(STYLE_ELEMENT_ID);
  if (existing) return existing as HTMLStyleElement;
  const style = doc.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = styles;
  (doc.head ?? doc.documentElement).appendChild(style);
  return style;
}
