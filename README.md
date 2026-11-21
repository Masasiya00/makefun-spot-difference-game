# Twin Lanterns — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**Twin Lanterns** is a complete spot-the-difference game for the
[make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
Two lantern-lit pictures hang side by side — they look the same, but a few
small things changed between them. Find them all before the lanterns burn down.

## The game

Four hand-painted (procedural Canvas 2D) scenes, each harder than the last:

| Level | Scene | Differences | Time |
|-------|-------|-------------|------|
| 1 | Lantern Market | 5 | 90 s |
| 2 | Coral Reef | 7 | 120 s |
| 3 | Clockwork Garden | 8 | 150 s |
| 4 | Starlight Library | 10 | 180 s |

Differences are fair but hidden by design: a lantern that vanished, a moon
that changed colour, a cat that turned its tail, a turtle that lost a shell
spot, a clock hand that moved, a book that left the shelf — missing objects,
colour changes, moved things, tiny extras and pattern changes.

## How to play

- **Click** a difference in picture **A** or **B** — a golden pulsing ring
  marks it on both panels, with a satisfying ding.
- **Wrong click** costs 5 seconds, shakes the frame and breaks your combo.
- **H** spends a hint (3 per level): a blue dashed ring circles an
  unfound difference for 2 seconds.
- **Combo + speed bonuses** reward sharp, fast eyes; leftover time becomes
  a score bonus when a level clears.
- **P** / **Esc** pause, **M** mute, **R** restart the level.
- **Keyboard only works too:** arrow keys move the reticle, Enter clicks.

Every sound is a procedural WebAudio oscillator — no audio files. The game
runs fully offline from static files: no network requests, no external
fonts or images.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or open `game/index.html` through any static server. Screenshots are taken
with `?shot=cover|level2|complete|start` for deterministic frames.

## Structure

- `game/src/config.js` — constants (panel size, timers, scoring)
- `game/src/differences.js` — the difference sets, one level at a time
- `game/src/scenes.js` — the four scenes, each painted twice from one function
- `game/src/render.js` — two panels, found markers, hint rings, reticle
- `game/src/input.js` — mouse + keyboard + reticle
- `game/src/hud.js` — HUD bar, timer, start/pause/complete/game-over screens
- `game/src/audio.js` — procedural WebAudio sounds
- `game/src/game.js` — state machine, timer, score, combo, hints, level flow
- `game/src/main.js` — bootstrap + `?shot=` modes
- `main.ts` — the make.fun hand-in program (copies `game/` + `screenshots/`,
  writes `dossier.json`)
