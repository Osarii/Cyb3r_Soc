# Fuentes de componentes Cyb3r_Soc

Este archivo es el registro permanente de las fuentes entregadas por el usuario. Una referencia visual define el objetivo; los archivos de `code/` definen la estructura o animación que debe conservarse y adaptarse al producto.

| Fuente | Componente adaptado | Uso en Cyb3r_Soc | Comportamiento requerido |
|---|---|---|---|
| `code/loader_1.txt` | `ExactLoader1` / `Cyb3r_SocLogo` | Boot inicial, marca compacta y watermark | Cinco capas rotatorias; el boot aparece una vez por sesión mediante `sessionStorage.cyb3r_soc_initialized` |
| `code/loader_2.txt` | `ExactLoader2` | Mitigación DDoS | Movimiento del interceptor y líneas de velocidad durante la limpieza |
| `code/loader_4.txt` | `ExactLoader4` | Servidor no disponible | Cubo HTML/CSS con seis caras y rotación lenta |
| `code/boton_ataque.txt` | `ExactAttackSwitch` | Consola de simulación | Secuencia POWER / ARMED / LAUNCH, confirmación y creación de un ataque ficticio |
| `code/ia_icon.txt` | `ExactAIIcon` / `CyberAI` | Esquina inferior derecha en todas las vistas | Orb con ondas, panel, texto, micrófono con permiso explícito y respuesta mediante `speechSynthesis` |
| `code/background.txt` | `ExactBackground` | Fondo compartido | Textura espacial tenue, recoloreada al sistema morado sin afectar legibilidad |
| `code/map.txt` | `ThreatMap` | Dashboard y mapa de amenazas | Inspiración de movimiento trasladada a rutas SVG simuladas entre origen y destino |
| `src/assets/illustrations/ddos-interceptor.png` | Asset generado para el proyecto | Nave del loader de mitigación | PNG transparente; React/CSS controla posición, movimiento, trails, progreso y visibilidad |

## Reglas de integración

- Nunca usar una captura completa de referencia como fondo o sustituto de la interfaz.
- Mantener la estructura y la idea de movimiento de la fuente; la paleta puede adaptarse a Cyb3r_Soc.
- Toda acción ofensiva es exclusivamente una simulación local y educativa: no genera tráfico ni toca sistemas externos.
- Registrar aquí cada nueva fuente antes de integrarla, indicando archivo original, componente, rutas y comportamiento.
- Las imágenes completas de `docs/references/` existen únicamente para pruebas y comparación visual.
