import interceptorLoop from '../../assets/ddos/ddos-interceptor-loop.webm';
import interceptorStatic from '../../assets/ddos/ddos-interceptor-static.webp';
import { AdaptiveAssetImage } from './AdaptiveAssetImage';

export function DDoSInterceptor({ active = true, className = '' }: { active?: boolean; className?: string }) {
  return <AdaptiveAssetImage className={`ddos-interceptor-asset ${className}`} animated={active} animatedSrc={interceptorLoop} staticSrc={interceptorStatic} alt="Interceptor de mitigación DDoS" />;
}
