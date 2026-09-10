# Cyb3r_Soc master spec

## Objetivo

Continuar sobre el repositorio actual y reconstruir en React/TypeScript las cinco referencias a `1672 × 941`, sin utilizarlas como fondos de la aplicación. Cyb3r_Soc debe sentirse como un centro de operaciones espacial, empresarial y propio: carbón, morado oscuro, violeta, lavanda y blanco frío.

## Flujo de aceptación principal

Boot de primera sesión → Dashboard → Mapa de amenazas → Simulación controlada → Confirmación → Cuenta regresiva → Trayectoria → Incidente → Neutralización → Limpieza DDoS → Resolución → Métricas y notificación actualizadas, todo sin refrescar la página.

## Reglas no negociables

- Las referencias completas solo se usan como targets de Playwright.
- Las simulaciones nunca crean tráfico real ni ejecutan acciones ofensivas.
- El estado conectado vive en Zustand y los componentes visuales se reutilizan.
- CyberAI nunca activa el micrófono sin una acción y permiso explícitos.
- `?visualTest=true` fija datos, tiempos y animaciones; no reemplaza componentes por fragmentos rasterizados.
- No declarar una pantalla terminada solo porque el build pasa o porque supera un umbral visual general.

## Orden vigente

1. Auditar y corregir el design system compartido.
2. Completar logo y boot inicial.
3. Afinar Dashboard y Threat Map con componentes reales.
4. Conectar motor de ataque, incidentes y mitigación de extremo a extremo.
5. Completar offline y CyberAI.
6. Terminar páginas secundarias, responsive y QA visual/funcional.

El detalle de procedencia de componentes se mantiene en [COMPONENT_SOURCES.md](COMPONENT_SOURCES.md).

