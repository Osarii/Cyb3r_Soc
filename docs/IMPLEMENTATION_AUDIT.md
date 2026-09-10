# Estado de implementación

## Current state

- Aplicación React/TypeScript existente con rutas principales y shell responsive.
- Cinco composiciones objetivo disponibles: dashboard, boot, mapa, mitigación y offline.
- Zustand, TanStack Table, Recharts, react-simple-maps, Framer Motion y styled-components instalados.
- Componentes fuente de logo, fondo, consola, loaders e icono de IA integrados o en adaptación.
- Build de producción operativo y Playwright configurado a `1672 × 941`.

## Partial

- Design system: existen primitivas compartidas, pero botones, cards y variantes aún no están completos en todas las pantallas.
- Ataques e incidentes: hay creación y controles parciales; falta cerrar todas las transiciones y consecuencias del flujo completo.
- Mitigación: progreso, etapas, métricas y logs visibles; falta sincronizar resolución, activo, dashboard y notificación.
- CyberAI: panel, texto, reconocimiento y síntesis existen; falta completar todos los comandos derivados de Zustand.
- Visual QA: debe recalcularse sin ningún screenshot renderizado dentro de la app.

## Missing

- Aceptación funcional automatizada del flujo completo sin refrescar.
- Variantes y estados completos del design system descrito en la especificación.
- Búsqueda global conectada a incidentes, IPs, activos y tipos.
- Filtros completos de incidentes y preferencias de Settings conectadas.
- División de rutas pesadas para reducir el bundle de producción.

## Next implementation

Completar el design system compartido y aplicar `CyberButton`/`CyberCard` a los controles prioritarios; después cerrar el motor Attack → Incident → Mitigation → Resolved con pruebas de navegador.

