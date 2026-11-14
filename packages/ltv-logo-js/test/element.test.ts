import { describe, expect, test } from 'bun:test';
import { STYLE_ELEMENT_ID, defineLtvLogoElement } from '../src/index.ts';

describe('<ltv-logo> custom element', () => {
  test('renders and reacts to attribute changes', () => {
    const ctor = defineLtvLogoElement();
    expect(ctor).toBeDefined();
    expect(defineLtvLogoElement()).toBe(ctor);

    const el = document.createElement('ltv-logo');
    el.setAttribute('size', '3');
    document.body.appendChild(el);

    const svg = el.querySelector('svg')!;
    expect(svg.getAttribute('class')).toBe(
      'ltv-mark ltv-anim-assemble ltv-tone-color'
    );
    expect(svg.getAttribute('width')).toBe('48');
    expect(document.getElementById(STYLE_ELEMENT_ID)).not.toBeNull();

    el.setAttribute('animation', 'greet');
    el.setAttribute('tone', 'dark');
    expect(svg.getAttribute('class')).toBe(
      'ltv-mark ltv-anim-greet ltv-tone-dark'
    );

    el.setAttribute('mark', 'legacy');
    el.setAttribute('animation', 'wave');
    expect(svg.getAttribute('class')).toBe('logo size-3 logo-anim-wave');

    el.setAttribute('label', 'LTV Co., Ltd');
    expect(svg.getAttribute('aria-label')).toBe('LTV Co., Ltd');
    el.remove();
  });
});
