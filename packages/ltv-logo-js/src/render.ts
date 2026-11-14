import {
  CONVERGE_ANIMATIONS,
  CONVERGE_SIZE_STEP,
  DEFAULT_ANIMATIONS,
  DEFAULT_MARK,
  DEFAULT_SIZE,
  DEFAULT_TONE,
  LEGACY_ANIMATIONS,
  LOGO_CLASS,
  LOGO_LETTERS,
  LOGO_MARKS,
  LOGO_TONES,
  MARK_CLASS,
  MAX_SIZE,
  MIN_SIZE
} from './constants.js';
import type {
  ConvergeAnimation,
  LegacyAnimation,
  LogoAnimation,
  LogoMark,
  LogoTone
} from './constants.js';
import {
  CONVERGE_STROKES,
  CONVERGE_STROKE_WIDTH,
  CONVERGE_VIEWBOX,
  TONE_COLORS
} from './converge.js';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export interface LogoOptions {
  /** `"converge"` (the Hội tụ mark, default) or `"legacy"` (the L·T·V mark). */
  mark?: LogoMark;
  /**
   * Size from 1 (smallest) to 10 (largest). Defaults to 5. The converge mark
   * is `size × 16` px square (5 → 80 px); the legacy mark keeps its old scale.
   */
  size?: number | string;
  /**
   * Animation. Converge: `assemble` (default), `idle`, `greet`, `cheer`,
   * `work`, `hover`, `none`. Legacy: `pulse` (default), `assemble`, `float`,
   * `intro`, `wave`, `hover`, `none`.
   */
  animation?: LogoAnimation;
  /** Converge only: `color` (default), `dark`, `mono` or `white`. */
  tone?: LogoTone;
  /** Extra classes added to the `<svg>` element. */
  className?: string;
  /** Accessible label. Defaults to `"LTV"`. Pass `""` to hide it from assistive tech. */
  title?: string;
}

/** A framework-neutral description of the logo's SVG markup. */
export interface LogoNode {
  tag: string;
  attrs: Record<string, string>;
  children: LogoNode[];
}

const includes = <T extends string>(
  list: readonly T[],
  value: unknown
): value is T => (list as readonly unknown[]).includes(value);

/**
 * Normalizes a size value to an integer between 1 and 10.
 * Invalid input falls back to the default size (5).
 */
export function normalizeSize(size: unknown = DEFAULT_SIZE): number {
  const value = typeof size === 'string' ? Number(size.trim()) : size;
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_SIZE;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)));
}

/** Returns a supported mark; unknown values fall back to `"converge"`. */
export function normalizeMark(mark: unknown): LogoMark {
  return includes(LOGO_MARKS, mark) ? mark : DEFAULT_MARK;
}

/** Returns a supported tone; unknown values fall back to `"color"`. */
export function normalizeTone(tone: unknown): LogoTone {
  return includes(LOGO_TONES, tone) ? tone : DEFAULT_TONE;
}

/**
 * Returns an animation the given mark supports; anything else falls back to
 * that mark's default (`assemble` for converge, `pulse` for legacy).
 */
export function normalizeAnimation(
  animation: unknown,
  mark: LogoMark = DEFAULT_MARK
): LogoAnimation {
  if (mark === 'legacy') {
    return includes(LEGACY_ANIMATIONS, animation)
      ? animation
      : DEFAULT_ANIMATIONS.legacy;
  }
  return includes(CONVERGE_ANIMATIONS, animation)
    ? animation
    : DEFAULT_ANIMATIONS.converge;
}

const joinClasses = (...parts: (string | undefined)[]) =>
  parts
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(' ');

/**
 * Class list of the legacy `<svg>`, e.g. `"logo size-5"` or
 * `"logo size-5 logo-anim-wave"`.
 */
export function getLogoClass(
  size?: number | string,
  className?: string,
  animation?: LegacyAnimation | string
): string {
  const anim = normalizeAnimation(animation, 'legacy');
  return joinClasses(
    `${LOGO_CLASS} size-${normalizeSize(size)}`,
    anim !== DEFAULT_ANIMATIONS.legacy ? `logo-anim-${anim}` : undefined,
    className
  );
}

/** Class list of the converge `<svg>`, e.g. `"ltv-mark ltv-anim-greet ltv-tone-color"`. */
export function getMarkClass(
  animation?: ConvergeAnimation | string,
  tone?: LogoTone | string,
  className?: string
): string {
  return joinClasses(
    MARK_CLASS,
    `ltv-anim-${normalizeAnimation(animation, 'converge')}`,
    `ltv-tone-${normalizeTone(tone)}`,
    className
  );
}

