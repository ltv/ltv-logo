import { join } from 'node:path';
import { buildPackage } from '../../../scripts/build-package.ts';
import { styles } from '../src/styles.ts';

const cwd = join(import.meta.dir, '..');

await buildPackage({
  cwd,
  extra: [
    {
      // <script src="https://unpkg.com/ltv-logo-js"> → window.LtvLogo
      entrypoints: [join(cwd, 'src/browser.ts')],
      format: 'iife',
      naming: 'ltv-logo.iife.js',
      target: 'browser',
      minify: true,
      sourcemap: 'linked'
    }
  ]
});

await Bun.write(join(cwd, 'dist/style.css'), styles);
console.log('ltv-logo-js built');
