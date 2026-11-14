import { describe, expect, test } from 'bun:test';
import { createApp, createSSRApp, h, nextTick, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { STYLE_ELEMENT_ID, renderLogo } from 'ltv-logo-js';
import type { LogoOptions } from 'ltv-logo-js';
import LtvLogo, { LtvLogoPlugin } from '../src/index.ts';

/** Vue SSR writes `<polyline ...></polyline>`; compare with self-closing tags. */
const normalize = (html: string) =>
  html
    .replace(/<!--.*?-->/g, '')
    .replace(/<(\w+)([^<>]*?)><\/\1>/g, '<$1$2 />')
    .replace(/\s*\/>/g, ' />');

const ssr = (props: LogoOptions) =>
  renderToString(createSSRApp({ render: () => h(LtvLogo, props) }));

describe('LtvLogo (Vue 3)', () => {
  test.each([
    [{ size: 7 }],
    [{ animation: 'cheer', tone: 'dark' }],
    [{ mark: 'legacy', size: 4, animation: 'wave' }]
  ] as [LogoOptions][])(
    'SSR output matches the vanilla renderer: %o',
    async (props) => {
      expect(normalize(await ssr(props))).toBe(renderLogo(props));
    }
  );

  test('defaults to the converge mark at size 5', async () => {
    const html = await renderToString(createSSRApp(LtvLogo));
    expect(html).toContain('class="ltv-mark ltv-anim-assemble ltv-tone-color"');
    expect(html).toContain('width="80"');
  });

  test('mounts in the DOM, injects styles and reacts to prop changes', async () => {
    const animation = ref<'greet' | 'work'>('greet');
    const root = document.createElement('div');
    const app = createApp({
      render: () => h(LtvLogo, { size: 2, animation: animation.value })
    });
    app.mount(root);

    const svg = () => root.querySelector('svg')!;
    expect(svg().getAttribute('class')).toBe(
      'ltv-mark ltv-anim-greet ltv-tone-color'
    );
    expect(document.getElementById(STYLE_ELEMENT_ID)).not.toBeNull();

    animation.value = 'work';
    await nextTick();
    expect(svg().getAttribute('class')).toBe(
      'ltv-mark ltv-anim-work ltv-tone-color'
    );
    app.unmount();
  });

  test('plugin registers the component globally', () => {
    const root = document.createElement('div');
    const app = createApp({ render: () => h('div') });
    app.use(LtvLogoPlugin);
    expect(app.component('LtvLogo')).toBe(LtvLogo);
    app.mount(root);
    app.unmount();
  });
});
