import { join } from 'node:path';
import { styles } from 'ltv-logo-js';
import { buildPackage } from '../../../scripts/build-package.ts';

const cwd = join(import.meta.dir, '..');
await buildPackage({ cwd });
await Bun.write(join(cwd, 'dist/style.css'), styles);
console.log('ltv-logo-react built');