/** Accessibility attributes for the `<svg>` element. */
export function getLogoA11yAttributes(title = 'LTV'): Record<string, string> {
  return title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': 'true' };
}

const node = (
  tag: string,
  attrs: Record<string, string> = {},
  children: LogoNode[] = []
): LogoNode => ({ tag, attrs, children });

/** Describes the logo's SVG markup; every renderer is built on this. */
export function getLogoTree(options: LogoOptions = {}): LogoNode {
  const mark = normalizeMark(options.mark);
  const a11y = getLogoA11yAttributes(options.title);

  if (mark === 'legacy') {
    return node(
      'svg',
      {
        xmlns: SVG_NS,
        class: getLogoClass(options.size, options.className, options.animation),
        ...a11y
      },
      [
        node(
          'g',
          { class: 'logo-wrapper' },
          LOGO_LETTERS.map((letter) =>
            node('g', { class: `logo-letter ${letter}` }, [
              node('rect'),
              node('rect')
            ])
          )
        )
      ]
    );
  }

  const tone = normalizeTone(options.tone);
  const [armColor, legColor] = TONE_COLORS[tone];
  const px = String(normalizeSize(options.size) * CONVERGE_SIZE_STEP);
  return node(
    'svg',
    {
      xmlns: SVG_NS,
      class: getMarkClass(options.animation, tone, options.className),
      viewBox: CONVERGE_VIEWBOX,
      width: px,
      height: px,
      ...a11y
    },
    [
      node(
        'g',
        {
          class: 'ltv-figure',
          fill: 'none',
          'stroke-width': String(CONVERGE_STROKE_WIDTH),
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        },
        CONVERGE_STROKES.map(({ part, points }) =>
          node('polyline', {
            class: `ltv-stroke ${part === 'arms' ? 'ltv-arms' : `ltv-leg ltv-${part}`}`,
            points,
            // Presentation attributes: correct colours even without the CSS.
            stroke: part === 'arms' ? armColor : legColor
          })
        )
      )
    ]
  );
}

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function serialize({ tag, attrs, children }: LogoNode): string {
  const attrString = Object.entries(attrs)
    .map(([name, value]) => ` ${name}="${escapeAttr(value)}"`)
    .join('');
  return children.length
    ? `<${tag}${attrString}>${children.map(serialize).join('')}</${tag}>`
    : `<${tag}${attrString} />`;
}

/** Renders the logo as an SVG markup string (works on the server too). */
export function renderLogo(options: LogoOptions = {}): string {
  return serialize(getLogoTree(options));
}

function build(doc: Document, { tag, attrs, children }: LogoNode): Element {
  const el = doc.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (name !== 'xmlns') el.setAttribute(name, value);
  }
  for (const child of children) el.appendChild(build(doc, child));
  return el;
}

/** Serialized children per element, so updates only rebuild when needed. */
const renderedContent = new WeakMap<Element, string>();

/** Creates the logo as a DOM `SVGSVGElement`. */
export function createLogoElement(
  options: LogoOptions = {},
  doc: Document = document
): SVGSVGElement {
  const tree = getLogoTree(options);
  const svg = build(doc, tree) as SVGSVGElement;
  renderedContent.set(svg, tree.children.map(serialize).join(''));
  return svg;
}

/**
 * Updates an element made by `createLogoElement` in place (attributes and
 * content), so it can be re-rendered with new options, including a different
 * mark.
 */
export function updateLogoElement(
  svg: SVGSVGElement,
  options: LogoOptions = {}
): void {
  const tree = getLogoTree(options);
  for (const name of svg.getAttributeNames()) {
    if (!(name in tree.attrs)) svg.removeAttribute(name);
  }
  for (const [name, value] of Object.entries(tree.attrs)) {
    if (name !== 'xmlns' && svg.getAttribute(name) !== value) {
      svg.setAttribute(name, value);
    }
  }
  // Rebuild the content only when it changed (mark or tone), so a size or
  // label change does not restart a running animation.
  const content = tree.children.map(serialize).join('');
  if (renderedContent.get(svg) !== content) {
    const doc = svg.ownerDocument;
    svg.replaceChildren(...tree.children.map((child) => build(doc, child)));
    renderedContent.set(svg, content);
  }
}
