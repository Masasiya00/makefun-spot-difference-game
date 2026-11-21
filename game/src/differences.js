// Twin Lanterns — the difference sets, one level at a time.
// Every difference lives in panel-local coordinates (0..600 across,
// 0..640 down) so the same data drives both panels. `kind` names the
// trick so the scene painter knows what to change on the right panel:
// missing = the thing is gone, color = it changes colour, moved = it
// sits somewhere else, extra = it only exists on the right,
// flipped = it faces the other way, pattern = its markings change.
(function () {
  'use strict';
  window.TL_LEVELS = [
    {
      id: 'lantern-market',
      name: 'Lantern Market',
      subtitle: 'Night market under paper lanterns',
      timeLimit: 90,
      differences: [
        { x: 520, y: 70, r: 30, kind: 'color', label: 'the moon changed colour' },
        { x: 150, y: 185, r: 26, kind: 'missing', label: 'a red lantern is gone' },
        { x: 478, y: 520, r: 26, kind: 'flipped', label: 'the cat turned its tail' },
        { x: 152, y: 318, r: 30, kind: 'color', label: 'the awning stripe changed' },
        { x: 92, y: 118, r: 20, kind: 'extra', label: 'a little bird appeared' },
      ],
    },
    {
      id: 'coral-reef',
      name: 'Coral Reef',
      subtitle: 'A reef full of quiet hiding places',
      timeLimit: 120,
      differences: [
        { x: 205, y: 205, r: 26, kind: 'missing', label: 'a yellow fish swam away' },
        { x: 452, y: 542, r: 24, kind: 'color', label: 'the starfish changed colour' },
        { x: 520, y: 122, r: 24, kind: 'extra', label: 'extra bubbles rose up' },
        { x: 118, y: 418, r: 28, kind: 'missing', label: 'a coral branch is gone' },
        { x: 300, y: 305, r: 30, kind: 'pattern', label: 'the turtle lost a shell spot' },
        { x: 82, y: 435, r: 26, kind: 'moved', label: 'a seaweed frond grew taller' },
        { x: 382, y: 482, r: 24, kind: 'missing', label: 'the pearl left its clam' },
      ],
    },
    {
      id: 'clockwork-garden',
      name: 'Clockwork Garden',
      subtitle: 'Gears bloom where flowers grow',
      timeLimit: 150,
      differences: [
        { x: 300, y: 138, r: 30, kind: 'moved', label: 'the clock hand moved' },
        { x: 518, y: 300, r: 28, kind: 'color', label: 'a gear changed metal' },
        { x: 152, y: 452, r: 24, kind: 'missing', label: 'a flower never bloomed' },
        { x: 420, y: 222, r: 24, kind: 'color', label: 'the butterfly changed wings' },
        { x: 300, y: 498, r: 28, kind: 'missing', label: 'a fountain jet stopped' },
        { x: 92, y: 560, r: 28, kind: 'extra', label: 'an extra bush sprouted' },
        { x: 558, y: 92, r: 22, kind: 'color', label: 'the garden lamp went dark' },
        { x: 202, y: 122, r: 22, kind: 'extra', label: 'a bird landed on the branch' },
      ],
    },
    {
      id: 'starlight-library',
      name: 'Starlight Library',
      subtitle: 'Ten secrets among the shelves',
      timeLimit: 180,
      differences: [
        { x: 110, y: 197, r: 24, kind: 'missing', label: 'a book left the shelf' },
        { x: 480, y: 482, r: 30, kind: 'color', label: 'the globe spun to a new sea' },
        { x: 300, y: 418, r: 22, kind: 'missing', label: 'a candle flame went out' },
        { x: 400, y: 562, r: 26, kind: 'missing', label: 'the reading cat wandered off' },
        { x: 520, y: 202, r: 28, kind: 'moved', label: 'the telescope points elsewhere' },
        { x: 122, y: 92, r: 20, kind: 'extra', label: 'a new star shines in the window' },
        { x: 252, y: 240, r: 24, kind: 'missing', label: 'a ladder rung is gone' },
        { x: 421, y: 197, r: 22, kind: 'color', label: 'a book spine changed colour' },
        { x: 300, y: 602, r: 28, kind: 'pattern', label: 'the rug lost a stripe' },
        { x: 542, y: 152, r: 24, kind: 'extra', label: 'an owl perched on the shelf' },
      ],
    },
  ];
})();
