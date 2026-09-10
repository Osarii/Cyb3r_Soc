import { useState } from 'react';
import { Play, TriangleAlert } from 'lucide-react';
import styled from 'styled-components';

const ExactAttackSwitch = ({ buttonLabel = 'Iniciar ataque simulado', onLaunch }: { buttonLabel?: string; onLaunch?: () => void }) => {
  const [launched, setLaunched] = useState(false);

  const toggleSimulation = () => {
    const next = !launched;
    setLaunched(next);
    if (next) onLaunch?.();
  };

  return <StyledWrapper>
    <div className="cyber-attack-module">
      <div className="module-body">
        <div className="device-art" aria-hidden="true">
          <span className="crystal shard-a"/><span className="crystal shard-b"/><span className="crystal shard-c"/>
          <div className="device-shadow"/>
          <div className="device-housing">
            <i className="bolt bolt-a"/><i className="bolt bolt-b"/><i className="bolt bolt-c"/><i className="bolt bolt-d"/>
            <div className={`launch-lamp ${launched ? 'is-active' : ''}`}/>
            <small>LAUNCH</small>
          </div>
          <div className="safety-lid"><i/><b/></div>
        </div>
        <div className="module-copy">
          <div className="controlled"><TriangleAlert/><span>SIMULACIÓN<br/>CONTROLADA</span></div>
          <p>Ejecuta un escenario de ataque para validar detecciones y respuestas.</p>
        </div>
      </div>
      <button className="simulation-trigger" type="button" onClick={toggleSimulation} aria-pressed={launched}>
        <Play fill="currentColor"/>
        <span>{launched ? 'Simulación iniciada' : buttonLabel}</span>
        <b aria-hidden>›</b>
      </button>
    </div>
  </StyledWrapper>;
};

