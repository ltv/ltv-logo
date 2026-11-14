import { useInsertionEffect } from 'react';
import type { SVGProps } from 'react';
import {
  DEFAULT_SIZE,
  LOGO_LETTERS,
  SVG_NS,
  getLogoA11yAttributes,
  getLogoClass,
  injectStyles
} from 'ltv-logo-js';
import type { LogoAnimation } from 'ltv-logo-js';

export interface LtvLogoProps extends Omit<
  SVGProps<SVGSVGElement>,
  'children'
> {
  /** Logo size from 1 (smallest) to 10 (largest). Defaults to 5. */
  size?: number | string;
  /** `pulse` (default), `assemble`, `float`, `intro`, `wave`, `hover` or `none`. */
  animation?: LogoAnimation;
  /** Accessible label. Use an empty string to hide it from assistive tech. */
  title?: string;
}

/**
 * `<LtvLogo size={5} animation="intro" />` — the animated LTV logo for React.
 * Styles are injected automatically; `ref` and other SVG props are forwarded.
 */
export function LtvLogo({
  size = DEFAULT_SIZE,
  title = 'LTV',
  animation,
  className,
  ...rest
}: LtvLogoProps) {
  useInsertionEffect(() => {
    injectStyles();
  }, []);

  return (
    <svg
      xmlns={SVG_NS}
      className={getLogoClass(size, className, animation)}
      {...getLogoA11yAttributes(title)}
      {...rest}
    >
      <g className="logo-wrapper">
        {LOGO_LETTERS.map((letter) => (
          <g key={letter} className={`logo-letter ${letter}`}>
            <rect />
            <rect />
          </g>
        ))}
      </g>
    </svg>
  );
}
