// Twin Lanterns — shared constants for the whole game.
// One place owns every number the other files use, so a tweak here
// (a bigger click radius, a harsher wrong-click penalty) flows everywhere.
(function () {
  'use strict';
  window.TL_CONFIG = {
    canvasWidth: 1280,
    canvasHeight: 800,
    hudHeight: 76,
    footerHeight: 64,
    panelWidth: 600,
    panelHeight: 640,
    panelY: 84,
    leftPanelX: 20,
    rightPanelX: 660,
    panelGap: 40,
    // A click counts when it lands inside a difference's circle, with
    // this much slack so small differences stay fair on a mouse.
    clickSlack: 14,
    // Wrong click: seconds taken off the clock.
    wrongPenaltySeconds: 5,
    // Score: a find is worth this base, plus a combo bonus and a
    // speed bonus scaled by the time still left in the level.
    baseFindScore: 100,
    comboBonusPerStep: 20,
    speedBonusMax: 50,
    // Finishing a level banks the seconds left, times this.
    levelTimeBonusPerSecond: 10,
    // Hints per level, and how long a hint ring stays visible.
    hintsPerLevel: 3,
    hintDurationMs: 2000,
    // The timer bar turns red and throbs under this many seconds.
    dangerSeconds: 15,
    // Wrong-click screen shake, in pixels and milliseconds.
    shakePixels: 7,
    shakeDurationMs: 280,
    // Marker ring pulse, in milliseconds per full throb.
    markerPulseMs: 900,
  };
})();
