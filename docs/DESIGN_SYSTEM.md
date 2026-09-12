# Cyb3r_Soc Design System

The interface uses shared tokens in `src/styles/global.css`. Backgrounds are charcoal and near-black, primary UI accents are purple and lavender, and status colors are semantic. Buttons, panels, cards, fields, badges, status chips, progress bars, and stat cards live in `src/components/ui`.

Geometry is lightly faceted, never ornamental for its own sake. Glow is restricted to active indicators and low-opacity ambient highlights. Display, UI, and mono typography are separated through `--font-display`, `--font-ui`, and `--font-mono`.

## Official visual assets

`src/assets/` contains the official Cyb3r_Soc visual identity. `branding/`, `ddos/`, `offline/`, and `ai/` assets are rendered through components in `src/components/assets/`. Animated WebP files are paired with static WebP fallbacks for loading failures and reduced-motion preferences. Decorative assets in `decorations/` remain subordinate to interface content and never replace the programmatic background or world map.
