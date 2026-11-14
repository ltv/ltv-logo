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
    expect(svg.getAttribute('class')).toBe('logo size-3');
    expect(document.getElementById(STYLE_ELEMENT_ID)).not.toBeNull();

    el.setAttribute('size', '9');
    expect(svg.getAttribute('class')).toBe('logo size-9');

    el.setAttribute('animation', 'wave');
    expect(svg.getAttribute('class')).toBe('logo size-9 logo-anim-wave');

    el.setAttribute('label', 'LTV Co., Ltd');
    expect(svg.getAttribute('aria-label')).toBe('LTV Co., Ltd');
    el.remove();
  });
});
