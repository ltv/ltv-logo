import { COLORS, MARK_CLASS } from './constants.js';
import type { LogoTone } from './constants.js';

/**
 * Geometry of the `converge` mark on a 120 × 120 grid: three 90° strokes,
 * arms 32 long, vertices 14 from the centre, rotated 120° apart. Every stroke
 * end stays inside a circle of radius 52, so the mark sits centred in square,
 * round and rectangular frames.
 */
export const CONVERGE_VIEWBOX = '0 0 120 120';
export const CONVERGE_STROKE_WIDTH = 16;

export const CONVERGE_STROKES = [
  // Yellow stroke on top: the "arms".
  { part: 'arms', points: '37.37,23.37 60,46 82.63,23.37' },
  // Blue strokes: the "legs".
  { part: 'leg-r', points: '103.03,58.72 72.12,67 80.41,97.91' },
  { part: 'leg-l', points: '39.59,97.91 47.88,67 16.97,58.72' }
] as const;
export type ConvergePart = (typeof CONVERGE_STROKES)[number]['part'];

/** Stroke colours per tone: [arms, legs]. */
export const TONE_COLORS: Record<LogoTone, readonly [string, string]> = {
  color: [COLORS.accent, COLORS.primary],
  dark: [COLORS.accentDark, COLORS.primaryDark],
  mono: [COLORS.primary, COLORS.primary],
  white: ['#ffffff', '#ffffff']
};

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

/** Strong ease-out: entrances and hover feedback. */
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
/** Strong ease-in-out: on-screen movement between poses. */
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

const root = `svg.${MARK_CLASS}`;
const anim = (name: string) => `${root}.ltv-anim-${name}`;

type Decls = Record<string, string>;

