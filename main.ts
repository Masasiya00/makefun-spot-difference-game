// Twin Lanterns — the hand-in program (Node 22, standard library only).
// It copies this repository's game/ and screenshots/ into the output
// directory and writes /output/dossier.json with the vendored make.fun
// library, exactly as the kit asks. Run it as:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader MAKEFUN_OUTPUT_DIR stands in for /output; with no
// variable set it writes to /output. Both runs must write the same bytes,
// so nothing here depends on the clock, the user or the environment.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Clear the output directory's contents without removing the directory
// itself: deleting the directory can fail for a later run that does not
// own it, while emptying it always works. Create it only when missing.
if (existsSync(out)) {
  for (const entry of readdirSync(out)) {
    rmSync(join(out, entry), { recursive: true, force: true });
  }
} else {
  mkdirSync(out, { recursive: true });
}

cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the dossier bytes;
// the rest refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files in game/ or
// 48 MiB of game files in all, or a path under game/ over 1000 bytes).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
