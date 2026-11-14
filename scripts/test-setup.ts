// Registers a browser-like DOM (window, document, customElements, ...) for `bun test`.
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();
