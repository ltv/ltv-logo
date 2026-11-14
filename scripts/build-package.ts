/**
 * Shared build for every package: bundles `src/index.ts` to ESM + CJS with
 * Bun's bundler, keeps dependencies external, and emits `.d.ts` with tsc.
 *
 * Usage (from a package directory): `bun ../../scripts/build-package.ts`
 */
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

export interface BuildOptions {
  cwd?: string;
  entry?: string;
  /** Extra bundles, e.g. a browser IIFE. */
  extra?: Parameters<typeof Bun.build>[0][];
}

export async function buildPackage(options: BuildOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const entry = join(cwd, options.entry ?? 'src/index.ts');
  const outdir = join(cwd, 'dist');
  await rm(outdir, { recursive: true, force: true });

  const builds = [
    { format: 'esm' as const, naming: 'index.js' },
    { format: 'cjs' as const, naming: 'index.cjs' }
  ].map(({ format, naming }) =>
    Bun.build({
      entrypoints: [entry],
      outdir,
      format,
      naming,
      target: 'browser',
      packages: 'external',
      sourcemap: 'linked',
      minify: false,
      jsx: { runtime: 'automatic', development: false },
      define: { 'process.env.NODE_ENV': '"production"' }
    })
  );

  for (const extra of options.extra ?? []) {
    builds.push(Bun.build({ outdir, ...extra }));
  }

  for (const result of await Promise.all(builds)) {
    if (!result.success) {
      for (const log of result.logs) console.error(log);
      throw new Error('Bundling failed');
    }
  }

  const tsc = Bun.spawnSync(['bunx', 'tsc', '-p', 'tsconfig.build.json'], {
    cwd,
    stdout: 'inherit',
    stderr: 'inherit'
  });
  if (tsc.exitCode !== 0) throw new Error('Type declaration build failed');
}

if (import.meta.main) {
  await buildPackage();
}
