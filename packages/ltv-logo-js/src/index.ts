export {
  COLORS,
  DEFAULT_ANIMATION,
  DEFAULT_SIZE,
  LOGO_ANIMATIONS,
  LOGO_CLASS,
  LOGO_LETTERS,
  MAX_SIZE,
  MIN_SIZE,
  STYLE_ELEMENT_ID
} from './constants.js';
export type { LogoAnimation, LogoLetter } from './constants.js';
export {
  SVG_NS,
  createLogoElement,
  getLogoA11yAttributes,
  getLogoClass,
  normalizeAnimation,
  normalizeSize,
  renderLogo,
  updateLogoElement
} from './render.js';
export type { LogoOptions } from './render.js';
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
