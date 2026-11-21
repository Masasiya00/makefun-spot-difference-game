// Twin Lanterns — paints the two panels, the found markers and the
// feedback effects (shake, hint ring, reticle). It never owns state:
// game.js hands it a snapshot of what to draw each frame.
(function () {
  'use strict';
  var CFG = window.TL_CONFIG;

  function panelOrigin(variant) {
    return {
      x: variant === 0 ? CFG.leftPanelX : CFG.rightPanelX,
      y: CFG.panelY,
    };
  }

  function drawPanelFrame(ctx, variant, label) {
    var o = panelOrigin(variant);
    ctx.save();
    ctx.strokeStyle = '#f5e6c8';
    ctx.lineWidth = 4;
    ctx.strokeRect(o.x - 2, o.y - 2, CFG.panelWidth + 4, CFG.panelHeight + 4);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(o.x + 8, o.y + 8, 34, 24);
    ctx.fillStyle = '#ffe9a8';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, o.x + 25, o.y + 21);
    ctx.restore();
  }

  function drawFoundMarker(ctx, origin, diff, now) {
    var pulse = 0.5 + 0.5 * Math.sin((now / CFG.markerPulseMs) * Math.PI * 2);
    var r = diff.r + 4 + pulse * 4;
    ctx.save();
    ctx.beginPath();
    ctx.arc(origin.x + diff.x, origin.y + diff.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffd23e';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(origin.x + diff.x, origin.y + diff.y, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,210,62,' + (0.35 + pulse * 0.3) + ')';
    ctx.lineWidth = 2;
    ctx.stroke();
    // A small check in the middle of the ring, so a found difference
    // reads as "done" even at contact-sheet size.
    ctx.beginPath();
    ctx.moveTo(origin.x + diff.x - 7, origin.y + diff.y);
    ctx.lineTo(origin.x + diff.x - 1, origin.y + diff.y + 6);
    ctx.lineTo(origin.x + diff.x + 9, origin.y + diff.y - 6);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  function drawHintRing(ctx, origin, diff, now, startedAt) {
    var age = now - startedAt;
    var frac = age / CFG.hintDurationMs;
    if (frac < 0 || frac > 1) return;
    var alpha = frac < 0.2 ? frac / 0.2 : 1 - (frac - 0.2) / 0.8;
    var r = diff.r + 10 + Math.sin(frac * Math.PI * 4) * 4;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.beginPath();
    ctx.arc(origin.x + diff.x, origin.y + diff.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#5db4ff';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.restore();
  }

  function drawReticle(ctx, x, y, now) {
    var pulse = 0.5 + 0.5 * Math.sin(now / 180);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 12 + pulse * 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.lineTo(x - 6, y);
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x, y - 6);
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x, y + 18);
    ctx.stroke();
    ctx.restore();
  }

  function paintPanels(ctx, levelIndex, found, hint, now) {
    var painter = window.TL_SCENES.painters[levelIndex];
    var level = window.TL_LEVELS[levelIndex];
    for (var variant = 0; variant < 2; variant++) {
      var o = panelOrigin(variant);
      ctx.save();
      ctx.beginPath();
      ctx.rect(o.x, o.y, CFG.panelWidth, CFG.panelHeight);
      ctx.clip();
      ctx.translate(o.x, o.y);
      painter(ctx, variant, CFG.panelWidth, CFG.panelHeight);
      ctx.restore();
      drawPanelFrame(ctx, variant, variant === 0 ? 'A' : 'B');
      for (var i = 0; i < level.differences.length; i++) {
        if (found.indexOf(i) !== -1) drawFoundMarker(ctx, o, level.differences[i], now);
      }
      if (hint && hint.index >= 0) {
        drawHintRing(ctx, o, level.differences[hint.index], now, hint.startedAt);
      }
    }
  }

  window.TL_RENDER = {
    paintPanels: paintPanels,
    drawReticle: drawReticle,
    panelOrigin: panelOrigin,
  };
})();
