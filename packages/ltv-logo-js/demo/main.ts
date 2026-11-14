import {
  CONVERGE_ANIMATIONS,
  LEGACY_ANIMATIONS,
  defineLtvLogoElement
} from '../src/index.ts';

defineLtvLogoElement();

const row = (mark: string, animations: readonly string[]) => {
  const el = document.createElement('div');
  el.className = 'row';
  el.innerHTML = animations
    .map(
      (animation) =>
        `<div><p>${mark} · ${animation}</p><ltv-logo mark="${mark}" size="5" animation="${animation}"></ltv-logo></div>`
    )
    .join('');
  return el;
};

document
  .getElementById('app')!
  .append(
    row('converge', CONVERGE_ANIMATIONS),
    row('legacy', LEGACY_ANIMATIONS)
  );
