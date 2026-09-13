# Asset Audit — v2 Fixed

Auditoría técnica completa del paquete antes de reemplazar los assets del proyecto.

## Qué se corrigió

- Se eliminaron mattes/rectángulos oscuros residuales de los WebP que habían sido extraídos sobre un fondo navy.
- Se normalizó el canal alpha para que los bordes exteriores lleguen a transparencia real (`alpha = 0`) y no oscurezcan el layout al componer.
- Los dos logos animados WEBM fueron decodificados con libvpx, saneados frame a frame y recodificados como VP9 WebM con `alpha_mode=1`.
- Se sanearon los fallback WEBP del branding.
- Se validaron ambos SVG como XML correcto.
- Se volvió a optimizar el peso manteniendo el paquete muy por debajo de 5 MB.

## Nota importante sobre `boot-particle-wave.webp`

El archivo sí tiene transparencia real. La prueba que produjo un diff de 99.775% no demuestra que el WebP tuviera un fondo negro opaco.

Para integrarlo, NO reutilizar sobre el `<img>` las propiedades procedurales antiguas de `.ss-boot-wave` (backgrounds, clip-path, filters o pseudo-elementos). Debe usarse una clase de asset limpia que solo controle posición, tamaño, opacity, z-index y pointer-events.

## Assets corregidos por matte/alpha

- `boot/boot-loader-crystal-static.webp`
- `boot/boot-left-crystal-blur.webp`
- `boot/boot-orbital-fog.webp`
- `boot/boot-particle-wave.webp` (saneamiento conservador)
- `shared/sidebar-crystal-cluster.webp`
- `shared/simulation-control-device.webp`
- `ddos/ddos-mitigation-hero-static.webp`
- `offline/server-offline-hero-static.webp`
- `threat/threat-world-map.webp`
- `branding/cybersoc-logo-loop.webm`
- `branding/cybersoc-logo-loop-small.webm`
- `branding/cybersoc-logo-static.webp`
- `branding/cybersoc-logo-static-small.webp`

## Assets sin problema estructural

- `boot/boot-orbital-system.svg`
- `shared/shell-top-crystal-field.svg`

## Regla de reemplazo

Copiar la carpeta `src/assets/` encima de la carpeta `src/assets/` del proyecto conservando los mismos nombres.

No borrar todavía assets antiguos que no estén incluidos en este paquete. La eliminación de assets/código procedural debe hacerse después de validar consumidores.
