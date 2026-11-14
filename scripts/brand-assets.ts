/**
 * Generates the LTV brand asset pack in `brand/`: SVG and PNG marks,
 * wordmark and lockups, web favicons + manifest, social images, and iOS /
 * Android app icons. Everything is derived from the mark geometry and
 * colours in `ltv-logo-js`, and the text is converted to outlines, so the
 * output does not depend on installed fonts.
 *
 *   bun run brand
 */
import { mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import * as opentype from 'opentype.js';
import type { Font, Glyph } from 'opentype.js';
import {
  COLORS,
  CONVERGE_STROKES,
  CONVERGE_STROKE_WIDTH,
  TONE_COLORS
} from '../packages/ltv-logo-js/src/index.ts';
import type { LogoTone } from '../packages/ltv-logo-js/src/index.ts';

const root = join(import.meta.dir, '..');
const out = join(root, 'brand');
const fontDir = (pkg: string) =>
  join(root, 'node_modules/@fontsource', pkg, 'files');

// --- palette (LTV Design System) --------------------------------------------
const WHITE = '#ffffff';
const NAVY = '#0b1326'; // ink / dark surface
const MUTED = '#4a5775'; // ink-muted
const MUTED_DARK = '#a7b4cf';
const BLACK = '#000000';

type Tone = LogoTone | 'black';
const toneColors = (tone: Tone): readonly [arms: string, legs: string] =>
  tone === 'black' ? [BLACK, BLACK] : TONE_COLORS[tone];
const wordmarkColor = (tone: Tone) =>
  ({
    color: COLORS.wordmark,
    dark: COLORS.wordmarkDark,
    mono: COLORS.primary,
    white: WHITE,
    black: BLACK
  })[tone];

// Visible extent of the mark inside its 120 × 120 box (stroke included).
const MARK_INK = { x1: 8.97, y1: 15.37, x2: 111.03, y2: 105.91 };

// --- fonts -------------------------------------------------------------------
async function loadFont(path: string): Promise<Font> {
  const buf = await Bun.file(path).arrayBuffer();
  return opentype.parse(buf);
}

const sora = [
  await loadFont(join(fontDir('sora'), 'sora-latin-700-normal.woff'))
];
const plex = (weight: number) =>
  Promise.all(
    ['latin', 'latin-ext', 'vietnamese'].map((subset) =>
      loadFont(
        join(
          fontDir('ibm-plex-sans'),
          `ibm-plex-sans-${subset}-${weight}-normal.woff`
        )
      )
    )
  );
const plex500 = await plex(500);

interface Text {
  d: string;
  /** Ink bounds relative to the pen origin (baseline at y = 0). */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Lays out `text` as one outlined path, picking glyphs from the first font that has them. */
function outline(
  fonts: Font[],
  text: string,
  size: number,
  tracking = 0
): Text {
  let x = 0;
  let prev: { font: Font; glyph: Glyph } | null = null;
  const parts: string[] = [];
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const char of text) {
    const font =
      fonts.find((f) => f.charToGlyph(char).index !== 0) ?? fonts[0]!;
    const glyph = font.charToGlyph(char);
    const scale = size / font.unitsPerEm;
    if (prev && prev.font === font)
      x += font.getKerningValue(prev.glyph, glyph) * scale;
    const path = glyph.getPath(x, 0, size);
    const box = path.getBoundingBox();
    if (box.x2 > box.x1) {
      parts.push(path.toPathData(2));
      x1 = Math.min(x1, box.x1);
      y1 = Math.min(y1, box.y1);
      x2 = Math.max(x2, box.x2);
      y2 = Math.max(y2, box.y2);
    }
    x += glyph.advanceWidth * scale + tracking * size;
    prev = { font, glyph };
  }
  return { d: parts.join(''), x1, y1, x2, y2 };
}

// --- SVG building blocks -----------------------------------------------------
const n = (v: number) => +v.toFixed(2);

function markGroup(
  tone: Tone,
  x: number,
  y: number,
  box: number,
  strokeWidth = CONVERGE_STROKE_WIDTH
) {
  const [arms, legs] = toneColors(tone);
  const strokes = CONVERGE_STROKES.map(
    ({ part, points }) =>
      `<polyline points="${points}" stroke="${part === 'arms' ? arms : legs}"/>`
  ).join('');
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(box / 120)})" fill="none" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${strokes}</g>`;
}

