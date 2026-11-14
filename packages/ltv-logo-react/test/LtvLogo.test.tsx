import { describe, expect, test } from 'bun:test';
import { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { STYLE_ELEMENT_ID, renderLogo } from 'ltv-logo-js';
import LtvLogo from '../src/index.ts';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const normalize = (html: string) =>
  html.replace(/<rect><\/rect>|<rect\/>/g, '<rect />');

describe('LtvLogo (React)', () => {
  test('SSR output matches the vanilla renderer', () => {
    const html = renderToStaticMarkup(<LtvLogo size={7} />);
    expect(normalize(html)).toBe(renderLogo({ size: 7 }));
  });

  test('animation prop adds the variant class', () => {
    expect(renderToStaticMarkup(<LtvLogo animation="wave" />)).toContain(
      'class="logo size-5 logo-anim-wave"'
    );
  });

  test('merges className and forwards SVG props', () => {
    const html = renderToStaticMarkup(
      <LtvLogo className="brand" data-testid="logo" title="" />
    );
    expect(html).toContain('class="logo size-5 brand"');
    expect(html).toContain('data-testid="logo"');
    expect(html).toContain('aria-hidden="true"');
  });

  test('mounts in the DOM, injects styles and forwards ref', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    const ref = createRef<SVGSVGElement>();
    await act(async () => root.render(<LtvLogo size={3} ref={ref} />));

    expect(ref.current?.getAttribute('class')).toBe('logo size-3');
    expect(document.getElementById(STYLE_ELEMENT_ID)).not.toBeNull();

    await act(async () => root.render(<LtvLogo size="10" ref={ref} />));
    expect(ref.current?.getAttribute('class')).toBe('logo size-10');
    await act(async () => root.unmount());
  });
});
