import logoLoop from '../../assets/branding/cybersoc-logo-loop.webm';
import logoStatic from '../../assets/branding/cybersoc-logo-static.webp';
import logoLoopSmall from '../../assets/branding/cybersoc-logo-loop-small.webm';
import logoStaticSmall from '../../assets/branding/cybersoc-logo-static-small.webp';
import { AdaptiveAssetImage } from '../assets/AdaptiveAssetImage';

export type CyberSOCLogoSize = 'sm' | 'md' | 'lg' | 'xl';
const sizes: Record<CyberSOCLogoSize, number> = { sm: 52, md: 74, lg: 190, xl: 390 };

export function CyberSOCLogo({ variant = 'animated', size = 'md', decorative = false, className = '' }: {
  variant?: 'animated' | 'static'; size?: CyberSOCLogoSize | number; decorative?: boolean; className?: string;
}) {
  const pixels = typeof size === 'number' ? size : sizes[size];
  const useSmallAsset = pixels <= sizes.md;
  return <AdaptiveAssetImage className={`cybersoc-logo-asset ${className}`} animated={variant === 'animated'} animatedSrc={useSmallAsset ? logoLoopSmall : logoLoop} staticSrc={useSmallAsset ? logoStaticSmall : logoStatic} alt={decorative ? '' : 'Cyb3r_Soc'} aria-hidden={decorative || undefined} style={{ width: pixels, height: pixels }} />;
}
