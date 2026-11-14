import { defineComponent, h, onMounted } from 'vue';
import type { PropType, VNode } from 'vue';
import {
  DEFAULT_MARK,
  DEFAULT_SIZE,
  getLogoTree,
  injectStyles
} from 'ltv-logo-js';
import type { LogoAnimation, LogoMark, LogoNode, LogoTone } from 'ltv-logo-js';

const toVNode = (node: LogoNode): VNode =>
  h(node.tag, { ...node.attrs }, node.children.map(toVNode));

/**
 * `<LtvLogo :size="5" animation="greet" />` — the animated LTV logo for Vue 3.
 * Styles are injected automatically on mount.
 */
export const LtvLogo = defineComponent({
  name: 'LtvLogo',
  props: {
    /** `converge` (the Hội tụ mark, default) or `legacy` (the L·T·V mark). */
    mark: {
      type: String as PropType<LogoMark>,
      default: DEFAULT_MARK
    },
    /** Size from 1 (smallest) to 10 (largest). Converge: size × 16 px. */
    size: {
      type: [Number, String] as PropType<number | string>,
      default: DEFAULT_SIZE
    },
    /**
     * Converge: `assemble` (default), `idle`, `greet`, `cheer`, `work`,
     * `hover`, `none`. Legacy: `pulse` (default), `assemble`, `float`,
     * `intro`, `wave`, `hover`, `none`.
     */
    animation: {
      type: String as PropType<LogoAnimation>,
      default: undefined
    },
    /** Converge only: `color` (default), `dark`, `mono`, `white`. */
    tone: {
      type: String as PropType<LogoTone>,
      default: undefined
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
      toVNode(
        getLogoTree({
          mark: props.mark,
          size: props.size,
          animation: props.animation,
          tone: props.tone,
          title: props.title
        })
      );
  }
});
