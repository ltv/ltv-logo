import { describe, expect, test } from 'bun:test';
import { nextVersion } from './bump-version.ts';
import { compare, inc, isValid } from './semver.ts';

describe('inc', () => {
  test.each([
    ['1.0.0', 'patch', '1.0.1'],
    ['1.0.0', 'minor', '1.1.0'],
    ['1.2.3', 'major', '2.0.0'],
    ['1.2.3', 'prepatch', '1.2.4-beta.0'],
    ['1.2.3', 'preminor', '1.3.0-beta.0'],
    ['1.2.3', 'premajor', '2.0.0-beta.0'],
    ['1.2.3', 'prerelease', '1.2.4-beta.0'],
    ['2.0.0-beta.0', 'prerelease', '2.0.0-beta.1'],
    ['2.0.0-beta.9', 'prerelease', '2.0.0-beta.10'],
    ['2.0.0-alpha.3', 'prerelease', '2.0.0-beta.0'],
    ['2.0.0-beta.1', 'major', '2.0.0'],
    ['2.1.0-beta.1', 'minor', '2.1.0'],
    ['2.1.1-beta.1', 'patch', '2.1.1'],
    ['2.1.1-beta.1', 'minor', '2.2.0'],
    ['2.1.1-beta.1', 'major', '3.0.0']
  ] as const)('%s + %s → %s', (from, type, to) => {
    expect(inc(from, type)).toBe(to);
  });

  test('custom preid', () =>
    expect(inc('1.0.0', 'premajor', 'rc')).toBe('2.0.0-rc.0'));
  test('rejects invalid preid', () =>
    expect(() => inc('1.0.0', 'prerelease', 'a b')).toThrow());
});

describe('validation', () => {
  test.each(['1.0.0', '0.0.1', '1.0.0-rc.1', '1.0.0+build.5'])(
    '%s is valid',
    (v) => expect(isValid(v)).toBe(true)
  );
  test.each(['1.0', 'v1.0.0', '01.0.0', '1.0.0-', '1.0.0-01'])(
    '%s is invalid',
    (v) => expect(isValid(v)).toBe(false)
  );
  test('precedence', () => {
    expect(compare('1.0.0-beta.2', '1.0.0-beta.10')).toBe(-1);
    expect(compare('1.0.0-rc.1', '1.0.0')).toBe(-1);
  });
});

describe('nextVersion', () => {
  test('accepts an explicit version', () =>
    expect(nextVersion('1.0.0', 'v2.0.0')).toBe('2.0.0'));
  test('refuses to go backwards', () =>
    expect(() => nextVersion('2.0.0', '1.9.9')).toThrow());
  test('refuses garbage', () =>
    expect(() => nextVersion('1.0.0', 'banana')).toThrow());
});
