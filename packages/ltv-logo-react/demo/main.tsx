import { createRoot } from 'react-dom/client';
import {
  CONVERGE_ANIMATIONS,
  LEGACY_ANIMATIONS,
  LtvLogo
} from '../src/index.ts';

createRoot(document.getElementById('app')!).render(
  <>
    <div className="row">
      {CONVERGE_ANIMATIONS.map((animation) => (
        <div key={animation}>
          <p>converge · {animation}</p>
          <LtvLogo size={5} animation={animation} />
        </div>
      ))}
    </div>
    <div className="row">
      {LEGACY_ANIMATIONS.map((animation) => (
        <div key={animation}>
          <p>legacy · {animation}</p>
          <LtvLogo mark="legacy" size={4} animation={animation} />
        </div>
      ))}
    </div>
  </>
);
