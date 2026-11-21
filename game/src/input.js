// Twin Lanterns — mouse and keyboard input, translated into game
// actions. The canvas owns one reticle: arrow keys walk it across the
// frame and Enter/Space clicks where it stands, so the whole game is
// playable without a mouse at all.
(function () {
  'use strict';
  var CFG = window.TL_CONFIG;

  function makeInput(canvas, game) {
    var reticle = { x: CFG.canvasWidth / 2, y: 420, visible: false };
    var keys = {};

    function canvasPoint(event) {
      var r = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - r.left) * (CFG.canvasWidth / r.width),
        y: (event.clientY - r.top) * (CFG.canvasHeight / r.height),
      };
    }

    canvas.addEventListener('click', function (event) {
      var p = canvasPoint(event);
      reticle.x = p.x;
      reticle.y = p.y;
      reticle.visible = true;
      game.handleClick(p.x, p.y);
    });

    canvas.addEventListener('mousemove', function (event) {
      var p = canvasPoint(event);
      reticle.x = p.x;
      reticle.y = p.y;
      reticle.visible = true;
    });

    window.addEventListener('keydown', function (event) {
      if (event.repeat && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        return;
      }
      var step = event.shiftKey ? 60 : 24;
      switch (event.key) {
        case 'ArrowLeft': reticle.x = Math.max(0, reticle.x - step); reticle.visible = true; event.preventDefault(); break;
        case 'ArrowRight': reticle.x = Math.min(CFG.canvasWidth, reticle.x + step); reticle.visible = true; event.preventDefault(); break;
        case 'ArrowUp': reticle.y = Math.max(0, reticle.y - step); reticle.visible = true; event.preventDefault(); break;
        case 'ArrowDown': reticle.y = Math.min(CFG.canvasHeight, reticle.y + step); reticle.visible = true; event.preventDefault(); break;
        case 'Enter':
        case ' ':
          reticle.visible = true;
          game.handleClick(reticle.x, reticle.y);
          event.preventDefault();
          break;
        case 'h':
        case 'H': game.useHint(); break;
        case 'p':
        case 'P':
        case 'Escape': game.togglePause(); break;
        case 'm':
        case 'M': game.toggleMute(); break;
        case 'r':
        case 'R': game.restartLevel(); break;
        default: break;
      }
      keys[event.key] = true;
    });

    window.addEventListener('keyup', function (event) {
      keys[event.key] = false;
    });

    return {
      reticle: reticle,
      isDown: function (key) { return !!keys[key]; },
    };
  }

  window.TL_INPUT = { create: makeInput };
})();
