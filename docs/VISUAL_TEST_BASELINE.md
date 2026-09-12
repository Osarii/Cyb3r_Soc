# Cyb3r_Soc visual-test baseline

- **TARGET oficial e inmutable:** `Cyb3r_Soc_References_1to1`
- **CURRENT:** `tests/visual/current`
- **REPEAT:** `tests/visual/repeat`
- **DIFF real contra TARGET:** `tests/visual/diffs`

Las cinco referencias oficiales son PNG de **1672 × 941 px**:

| Pantalla | Archivo |
| --- | --- |
| Dashboard | `01-dashboard.png` |
| Boot | `02-boot-screen.png` |
| Threat Map | `03-threat-map.png` |
| DDoS | `04-ddos-mitigation.png` |
| Offline | `05-server-offline.png` |

Las capturas se realizan con Chromium, viewport **1672 × 941**, deviceScaleFactor **1**, zoom baseline **100 %**, `es-CR`, zona horaria `America/Costa_Rica` y `?visualTest=true`. El modo visual usa datos y estados fijos, desactiva el movimiento de las trayectorias y cambia los WebM de los assets adaptativos por sus fallback WebP estáticos.

`npm.cmd run capture:visual` toma CURRENT y REPEAT. Ambas imágenes se comparan byte a byte: igualdad exacta significa `DETERMINISM = PASS`. Después genera un PNG de diferencia real por pantalla, donde gris tenue representa píxeles que coinciden y rojo representa una diferencia significativa respecto al TARGET. `tests/visual/diffs/metrics.json` registra el número y porcentaje de píxeles distintos.

Playwright toma snapshots exclusivamente desde `Cyb3r_Soc_References_1to1`. El baseline estricto usa `threshold: 0.10`, `maxDiffPixelRatio: 0.015` y `maxDiffPixels: 23600` (1.5 % de 1,573,352 píxeles). El threshold descarta variaciones de canal de hasta 25.5/255 por antialiasing; los límites de diferencia son deliberadamente mucho menores que el 8 % anterior. Un PASS significa únicamente que la captura cumple esos límites, no que sea pixel-perfect.

La automatización disponible no aplica el zoom nativo del menú de Chromium de forma fiable. Checklist manual: abrir cada ruta con `?visualTest=true`, establecer 100 %, 110 %, 125 % y 150 %, comprobar scroll horizontal, contenido cortado, solapes, los toggles del mapa y el panel de simulación; volver a 100 % antes de capturar.

## Validación de referencias

Los cinco archivos inmutables de `Cyb3r_Soc_References_1to1` fueron comprobados contra las capturas generadas: `01-dashboard.png`, `02-boot-screen.png`, `03-threat-map.png`, `04-ddos-mitigation.png` y `05-server-offline.png`. Todos miden 1672 × 941 px.

## Resultado de la captura actual

| Pantalla | Determinismo A/B | Píxeles distintos vs TARGET | Porcentaje |
| --- | --- | ---: | ---: |
| Dashboard | PASS | 357,451 / 1,573,352 | 22.719 % |
| Boot | PASS | 211,071 / 1,573,352 | 13.415 % |
| Threat Map | PASS | 474,661 / 1,573,352 | 30.169 % |
| DDoS | PASS | 338,405 / 1,573,352 | 21.509 % |
| Offline | PASS | 319,284 / 1,573,352 | 20.293 % |

Estas diferencias superan intencionalmente el baseline estricto y muestran que las pantallas actuales todavía no son 1:1. El detalle reproducible está en `tests/visual/diffs/metrics.json` y cada PNG de diff.

## Clipping interno y zoom

Con Chromium a 1672 × 941 y `?visualTest=true`, Dashboard, Boot, DDoS, Offline y Threat Map no presentan overflow horizontal. Se inspeccionaron los recortes internos: los detectados corresponden a fondos, decoraciones laterales, la animación del interceptor y el área deliberadamente acotada de logs; no se halló contenido funcional cortado.

El zoom nativo 110 %, 125 % y 150 % sigue pendiente de verificación manual porque Playwright no controla de forma fiable el zoom del menú del navegador. No debe marcarse como PASS automático por las pruebas de viewport.
