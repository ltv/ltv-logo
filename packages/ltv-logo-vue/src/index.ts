import type { App, Plugin } from 'vue';
import { LtvLogo } from './LtvLogo.js';

/** `app.use(LtvLogoPlugin)` registers `<LtvLogo>` / `<ltv-logo>` globally. */
export const LtvLogoPlugin: Plugin = {
  install(app: App) {
    app.component('LtvLogo', LtvLogo);
  }
};

export { LtvLogo };
export {
  CONVERGE_ANIMATIONS,
  LEGACY_ANIMATIONS,
  LOGO_ANIMATIONS,
  LOGO_MARKS,
  LOGO_TONES,
  injectStyles,
  normalizeSize,
  styles
} from 'ltv-logo-js';
export type { LogoAnimation, LogoMark, LogoTone } from 'ltv-logo-js';
export default LtvLogo;
