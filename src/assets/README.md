# CyberSOC — Production Lite Assets

Este paquete está pensado para PRODUCCIÓN.

## Estrategia

ANIMACIONES:
- WebM VP9 con alpha/transparencia
- 30 FPS
- mucho más ligeras que Animated WebP

ESTÁTICOS / FALLBACK:
- WebP

Se eliminaron del paquete de producción:
- Animated WebP pesados
- PNG duplicados
- MP4 preview
- JPG de revisión
- archivos de documentación visual

## Uso recomendado

Animación:
<video autoPlay loop muted playsInline>
  <source src={asset} type="video/webm" />
</video>

Fallback:
<img src={staticAsset} alt="" />

## Assets

branding/
- cybersoc-logo-loop.webm
- cybersoc-logo-loop-small.webm
- cybersoc-logo-static.webp
- cybersoc-logo-static-small.webp

ddos/
- ddos-interceptor-loop.webm
- ddos-interceptor-static.webp

offline/
- server-cube-loop.webm
- server-cube-static.webp

ai/
- cyberai-idle.webm
- cyberai-listening.webm
- cyberai-thinking.webm
- cyberai-speaking.webm
- cyberai-orb-static.webp

decorations/
- security-shield-loop.webm
- security-shield-static.webp
- radar-loop.webm
- radar-static.webp
- crystal-cluster-loop.webm
- crystal-cluster-static.webp

## Importante

Para aprovechar esta reducción, los componentes animados deben usar <video>
en lugar de <img> para los loops.
