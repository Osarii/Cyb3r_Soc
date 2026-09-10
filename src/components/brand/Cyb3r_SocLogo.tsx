import ExactLoader1 from '../referenceExact/ExactLoader1';
import type { CSSProperties } from 'react';

export type Cyb3r_SocLogoVariant = 'compact' | 'full' | 'animated' | 'watermark';

/**
 * The Cyb3r_Soc mark is the supplied code/loader_1.txt component.
 * The wrapper only provides sizing, Cyb3r_Soc color treatment and variants;
 * the original five rotating .crack layers remain intact.
 */
export function Cyb3r_SocMark({
  size = 64,
  animated = true,
  watermark = false,
  className = '',
}: {
  size?: number;
  animated?: boolean;
  watermark?: boolean;
  className?: string;
}) {
  return <span
    className={`cyber-crystal-mark ${animated ? 'is-animated' : 'is-static'} ${watermark ? 'is-watermark' : ''} ${className}`}
    style={{ '--cyber-mark-size': `${size}px` } as CSSProperties}
    aria-hidden="true"
  >
    <ExactLoader1 />
  </span>;
}

export function Cyb3r_SocLogo({
  size = 40,
  full = false,
  animated = true,
  variant,
}: {
  size?: number;
  full?: boolean;
  animated?: boolean;
  variant?: Cyb3r_SocLogoVariant;
}) {
  const showLockup = full || variant === 'full';
  const isAnimated = animated || variant === 'animated';

  return <div className={`brand cyber-logo-lockup ${isAnimated ? 'animated' : ''}`}>
    <Cyb3r_SocMark size={size} animated={isAnimated} watermark={variant === 'watermark'}/>
    {showLockup && <div className="brand-type"><b>Cyb3r_<span>Soc</span></b><small>DETECTAR · ANALIZAR · PROTEGER</small></div>}
  </div>;
}
