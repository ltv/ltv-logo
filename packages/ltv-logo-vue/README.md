# ltv-logo-vue

The animated [LTV](https://ltv.vn) logo as a Vue 3 component.

```bash
npm i ltv-logo-vue
```

```vue
<script setup lang="ts">
import LtvLogo from 'ltv-logo-vue';
</script>

<template>
  <LtvLogo :size="5" animation="greet" />
</template>
```

Register globally:

```ts
import { createApp } from 'vue';
import { LtvLogoPlugin } from 'ltv-logo-vue';

createApp(App).use(LtvLogoPlugin).mount('#app'); // <LtvLogo> / <ltv-logo>
```

Props:

- `mark` — `converge` (Hội tụ, default) or `legacy` (the 1.x L·T·V mark)
- `size` — `1`…`10`, default `5` (converge: size × 16 px)
- `tone` — converge only: `color` (default), `dark`, `mono`, `white`
- `animation` — converge: `assemble` (default), `idle`, `greet`, `cheer`, `work`, `hover`, `none`; legacy: `pulse` (default), `assemble`, `float`, `intro`, `wave`, `hover`, `none`
- `title` — accessible name, default `"LTV"`; `""` hides it from assistive tech

Styles are injected on mount. For SSR you can also import
`ltv-logo-vue/style.css`.

## Migrating from 1.x (Vue 2)

- Requires Vue 3.3+. The class-component API is gone; the default export is
  now a regular `defineComponent` component.
- `ltv-logo-vue.css` is now `ltv-logo-vue/style.css`, and is injected
  automatically, so the import is optional.
- The rendered `<svg>` gains `xmlns`, `role="img"` and `aria-label`.

See the [repository README](https://github.com/ltv/ltv-logo#readme) for the
animation guide and theming.
