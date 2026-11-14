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

interface Workspace {
  dir: string;
  pkg: {
    name: string;
    private?: boolean;
    dependencies?: Record<string, string>;
  };
}
const workspaces: Workspace[] = [];
for (const d of dirs.filter((d) => d.isDirectory())) {
  const pkg = await Bun.file(
    join(root, 'packages', d.name, 'package.json')
  ).json();
  if (!pkg.private) workspaces.push({ dir: d.name, pkg });
}

/**
 * Dependency order: a package comes after the workspace packages it depends
 * on, so the release publishes `ltv-logo-js` before `ltv-logo-vue` and
 * `ltv-logo-react` and never leaves a published version pointing at an
 * unpublished one.
 */
function dependencyOrder(list: Workspace[]): Workspace[] {
  const names = new Set(list.map((w) => w.pkg.name));
  const done = new Set<string>();
  const ordered: Workspace[] = [];
  const visit = (w: Workspace, path: string[] = []) => {
    if (done.has(w.pkg.name)) return;
    if (path.includes(w.pkg.name)) {
      throw new Error(
        `Workspace dependency cycle: ${[...path, w.pkg.name].join(' → ')}`
      );
    }
    for (const dep of Object.keys(w.pkg.dependencies ?? {})) {
      const target = list.find((x) => x.pkg.name === dep);
      if (target && names.has(dep)) visit(target, [...path, w.pkg.name]);
    }
    done.add(w.pkg.name);
    ordered.push(w);
  };
  for (const w of [...list].sort((a, b) =>
    a.pkg.name.localeCompare(b.pkg.name)
  ))
    visit(w);
  return ordered;
}

for (const { dir: dirName, pkg } of dependencyOrder(workspaces)) {
  const dir = { name: dirName };
  const cwd = join(root, 'packages', dir.name);

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
