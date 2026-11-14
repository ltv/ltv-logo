import {
  createLogoElement,
  normalizeAnimation,
  updateLogoElement
} from './render.js';
import { injectStyles } from './styles.js';

export const DEFAULT_TAG_NAME = 'ltv-logo';

/**
 * Registers the `<ltv-logo size="5" animation="wave"></ltv-logo>` custom
 * element. Attributes: `size` (1–10), `animation`, `label`.
 * Returns the element class. Calling it again is a no-op.
 */
export function defineLtvLogoElement(
  tagName: string = DEFAULT_TAG_NAME
): CustomElementConstructor | undefined {
  if (typeof customElements === 'undefined') return undefined;
  const existing = customElements.get(tagName);
  if (existing) return existing;

  class LtvLogoElement extends HTMLElement {
    static observedAttributes = ['size', 'animation', 'label'];
    #svg: SVGSVGElement | null = null;

    connectedCallback(): void {
      injectStyles(this.ownerDocument);
      if (!this.#svg) {
        this.#svg = createLogoElement(this.#options(), this.ownerDocument);
        this.replaceChildren(this.#svg);
      }
    }

    attributeChangedCallback(): void {
      if (this.#svg) updateLogoElement(this.#svg, this.#options());
    }

    get size(): number | string | null {
      return this.getAttribute('size');
    }

    set size(value: number | string | null) {
      if (value === null) this.removeAttribute('size');
      else this.setAttribute('size', String(value));
    }

    #options() {
      return {
        size: this.getAttribute('size') ?? undefined,
        animation: normalizeAnimation(this.getAttribute('animation')),
        title: this.getAttribute('label') ?? undefined
      };
    }
  }

  customElements.define(tagName, LtvLogoElement);
  return LtvLogoElement;
}
