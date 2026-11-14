/** Letters drawn by the logo, in paint order (back to front). */
export const LOGO_LETTERS = ['V', 'L', 'T'] as const;
export type LogoLetter = (typeof LOGO_LETTERS)[number];

/** Smallest and largest supported `size` values. */
export const MIN_SIZE = 1;
export const MAX_SIZE = 10;
export const DEFAULT_SIZE = 5;

/** Root CSS class applied to the `<svg>` element. */
export const LOGO_CLASS = 'logo';

/** `id` of the `<style>` element created by `injectStyles()`. */
export const STYLE_ELEMENT_ID = 'ltv-logo-styles';

export const COLORS = {
  blue: '#3369e8',
  yellow: '#f4b400',
  green: '#0f9d58'
} as const;

/**
 * Built-in animations.
 * - `pulse`    – the original looping "breathing" animation (default)
 * - `assemble` – letters fly in and settle once (entrance / splash)
 * - `float`    – slow, out-of-phase ambient drift (hero sections)
 * - `intro`    – `assemble`, then `float`
 * - `wave`     – letters bob one after another (loading indicator)
 * - `hover`    – static; letters spread slightly on hover / keyboard focus
 * - `none`     – static brand mark
 */
export const LOGO_ANIMATIONS = [
  'pulse',
  'assemble',
  'float',
  'intro',
  'wave',
  'hover',
  'none'
] as const;
export type LogoAnimation = (typeof LOGO_ANIMATIONS)[number];
export const DEFAULT_ANIMATION: LogoAnimation = 'pulse';
