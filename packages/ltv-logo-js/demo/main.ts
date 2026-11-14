import { LOGO_ANIMATIONS, defineLtvLogoElement } from '../src/index.ts';

defineLtvLogoElement();

const row = document.createElement('div');
row.className = 'row';
row.innerHTML = LOGO_ANIMATIONS.map(
  (animation) =>
    `<div><p>${animation}</p><ltv-logo size="4" animation="${animation}"></ltv-logo></div>`
).join('');
document.getElementById('app')!.appendChild(row);
