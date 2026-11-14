import {
  DEFAULT_ANIMATION,
  DEFAULT_SIZE,
  LOGO_ANIMATIONS,
  LOGO_CLASS,
  LOGO_LETTERS,
  MAX_SIZE,
  MIN_SIZE
} from './constants.js';
import type { LogoAnimation } from './constants.js';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export interface LogoOptions {
  /** Logo size from 1 (smallest) to 10 (largest). Defaults to 5. */
  size?: number | string;
  /** Animation style. Defaults to `"pulse"` (the original animation). */
  animation?: LogoAnimation;
  /** Extra classes added to the `<svg>` element. */
  className?: string;
  /** Accessible label. Defaults to `"LTV"`. Pass `""` to hide it from assistive tech. */
  title?: string;
}

/**
 * Normalizes a size value to an integer between 1 and 10.
 * Invalid input falls back to the default size (5).
 */
export function normalizeSize(size: unknown = DEFAULT_SIZE): number {
  const value = typeof size === 'string' ? Number(size.trim()) : size;
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_SIZE;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)));
}

/** Returns a supported animation name; unknown values fall back to `"pulse"`. */
export function normalizeAnimation(animation: unknown): LogoAnimation {
  return (LOGO_ANIMATIONS as readonly unknown[]).includes(animation)
    ? (animation as LogoAnimation)
    : DEFAULT_ANIMATION;
}

/**
 * Class list for the `<svg>` element, e.g. `"logo size-5"` or
 * `"logo size-5 logo-anim-wave"`.
 */
export function getLogoClass(
  size?: number | string,
  className?: string,
  animation?: LogoAnimation | string
): string {
  const classes = [`${LOGO_CLASS} size-${normalizeSize(size)}`];
  const anim = normalizeAnimation(animation);
  if (anim !== DEFAULT_ANIMATION) classes.push(`logo-anim-${anim}`);
  const extra = className?.trim();
  if (extra) classes.push(extra);
  return classes.join(' ');
}

/** Accessibility attributes for the `<svg>` element. */
export function getLogoA11yAttributes(title = 'LTV'): Record<string, string> {
  return title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': 'true' };
}

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Renders the logo as an SVG markup string (works on the server too). */
export function renderLogo(options: LogoOptions = {}): string {
  const attrs: Record<string, string> = {
    xmlns: SVG_NS,
    class: getLogoClass(options.size, options.className, options.animation),
    ...getLogoA11yAttributes(options.title)
  };
  const attrString = Object.entries(attrs)
    .map(([name, value]) => `${name}="${escapeAttr(value)}"`)
    .join(' ');
  const letters = LOGO_LETTERS.map(
    (letter) => `<g class="logo-letter ${letter}"><rect /><rect /></g>`
  ).join('');
  return `<svg ${attrString}><g class="logo-wrapper">${letters}</g></svg>`;
}

/** Creates the logo as a DOM `SVGSVGElement`. */
export function createLogoElement(
  options: LogoOptions = {},
  doc: Document = document
): SVGSVGElement {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  updateLogoElement(svg, options);
  const wrapper = doc.createElementNS(SVG_NS, 'g');
  wrapper.setAttribute('class', 'logo-wrapper');
  for (const letter of LOGO_LETTERS) {
    const group = doc.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', `logo-letter ${letter}`);
    group.append(
      doc.createElementNS(SVG_NS, 'rect'),
      doc.createElementNS(SVG_NS, 'rect')
    );
    wrapper.appendChild(group);
  }
  svg.appendChild(wrapper);
  return svg;
}

/** Updates the size / class / label of an element made by `createLogoElement`. */
export function updateLogoElement(
  svg: SVGSVGElement,
  options: LogoOptions = {}
): void {
  svg.setAttribute(
    'class',
    getLogoClass(options.size, options.className, options.animation)
  );
  for (const name of ['role', 'aria-label', 'aria-hidden']) {
    svg.removeAttribute(name);
  }
  for (const [name, value] of Object.entries(
    getLogoA11yAttributes(options.title)
  )) {
    svg.setAttribute(name, value);
  }
}