function textPath(t: Text, x: number, y: number, fill: string) {
  return `<path transform="translate(${n(x)} ${n(y)})" fill="${fill}" d="${t.d}"/>`;
}

function svg(
  w: number,
  h: number,
  body: string,
  background?: string,
  title = 'LTV'
) {
  const bg = background
    ? `<rect width="${w}" height="${h}" fill="${background}"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w)} ${n(h)}" width="${n(w)}" height="${n(h)}" role="img" aria-label="${title}"><title>${title}</title>${bg}${body}</svg>\n`;
}

/** A square icon: background, then the mark box centred at `ratio` of the side. */
function icon(
  size: number,
  tone: Tone,
  ratio: number,
  background?: string,
  strokeWidth?: number
) {
  const box = size * ratio;
  const o = (size - box) / 2;
  return svg(size, size, markGroup(tone, o, o, box, strokeWidth), background);
}

// --- lockups -----------------------------------------------------------------
const WORDMARK_SIZE = 48;
const wordmark = outline(sora, 'LTV', WORDMARK_SIZE, -0.02);

/** Horizontal lockup: mark 1.33 × the font size, `space-4` gap, clear space ¼ of the mark. */
function lockupHorizontal(tone: Tone, background?: string) {
  const M = WORDMARK_SIZE * (4 / 3); // mark box
  const gap = WORDMARK_SIZE / 3;
  const s = M / 120;
  const inkW = (MARK_INK.x2 - MARK_INK.x1) * s;
  const inkH = (MARK_INK.y2 - MARK_INK.y1) * s;
  const pad = inkH / 4;
  const textH = wordmark.y2 - wordmark.y1;
  const h = inkH + pad * 2;
  const markX = pad - MARK_INK.x1 * s;
  const markY = pad - MARK_INK.y1 * s;
  const textX = pad + inkW + gap - wordmark.x1;
  const textY = pad + inkH / 2 + textH / 2 - wordmark.y2;
  const w = pad + inkW + gap + (wordmark.x2 - wordmark.x1) + pad;
  return {
    w,
    h,
    svg: svg(
      w,
      h,
      markGroup(tone, markX, markY, M) +
        textPath(wordmark, textX, textY, wordmarkColor(tone)),
      background
    )
  };
}

/** Stacked lockup: mark above, wordmark centred below. */
function lockupStacked(tone: Tone, background?: string) {
  const M = WORDMARK_SIZE * 2;
  const gap = WORDMARK_SIZE / 3;
  const s = M / 120;
  const inkW = (MARK_INK.x2 - MARK_INK.x1) * s;
  const inkH = (MARK_INK.y2 - MARK_INK.y1) * s;
  const pad = inkH / 4;
  const textW = wordmark.x2 - wordmark.x1;
  const textH = wordmark.y2 - wordmark.y1;
  const w = Math.max(inkW, textW) + pad * 2;
  const h = pad + inkH + gap + textH + pad;
  const markX = (w - inkW) / 2 - MARK_INK.x1 * s;
  const markY = pad - MARK_INK.y1 * s;
  const textX = (w - textW) / 2 - wordmark.x1;
  const textY = pad + inkH + gap - wordmark.y1;
  return {
    w,
    h,
    svg: svg(
      w,
      h,
      markGroup(tone, markX, markY, M) +
        textPath(wordmark, textX, textY, wordmarkColor(tone)),
      background
    )
  };
}

function wordmarkOnly(tone: Tone) {
  const pad = (wordmark.y2 - wordmark.y1) / 4;
  const w = wordmark.x2 - wordmark.x1 + pad * 2;
  const h = wordmark.y2 - wordmark.y1 + pad * 2;
  return svg(
    w,
    h,
    textPath(
      wordmark,
      pad - wordmark.x1,
      pad - wordmark.y1,
      wordmarkColor(tone)
    )
  );
}

