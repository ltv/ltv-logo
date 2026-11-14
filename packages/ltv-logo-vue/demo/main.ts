import { createApp, h } from 'vue';
import { LOGO_ANIMATIONS, LtvLogo } from '../src/index.ts';

createApp({
  render: () =>
    h(
      'div',
      { class: 'row' },
      LOGO_ANIMATIONS.map((animation) =>
        h('div', { key: animation }, [
          h('p', animation),
          h(LtvLogo, { size: 4, animation })
        ])
      )
    )
}).mount('#app');
