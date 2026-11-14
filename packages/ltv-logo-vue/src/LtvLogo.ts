import { defineComponent, h, onMounted } from 'vue';
import type { PropType } from 'vue';
import {
  DEFAULT_ANIMATION,
  DEFAULT_SIZE,
  LOGO_LETTERS,
  getLogoA11yAttributes,
  getLogoClass,
  injectStyles
} from 'ltv-logo-js';
import type { LogoAnimation } from 'ltv-logo-js';

/**
 * `<LtvLogo :size="5" animation="intro" />` — the animated LTV logo for Vue 3.
 * Styles are injected automatically on mount.
 */
export const LtvLogo = defineComponent({
  name: 'LtvLogo',
  props: {
    /** Logo size from 1 (smallest) to 10 (largest). */
    size: {
      type: [Number, String] as PropType<number | string>,
      default: DEFAULT_SIZE
    },
    /** `pulse` (default), `assemble`, `float`, `intro`, `wave`, `hover` or `none`. */
    animation: {
      type: String as PropType<LogoAnimation>,
      default: DEFAULT_ANIMATION
    },
    /** Accessible label. Use an empty string to hide it from assistive tech. */
    title: {
      type: String,
      default: 'LTV'
    }
  },
  setup(props) {
    onMounted(() => {
      injectStyles();
    });
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          class: getLogoClass(props.size, undefined, props.animation),
          ...getLogoA11yAttributes(props.title)
        },
        [
          h(
            'g',
            { class: 'logo-wrapper' },
            LOGO_LETTERS.map((letter) =>
              h('g', { key: letter, class: `logo-letter ${letter}` }, [
                h('rect'),
                h('rect')
              ])
            )
          )
        ]
      );
  }
});