/** Banner / Open Graph image: horizontal lockup, tagline below. */
function banner(
  w: number,
  h: number,
  dark: boolean,
  scale: number,
  tagline: string
) {
  const tone: Tone = dark ? 'dark' : 'color';
  const M = 128 * scale;
  const F = 96 * scale;
  const big = outline(sora, 'LTV', F, -0.02);
  const tag = outline(plex500, tagline, 34 * scale);
  const s = M / 120;
  const inkW = (MARK_INK.x2 - MARK_INK.x1) * s;
  const inkH = (MARK_INK.y2 - MARK_INK.y1) * s;
  const gap = F / 3;
  const rowW = inkW + gap + (big.x2 - big.x1);
  const tagGap = 40 * scale;
  const tagH = tag.y2 - tag.y1;
  const blockH = inkH + tagGap + tagH;
  const top = (h - blockH) / 2;
  const left = (w - rowW) / 2;
  const textH = big.y2 - big.y1;
  const body =
    markGroup(tone, left - MARK_INK.x1 * s, top - MARK_INK.y1 * s, M) +
    textPath(
      big,
      left + inkW + gap - big.x1,
      top + inkH / 2 + textH / 2 - big.y2,
      wordmarkColor(tone)
    ) +
    textPath(
      tag,
      (w - (tag.x2 - tag.x1)) / 2 - tag.x1,
      top + inkH + tagGap - tag.y1,
      dark ? MUTED_DARK : MUTED
    );
  return svg(w, h, body, dark ? NAVY : WHITE);
}

// --- writers -----------------------------------------------------------------
const written: string[] = [];

async function write(path: string, data: string | Uint8Array) {
  const file = join(out, path);
  await mkdir(dirname(file), { recursive: true });
  await Bun.write(file, data);
  written.push(path);
}

function png(svgText: string, width: number): Uint8Array {
  return new Resvg(svgText, { fitTo: { mode: 'width', value: width } })
    .render()
    .asPng();
}

/** ICO containing PNG images (supported by every current browser and Windows Vista+). */
function ico(images: { size: number; data: Uint8Array }[]): Uint8Array {
  const header = 6 + images.length * 16;
  const total = header + images.reduce((sum, i) => sum + i.data.length, 0);
  const buf = new Uint8Array(total);
  const view = new DataView(buf.buffer);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);
  let offset = header;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    view.setUint8(e, size >= 256 ? 0 : size);
    view.setUint8(e + 1, size >= 256 ? 0 : size);
    view.setUint16(e + 4, 1, true);
    view.setUint16(e + 6, 32, true);
    view.setUint32(e + 8, data.length, true);
    view.setUint32(e + 12, offset, true);
    buf.set(data, offset);
    offset += data.length;
  });
  return buf;
}

// --- build -------------------------------------------------------------------
// Clear only generated output; brand/README.md is hand-written.
for (const generated of [
  'svg',
  'png',
  'web',
  'social',
  'ios',
  'android',
  'index.html'
]) {
  await rm(join(out, generated), { recursive: true, force: true });
}
const TONES: Tone[] = ['color', 'dark', 'mono', 'white', 'black'];

// Marks, wordmark, lockups (SVG + PNG)
for (const tone of TONES) {
  const suffix = tone === 'color' ? '' : `-${tone}`;
  const mark = icon(120, tone, 1);
  await write(`svg/ltv-mark${suffix}.svg`, mark);
  for (const size of [256, 512, 1024])
    await write(`png/ltv-mark${suffix}-${size}.png`, png(mark, size));

  await write(`svg/ltv-wordmark${suffix}.svg`, wordmarkOnly(tone));

  const h = lockupHorizontal(tone);
  await write(`svg/ltv-lockup-horizontal${suffix}.svg`, h.svg);
  await write(`png/ltv-lockup-horizontal${suffix}-1200w.png`, png(h.svg, 1200));
  const st = lockupStacked(tone);
  await write(`svg/ltv-lockup-stacked${suffix}.svg`, st.svg);
  await write(`png/ltv-lockup-stacked${suffix}-800w.png`, png(st.svg, 800));
}
// Small-size mark: one colour, heavier stroke (16–32 px)
const small = icon(120, 'mono', 1, undefined, 18);
await write('svg/ltv-mark-small.svg', small);

