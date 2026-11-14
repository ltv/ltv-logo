/** Minimal SemVer 2.0.0 helpers (no dependencies). https://semver.org */

// Official SemVer regex (without build metadata support for bumps).
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const RELEASE_TYPES = [
  'major',
  'minor',
  'patch',
  'premajor',
  'preminor',
  'prepatch',
  'prerelease'
] as const;
export type ReleaseType = (typeof RELEASE_TYPES)[number];

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
}

export function isValid(version: string): boolean {
  return SEMVER.test(version);
}

export function parse(version: string): SemVer {
  const m = SEMVER.exec(version);
  if (!m) throw new Error(`Invalid semver version: "${version}"`);
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: m[4] ? m[4].split('.') : []
  };
}

export function format(v: SemVer): string {
  const core = `${v.major}.${v.minor}.${v.patch}`;
  return v.prerelease.length ? `${core}-${v.prerelease.join('.')}` : core;
}

const PREID = /^[0-9A-Za-z-]+$/;

/** Same semantics as `npm version` / node-semver `inc`. */
export function inc(
  version: string,
  type: ReleaseType,
  preid = 'beta'
): string {
  if (!PREID.test(preid)) throw new Error(`Invalid pre-release id: "${preid}"`);
  const v = parse(version);
  const isPre = v.prerelease.length > 0;
  const next: SemVer = { ...v, prerelease: [] };

  switch (type) {
    case 'major':
      // 2.0.0-beta.1 → 2.0.0 ; 1.4.2 → 2.0.0
      if (!(isPre && v.minor === 0 && v.patch === 0)) {
        next.major++;
        next.minor = 0;
        next.patch = 0;
      }
      break;
    case 'minor':
      if (!(isPre && v.patch === 0)) {
        next.minor++;
        next.patch = 0;
      }
      break;
    case 'patch':
      if (!isPre) next.patch++;
      break;
    case 'premajor':
      next.major++;
      next.minor = 0;
      next.patch = 0;
      next.prerelease = [preid, '0'];
      break;
    case 'preminor':
      next.minor++;
      next.patch = 0;
      next.prerelease = [preid, '0'];
      break;
    case 'prepatch':
      next.patch++;
      next.prerelease = [preid, '0'];
      break;
    case 'prerelease': {
      if (!isPre) {
        next.patch++;
        next.prerelease = [preid, '0'];
        break;
      }
      const [id, num, ...rest] = v.prerelease;
      if (
        id === preid &&
        num !== undefined &&
        /^\d+$/.test(num) &&
        !rest.length
      ) {
        next.prerelease = [preid, String(Number(num) + 1)];
      } else {
        next.prerelease = [preid, '0'];
      }
      break;
    }
  }
  return format(next);
}

/** Compares two versions: -1, 0 or 1 (SemVer precedence). */
export function compare(a: string, b: string): -1 | 0 | 1 {
  return Bun.semver.order(a, b);
}
