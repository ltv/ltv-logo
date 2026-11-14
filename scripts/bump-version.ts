/**
 * Bumps every publishable package (lockstep) and the root to the next
 * SemVer version.
 *
 *   bun scripts/bump-version.ts <major|minor|patch|premajor|preminor|prepatch|prerelease|X.Y.Z> [--preid beta] [--dry-run]
 *
 * In GitHub Actions it also writes `version`, `tag`, `prerelease` and
 * `npm_tag` to $GITHUB_OUTPUT.
 */
import { appendFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { RELEASE_TYPES, compare, inc, isValid, parse } from './semver.ts';
import type { ReleaseType } from './semver.ts';

const root = join(import.meta.dir, '..');

export async function manifestPaths(): Promise<string[]> {
  const dirs = await readdir(join(root, 'packages'), { withFileTypes: true });
  return [
    join(root, 'package.json'),
    ...dirs
      .filter((d) => d.isDirectory())
      .map((d) => join(root, 'packages', d.name, 'package.json'))
  ];
}

export function nextVersion(
  current: string,
  release: string,
  preid?: string
): string {
  const next = (RELEASE_TYPES as readonly string[]).includes(release)
    ? inc(current, release as ReleaseType, preid)
    : release.replace(/^v/, '');
  if (!isValid(next)) throw new Error(`Invalid version: "${release}"`);
  if (compare(next, current) <= 0) {
    throw new Error(`Next version ${next} must be greater than ${current}`);
  }
  return next;
}

async function main() {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    allowPositionals: true,
    options: {
      preid: { type: 'string', default: 'beta' },
      'dry-run': { type: 'boolean', default: false }
    }
  });
  const release = positionals[0];
  if (!release) {
    console.error(
      `Usage: bun scripts/bump-version.ts <${RELEASE_TYPES.join('|')}|X.Y.Z> [--preid beta] [--dry-run]`
    );
    process.exit(1);
  }

  const paths = await manifestPaths();
  const rootPkg = await Bun.file(paths[0]!).json();
  const current: string = rootPkg.version;
  const version = nextVersion(current, release, values.preid);

  for (const path of paths) {
    const text = await Bun.file(path).text();
    const pkg = JSON.parse(text);
    if (pkg.version !== current) {
      throw new Error(
        `${path} is at ${pkg.version}, expected ${current} (packages are versioned in lockstep)`
      );
    }
    // Replace only the top-level "version" value so formatting is preserved.
    const updated = text.replace(
      /^(\s{2}"version":\s*")[^"]*(")/m,
      `$1${version}$2`
    );
    if (JSON.parse(updated).version !== version) {
      throw new Error(`Could not update the version in ${path}`);
    }
    if (!values['dry-run']) await Bun.write(path, updated);
  }

  const prerelease = parse(version).prerelease;
  const outputs = {
    version,
    previous: current,
    tag: `v${version}`,
    prerelease: String(prerelease.length > 0),
    // npm dist-tag: pre-releases never become `latest`
    npm_tag: prerelease.length ? String(prerelease[0]) : 'latest'
  };
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      Object.entries(outputs)
        .map(([k, v]) => `${k}=${v}\n`)
        .join('')
    );
  }
  console.log(
    `${values['dry-run'] ? '[dry-run] ' : ''}${current} → ${version} (${paths.length} manifests)`
  );
}

if (import.meta.main) await main();
