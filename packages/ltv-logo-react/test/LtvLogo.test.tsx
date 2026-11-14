import { describe, expect, test } from 'bun:test';
import { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { STYLE_ELEMENT_ID, renderLogo } from 'ltv-logo-js';
import type { LogoOptions } from 'ltv-logo-js';
import LtvLogo from '../src/index.ts';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** React writes `<polyline .../>` and `<rect></rect>`; compare with ` />`. */
const normalize = (html: string) =>
  html.replace(/<(\w+)([^<>]*?)><\/\1>/g, '<$1$2 />').replace(/\s*\/>/g, ' />');

describe('LtvLogo (React)', () => {
  test.each([
    [{ size: 7 }],
    [{ animation: 'cheer', tone: 'mono' }],
    [{ mark: 'legacy', size: 4, animation: 'wave' }]
  ] as [LogoOptions][])(
    'SSR output matches the vanilla renderer: %o',
    (props) => {
      const html = renderToStaticMarkup(<LtvLogo {...props} />);
      expect(normalize(html)).toBe(renderLogo(props));
    }
  );

  test('merges className and forwards SVG props', () => {
    const html = renderToStaticMarkup(
      <LtvLogo
        className="brand"
        data-testid="logo"
        title=""
        animation="greet"
      />
    );
    expect(html).toContain(
      'class="ltv-mark ltv-anim-greet ltv-tone-color brand"'
    );
    expect(html).toContain('data-testid="logo"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('stroke-linecap="round"');
  });

  test('mounts in the DOM, injects styles and forwards ref', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    const ref = createRef<SVGSVGElement>();
    await act(async () => root.render(<LtvLogo size={3} ref={ref} />));

    expect(ref.current?.getAttribute('width')).toBe('48');
    expect(document.getElementById(STYLE_ELEMENT_ID)).not.toBeNull();

    await act(async () =>
      root.render(<LtvLogo mark="legacy" size="10" ref={ref} />)
    );
    expect(ref.current?.getAttribute('class')).toBe('logo size-10');
    await act(async () => root.unmount());
  });
});
