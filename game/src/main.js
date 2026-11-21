// Twin Lanterns — bootstrap: build the game, run the frame loop and
// honour the deterministic ?shot= modes the screenshots are taken in.
(function () {
  'use strict';
  var CFG = window.TL_CONFIG;

  function boot() {
    var canvas = document.getElementById('game');
    canvas.width = CFG.canvasWidth;
    canvas.height = CFG.canvasHeight;
    var game = window.TL_GAME.create(canvas);
    window.__game = game;

    var params = new URLSearchParams(window.location.search);
    var shot = params.get('shot');
    if (shot) game.setupShot(shot);

    var last = performance.now();
    var frames = 0;
    function frame(now) {
      var dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      game.update(dt);
      game.draw(now);
      frames += 1;
      // In shot mode the frame is fixed: announce readiness after a
      // few frames so the screenshot catches a settled picture.
      if (shot && frames >= 4) window.__shotReady = true;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