const StyledWrapper = styled.div`
  width: 500px;
  height: 332px;

  .cyber-attack-module {
    width: 500px;
    height: 332px;
    display: grid;
    grid-template-rows: 240px 82px;
    gap: 10px;
    color: #f6f1ff;
    font-family: var(--font-ui, Inter, sans-serif);
  }

  .module-body { display: grid; grid-template-columns: 246px 1fr; gap: 10px; }
  .device-art { position: relative; height: 240px; display: grid; place-items: center; perspective: 560px; isolation: isolate; }

  .crystal { position: absolute; z-index: -2; display: block; background: linear-gradient(145deg,rgba(237,220,255,.83),rgba(131,54,239,.55) 44%,rgba(35,11,73,.08) 75%); border: 1px solid rgba(193,128,255,.38); filter: drop-shadow(0 0 10px rgba(129,45,231,.36)); }
  .shard-a { width: 105px; height: 226px; left: 14px; top: 8px; clip-path: polygon(0 20%,64% 0,100% 32%,68% 65%,96% 100%,18% 83%); }
  .shard-b { width: 151px; height: 153px; right: 2px; top: 25px; clip-path: polygon(26% 0,100% 24%,78% 62%,96% 98%,28% 82%,0 37%); opacity: .6; }
  .shard-c { width: 208px; height: 73px; left: 18px; bottom: 6px; clip-path: polygon(0 36%,64% 0,100% 45%,72% 100%,20% 82%); opacity: .48; }
  .device-shadow { position: absolute; left: 50%; bottom: 4px; width: 184px; height: 31px; transform: translateX(-50%); border-radius: 50%; background: #030309; filter: blur(12px); opacity: .85; }

  .device-housing { position: absolute; left: 53px; bottom: 17px; width: 151px; height: 166px; border: 5px solid #363841; border-radius: 8px; background: repeating-linear-gradient(135deg,#d69e18 0 11px,#191a20 11px 22px); box-shadow: inset 0 0 0 10px #101117,inset 0 0 35px #000,0 15px 20px rgba(0,0,0,.7); transform: rotateX(3deg) rotateY(-2deg); }
  .device-housing::before { content: ''; position: absolute; inset: 18px; border: 4px solid #444751; border-radius: 50%; background: radial-gradient(circle at 39% 30%,#ff8295 0 4%,#cc354c 24%,#9f1c34 50%,#4b0916 73%,#16050a 74%); box-shadow: inset 0 12px 14px rgba(255,255,255,.18),inset 0 -16px 17px rgba(0,0,0,.58),0 0 0 7px #111218,0 8px 12px #000,0 0 18px rgba(228,37,73,.25); }
  .device-housing::after { content: ''; position: absolute; left: 48px; top: 39px; width: 30px; height: 16px; border-radius: 50%; background: rgba(255,255,255,.15); transform: rotate(-22deg); filter: blur(2px); }
  .device-housing small { position: absolute; left: 50%; bottom: 3px; transform: translateX(-50%); color: #9898a4; font: 600 7px var(--font-mono,monospace); letter-spacing: .16em; }

  .bolt { position: absolute; z-index: 3; width: 8px; height: 8px; border-radius: 50%; background: radial-gradient(circle at 32% 28%,#bec0c7,#555861 48%,#191a1f 53%); }
  .bolt::after { content: ''; position: absolute; left: 1px; right: 1px; top: 3px; border-top: 1px solid #202126; transform: rotate(32deg); }
  .bolt-a { left: 7px; top: 7px; }.bolt-b { right: 7px; top: 7px; }.bolt-c { left: 7px; bottom: 7px; }.bolt-d { right: 7px; bottom: 7px; }
  .launch-lamp { position: absolute; inset: 19px; border-radius: 50%; transition: filter .2s,transform .12s; }
  .launch-lamp.is-active { filter: brightness(1.35); transform: scale(.96); }

  .safety-lid { position: absolute; z-index: 5; left: 62px; top: 1px; width: 137px; height: 80px; transform-origin: 50% 100%; transform: rotateX(-51deg) skewX(-5deg); border: 5px solid #292a31; border-radius: 8px 8px 3px 3px; background: linear-gradient(152deg,#8c2033,#54101e 58%,#25080e); box-shadow: inset 0 5px rgba(255,255,255,.11),0 8px 9px rgba(0,0,0,.62),0 0 0 2px #101116; }
  .safety-lid::before { content: ''; position: absolute; inset: 11px; border: 2px solid #9d3547; border-radius: 4px; background: linear-gradient(154deg,#6f1829,#2b090f); box-shadow: inset 0 5px 10px rgba(255,255,255,.05); }
  .safety-lid i { position: absolute; z-index: 2; left: 44px; top: 19px; width: 39px; height: 28px; border-radius: 4px; background: linear-gradient(#282a31,#07080a); box-shadow: 0 0 0 3px #454750; }
  .safety-lid b { position: absolute; z-index: 4; left: 50%; bottom: -9px; width: 45px; height: 12px; transform: translateX(-50%); border-radius: 3px; background: #15161b; box-shadow: 0 0 0 3px #3d4048; }

  .module-copy { display: flex; min-width: 0; flex-direction: column; justify-content: center; gap: 17px; padding: 23px 9px 8px 0; }
  .controlled { min-height: 66px; display: flex; align-items: center; gap: 13px; padding: 13px 15px; color: #ff5378; border: 1px solid rgba(255,57,102,.32); border-radius: 9px; background: rgba(92,22,50,.3); font-size: 16px; line-height: 1.35; font-weight: 600; }
  .controlled svg { width: 33px; height: 33px; fill: currentColor; color: #ff5276; stroke: #541021; }
  .module-copy p { margin: 0; padding: 0 12px; color: #b5adc5; font-size: 15px; line-height: 1.52; }

  .simulation-trigger { position: relative; height: 82px; display: flex; align-items: center; justify-content: center; gap: 20px; overflow: hidden; color: #fff; border: 2px solid #bd83ff; background: linear-gradient(180deg,#8b45f0 0,#6321c9 56%,#42108e 100%); clip-path: polygon(28px 0,calc(100% - 28px) 0,100% 50%,calc(100% - 28px) 100%,28px 100%,0 50%); box-shadow: inset 0 0 24px #d59aff,inset 0 4px rgba(255,255,255,.22),0 0 22px rgba(122,48,235,.62); font-size: 24px; font-weight: 600; cursor: pointer; }
  .simulation-trigger::before,.simulation-trigger::after { content: ''; position: absolute; inset: 7px 18px; opacity: .55; background: linear-gradient(115deg,transparent 18%,rgba(255,255,255,.32) 19% 28%,transparent 29% 48%,rgba(255,255,255,.17) 49% 61%,transparent 62%); clip-path: polygon(8% 0,100% 0,92% 100%,0 100%); }
  .simulation-trigger::after { transform: scaleX(-1); opacity: .26; }
  .simulation-trigger > * { position: relative; z-index: 2; }
  .simulation-trigger svg { width: 32px; height: 32px; }
  .simulation-trigger b { position: absolute; right: 27px; font-size: 30px; color: #c699ff; }
  .simulation-trigger:hover { filter: brightness(1.12); }
`;

export default ExactAttackSwitch;
