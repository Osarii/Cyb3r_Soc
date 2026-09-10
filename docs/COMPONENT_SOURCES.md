# Component sources

| Source | CyberSOC adaptation |
|---|---|
| `code/loader_1.txt` | Layered rotating star/crystal logo and initial boot identity |
| `code/loader_2.txt` | DDoS mitigation speeder and horizontal velocity trails |
| `code/loader_4.txt` | Six-face preserve-3d offline cube |
| `code/boton_ataque.txt` | Three-step physical simulation console: POWER, ARMED, LAUNCH |
| `code/ia_icon.txt` | Persistent CyberAI orb with sphere, waves, and state-driven motion |
| `code/background.txt` | Reduced-density spatial texture and ambient movement |
| `code/map.txt` | Inspiration for the dark global map and orbital markers |

New supplied components should be added to this table before integration.

## Literal copies

The six source components are preserved as literal React/styled-components copies in `src/components/referenceExact`. Only their exported component names changed. The reference-calibrated screens import and render those copies directly; presentation wrappers handle scale and placement without replacing their original DOM or animation logic.