function rule(selector: string, decls: Decls): string {
  const body = Object.entries(decls)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

function keyframes(name: string, frames: Record<string, Decls>): string {
  const body = Object.entries(frames)
    .map(([offset, decls]) => {
      const lines = Object.entries(decls)
        .map(([prop, value]) => `    ${prop}: ${value};`)
        .join('\n');
      return `  ${offset} {\n${lines}\n  }`;
    })
    .join('\n');
  return `@keyframes ${name} {\n${body}\n}`;
}

const media = (query: string, rules: string[]) =>
  `@media ${query} {\n${rules
    .map((r) =>
      r
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n')
    )
    .join('\n')}\n}`;

/** Stylesheet for the `converge` mark: tones and agent animations. */
export function buildConvergeStyles(): string {
  const arms = '.ltv-arms';
  const legs = '.ltv-leg';
  const legL = '.ltv-leg-l';
  const legR = '.ltv-leg-r';
  const figure = '.ltv-figure';

  const blocks: string[] = [
    // --- base and tones -----------------------------------------------------
    rule(root, { overflow: 'visible' }),
    rule(`${root} ${figure}, ${root} .ltv-stroke`, {
      'transform-box': 'view-box'
    }),
    rule(`${root} ${figure}`, { 'transform-origin': '60px 60px' }),
    // The arms pivot on their own vertex.
    rule(`${root} ${arms}`, { 'transform-origin': '60px 46px' }),
    rule(`${root} ${arms}`, {
      stroke: `var(--ltv-logo-accent, ${COLORS.accent})`
    }),
    rule(`${root} ${legs}`, {
      stroke: `var(--ltv-logo-primary, ${COLORS.primary})`
    }),
    rule(`${root}.ltv-tone-dark ${arms}`, {
      stroke: `var(--ltv-logo-accent-dark, ${COLORS.accentDark})`
    }),
    rule(`${root}.ltv-tone-dark ${legs}`, {
      stroke: `var(--ltv-logo-primary-dark, ${COLORS.primaryDark})`
    }),
    rule(`${root}.ltv-tone-mono ${arms}, ${root}.ltv-tone-mono ${legs}`, {
      stroke: `var(--ltv-logo-primary, ${COLORS.primary})`
    }),
    rule(`${root}.ltv-tone-white ${arms}, ${root}.ltv-tone-white ${legs}`, {
      stroke: '#ffffff'
    }),

    // --- assemble: strokes fly in along their own axis and lock ------------
    keyframes('ltv-in-arms', {
      from: { opacity: '0', translate: '0px -30px' },
      to: { opacity: '1', translate: '0px 0px' }
    }),
    keyframes('ltv-in-leg-r', {
      from: { opacity: '0', translate: '26px 15px' },
      to: { opacity: '1', translate: '0px 0px' }
    }),
    keyframes('ltv-in-leg-l', {
      from: { opacity: '0', translate: '-26px 15px' },
      to: { opacity: '1', translate: '0px 0px' }
    }),
    rule(`${anim('assemble')} ${arms}`, {
      animation: `ltv-in-arms 800ms ${EASE_OUT} both`
    }),
    rule(`${anim('assemble')} ${legR}`, {
      animation: `ltv-in-leg-r 800ms ${EASE_OUT} 90ms both`
    }),
    rule(`${anim('assemble')} ${legL}`, {
      animation: `ltv-in-leg-l 800ms ${EASE_OUT} 180ms both`
    }),

    // --- idle: breathing ---------------------------------------------------
    keyframes('ltv-idle-arms', {
      '0%, 100%': { translate: '0px 0px' },
      '50%': { translate: '0px -3px' }
    }),
    keyframes('ltv-idle-legs', {
      '0%, 100%': { translate: '0px 0px' },
      '50%': { translate: '0px 1px' }
    }),
    rule(`${anim('idle')} ${arms}`, {
      animation: 'ltv-idle-arms 3.2s ease-in-out infinite'
    }),
    rule(`${anim('idle')} ${legs}`, {
      animation: 'ltv-idle-legs 3.2s ease-in-out infinite'
    }),

    // --- greet: waves hello -------------------------------------------------
    keyframes('ltv-greet', {
      '0%, 55%, 100%': { rotate: '0deg' },
      '10%': { rotate: '-14deg' },
      '22%': { rotate: '12deg' },
      '34%': { rotate: '-9deg' },
      '45%': { rotate: '5deg' }
    }),
    keyframes('ltv-greet-body', {
      '0%, 55%, 100%': { translate: '0px 0px' },
      '22%': { translate: '0px -2px' }
    }),
    rule(`${anim('greet')} ${arms}`, {
      animation: 'ltv-greet 2.4s ease-in-out infinite'
    }),
    rule(`${anim('greet')} ${figure}`, {
      animation: 'ltv-greet-body 2.4s ease-in-out infinite'
    }),

    // --- cheer: crouch, jump, land ----------------------------------------
    rule(`${anim('cheer')} ${figure}`, {
      'transform-origin': '60px 106px',
      animation: 'ltv-cheer-body 1.6s ease-in-out infinite'
    }),
    keyframes('ltv-cheer-body', {
      '0%, 80%, 100%': { translate: '0px 0px', scale: '1 1' },
      '18%': { translate: '0px 3px', scale: '1.06 0.92' },
      '42%': { translate: '0px -16px', scale: '0.97 1.04' },
      '62%': { translate: '0px 0px', scale: '1.04 0.95' }
    }),
    keyframes('ltv-cheer-arms', {
      '0%, 18%, 80%, 100%': { translate: '0px 0px' },
      '42%': { translate: '0px -6px' }
    }),
    rule(`${anim('cheer')} ${arms}`, {
      animation: 'ltv-cheer-arms 1.6s ease-in-out infinite'
    }),

    // --- work: turns a third at a time (120° = the same shape) -------------
    keyframes('ltv-work', {
      '0%, 20%': { rotate: '0deg' },
      '33.33%, 53.33%': { rotate: '120deg' },
      '66.67%, 86.67%': { rotate: '240deg' },
      '100%': { rotate: '360deg' }
    }),
    rule(`${anim('work')} ${figure}`, {
      animation: `ltv-work 2.7s ${EASE_IN_OUT} infinite`
    }),

    // --- hover: perks up -----------------------------------------------------
    media(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      [
        rule(`${anim('hover')} .ltv-stroke`, {
          transition: `translate 240ms ${EASE_OUT}`
        }),
        rule(
          `${anim('hover')}:hover ${arms}, :focus-visible > ${anim('hover')} ${arms}`,
          { translate: '0px -5px' }
        ),
        rule(
          `${anim('hover')}:hover ${legL}, :focus-visible > ${anim('hover')} ${legL}`,
          { translate: '-2px 2px' }
        ),
        rule(
          `${anim('hover')}:hover ${legR}, :focus-visible > ${anim('hover')} ${legR}`,
          { translate: '2px 2px' }
        )
      ]
    ),

    // --- reduced motion -------------------------------------------------------
    // No movement. The `work` loader keeps a gentle opacity pulse so the busy
    // state stays visible; the entrance becomes a short fade.
    keyframes('ltv-fade-in', { from: { opacity: '0' }, to: { opacity: '1' } }),
    keyframes('ltv-busy', {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' }
    }),
    media('(prefers-reduced-motion: reduce)', [
      // Same specificity as the rules above and later, so these win.
      rule(
        ['idle', 'greet', 'cheer']
          .flatMap((a) => [`${anim(a)} .ltv-stroke`, `${anim(a)} ${figure}`])
          .join(', '),
        { animation: 'none' }
      ),
      rule(`${anim('assemble')} .ltv-stroke`, {
        animation: `ltv-fade-in 300ms ${EASE_OUT} both`
      }),
      rule(`${anim('work')} ${figure}`, {
        animation: 'ltv-busy 2s ease-in-out infinite'
      })
    ])
  ];
  return `${blocks.join('\n')}\n`;
}
