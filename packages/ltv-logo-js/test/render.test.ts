import { describe, expect, test } from 'bun:test';
import {
  CONVERGE_ANIMATIONS,
  LEGACY_ANIMATIONS,
  createLogoElement,
  getLogoClass,
  getMarkClass,
  normalizeAnimation,
  normalizeMark,
  normalizeSize,
  normalizeTone,
  renderLogo,
  styles,
  updateLogoElement
} from '../src/index.ts';

describe('normalizers', () => {
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
  ])('size %p → %p', (input, expected) => {
    expect(normalizeSize(input)).toBe(expected);
  });

  test('mark and tone fall back to defaults', () => {
    expect(normalizeMark('legacy')).toBe('legacy');
    expect(normalizeMark('nope')).toBe('converge');
    expect(normalizeTone('dark')).toBe('dark');
    expect(normalizeTone(undefined)).toBe('color');
  });

  test('animation falls back to the default of the mark', () => {
    expect(normalizeAnimation('greet')).toBe('greet');
    expect(normalizeAnimation('pulse')).toBe('assemble');
    expect(normalizeAnimation('greet', 'legacy')).toBe('pulse');
    expect(normalizeAnimation('wave', 'legacy')).toBe('wave');
  });
});

describe('converge mark (default)', () => {
  test('renders the documented markup', () => {
    expect(renderLogo({ size: 5 })).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" class="ltv-mark ltv-anim-assemble ltv-tone-color" viewBox="0 0 120 120" width="80" height="80" role="img" aria-label="LTV">' +
        '<g class="ltv-figure" fill="none" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline class="ltv-stroke ltv-arms" points="37.37,23.37 60,46 82.63,23.37" stroke="#eeb211" />' +
        '<polyline class="ltv-stroke ltv-leg ltv-leg-r" points="103.03,58.72 72.12,67 80.41,97.91" stroke="#3369e8" />' +
        '<polyline class="ltv-stroke ltv-leg ltv-leg-l" points="39.59,97.91 47.88,67 16.97,58.72" stroke="#3369e8" />' +
        '</g></svg>'
    );
  });

  test('size maps to 16 px steps', () => {
    expect(renderLogo({ size: 2 })).toContain('width="32" height="32"');
    expect(renderLogo({ size: 10 })).toContain('width="160" height="160"');
  });

  test.each([
    ['color', '#eeb211', '#3369e8'],
    ['dark', '#f2c240', '#6b93f0'],
    ['mono', '#3369e8', '#3369e8'],
    ['white', '#ffffff', '#ffffff']
  ] as const)('tone %s colours the strokes', (tone, arms, legs) => {
    const svg = createLogoElement({ tone });
    expect(svg.getAttribute('class')).toContain(`ltv-tone-${tone}`);
    expect(svg.querySelector('.ltv-arms')!.getAttribute('stroke')).toBe(arms);
    for (const leg of svg.querySelectorAll('.ltv-leg')) {
      expect(leg.getAttribute('stroke')).toBe(legs);
    }
  });

  test('class list', () => {
    expect(getMarkClass('cheer', 'mono', ' brand ')).toBe(
      'ltv-mark ltv-anim-cheer ltv-tone-mono brand'
    );
  });

  test('every converge animation has CSS and a reduced-motion rule', () => {
    const reduced = styles.slice(
      styles.lastIndexOf('@media (prefers-reduced-motion: reduce)')
    );
    for (const name of CONVERGE_ANIMATIONS) {
      if (name === 'none') continue;
      expect(styles).toContain(`svg.ltv-mark.ltv-anim-${name}`);
      if (name !== 'hover') expect(reduced).toContain(`ltv-anim-${name}`);
    }
  });

  test('escapes attribute values and hides with an empty title', () => {
    expect(renderLogo({ title: '"<x>"' })).toContain(
      'aria-label="&quot;&lt;x&gt;&quot;"'
    );
    const html = renderLogo({ title: '' });
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role=');
  });
});

describe('legacy mark', () => {
  test('renders the 1.x markup', () => {
    expect(renderLogo({ mark: 'legacy', size: 5 })).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" class="logo size-5" role="img" aria-label="LTV">' +
        '<g class="logo-wrapper">' +
        '<g class="logo-letter V"><rect /><rect /></g>' +
        '<g class="logo-letter L"><rect /><rect /></g>' +
        '<g class="logo-letter T"><rect /><rect /></g>' +
        '</g></svg>'
    );
  });

  test('class list', () => {
    expect(getLogoClass()).toBe('logo size-5');
    expect(getLogoClass(5, undefined, 'pulse')).toBe('logo size-5');
    expect(getLogoClass(4, 'brand', 'wave')).toBe(
      'logo size-4 logo-anim-wave brand'
    );
  });

  test('every legacy animation has CSS', () => {
    for (const name of LEGACY_ANIMATIONS) {
      if (name === 'pulse') continue;
      expect(styles).toContain(`svg.logo.logo-anim-${name}`);
    }
  });
});

describe('DOM', () => {
  test('createLogoElement builds an SVG tree', () => {
    const svg = createLogoElement({ size: 8, className: 'x' });
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(svg.getAttribute('class')).toBe(
      'ltv-mark ltv-anim-assemble ltv-tone-color x'
    );
    expect(svg.getAttribute('width')).toBe('128');
    expect(svg.querySelectorAll('polyline').length).toBe(3);
  });

  test('updateLogoElement keeps content for size/label changes', () => {
    const svg = createLogoElement();
    const arms = svg.querySelector('.ltv-arms');
    updateLogoElement(svg, { size: 2, title: '' });
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.hasAttribute('aria-label')).toBe(false);
    expect(svg.querySelector('.ltv-arms')).toBe(arms);
  });

  test('updateLogoElement switches marks', () => {
    const svg = createLogoElement();
    updateLogoElement(svg, { mark: 'legacy', size: 3 });
    expect(svg.getAttribute('class')).toBe('logo size-3');
    expect(svg.hasAttribute('viewBox')).toBe(false);
    expect(svg.querySelectorAll('rect').length).toBe(6);
  });
});
