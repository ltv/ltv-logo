import { createElement, useInsertionEffect } from 'react';
import type { ReactElement, SVGProps } from 'react';
import { DEFAULT_SIZE, getLogoTree, injectStyles } from 'ltv-logo-js';
import type { LogoAnimation, LogoMark, LogoNode, LogoTone } from 'ltv-logo-js';

export interface LtvLogoProps extends Omit<
  SVGProps<SVGSVGElement>,
  'children' | 'mark'
> {
  /** `converge` (the Hội tụ mark, default) or `legacy` (the L·T·V mark). */
  mark?: LogoMark;
  /** Size from 1 (smallest) to 10 (largest). Converge: size × 16 px. */
  size?: number | string;
  /**
   * Converge: `assemble` (default), `idle`, `greet`, `cheer`, `work`,
   * `hover`, `none`. Legacy: `pulse` (default), `assemble`, `float`,
   * `intro`, `wave`, `hover`, `none`.
   */
  animation?: LogoAnimation;
  /** Converge only: `color` (default), `dark`, `mono`, `white`. */
  tone?: LogoTone;
  /** Accessible label. Use an empty string to hide it from assistive tech. */
  title?: string;
}

/** SVG attribute names → React prop names (`stroke-width` → `strokeWidth`). */
const toReactProp = (name: string) => {
  if (name === 'class') return 'className';
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  return name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
};

const toReactProps = (attrs: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(attrs).map(([name, value]) => [toReactProp(name), value])
  );

const toElement = (node: LogoNode, key?: number): ReactElement =>
  createElement(
    node.tag,
    { key, ...toReactProps(node.attrs) },
    ...node.children.map((child, i) => toElement(child, i))
  );

/**
 * `<LtvLogo size={5} animation="greet" />` — the animated LTV logo for React.
 * Styles are injected automatically; `ref` and other SVG props are forwarded.
 */
export function LtvLogo({
  mark,
  size = DEFAULT_SIZE,
  animation,
  tone,
  title = 'LTV',
  className,
  ...rest
}: LtvLogoProps) {
  useInsertionEffect(() => {
    injectStyles();
  }, []);

  const tree = getLogoTree({ mark, size, animation, tone, title, className });
  return createElement(
    'svg',
    { ...toReactProps(tree.attrs), ...rest },
    ...tree.children.map((child, i) => toElement(child, i))
  );
}
