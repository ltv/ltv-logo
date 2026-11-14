# LTV Logo

![LTV Co., Ltd](./logo.png)

[LTV Official Website](https://ltv.vn)

The animated LTV logo as an SVG, for every stack:

| Package | Version | For |
| --- | --- | --- |
| [`ltv-logo-js`](./packages/ltv-logo-js) | [![npm](https://img.shields.io/npm/v/ltv-logo-js)](https://www.npmjs.com/package/ltv-logo-js) | Plain JavaScript / TypeScript, `<ltv-logo>` web component, `<script>` tag, SSR string |
| [`ltv-logo-vue`](./packages/ltv-logo-vue) | [![npm](https://img.shields.io/npm/v/ltv-logo-vue)](https://www.npmjs.com/package/ltv-logo-vue) | Vue 3 |
| [`ltv-logo-react`](./packages/ltv-logo-react) | [![npm](https://img.shields.io/npm/v/ltv-logo-react)](https://www.npmjs.com/package/ltv-logo-react) | React 18 / 19 |

## Quick start

```bash
bun add ltv-logo-js     # or: npm i ltv-logo-js
bun add ltv-logo-vue    # Vue 3
bun add ltv-logo-react  # React
```

```html
<!-- No build step -->
<script src="https://unpkg.com/ltv-logo-js"></script>
<ltv-logo size="5" animation="greet"></ltv-logo>
```

```vue
<script setup lang="ts">
import LtvLogo from 'ltv-logo-vue';
</script>

<template>
  <LtvLogo :size="5" animation="greet" />
</template>
```

```tsx
import LtvLogo from 'ltv-logo-react';

export const Header = () => <LtvLogo size={5} animation="greet" />;
```

Styles are injected automatically on mount. To ship them as a stylesheet
instead (for example for SSR without a flash), import
`ltv-logo-js/style.css` (also re-exported as `ltv-logo-vue/style.css` and
`ltv-logo-react/style.css`).

## The mark

The **Hội tụ** mark (2026): three 90° round-capped strokes pointing at one
centre, rotated 120° apart — two blue (`brand`), the top one yellow
(`spark`). Built on a 120 × 120 grid (stroke 16, arms 32, vertices 14 from
the centre), every stroke end inside a circle of radius 52, so it sits
centred in square, round and rectangular frames.

The yellow stroke reads as raised arms and the blue strokes as legs, so the
animations treat the mark as a small agent character.

The original L·T·V mark (2015–2026) is still available as `mark="legacy"`.

## Options

| Option | Values | Default |
| --- | --- | --- |
| `mark` | `converge`, `legacy` | `converge` |
| `size` | `1` … `10`, clamped. Converge: `size × 16` px square (5 → 80 px). Legacy: the 1.x scale. | `5` |
| `animation` | See below; depends on `mark` | `assemble` / `pulse` |
| `tone` (converge) | `color`, `dark`, `mono`, `white` | `color` |
| `title` (`label` attribute on `<ltv-logo>`) | Accessible name. `""` hides the logo from assistive tech. | `"LTV"` |

### Tones (converge)

| Tone | Use |
| --- | --- |
| `color` | Light backgrounds, 48 px and up |
| `dark` | Dark backgrounds (lighter blue and yellow) |
| `mono` | Icons and favicons ≤ 32 px on light backgrounds, single-colour print |
| `white` | On blue or photographic backgrounds |

### Animations (converge)

| Name | What the agent does | Use it for |
| --- | --- | --- |
| `assemble` | The strokes fly in along their own axis and lock (800 ms, once) | Default, first view |
| `idle` | Breathes: arms rise a little, legs settle (3.2 s loop) | Ambient, hero sections |
| `greet` | Waves hello with its arms | Welcome screens, chat greeting |
| `cheer` | Crouches, jumps and lands | A task just finished |
| `work` | Turns a third at a time (120° gives the same shape), pausing between | Loading / busy indicator |
| `hover` | Static; perks up on hover or keyboard focus | Logo link in a header |
| `none` | Static mark | Print, footers |

### Animations (legacy)

`pulse` (default, the 1.x loop), `assemble`, `float`, `intro`, `wave`,
`hover`, `none`.

All animations use only `transform` / `opacity` and respect
`prefers-reduced-motion`: loops stop (the `work` loader keeps a gentle
opacity pulse so "busy" stays visible), entrances become a short fade, and
hover motion is off.

### Theming

```css
svg.ltv-mark {
  --ltv-logo-primary: #3369e8; /* legs (blue) */
  --ltv-logo-accent: #eeb211; /* arms (yellow) */
  --ltv-logo-primary-dark: #6b93f0; /* tone="dark" */
  --ltv-logo-accent-dark: #f2c240;
}
```

The wordmark next to the mark is "LTV" set in Sora 700, colour `#364c79`
(`#a3bef2` on dark) — see the LTV Design System.

### Rendered HTML

```html
<svg xmlns="http://www.w3.org/2000/svg" class="ltv-mark ltv-anim-assemble ltv-tone-color"
     viewBox="0 0 120 120" width="80" height="80" role="img" aria-label="LTV">
  <g class="ltv-figure" fill="none" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
    <polyline class="ltv-stroke ltv-arms" points="37.37,23.37 60,46 82.63,23.37" stroke="#eeb211" />
    <polyline class="ltv-stroke ltv-leg ltv-leg-r" points="103.03,58.72 72.12,67 80.41,97.91" stroke="#3369e8" />
    <polyline class="ltv-stroke ltv-leg ltv-leg-l" points="39.59,97.91 47.88,67 16.97,58.72" stroke="#3369e8" />
  </g>
</svg>
```

Stroke colours are also set as attributes, so the mark renders correctly
even without the stylesheet.

## Migrating from 1.x

- The default mark is now `converge`. Pass `mark="legacy"` to keep the
  L·T·V logo and its animations exactly as before.
- `LOGO_ANIMATIONS` is now `{ converge: [...], legacy: [...] }`; use
  `CONVERGE_ANIMATIONS` / `LEGACY_ANIMATIONS` for flat lists.
- `ltv-logo-vue` requires Vue 3.3+ (see its README).

## Development

This is a [Bun](https://bun.sh) workspace monorepo.

```bash
bun install
bun run build        # build all packages (ltv-logo-js first)
bun test             # unit tests (happy-dom, Vue SSR, React DOM)
bun run typecheck
bun run format       # prettier

bun run playground   # http://localhost:4173/playground/ — every animation side by side
bun run dev:js       # per-package demo with hot reload
bun run dev:vue
bun run dev:react
```

`playground/index.html` can also be opened directly from disk after
`bun run build`.

### Layout

```
packages/
  ltv-logo-js/     core: SVG markup, stylesheet, <ltv-logo> element, IIFE bundle
  ltv-logo-vue/    Vue 3 component (depends on ltv-logo-js)
  ltv-logo-react/  React component (depends on ltv-logo-js)
playground/        standalone HTML test page
scripts/           shared build, version bump, pack, playground server
```

## Releasing

Releases are cut by the **Release** GitHub Actions workflow
(`Actions → Release → Run workflow`):

1. Pick a SemVer bump — `patch`, `minor`, `major`, `prepatch`, `preminor`,
   `premajor`, `prerelease` (with a `preid` such as `beta` or `rc`) — or type
   an explicit version.
2. The workflow bumps every package in lockstep, runs format check, build,
   typecheck and tests, packs the tarballs, commits
   `chore(release): vX.Y.Z`, tags `vX.Y.Z`, publishes to npm with
   provenance, pushes, and creates a GitHub Release with generated notes
   and the tarballs attached.
3. Pre-releases are published under their `preid` dist-tag (e.g. `beta`)
   and marked as pre-release on GitHub; normal releases go to `latest`.

Use **dry run** to try a release without publishing or pushing anything.

One-time setup:

- Add an `NPM_TOKEN` repository secret (an npm automation / granular token
  with publish rights to the three packages), **or** configure npm
  [trusted publishing](https://docs.npmjs.com/trusted-publishers) for
  `.github/workflows/release.yml` and drop the token.
- If `master` is protected, allow GitHub Actions to push the release commit
  and tag.

Locally you can preview a bump with:

```bash
bun scripts/bump-version.ts minor --dry-run
```
