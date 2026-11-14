import { createRoot } from 'react-dom/client';
import { LOGO_ANIMATIONS, LtvLogo } from '../src/index.ts';

createRoot(document.getElementById('app')!).render(
  <div className="row">
    {LOGO_ANIMATIONS.map((animation) => (
      <div key={animation}>
        <p>{animation}</p>
        <LtvLogo size={4} animation={animation} />
      </div>
    ))}
  </div>
);
