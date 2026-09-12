# Auditoría visual prioritaria — Cyb3r_Soc

Fecha: 2026-09-11. Alcance: inspección de las cinco parejas de PNG y verificación estructural. No se inicia Fase 1 ni se modifican assets, diseño o dependencias. Única excepción: ajuste mínimo de altura en Threat Map descrito abajo.

## Evidencia y límites

TARGET: `Cyb3r_Soc_References_1to1/`. CURRENT: `tests/visual/current/`. Se abrieron visualmente las diez imágenes; no se utilizó `docs/references` como target. Las parejas tienen el mismo lienzo de 1672 × 941 px.

| Pantalla | Filename en ambas carpetas | Distancia al 1:1 |
| --- | --- | --- |
| Dashboard | 01-dashboard.png | MEDIUM |
| Boot | 02-boot-screen.png | MAJOR |
| Threat Map | 03-threat-map.png | MAJOR |
| DDoS | 04-ddos-mitigation.png | MEDIUM |
| Offline | 05-server-offline.png | MAJOR |

Las clasificaciones son juicios visuales, no porcentajes de similitud. GOOD significa coincidencia amplia; MINOR, ajustes pequeños; MEDIUM, composición reconocible con diferencias relevantes; MAJOR, diferencias dominantes en composición o elemento central.

El nombre Cyb3r_Soc fue solicitado explícitamente: las referencias dicen CyberSOC, pero esa diferencia de texto no debe revertirse. La fidelidad de MOTION no puede evaluarse con PNG estáticos. Las capturas conservadas preceden al fix mínimo de esta auditoría; no se sobrescribieron para respetar la entrega de un único documento nuevo.

## Fase 0: resultado de verificación

Estado: PARTIAL para cierre exhaustivo; PASS para los dos defectos de altura comprobados y corregidos. No se declara cierre completo de todos los solapes ni zoom nativo.

Se abrió Chromium mediante Playwright existente, sin instalar dependencias. Se recorrieron las cinco rutas con `?visualTest=true`, esperando fuentes, en viewports 1672×941, 1520×855, 1338×753 y 1115×627. Son aproximaciones del reflujo a 100/110/125/150%; no equivalen a probar rasterización y zoom nativo. Las 20 combinaciones dieron overflow horizontal del documento = 0. Esto no demuestra por sí solo ausencia de clipping interno.

P0 encontrado: la fila `.ref-map-workspace` reservaba 540 px aunque la consola medía 590 px. A 1672 px, la consola terminaba en y=833 y la tabla comenzaba en y=794: 39 px de superposición. A 1115 px, los toggles terminaban por debajo del panel del mapa.

Fix mínimo en `src/v2/threat-map-reference.css`: fila con `height:auto`, `min-height:540px`, `align-items:start`; panel del mapa con `height:auto` y `min-height:540px`. No se alteraron colores, fuentes, assets ni datos.

| Ancho CSS | Fin consola después | Inicio tabla después | Fin toggles / panel | Resultado medido |
| --- | --- | --- | --- | --- |
| 1672 | 833 | 844 | 775 / 785 | Separados; toggles dentro |
| 1520 | 833 | 844 | 775 / 785 | Separados; toggles dentro |
| 1338 | 801 | 812 | 775 / 785 | Separados; toggles dentro |
| 1115 | 1501 | 1511 | 923 / 933 | Separados; toggles dentro |

Pendiente: zoom nativo 110/125/150%, revisión exhaustiva de clipping interno en las otras cuatro rutas y lectura del gráfico bajo el asistente flotante. El scroll vertical del mapa permite acceder al contenido pero se aleja de la composición de la referencia.

## Top 10 diferencias prioritarias

