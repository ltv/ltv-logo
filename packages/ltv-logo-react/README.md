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
      <LtvLogo size={3} animation="hover" title="" />
    </a>
  );
}
```

Props:

- `size` — `1`…`10`, default `5`
- `animation` — `pulse` (default), `assemble`, `float`, `intro`, `wave`, `hover`, `none`
- `title` — accessible name, default `"LTV"`; `""` hides it from assistive tech
- any other SVG prop (`className`, `style`, `ref`, `onClick`, …) is forwarded

Styles are injected automatically (`useInsertionEffect`). For SSR you can also
import `ltv-logo-react/style.css`.

See the [repository README](https://github.com/ltv/ltv-logo#readme) for the
animation guide and theming.
