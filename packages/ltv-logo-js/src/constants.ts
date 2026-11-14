/**
 * Logo marks.
 * - `converge` – the Hội tụ mark (2026): three 90° round-capped strokes
 *   pointing at one centre. Default.
 * - `legacy`   – the original L·T·V mark (2015–2026), kept for existing
 *   pages and documents.
 */
export const LOGO_MARKS = ['converge', 'legacy'] as const;
export type LogoMark = (typeof LOGO_MARKS)[number];
export const DEFAULT_MARK: LogoMark = 'converge';

/**
 * Animations for the `converge` mark. The yellow stroke reads as raised
 * arms and the two blue strokes as legs, so the mark moves like a small
 * agent character.
 * - `assemble` – the strokes fly in along their axes and lock (default)
 * - `idle`     – slow breathing: arms rise a little, legs settle
 * - `greet`    – waves hello with its arms
 * - `cheer`    – crouches, jumps and lands (task done)
 * - `work`     – turns a third at a time, pausing between (busy / loader)
 * - `hover`    – static; perks up on hover or keyboard focus
 * - `none`     – static mark
 */
export const CONVERGE_ANIMATIONS = [
  'assemble',
  'idle',
  'greet',
  'cheer',
  'work',
  'hover',
  'none'
] as const;
export type ConvergeAnimation = (typeof CONVERGE_ANIMATIONS)[number];

/**
 * Animations for the `legacy` mark.
 * - `pulse`    – the original looping "breathing" animation (default)
 * - `assemble` – letters fly in and settle once
 * - `float`    – slow, out-of-phase ambient drift
 * - `intro`    – `assemble`, then `float`
 * - `wave`     – letters bob one after another
 * - `hover`    – static; letters spread on hover / keyboard focus
 * - `none`     – static mark
 */
export const LEGACY_ANIMATIONS = [
  'pulse',
  'assemble',
  'float',
  'intro',
  'wave',
  'hover',
  'none'
] as const;
export type LegacyAnimation = (typeof LEGACY_ANIMATIONS)[number];

export type LogoAnimation = ConvergeAnimation | LegacyAnimation;

export const LOGO_ANIMATIONS: {
  converge: readonly ConvergeAnimation[];
  legacy: readonly LegacyAnimation[];
} = {
  converge: CONVERGE_ANIMATIONS,
  legacy: LEGACY_ANIMATIONS
};

export const DEFAULT_ANIMATIONS: {
  converge: ConvergeAnimation;
  legacy: LegacyAnimation;
} = {
  converge: 'assemble',
  legacy: 'pulse'
};

/**
 * Colour versions of the `converge` mark.
 * - `color` – blue strokes, yellow arms, for light backgrounds (default)
 * - `dark`  – lighter blue and yellow for dark backgrounds
 * - `mono`  – all blue: icons ≤ 32 px on light backgrounds, single-colour print
 * - `white` – all white, on blue or photographic backgrounds
 */
export const LOGO_TONES = ['color', 'dark', 'mono', 'white'] as const;
export type LogoTone = (typeof LOGO_TONES)[number];
export const DEFAULT_TONE: LogoTone = 'color';

/** Smallest and largest supported `size` values. */
export const MIN_SIZE = 1;
export const MAX_SIZE = 10;
export const DEFAULT_SIZE = 5;
/** Pixel size of the `converge` mark per size step (size 5 → 80 px). */
export const CONVERGE_SIZE_STEP = 16;

/** `id` of the `<style>` element created by `injectStyles()`. */
export const STYLE_ELEMENT_ID = 'ltv-logo-styles';

/** Brand colours of the `converge` mark (LTV Design System tokens). */
export const COLORS = {
  /** `brand`: the leg strokes. */
  primary: '#3369e8',
  /** `spark`: the arm stroke. */
  accent: '#eeb211',
  /** `brand` on dark backgrounds. */
  primaryDark: '#6b93f0',
  /** `spark` on dark backgrounds. */
  accentDark: '#f2c240',
  /** `wordmark`: "LTV" set next to the mark. */
  wordmark: '#364c79',
  /** `wordmark` on dark backgrounds. */
  wordmarkDark: '#a3bef2'
} as const;

// ---------------------------------------------------------------------------
// Legacy mark
// ---------------------------------------------------------------------------

/** Letters drawn by the legacy logo, in paint order (back to front). */
export const LOGO_LETTERS = ['V', 'L', 'T'] as const;
export type LogoLetter = (typeof LOGO_LETTERS)[number];

/** Root CSS class of the legacy `<svg>`. */
export const LOGO_CLASS = 'logo';

/** Root CSS class of the converge `<svg>`. */
export const MARK_CLASS = 'ltv-mark';

/** Colours of the legacy mark. */
export const LEGACY_COLORS = {
  blue: '#3369e8',
  yellow: '#f4b400',
  green: '#0f9d58'
} as const;