| # | Prioridad / categoría | Diferencia y efecto | Control probable |
| --- | --- | --- | --- |
| 1 | P0 LAYOUT | Threat Map: consola invadía la fila inferior y toggles se recortaban al estrechar. Corregido en esta auditoría. | `src/v2/threat-map-reference.css`, workspace/stage |
| 2 | P1 LAYOUT | Threat Map: mapa más alto; tablas empiezan alrededor de y=794 en CURRENT frente a y=686 en target. El fix las desplaza a y=844 para reservar contenido. | mismo CSS; `ThreatMapReferenceContent` |
| 3 | P1 LAYOUT / ASSET | Offline: cubo pequeño y arriba a la izquierda de sus órbitas; target tiene cubo grande centrado. | `OfflineCube`, `ServerUnavailableV2`, `special-screens.css`, `official-assets.css` |
| 4 | P1 CHARTS | Ambos mapas: proyección, escala, arcos y distribución de nodos difieren ampliamente; Dashboard ocupa casi toda la altura con continentes. | `ThreatMapPanel` en `DashboardReference.tsx`; `components/map/ThreatMap.tsx` |
| 5 | P1 ASSET / DECORATION | Boot: estrella con centro luminoso frente al hueco oscuro de la referencia; órbitas menos extensas y logo más alto. | `LoaderOneCore`, `CyberSOCLogo`, `special-screens.css` |
| 6 | P2 TYPOGRAPHY | Textos secundarios/tablas demasiado pequeños; KPI de respuesta del Dashboard truncado. DDoS/Offline tienen escala tipográfica distinta del shell principal. | `reference-dashboard.css`, `special-screens.css`, `reference-polish.css` |
| 7 | P2 DATA / CHARTS | Donuts y tablas no corresponden al target: categorías, porcentajes, filas e IPs diferentes. | `ThreatAnalytics`, `RecentIncidents`, constantes de `ThreatMapReference.tsx` |
| 8 | P3 STYLE | Bordes planos/interrumpidos y botones con franjas regulares frente a biseles cristalinos y brillos localizados del target. | CSS v2, `reference-polish.css`, `ExactAttackSwitch` |
| 9 | P4 DECORATION | Fondos con triángulos de alambre y puntos regulares; faltan densidad, profundidad y cristales laterales de la referencia. | `AmbientField`, `ExactBackground`, CSS v2 y assets decorativos existentes |
| 10 | P4 ASSET / P5 MOTION | CyberAI tiene aro mecánico en vez de esfera orgánica; motion no demostrable desde capturas. También cambia la ilustración del botón de ataque. | `CyberAIOrb`, `AdaptiveAssetImage`, `ExactAttackSwitch` |

## Dashboard — MEDIUM

| Categoría | Prioridad | Observación | Control probable |
| --- | --- | --- | --- |
| LAYOUT | P1 | Distribución general de paneles próxima; los KPI tienen anchuras distintas y el mapa una ocupación interna muy diferente. | `DashboardReference.tsx`, `reference-dashboard.css` |
| TYPOGRAPHY | P2 | Tabla, feed, leyendas y metadatos menores; título más pesado. “Tiempo medio de resp...” está truncado. | `StatCard`, `RecentIncidents`, CSS rd |
| STYLE | P3 | Paneles menos volumétricos; selección del sidebar y botones no replican biseles. | `reference-polish.css`, CSS rd |
| DATA | P2 | Coinciden 247, 18, 1,428 y 12 min. No coinciden todas las horas/IPs/textos de incidentes; ejemplo segundo registro 09:58 frente a 09:56. | `RecentIncidents`, datos/fixtures de Dashboard |
| ASSET | P4 | Botón de simulación más plano y logo/CyberAI distintos del target. Mantener assets actuales durante esta sesión. | `AttackSimulationCard`, `ExactAttackSwitch`, componentes assets |
| CHARTS | P1 | Rutas con curvas mucho más altas; donut actual muestra cinco categorías frente a seis, y porcentajes/barras distintos. | `ThreatMapPanel`, `ThreatAnalytics` |
| DECORATION | P4 | Cristal inferior izquierdo mucho menor; fondo más vacío y regular. | `ReferenceSidebar`, `AmbientField`, CSS rd |
| MOTION | P5 | PNG no prueba trayectorias ni pulso; fallback estático es correcto para captura. | CSS `.rd-route`, `AdaptiveAssetImage` |

## Boot — MAJOR