// Web
const favicon16 = png(icon(16, 'mono', 1, undefined, 18), 16);
const favicon32 = png(icon(32, 'mono', 1, undefined, 18), 32);
const favicon48 = png(icon(48, 'color', 1), 48);
await write(
  'web/favicon.ico',
  ico([
    { size: 16, data: favicon16 },
    { size: 32, data: favicon32 },
    { size: 48, data: favicon48 }
  ])
);
await write('web/favicon-16x16.png', favicon16);
await write('web/favicon-32x32.png', favicon32);
const [, legDark] = TONE_COLORS.dark;
const [armDark] = TONE_COLORS.dark;
await write(
  'web/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><style>polyline{stroke:${COLORS.primary}}@media (prefers-color-scheme:dark){.legs polyline{stroke:${legDark}}.arms{stroke:${armDark}!important}}</style><g fill="none" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">${CONVERGE_STROKES.map(
    ({ part, points }) =>
      part === 'arms'
        ? `<polyline class="arms" points="${points}"/>`
        : `<g class="legs"><polyline points="${points}"/></g>`
  ).join('')}</g></svg>\n`
);
await write(
  'web/apple-touch-icon.png',
  png(icon(180, 'color', 0.66, WHITE), 180)
);
await write('web/icon-192.png', png(icon(192, 'color', 0.7, WHITE), 192));
await write('web/icon-512.png', png(icon(512, 'color', 0.7, WHITE), 512));
await write(
  'web/icon-maskable-512.png',
  png(icon(512, 'color', 0.62, WHITE), 512)
);
await write('web/safari-pinned-tab.svg', icon(120, 'black', 1));
await write('web/mstile-150x150.png', png(icon(150, 'white', 0.5), 150));
await write(
  'web/og-image.png',
  png(banner(1200, 630, false, 1.45, 'Make Everything Easier.'), 1200)
);
await write(
  'web/og-image-dark.png',
  png(banner(1200, 630, true, 1.45, 'Make Everything Easier.'), 1200)
);
await write(
  'web/site.webmanifest',
  `${JSON.stringify(
    {
      name: 'LTV',
      short_name: 'LTV',
      description: 'AI Agents cho doanh nghiệp. Make Everything Easier.',
      theme_color: COLORS.primary,
      background_color: WHITE,
      display: 'standalone',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    null,
    2
  )}\n`
);
await write(
  'web/browserconfig.xml',
  `<?xml version="1.0" encoding="utf-8"?>\n<browserconfig>\n  <msapplication>\n    <tile>\n      <square150x150logo src="/mstile-150x150.png"/>\n      <TileColor>${COLORS.primary}</TileColor>\n    </tile>\n  </msapplication>\n</browserconfig>\n`
);

// Social
await write('social/avatar-400.png', png(icon(400, 'color', 0.62, WHITE), 400));
await write(
  'social/avatar-1024.png',
  png(icon(1024, 'color', 0.62, WHITE), 1024)
);
await write(
  'social/avatar-dark-400.png',
  png(icon(400, 'dark', 0.62, NAVY), 400)
);
await write(
  'social/x-header-1500x500.png',
  png(
    banner(
      1500,
      500,
      true,
      0.9,
      'AI Agents cho doanh nghiệp · Make Everything Easier.'
    ),
    1500
  )
);
await write(
  'social/linkedin-banner-1584x396.png',
  png(
    banner(
      1584,
      396,
      false,
      0.72,
      'AI Agents cho doanh nghiệp · Make Everything Easier.'
    ),
    1584
  )
);
await write(
  'social/facebook-cover-1640x624.png',
  png(
    banner(
      1640,
      624,
      false,
      1,
      'AI Agents cho doanh nghiệp · Make Everything Easier.'
    ),
    1640
  )
);

// iOS (single-size app icon, iOS 18 light / dark / tinted)
await write(
  'ios/AppIcon.appiconset/AppIcon-1024.png',
  png(icon(1024, 'color', 0.62, WHITE), 1024)
);
await write(
  'ios/AppIcon.appiconset/AppIcon-dark-1024.png',
  png(icon(1024, 'dark', 0.62), 1024)
);
await write(
  'ios/AppIcon.appiconset/AppIcon-tinted-1024.png',
  png(icon(1024, 'white', 0.62, BLACK), 1024)
);
await write(
  'ios/AppIcon.appiconset/Contents.json',
  `${JSON.stringify(
    {
      images: [
        {
          filename: 'AppIcon-1024.png',
          idiom: 'universal',
          platform: 'ios',
          size: '1024x1024'
        },
        {
          appearances: [{ appearance: 'luminosity', value: 'dark' }],
          filename: 'AppIcon-dark-1024.png',
          idiom: 'universal',
          platform: 'ios',
          size: '1024x1024'
        },
        {
          appearances: [{ appearance: 'luminosity', value: 'tinted' }],
          filename: 'AppIcon-tinted-1024.png',
          idiom: 'universal',
          platform: 'ios',
          size: '1024x1024'
        }
      ],
      info: { author: 'xcode', version: 1 }
    },
    null,
    2
  )}\n`
);

// Android: adaptive icon layers (108 dp, mark inside the 66 dp safe zone) + legacy icons
const densities = {
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4
} as const;
for (const [name, d] of Object.entries(densities)) {
  const adaptive = Math.round(108 * d);
  await write(
    `android/mipmap-${name}/ic_launcher_foreground.png`,
    png(icon(108, 'color', 0.62), adaptive)
  );
  await write(
    `android/mipmap-${name}/ic_launcher_monochrome.png`,
    png(icon(108, 'white', 0.62), adaptive)
  );
  const legacy = Math.round(48 * d);
  await write(
    `android/mipmap-${name}/ic_launcher.png`,
    png(icon(48, 'color', 0.7, WHITE), legacy)
  );
  await write(
    `android/mipmap-${name}/ic_launcher_round.png`,
    png(
      svg(
        48,
        48,
        `<circle cx="24" cy="24" r="24" fill="${WHITE}"/>${markGroup('color', 24 - 48 * 0.31, 24 - 48 * 0.31, 48 * 0.62)}`
      ),
      legacy
    )
  );
}
await write(
  'android/mipmap-anydpi-v26/ic_launcher.xml',
  `<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n  <background android:drawable="@color/ic_launcher_background"/>\n  <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n  <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>\n</adaptive-icon>\n`
);
await write(
  'android/values/ic_launcher_background.xml',
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <color name="ic_launcher_background">${WHITE.toUpperCase()}</color>\n</resources>\n`
);
await write(
  'android/play-store-512.png',
  png(icon(512, 'color', 0.62, WHITE), 512)
);

