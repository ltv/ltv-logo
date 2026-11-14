# ltv-logo-react

The animated [LTV](https://ltv.vn) logo as a React component (React 18 / 19).

```bash
npm i ltv-logo-react
```

```tsx
import LtvLogo from 'ltv-logo-react';

export function Header() {
  return (
    <a href="/" aria-label="Home">
      <LtvLogo size={2} animation="hover" title="" />
    </a>
  );
}
```

Props:

- `mark` — `converge` (Hội tụ, default) or `legacy` (the 1.x L·T·V mark)
- `size` — `1`…`10`, default `5` (converge: size × 16 px)
- `tone` — converge only: `color` (default), `dark`, `mono`, `white`
- `animation` — converge: `assemble` (default), `idle`, `greet`, `cheer`, `work`, `hover`, `none`; legacy: `pulse` (default), `assemble`, `float`, `intro`, `wave`, `hover`, `none`
- `title` — accessible name, default `"LTV"`; `""` hides it from assistive tech
- any other SVG prop (`className`, `style`, `ref`, `onClick`, …) is forwarded

Styles are injected automatically (`useInsertionEffect`). For SSR you can also
import `ltv-logo-react/style.css`.

See the [repository README](https://github.com/ltv/ltv-logo#readme) for the
animation guide and theming.
