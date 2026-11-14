/**
 * Packs every publishable package into `.release/` with `bun pm pack`
 * (which rewrites `workspace:*` to real versions) and checks the result.
 * Prints the tarball paths, one per line.
 */
import { mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');
const out = join(root, '.release');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const dirs = await readdir(join(root, 'packages'), { withFileTypes: true });
const tarballs: string[] = [];

for (const dir of dirs.filter((d) => d.isDirectory())) {
  const cwd = join(root, 'packages', dir.name);
  const pkg = await Bun.file(join(cwd, 'package.json')).json();
  if (pkg.private) continue;

  const pack = Bun.spawnSync(
    ['bun', 'pm', 'pack', '--quiet', '--destination', out],
    { cwd, stderr: 'inherit' }
  );
  if (pack.exitCode !== 0) throw new Error(`bun pm pack failed in ${dir.name}`);
  const file = join(
    out,
    pack.stdout.toString().trim().split('\n').pop()!.split('/').pop()!
  );

  const manifest = Bun.spawnSync([
    'tar',
    '-xOzf',
    file,
    'package/package.json'
  ]);
  const packed = JSON.parse(manifest.stdout.toString());
  const deps = JSON.stringify({
    ...packed.dependencies,
    ...packed.peerDependencies
  });
  if (deps.includes('workspace:')) {
    throw new Error(
      `${pkg.name}: workspace: protocol left in the packed manifest`
    );
  }
  const listing = Bun.spawnSync(['tar', '-tzf', file]).stdout.toString();
  for (const required of [
    'package/dist/index.js',
    'package/dist/index.cjs',
    'package/dist/index.d.ts',
    'package/README.md'
  ]) {
    if (!listing.includes(required))
      throw new Error(`${pkg.name}: ${required} missing from tarball`);
  }
  tarballs.push(file);
}

console.log(tarballs.join('\n'));
