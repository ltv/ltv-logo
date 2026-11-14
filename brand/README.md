# LTV brand assets

Logo files for every surface, generated from the mark geometry in
`ltv-logo-js` (so they always match the components):

```bash
bun run brand        # regenerates everything in this folder except this README
```

Open `index.html` (via `bun run playground` → `/brand/index.html`, or straight
from disk) to see every file on a checkerboard.

The text in the wordmark and banners is converted to outlines, so no font
needs to be installed. Wordmark: Sora 700. Taglines: IBM Plex Sans 500.

## Which file where

| Need | File |
| --- | --- |
| Website header | `svg/ltv-lockup-horizontal.svg` (dark header: `-dark`) |
| Website favicon | everything in `web/` (snippet below) |
| Documents, slides, email signature | `png/ltv-lockup-horizontal-1200w.png`, `png/ltv-mark-512.png` |
| Print, signage, merchandise | `svg/` (vector). One colour: `-mono` or `-black`; on dark or photos: `-white` |
| Icon 16–32 px | `svg/ltv-mark-small.svg` (one colour, stroke 18) |
| Social profile picture | `social/avatar-400.png` (`-1024` for high-res; `-dark` on navy) |
| Social covers | `social/x-header-1500x500.png`, `social/linkedin-banner-1584x396.png`, `social/facebook-cover-1640x624.png` |
| Link previews (Open Graph / X card) | `web/og-image.png` (1200 × 630) |
| iOS app | `ios/AppIcon.appiconset/` — drop into an Xcode asset catalog (light, dark, tinted) |
| Android app | `android/` — copy into `app/src/main/res/` (adaptive icon with monochrome layer, plus legacy icons) |
| Google Play listing | `android/play-store-512.png` |

## Versions

| Suffix | Colours | Use |
| --- | --- | --- |
| _(none)_ | blue `#3369e8`, yellow `#eeb211`, wordmark `#364c79` | Light backgrounds, 48 px and up |
| `-dark` | blue `#6b93f0`, yellow `#f2c240`, wordmark `#a3bef2` | Dark backgrounds |
| `-mono` | all `#3369e8` | Single-colour use, ≤ 32 px on light backgrounds |
| `-white` | all white | On blue or photos |
| `-black` | all black | Black-and-white print, engraving |

Clear space around the mark: ¼ of the mark's height (already included in the
lockup files). Minimum size: 16 px (use `ltv-mark-small.svg` below 32 px).
Do not recolour, rotate, stretch, or add shadows or gradients.

## HTML `<head>`

Copy the contents of `web/` to the site root, then:

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3369e8">
<meta name="theme-color" content="#3369e8">
<meta name="msapplication-config" content="/browserconfig.xml">

<meta property="og:image" content="https://ltv.vn/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://ltv.vn/og-image.png">
```

`favicon.svg` switches to the dark-theme colours when the browser is in dark
mode; `favicon.ico` holds 16, 32 and 48 px versions for older browsers and
Windows.

## Contents

- `svg/` — mark, wordmark, horizontal and stacked lockups in five versions;
  `ltv-mark-small.svg` for 16–32 px.
- `png/` — the mark at 256, 512 and 1024 px; lockups at 1200 px (horizontal)
  and 800 px (stacked) wide, transparent background.
- `web/` — `favicon.ico` (16/32/48), `favicon.svg`, 16/32 px PNGs,
  `apple-touch-icon.png` (180), PWA `icon-192.png`, `icon-512.png`,
  `icon-maskable-512.png`, `site.webmanifest`, `safari-pinned-tab.svg`,
  `mstile-150x150.png` + `browserconfig.xml`, `og-image.png` and
  `og-image-dark.png` (1200 × 630).
- `social/` — avatars (400, 1024, dark 400), X header, LinkedIn banner,
  Facebook cover.
- `ios/AppIcon.appiconset/` — 1024 px light (opaque white), dark
  (transparent) and tinted icons + `Contents.json`.
- `android/` — `mipmap-{mdpi…xxxhdpi}` with adaptive `ic_launcher_foreground`
  and `ic_launcher_monochrome` (108 dp, mark inside the 66 dp safe zone),
  legacy `ic_launcher` and `ic_launcher_round`; `mipmap-anydpi-v26/ic_launcher.xml`,
  `values/ic_launcher_background.xml` (white); `play-store-512.png`.
