# Fuentes de componentes Cyb3r_Soc

`src/assets/` es la fuente visual oficial. Los assets entregados se importan como recursos WebP; React conserva el estado, navegación, simulaciones, accesibilidad y lógica de voz.

| Asset oficial | Componente | Uso | Comportamiento |
|---|---|---|---|
| `branding/cybersoc-logo-loop.webm` / `cybersoc-logo-static.webp` | `CyberSOCLogo` | Header, sidebar y boot | WebM en reproducción activa; versión estática fuera de vista, en movimiento reducido o si el video falla. |
| `ddos/ddos-interceptor-loop.webm` / `ddos-interceptor-static.webp` | `DDoSInterceptor` | Mitigación DDoS | WebM activo solo durante la mitigación; entorno, progreso y logs siguen controlados por React/CSS. |
| `offline/server-cube-loop.webm` / `server-cube-static.webp` | `ServerStatusCube` | Servidor no disponible | WebM en reproducción activa y versión estática en movimiento reducido. |
| `ai/cyberai-idle.webm` | `CyberAIOrb` | CyberAI inactivo | Estado `idle`. |
| `ai/cyberai-listening.webm` | `CyberAIOrb` | Reconocimiento de voz | Estado `listening`. |
| `ai/cyberai-thinking.webm` | `CyberAIOrb` | Preparando respuesta | Estado `thinking`. |
| `ai/cyberai-speaking.webm` | `CyberAIOrb` | Síntesis de voz | Estado `speaking`; vuelve a `idle` al terminar `speechSynthesis`. |
| `ai/cyberai-orb-static.webp` | `CyberAIOrb` | Fallback/error | Estado `error` y fallback de carga. |
| `decorations/crystal-cluster-static.webp` | Sidebar | Fondo inferior | Decoración con opacidad reducida. |
| `decorations/radar-static.webp` | Threat map | Decoración secundaria | No sustituye al mapa SVG. |
| `decorations/security-shield-static.webp` | Consola de escenarios | Indicador secundario | Refuerza el contexto de simulación protegida. |

Los archivos `*-preview.mp4` permanecen sin importar, solo para revisión visual. Las capturas de `docs/references/` nunca se renderizan en la interfaz.

## Reglas de integración

- Cada recurso animado usa un fallback estático mediante `AdaptiveAssetImage`.
- `prefers-reduced-motion` selecciona el asset estático y desactiva la flotación auxiliar.
- Los assets decorativos usan `alt=""` y `aria-hidden`; los assets funcionales tienen texto alternativo útil.
- La simulación sigue siendo local y educativa: no genera tráfico ni interactúa con sistemas externos.
- Las reconstrucciones antiguas por `clip-path`, cubo CSS, nave CSS y orb SVG fueron retiradas de la ruta de ejecución.
