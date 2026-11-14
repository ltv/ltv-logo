import { afterEach, describe, expect, test } from 'bun:test';
import {
  STYLE_ELEMENT_ID,
  buildStyles,
  injectStyles,
  styles
} from '../src/index.ts';

afterEach(() => document.getElementById(STYLE_ELEMENT_ID)?.remove());

describe('styles', () => {
  test('defines a rule for every size', () => {
    for (let i = 1; i <= 10; i++) {
      expect(styles).toContain(`svg.logo.size-${i} {`);
    }
  });

  test('defines one animation per letter', () => {
    for (const letter of ['L', 'T', 'V']) {
      expect(styles).toContain(`@keyframes logo-am-${letter} {`);
    }
  });

  test('is deterministic', () => expect(buildStyles()).toBe(styles));

  test('matches snapshot', () => expect(styles).toMatchSnapshot());
});

describe('injectStyles', () => {
  test('injects once', () => {
    const first = injectStyles();
    const second = injectStyles();
    expect(first).not.toBeNull();
    expect(second).toBe(first!);
    expect(document.querySelectorAll(`#${STYLE_ELEMENT_ID}`).length).toBe(1);
    expect(first!.textContent).toBe(styles);
  });

  test('no-op without a document', () => {
    expect(injectStyles(null)).toBeNull();
  });
});
