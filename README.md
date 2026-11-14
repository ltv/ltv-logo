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
<ltv-logo size="5" animation="intro"></ltv-logo>
```

```vue
<script setup lang="ts">
import LtvLogo from 'ltv-logo-vue';
</script>

<template>
  <LtvLogo :size="5" animation="intro" />
</template>
```

```tsx
import LtvLogo from 'ltv-logo-react';

export const Header = () => <LtvLogo size={5} animation="intro" />;
```

Styles are injected automatically on mount. To ship them as a stylesheet
instead (for example for SSR without a flash), import
`ltv-logo-js/style.css` (also re-exported as `ltv-logo-vue/style.css` and
`ltv-logo-react/style.css`).

## Options

| Option | Values | Default |
| --- | --- | --- |
| `size` | `1` (smallest) … `10` (largest). Out-of-range values are clamped. | `5` |
| `animation` | `pulse`, `assemble`, `float`, `intro`, `wave`, `hover`, `none` | `pulse` |
| `title` (`label` attribute on `<ltv-logo>`) | Accessible name. `""` hides the logo from assistive tech. | `"LTV"` |

### Animations

| Name | What it does | Use it for |
| --- | --- | --- |
| `pulse` | The original loop: letters converge and spread | Default, backwards compatible |
| `assemble` | Letters fly in from their own direction and settle once (800 ms, staggered 90 ms) | Splash screen, first view |
| `float` | Each letter drifts slowly, out of phase | Hero sections |
| `intro` | `assemble`, then `float` | The most expressive option |
| `wave` | Letters bob one after another (1.4 s loop) | Loading indicator |
| `hover` | Static; letters spread slightly on hover / keyboard focus | Logo link in a header |
| `none` | Static brand mark | Print, footers |

All animations use only `transform` / `opacity` (GPU-friendly) and respect
`prefers-reduced-motion`: loops become a gentle opacity pulse, entrances
become a short fade, and ambient / hover motion is turned off.

Colours can be themed with CSS custom properties:

```css
svg.logo {
  --ltv-logo-l: #3369e8; /* blue  */
  --ltv-logo-v: #f4b400; /* yellow */
  --ltv-logo-t: #0f9d58; /* green */
}
```

### Rendered HTML

```html
<svg xmlns="http://www.w3.org/2000/svg" class="logo size-5 logo-anim-intro" role="img" aria-label="LTV">
  <g class="logo-wrapper">
    <g class="logo-letter V"><rect /><rect /></g>
    <g class="logo-letter L"><rect /><rect /></g>
    <g class="logo-letter T"><rect /><rect /></g>
  </g>
</svg>
```

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
