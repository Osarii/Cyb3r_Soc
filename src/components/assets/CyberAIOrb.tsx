import aiIdle from '../../assets/ai/cyberai-idle.webm';
import aiListening from '../../assets/ai/cyberai-listening.webm';
import aiThinking from '../../assets/ai/cyberai-thinking.webm';
import aiSpeaking from '../../assets/ai/cyberai-speaking.webm';
import aiStatic from '../../assets/ai/cyberai-orb-static.webp';
import { AdaptiveAssetImage } from './AdaptiveAssetImage';

export type CyberAIOrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
const stateAsset: Record<CyberAIOrbState, string> = { idle: aiIdle, listening: aiListening, thinking: aiThinking, speaking: aiSpeaking, error: aiStatic };

export function CyberAIOrb({ state, className = '' }: { state: CyberAIOrbState; className?: string }) {
  return <span className={`cyber-ai-orb-asset is-${state} ${className}`}>
    <AdaptiveAssetImage animatedSrc={state === 'error' ? undefined : stateAsset[state]} staticSrc={aiStatic} alt="CyberAI" />
    {state === 'error' ? <i aria-label="Error de CyberAI" /> : null}
  </span>;
}
