# Guía de reproducción 1:1

## Baseline

- Viewport de referencia: `1672 × 941`, DPR `1`.
- Sidebar desktop: `264 px` en dashboard/mapa y `262 px` en pantallas especiales.
- Topbar: `64–70 px`, según la familia de pantalla suministrada.
- El contenido no admite scroll horizontal en el viewport objetivo.
- Paleta dominante: `#070814`, `#111123`, `#9554ff`, `#c5a9ff`, `#ff3f68`, `#54e8a2`.

## Análisis por pantalla

### Dashboard

La fila de métricas comienza a `y≈159`; el mapa ocupa la columna principal hasta `x≈1270` y la columna derecha mide aproximadamente `370 px`. Los paneles inferiores comienzan a `y≈660`. El mapa, sus rutas y sus etiquetas constituyen una sola región visual densa.

### Boot

No utiliza chrome. El lockup vive en la esquina superior izquierda, el emblema y los anillos se centran en `x≈836`, la barra comienza cerca de `y≈676` y la ola de partículas ocupa el borde inferior. El estado lateral derecho está alineado verticalmente con el centro del emblema.

### Threat map

La cabecera de página y los filtros ocupan la primera banda bajo la topbar. Cinco KPIs forman una fila de `72 px`. El mapa principal y la consola derecha comparten altura; la consola objetivo mide alrededor de `373 px`. Tres paneles tabulares forman la franja inferior.

### DDoS mitigation

La ilustración del interceptor ocupa la mitad izquierda del bloque de progreso. El valor fijo de comparación es `78%`. El log y el gráfico forman una columna derecha de `480 px`; métricas y controles permanecen en la columna principal.

### Server offline

Conserva sidebar y topbar. El cubo se centra en la parte superior del contenido; título, acciones y tres tarjetas de estado se apilan sin scroll. La topbar es el único lugar donde el centro de operaciones indica `Sin conexión`.

## Modo determinista

`?visualTest=true` fija la mitigación en `78%`, evita el boot previo a las rutas, elimina transiciones y pausa animaciones variables. Las cinco pantallas se renderizan exclusivamente con componentes React/CSS/SVG; las referencias se leen solamente desde las pruebas para calcular diferencias.

## Ciclo de ajuste

1. Ejecutar `npm run build`.
2. Ejecutar `npm run capture:visual`; guarda las cinco capturas en `docs/visual-current/`.
3. Ejecutar `npm run test:visual`; el gate máximo es `8%`.
4. Revisar los diffs en `test-results/` y corregir posiciones, tamaño, color y tipografía.