// Overview page: every image on a checkerboard so transparency is visible.
const SECTION_NAMES: Record<string, string> = {
  svg: 'SVG (vector: web, print, design tools)',
  png: 'PNG (documents, slides, email)',
  web: 'Web: favicons, PWA, Open Graph',
  social: 'Social profiles and covers',
  ios: 'iOS app icon',
  android: 'Android launcher icons'
};
const images = written.filter((p) => /\.(png|svg)$/.test(p));
const sections = [...new Set(images.map((p) => p.split('/')[0]))];
const tiles = (section: string) =>
  images
    .filter((p) => p.startsWith(`${section}/`))
    .map(
      (p) =>
        `<figure><div class="img"><img src="${p}" alt="" loading="lazy"></div><figcaption><a href="${p}">${p.slice(section.length + 1)}</a></figcaption></figure>`
    )
    .join('\n');
await write(
  'index.html',
  `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>LTV brand assets</title>
<link rel="icon" href="web/favicon.svg" type="image/svg+xml">
<style>
  body { margin: 0; padding: 32px 16px 64px; font: 14px/1.5 system-ui, sans-serif; color: ${NAVY}; background: #f4f7fd; }
  main { max-width: 1200px; margin: 0 auto; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  h2 { font-size: 18px; margin: 32px 0 12px; }
  p { margin: 0; color: ${MUTED}; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  figure { margin: 0; background: #fff; border: 1px solid #d9e0ee; border-radius: 12px; overflow: hidden; }
  .img { height: 160px; display: grid; place-items: center; padding: 12px;
    background: repeating-conic-gradient(#e9edf5 0 25%, #fff 0 50%) 0 0 / 16px 16px; }
  .img img { max-width: 100%; max-height: 136px; }
  figcaption { padding: 8px 12px; font: 12px ui-monospace, monospace; word-break: break-all; }
  a { color: #2554c7; }
</style>
</head>
<body>
<main>
<h1>LTV brand assets</h1>
<p>Generated by <code>bun run brand</code> from the mark geometry in ltv-logo-js. ${written.length} files.</p>
${sections.map((s) => `<h2>${SECTION_NAMES[s!] ?? s}</h2>\n<div class="grid">\n${tiles(s!)}\n</div>`).join('\n')}
</main>
</body>
</html>
`
);

console.log(`brand/: ${written.length} files`);
