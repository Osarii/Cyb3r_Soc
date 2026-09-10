# Auditoría visual Cyb3r_Soc

Actualización: 2026-09-10. Comparación en Chromium a 1672 × 941, DPR 1, con `?visualTest=true` para estabilizar animaciones.

## Estado real

La implementación todavía NO es una réplica 1:1. El umbral automatizado existente (8%, threshold por píxel 0.28) es provisional y no demuestra fidelidad visual. No se modificaron las referencias ni se relajó el umbral.

| Pantalla | Última prueba visual | Diferencias pendientes |
|---|---|---|
| Dashboard | Pasa el umbral provisional | Facetas del logo, textura, tipografía y rutas del mapa |
| Boot | Pasa el umbral provisional | Geometría e iluminación del cristal central |
| Mapa | Falla: 125978 píxeles distintos | Proyección, composición de rutas, densidad y detalles de paneles |
| Mitigación | Pasa el umbral provisional | Silueta del interceptor, estelas e iluminación |
| Offline | Pasa el umbral provisional | Perspectiva, posición y material del cubo |

Build: correcto. Pruebas funcionales y responsive: 14/14 correctas antes del último ajuste de marcos y centrado geográfico. Última suite visual: 4/5 correctas.

## Cambios de esta revisión

- Marcos biselados reales en CSS, tipografía y jerarquía de paneles.
- Corrección del recorte de la consola de ataque.
- Logo por capas basado en loader_1; cubo HTML/CSS de seis caras basado en loader_4.
- Mapa SVG con textura geográfica, etiquetas proyectadas y marcadores que recorren las trayectorias.
- Fondo geométrico y partículas SVG; orb adaptado desde ia_icon.
- Pausa de efectos de mitigación vinculada al estado de la simulación.

Las capturas de referencia no se utilizan como interfaz ni fondo de la aplicación. El comparador independiente `visual-comparison.html` permite superponer las cinco referencias y los renders de `visual-current/`.

## Reproducción

```powershell
npm.cmd run build
npm.cmd run capture:visual
npm.cmd run test:visual
npm.cmd run test:responsive
```
