# Integración sugerida (sin tocar todavía el código existente)

## Boot
Capas recomendadas, de atrás hacia delante:
1. `boot-orbital-fog.webp`
2. `boot-orbital-system.svg`
3. `boot-loader-crystal-static.webp`
4. contenido/textos/progress React
5. `boot-particle-wave.webp`
6. `boot-left-crystal-blur.webp`

Todos los assets decorativos:
- `position: absolute`
- `pointer-events: none`
- no deben modificar layout/scroll
- usar `object-fit: contain`
- respetar `prefers-reduced-motion` si luego se añaden loops

## Threat / Dashboard
Usar `threat-world-map.webp` como base visual.
Mantener rutas, nodos, labels y estados dinámicos en SVG/React.

## DDoS / Offline
El hero es imagen; métricas, logs, botones y estados siguen en código.

## Limpieza
Después de validar cada sustitución, localizar la réplica procedural correspondiente y borrar solo lo demostrado como redundante.
