# Asset Map — Cyb3r_Soc

| Asset | Pantalla | Función | Qué debería reemplazar |
|---|---|---|---|
| `boot-loader-crystal-static.webp` | Boot | loader/cristal central | cristal procedural / aproximación CSS |
| `boot-orbital-system.svg` | Boot | órbitas técnicas | círculos y crosshairs CSS |
| `boot-orbital-fog.webp` | Boot | neblina | gradientes/blur atmosféricos |
| `boot-particle-wave.webp` | Boot | onda inferior | malla/partículas procedurales |
| `boot-left-crystal-blur.webp` | Boot | cristal inferior izq. | polígonos decorativos |
| `simulation-control-device.webp` | Dashboard/Threat | dispositivo rojo | ilustración procedimental |
| `sidebar-crystal-cluster.webp` | Shared | cristal lateral | decoración compleja |
| `shell-top-crystal-field.svg` | Shared | facetas superiores | múltiples pseudo-elementos |
| `threat-world-map.webp` | Dashboard/Threat | base del mapa | continente/base procedural |
| `ddos-mitigation-hero-static.webp` | DDoS | nave/energía | hero procedural |
| `server-offline-hero-static.webp` | Offline | cubo/órbitas | hero procedural |
| `cybersoc-logo-loop-small.webm` | Shared | logo small | versión small con fondo/alpha defectuoso |

## Regla de limpieza
No borrar una réplica procedural antes de integrar y validar el asset sustituto. Después de integrar:
1. localizar referencias,
2. confirmar cero consumidores o redundancia demostrada,
3. eliminar solo el código obsoleto,
4. ejecutar build,
5. ejecutar validación visual proporcional.
