# ltv-logo-js

The animated [LTV](https://ltv.vn) logo for plain JavaScript / TypeScript: an
SVG string renderer, a DOM element factory, an `<ltv-logo>` web component and
a `<script>` bundle. No dependencies.

```bash
npm i ltv-logo-js
```

## Web component

```html
<script src="https://unpkg.com/ltv-logo-js"></script>
<ltv-logo size="5" animation="intro"></ltv-logo>
```

With a bundler:

```ts
import { defineLtvLogoElement } from 'ltv-logo-js';

defineLtvLogoElement(); // registers <ltv-logo>
```

Attributes: `size` (1–10), `animation`, `label`.

## DOM

```ts
import { mountLogo, createLogoElement, updateLogoElement } from 'ltv-logo-js';

const svg = mountLogo('#app', { size: 3, animation: 'assemble' });
updateLogoElement(svg, { size: 8, animation: 'float' });
```

## String / SSR

```ts
import { renderLogo, styles } from 'ltv-logo-js';

const html = `<style>${styles}</style>${renderLogo({ size: 5, animation: 'wave' })}`;
```

Or import the stylesheet: `import 'ltv-logo-js/style.css'`.

## Options

- `size` — `1`…`10`, default `5`
- `animation` — `pulse` (default), `assemble`, `float`, `intro`, `wave`, `hover`, `none`
- `title` — accessible name, default `"LTV"`; `""` hides it from assistive tech
- `className` — extra classes

See the [repository README](https://github.com/ltv/ltv-logo#readme) for the
animation guide and theming.
