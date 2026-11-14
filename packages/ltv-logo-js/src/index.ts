export {
  COLORS,
  CONVERGE_ANIMATIONS,
  CONVERGE_SIZE_STEP,
  DEFAULT_ANIMATIONS,
  DEFAULT_MARK,
  DEFAULT_SIZE,
  DEFAULT_TONE,
  LEGACY_ANIMATIONS,
  LEGACY_COLORS,
  LOGO_ANIMATIONS,
  LOGO_CLASS,
  LOGO_LETTERS,
  LOGO_MARKS,
  LOGO_TONES,
  MARK_CLASS,
  MAX_SIZE,
  MIN_SIZE,
  STYLE_ELEMENT_ID
} from './constants.js';
export type {
  ConvergeAnimation,
  LegacyAnimation,
  LogoAnimation,
  LogoLetter,
  LogoMark,
  LogoTone
} from './constants.js';
export {
  CONVERGE_STROKES,
  CONVERGE_STROKE_WIDTH,
  CONVERGE_VIEWBOX,
  TONE_COLORS
} from './converge.js';
export {
  SVG_NS,
  createLogoElement,
  getLogoA11yAttributes,
  getLogoClass,
  getLogoTree,
  getMarkClass,
  normalizeAnimation,
  normalizeMark,
  normalizeSize,
  normalizeTone,
  renderLogo,
  updateLogoElement
} from './render.js';
export type { LogoNode, LogoOptions } from './render.js';
export { buildStyles, injectStyles, styles } from './styles.js';
export { DEFAULT_TAG_NAME, defineLtvLogoElement } from './element.js';

import { createLogoElement } from './render.js';
import type { LogoOptions } from './render.js';
import { injectStyles } from './styles.js';

/**
 * Convenience helper: injects the styles and appends a logo to `target`.
 * `target` can be an element or a CSS selector.
 */
export function mountLogo(
  target: Element | string,
  options: LogoOptions = {}
): SVGSVGElement {
  const el =
    typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) throw new Error(`ltv-logo: mount target not found: ${target}`);
  injectStyles(el.ownerDocument);
  const svg = createLogoElement(options, el.ownerDocument);
  el.appendChild(svg);
  return svg;
}
