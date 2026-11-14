import { createApp, h } from 'vue';
import {
  CONVERGE_ANIMATIONS,
  LEGACY_ANIMATIONS,
  LtvLogo
} from '../src/index.ts';

const cell = (mark: 'converge' | 'legacy', animation: string) =>
  h('div', { key: `${mark}-${animation}` }, [
    h('p', `${mark} · ${animation}`),
    h(LtvLogo, {
      mark,
      size: mark === 'legacy' ? 4 : 5,
      animation: animation as never
    })
  ]);

createApp({
  render: () => [
    h(
      'div',
      { class: 'row' },
      CONVERGE_ANIMATIONS.map((a) => cell('converge', a))
    ),
    h(
      'div',
      { class: 'row' },
      LEGACY_ANIMATIONS.map((a) => cell('legacy', a))
    )
  ]
}).mount('#app');
