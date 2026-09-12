import cubeLoop from '../../assets/offline/server-cube-loop.webm';
import cubeStatic from '../../assets/offline/server-cube-static.webp';
import { AdaptiveAssetImage } from './AdaptiveAssetImage';

export function ServerStatusCube() {
  return <AdaptiveAssetImage className="server-status-cube-asset" animatedSrc={cubeLoop} staticSrc={cubeStatic} alt="Estado del servidor: sin conexión" />;
}