| Categoría | Prioridad | Observación | Control probable |
| --- | --- | --- | --- |
| LAYOUT | P1 | Logo comienza aproximadamente en y=125 frente a y=178; anillos más pequeños. Texto lateral izquierdo unos 50 px más abajo; rail derecho más a la derecha. Título/barra bastante próximos verticalmente. | `InitialBootScreenV2`, CSS `.ss-boot-*` |
| TYPOGRAPHY | P2 | Marca superior menor, subtítulos y etapas más pequeños; contraste del título mayor. | `BrandLockup`, `special-screens.css` |
| STYLE | P3 | Violeta muy saturado y líneas nítidas frente a luz difusa lavanda. | `special-screens.css`, `official-assets.css` |
| DATA | P2 | 68% y textos de etapas principales coinciden. Cambio de nombre autorizado; botón OMITIR INTRO adicional. | `App.tsx`, `InitialBootScreenV2` |
| ASSET | P1 | Silueta y centro del logo no coinciden con el estado de referencia. No inferir de un PNG que el loop es incorrecto. | `LoaderOneCore`, `CyberSOCLogo`, fallback estático |
| CHARTS | — | No hay gráficos de datos; barra al 68% coincide en valor, no en grosor/acabado. | CSS de progreso boot |
| DECORATION | P4 | Mesh regular muy marcado; falta gran cristal difuminado inferior izquierdo y campo de partículas profundo. | `AmbientField`, `ExactBackground`, CSS boot |
| MOTION | P5 | Rotación, separación de facetas, partículas y órbitas requieren comparación temporal. | logo WebM y animaciones CSS |

## Threat Map — MAJOR

| Categoría | Prioridad | Observación | Control probable |
| --- | --- | --- | --- |
| LAYOUT | P0/P1 | P0 de filas corregido. Persisten mapa alto, fila inferior a ancho completo y scroll; target reserva zona derecha para escenario y coloca tres tarjetas debajo del mapa. | `ThreatMapReference.tsx`, `threat-map-reference.css` |
| TYPOGRAPHY | P2 | Encabezados, etiquetas y tablas demasiado pequeños; leyenda de tipos muy compacta. | mismo CSS, `MiniTable`, `MapKpi` |
| STYLE | P3 | Toggles, acciones y superficies simplificados; estados de tabla sin badges equivalentes. | `quick-actions`, `view-tabs`, `mini-tr` |
| DATA | P2 | KPI principales coinciden; tráfico muestra -15% frente a +15% del target. Países tienen valores distintos (China 124/1,024 frente a 1,241/8,412); faltan filas/categorías equivalentes en leyenda. | constantes `events`, `origins`, `chart`; `threatMapFixture` |
| ASSET | P4 | Iconos KPI diferentes; hardware de ataque más plano y CyberAI distinto. | `MapKpi`, `ExactAttackSwitch`, `CyberAIOrb` |
| CHARTS | P1 | Geografía/posición y rutas distintas; falta etiqueta Frankfurt. Donut actual Exfiltración 11% y Otros 9%, target 8% y 12%. | `ThreatMap.tsx`, `PieChart` de `ThreatMapReference.tsx` |
| DECORATION | P4 | Radar decorativo extra arriba derecha; estrellas de títulos simplificadas; falta cita superior. | `ThreatMapReference.tsx`, CSS oficial/rd |
| MOTION | P5 | No evaluable en PNG; revisar luego rutas activas sin rerender por frame. | `ThreatMap`, `useAnimationActivity` |

## DDoS — MEDIUM

| Categoría | Prioridad | Observación | Control probable |
| --- | --- | --- | --- |
| LAYOUT | P1 | Estructura principal bastante próxima; nave/estela llega al borde del contenedor, pie combina aviso y acciones en un bloque diferente. | `DDoSMitigationScreenV2`, `SpeederCore`, `.ss-speeder-stage` |
| TYPOGRAPHY | P2 | Logs, etapas, métricas y chips más pequeños; encabezado del log centrado en vez de alineado como target. | `special-screens.css`, `MitigationMetric` |
| STYLE | P3 | Barra lisa y botones geométricos frente a acabado cristalino; tarjetas menos luminosas. | CSS mitigación, `CyberButton` |
| DATA | P2 | Coinciden 78%, 12.4 Gbps, 48.7 M, 12, 03:12 y etapas/logs principales. No se detectó diferencia dominante en esos valores. | `mitigationFixture`, constantes de `SpecialScreens.tsx` |
| ASSET | P4 | Nave de silueta/ángulo distintos; cristales laterales y asistente distintos. | `DDoSInterceptor`, assets existentes |
| CHARTS | P1 | Barras apretadas hacia izquierda; cola maliciosa persiste y serie legítima difiere. Marcadores temporales no coinciden con la distribución del target. | `trafficBars`, `.ss-traffic-chart` |
| DECORATION | P4 | Anillos lisos frente a segmentos luminosos; fondo menos denso. | `.ss-speeder-rings`, `AmbientField` |
| MOTION | P5 | Captura no valida estela/loop ni pausa. Debe mantenerse solo en mitigación. | `DDoSInterceptor`, `AdaptiveAssetImage` |

