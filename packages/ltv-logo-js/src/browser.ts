// Entry for the <script> (IIFE) build: exposes `window.LtvLogo` and registers
// the <ltv-logo> custom element automatically.
import * as LtvLogo from './index.js';

declare global {
  // eslint-disable-next-line no-var
  var LtvLogo: typeof import('./index.js');
}

globalThis.LtvLogo = LtvLogo;
LtvLogo.defineLtvLogoElement();
