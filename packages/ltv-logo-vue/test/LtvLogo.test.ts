import { describe, expect, test } from 'bun:test';
import { createApp, createSSRApp, h, nextTick, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { STYLE_ELEMENT_ID, renderLogo } from 'ltv-logo-js';
import LtvLogo, { LtvLogoPlugin } from '../src/index.ts';

const normalize = (html: string) =>
  html
    .replace(/<!--.*?-->/g, '')
    .replace(/<rect\s*\/?>(<\/rect>)?/g, '<rect />');

describe('LtvLogo (Vue 3)', () => {
  test('SSR output matches the vanilla renderer', async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(LtvLogo, { size: 7 }) })
    );
    expect(normalize(html)).toBe(renderLogo({ size: 7 }));
  });

  test('animation prop adds the variant class', async () => {
    const html = await renderToString(
      createSSRApp({ render: () => h(LtvLogo, { animation: 'intro' }) })
    );
    expect(html).toContain('class="logo size-5 logo-anim-intro"');
  });

  test('defaults to size 5', async () => {
    const html = await renderToString(createSSRApp(LtvLogo));
    expect(html).toContain('class="logo size-5"');
  });

  test('mounts in the DOM, injects styles and reacts to prop changes', async () => {
    const size = ref<number | string>(2);
    const root = document.createElement('div');
    const app = createApp({ render: () => h(LtvLogo, { size: size.value }) });
    app.mount(root);

    expect(root.querySelector('svg')!.getAttribute('class')).toBe(
      'logo size-2'
    );
    expect(document.getElementById(STYLE_ELEMENT_ID)).not.toBeNull();

    size.value = '9';
    await nextTick();
    expect(root.querySelector('svg')!.getAttribute('class')).toBe(
      'logo size-9'
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