## Offline — MAJOR

| Categoría | Prioridad | Observación | Control probable |
| --- | --- | --- | --- |
| LAYOUT | P1 | Cubo alrededor de x=665..880/y=105..345 frente a x=720..1050/y=115..475; queda descentrado respecto a órbitas. Bloque de texto/acciones desplazado a derecha respecto al target. | `OfflineCube`, `ServerUnavailableV2`, `.ss-offline-*`, `.server-status-cube-asset` |
| TYPOGRAPHY | P2 | Etiquetas pequeñas y valores de tarjetas más pesados; titular con ancho diferente. | `special-screens.css` |
| STYLE | P3 | Botones y tarjetas con superficies planas y violeta más intenso. Estado superior rojo frente a verde en referencia: registrar como diferencia, no revertir semántica sin decidirlo. | `TopBar`, `CyberButton`, CSS offline |
| DATA | P2 | Coinciden Sin conexión, 10:24:17 y Servidor no responde. El sidebar dice SOC Online aun en offline, también presente en el target. | `offlineFixture`, `Sidebar`, `TopBar` |
| ASSET | P1 | Cubo existente conserva tema, pero escala y encuadre dominan la diferencia. CyberAI aparece en CURRENT y no en referencia Offline. | `ServerStatusCube`, `SpecialChrome`, `CyberAI` |
| CHARTS | — | No hay gráficos de datos. Órbitas se clasifican como decoración. | — |
| DECORATION | P4 | Faltan satélites y halo denso; órbitas vacías grandes, cristales laterales distintos. | CSS offline, `AmbientField`, assets decorativos |
| MOTION | P5 | PNG no demuestra flotación, rotación ni satélites; evaluar tras corregir posición/escala. | `ServerStatusCube`, CSS de animación |

## Riesgos de la evidencia anterior

- `playwright.config.ts` usa `docs/references`, no el directorio oficial, con tolerancia 8% y threshold 0.28. Un PASS de esa suite no certifica 1:1 contra el target.
- `tests/visual/diffs/*.repeat.png` son segundas capturas, no mapas de diferencias. No presentarlas como comparación visual oficial.
- El script de captura fuerza reduced motion y pausa CSS. Una pareja idéntica prueba estabilidad bajo ese entorno, no determinismo completo del runtime solo con query param.
- Esta auditoría no regenera capturas ni modifica baselines. El P0 reparado queda demostrado con medidas DOM antes/después; la imagen CURRENT del mapa conserva la superposición anterior.

## Dificultad recomendada y siguiente sesión

De menor a mayor esfuerzo: DATA fijo y etiquetas → TYPOGRAPHY/spacing → alineación del cubo Offline → geometría de paneles y filas de Threat Map → CHARTS/proyecciones → STYLE/biseles → DECORATION/profundidad → ASSET (solo si se autoriza) → MOTION.

Orden de prioridad distinto del esfuerzo: primero completar verificación P0 con zoom nativo y clipping interno. Después acordar la geometría del Threat Map (tabla bajo mapa y escenario derecho sin superposición); luego centrar/escalar Offline. A continuación corregir datos/series y escala tipográfica compartida antes de invertir en bordes o efectos. Mantener nombre Cyb3r_Soc y assets optimizados; documentar cualquier diferencia irreducible bajo esa restricción.

Para comenzar la siguiente fase: se requiere aprobación del usuario y cerrar los límites de verificación indicados. No se inicia ninguna fase nueva en esta sesión.

## Archivos de esta sesión y build

Creado: `docs/VISUAL_GAP_AUDIT.md`. Modificado excepcionalmente: `src/v2/threat-map-reference.css` (dos reglas estructurales). Ningún asset, captura o baseline fue sobrescrito.

Build final: `npm.cmd run build` PASS, exit code 0. TypeScript + Vite 8.2.2: 2733 módulos transformados; `built in 1.88s`. Advertencia existente: chunk JavaScript de 1,082.75 kB, superior a 500 kB. Sin errores de compilación.
