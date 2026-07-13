# AGENTS.md

This file applies to the entire repository. Goo Tower is a dependency-free,
browser-only physics puzzle game: vanilla JavaScript ES modules, HTML5 Canvas,
Web Audio, `localStorage`, and a small offline-first PWA shell.

## Start here

- Read `README.md` for the game rules and player-facing overview.
- Check `git status --short` before editing and preserve unrelated user changes.
- There is no package manager, build step, generated bundle, or automated test
  suite. Do not introduce one unless the task calls for it.
- Never open `index.html` via `file://`; ES modules and the service worker require
  HTTP. Run:

  ```sh
  python3 -m http.server 8000
  ```

  Then open `http://localhost:8000`. Use the literal `localhost` hostname during
  development: `index.html` deliberately skips service-worker registration only
  for that hostname, preventing an old cache from masking source changes.

## Validation

Run the lightweight checks that exist after every code change:

```sh
set -e
for file in js/*.js; do
  node --input-type=module --check < "$file"
done
node --check sw.js
python3 -m json.tool manifest.json >/dev/null
```

These checks validate syntax only; they do not resolve imports or exercise browser
APIs. Manually smoke-test relevant behavior over HTTP. At minimum, load the menu,
start a level, drag and release a goo ball, restart, and return to level select.
For affected features also test win/fail transitions, sound mute persistence,
touch-sized/mobile layouts, balloons, hazards, or wind as appropriate. Resize the
viewport once to catch Canvas coordinate regressions. The current game state is
available as `window.game` in DevTools for focused debugging.

## Project map

- `index.html`: DOM shell, Canvas, HUD/screens, controls, and service-worker
  registration. DOM IDs are an implicit contract with `js/ui.js` and `style.css`.
- `style.css`: all DOM/UI styling and responsive level-select behavior. Gameplay
  visuals belong in Canvas rendering, not CSS.
- `js/game.js`: owns mutable game state, pointer input, level lifecycle, fixed-step
  update loop, pipe collection, hazards, win/fail logic, and render orchestration.
- `js/config.js`: shared world, physics, goo, balloon, pipe, color, and storage
  constants. Tune shared mechanics here instead of scattering magic numbers.
- `js/physics.js`: Verlet `Point`/`Strut`/`World` model, constraint solving, and
  circle/rectangle collision.
- `js/goo.js`: `GooBall` state machine and attachment selection.
- `js/render.js`: stateless Canvas drawing for backgrounds, world objects, preview,
  and particles. It should not own gameplay state.
- `js/levels.js`: ordered level data plus inclusive `CHAPTERS` index ranges.
- `js/ui.js`: DOM event wiring and screen/HUD updates.
- `js/audio.js`: procedural Web Audio effects; there are no audio assets.
- `js/storage.js`: tolerant `localStorage` load/save wrapper.
- `sw.js`: cache-first service worker and the offline asset inventory.
- `manifest.json` and `icon-*.png`: install metadata and PWA icons.
- `.github/workflows/deploy.yml`: deploys the repository as static files to GitHub
  Pages on pushes to `main`.

## Runtime contracts

- Gameplay uses a fixed 1280x720 world (`WORLD`), independent of Canvas pixels.
  `resize()` in `js/game.js` letterboxes and scales the view; pointer positions
  must pass through `toWorld()`. Keep gameplay coordinates in world units.
- Simulation advances at a fixed 1/60-second step. Verlet velocity is encoded by
  current versus previous position (`x/y` versus `px/py`), so direct point movement
  can inject velocity. Respect `pinned`, `dragged`, and `buoyant` flags.
- `World.points` and `World.struts` use object identity. When removing a point or
  strut, also repair references held by crawling balls, attached balloons, and any
  related arrays. Balloon strings set the dynamic `noCrawl` flag.
- Regular goo state values are `falling`, `crawl`, `walk`, `held`, `sucked`, `node`,
  and `lost`; balloons additionally use `balloonNode`. State filters in input, HUD,
  pipe, hazards, and end-of-level logic must stay in sync when states change.
- User-facing copy and existing comments are Serbian; identifiers are English.
  Preserve that split. Use ES modules with explicit relative `.js` imports, single
  quotes, semicolons, and the surrounding file's indentation/style.
- Randomness is part of motion and presentation. Do not make logic depend on a
  repeatable spawn/crawl path unless you also introduce an explicit seeded design.

## Editing levels

Each entry in `LEVELS` is both gameplay and visual data. Preserve this contract:

- Stable, unique `id` (used as the key for saved best scores), Serbian `name` and
  `sub`, `required`, `total`, `killY`, `platforms`, and `pipe`.
- `initial.nodes` are `[x, y]` pairs; `initial.struts` reference node indexes;
  optional `initial.fixed` also contains node indexes.
- Visual fields are `sky`, `hills`, `ground`, `groundTop`, and optional `decor`.
- Optional mechanics are `wind`, `hazards` (`{x, y, r}`), and `balloons`
  (`[x, y]`). Keep `required <= total` and make the level solvable with losses
  allowed by its intended difficulty.
- `CHAPTERS.from`/`to` are zero-based and inclusive. When levels are inserted or
  removed, update chapter ranges, README level counts/descriptions, and any unlock
  assumptions in `js/ui.js`.

Play-test level changes rather than judging them only from coordinates. Confirm the
initial structure does not intersect platforms/hazards, attachment distances fit
the limits in `GOO`, the pipe can be activated, enough free goo can be collected,
and the level remains usable at the edges of the 1280x720 world.

## PWA and persistence pitfalls

- Any shipped static-file change can remain hidden behind the cache-first worker.
  Bump `CACHE_NAME` in `sw.js` when changing deployable game files. Add new runtime
  files to `CORE` (or deliberately to `OPTIONAL`) so offline installation is
  complete. Keep paths relative for GitHub Pages subpath hosting.
- `STORAGE_KEY` is `goo-tower-save-v1`. Keep stored `unlocked`, `best`, and `muted`
  data backward-compatible. If the schema or key changes, provide a migration or
  explicitly accept/reset old saves as part of the task.
- Test service-worker behavior separately from normal local work, because
  `http://localhost` intentionally does not register it. Avoid weakening that
  development safeguard.

## Change discipline

- Prefer the smallest cross-layer change that keeps ownership clear: simulation in
  physics/goo/game, drawing in render, DOM behavior in UI, tuning in config.
- If adding or renaming a DOM ID, update `index.html`, `style.css`, and `js/ui.js`
  together. If adding a module or asset, update `sw.js` as well.
- Avoid broad formatting rewrites in the large hand-authored `levels.js` and
  `render.js` files. Preserve Serbian diacritics and UTF-8 text.
- Do not commit, push, or alter deployment settings unless explicitly requested.
