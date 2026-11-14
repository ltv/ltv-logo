import { describe, expect, test } from 'bun:test';
import {
  LOGO_ANIMATIONS,
  createLogoElement,
  getLogoClass,
  normalizeAnimation,
  normalizeSize,
  renderLogo,
  styles,
  updateLogoElement
} from '../src/index.ts';

describe('normalizeSize', () => {
  test.each([
    [undefined, 5],
    [1, 1],
    [10, 10],
    [0, 1],
    [42, 10],
    [3.6, 4],
    ['7', 7],
    [' 2 ', 2],
    ['abc', 5],
    [Number.NaN, 5],
    [null, 5]
  ])('%p → %p', (input, expected) => {
    expect(normalizeSize(input)).toBe(expected);
  });
});

describe('getLogoClass', () => {
  test('default size', () => expect(getLogoClass()).toBe('logo size-5'));
  test('extra classes', () =>
    expect(getLogoClass(3, ' brand ')).toBe('logo size-3 brand'));
});

describe('renderLogo', () => {
  test('renders the documented markup', () => {
    expect(renderLogo({ size: 5 })).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" class="logo size-5" role="img" aria-label="LTV">' +
        '<g class="logo-wrapper">' +
        '<g class="logo-letter V"><rect /><rect /></g>' +
        '<g class="logo-letter L"><rect /><rect /></g>' +
        '<g class="logo-letter T"><rect /><rect /></g>' +
        '</g></svg>'
    );
  });

  test('escapes attribute values', () => {
    expect(renderLogo({ title: '"<x>"' })).toContain(
      'aria-label="&quot;&lt;x&gt;&quot;"'
    );
  });

  test('empty title hides the logo from assistive tech', () => {
    const html = renderLogo({ title: '' });
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role=');
  });
});

describe('createLogoElement', () => {
  test('builds an SVG element tree', () => {
    const svg = createLogoElement({ size: 8, className: 'x' });
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(svg.getAttribute('class')).toBe('logo size-8 x');
    expect(svg.querySelectorAll('.logo-letter').length).toBe(3);
    expect(svg.querySelectorAll('rect').length).toBe(6);
  });

  test('updateLogoElement changes size and label', () => {
    const svg = createLogoElement();
    updateLogoElement(svg, { size: 2, title: '' });
    expect(svg.getAttribute('class')).toBe('logo size-2');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.hasAttribute('aria-label')).toBe(false);
  });
});

describe('animation option', () => {
  test('default pulse adds no class (backwards compatible)', () => {
    expect(getLogoClass(5, undefined, 'pulse')).toBe('logo size-5');
  });

  test('variant adds a logo-anim-* class before extra classes', () => {
    expect(getLogoClass(4, 'brand', 'wave')).toBe(
      'logo size-4 logo-anim-wave brand'
    );
  });

  test('unknown values fall back to pulse', () => {
    expect(normalizeAnimation('nope')).toBe('pulse');
    expect(normalizeAnimation(null)).toBe('pulse');
    expect(normalizeAnimation('intro')).toBe('intro');
  });

  test('every animation has CSS', () => {
    for (const name of LOGO_ANIMATIONS) {
      if (name === 'pulse') continue;
      expect(styles).toContain(`svg.logo.logo-anim-${name}`);
    }
  });

  test('renderLogo and createLogoElement apply the class', () => {
    expect(renderLogo({ animation: 'intro' })).toContain(
      'class="logo size-5 logo-anim-intro"'
    );
    expect(
      createLogoElement({ animation: 'hover' }).getAttribute('class')
    ).toBe('logo size-5 logo-anim-hover');
  });

  test('reduced motion overrides every animated variant', () => {
    const reduced = styles.slice(
      styles.indexOf('@media (prefers-reduced-motion: reduce)')
    );
    for (const name of LOGO_ANIMATIONS) {
      if (name === 'pulse') continue;
      expect(reduced).toContain(`logo-anim-${name}`);
    }
  });
});
