import { useEffect, useRef, useState, type ImgHTMLAttributes, type Ref, type VideoHTMLAttributes } from 'react';
import { useAnimationActivity } from '../../hooks/useAnimationActivity';
import { useVisualTestMode } from '../../config/visualTest';

type AdaptiveAssetImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  animatedSrc?: string;
  staticSrc: string;
  animated?: boolean;
};

/**
 * Uses an official animated asset when allowed and falls back to its static pair on error.
 * Animated WebM files are rendered as videos so they retain native playback controls
 * (pause off-screen/hidden through useAnimationActivity) instead of being treated as images.
 */
export function AdaptiveAssetImage({ animatedSrc, staticSrc, animated = true, ...props }: AdaptiveAssetImageProps) {
  const ref = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const visualTest = useVisualTestMode();
  const useAnimatedAsset = useAnimationActivity(ref, Boolean(!visualTest && animated && animatedSrc));
  const preferred = useAnimatedAsset && animatedSrc ? animatedSrc : staticSrc;
  const [src, setSrc] = useState(preferred);
  useEffect(() => setSrc(preferred), [preferred]);
  const isWebM = useAnimatedAsset && /\.webm(?:$|[?#])/i.test(src);
  const fallbackToStatic = () => src !== staticSrc && setSrc(staticSrc);

  if (isWebM) {
    const { alt, ...videoProps } = props;
    return (
      <video
        {...(videoProps as VideoHTMLAttributes<HTMLVideoElement>)}
        ref={ref as Ref<HTMLVideoElement>}
        src={src}
        poster={staticSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        data-asset-active="true"
        data-asset-kind="webm"
        onError={fallbackToStatic}
      />
    );
  }

  return <img {...props} ref={ref as Ref<HTMLImageElement>} src={src} data-asset-active={useAnimatedAsset} data-asset-kind="image" onError={fallbackToStatic} />;
}
