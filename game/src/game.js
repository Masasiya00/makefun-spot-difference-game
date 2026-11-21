// Twin Lanterns — the state machine: phases, timer, score, combo,
// hints, level flow and click resolution. It owns the state; render.js
// and hud.js only draw what it hands them.
(function () {
  'use strict';
  var CFG = window.TL_CONFIG;

  function makeGame(canvas) {
    var ctx = canvas.getContext('2d');
    var audio = window.TL_AUDIO.create();
    var input = null; // created after `api` below; input calls back into it.
    var state = freshState();
    var lastTickSecond = -1;
    var shakeUntil = 0;
    var shakeSeed = 0;

    function freshState() {
      return {
        phase: 'start',
        levelIndex: 0,
        level: window.TL_LEVELS[0],
        found: [],
        score: 0,
        combo: 0,
        timeLeft: window.TL_LEVELS[0].timeLimit,
        hintsLeft: CFG.hintsPerLevel,
        hint: null,
        lastLevelBonus: 0,
        muted: false,
      };
    }

    function loadLevel(index) {
      state.levelIndex = index;
      state.level = window.TL_LEVELS[index];
      state.found = [];
      state.combo = 0;
      state.timeLeft = state.level.timeLimit;
      state.hintsLeft = CFG.hintsPerLevel;
      state.hint = null;
      state.lastLevelBonus = 0;
      lastTickSecond = -1;
    }

    function startGame() {
      state.score = 0;
      loadLevel(0);
      state.phase = 'playing';
      audio.unlock();
      audio.start();
    }

    function levelComplete() {
      var bonus = Math.ceil(state.timeLeft) * CFG.levelTimeBonusPerSecond;
      state.lastLevelBonus = bonus;
      state.score += bonus;
      audio.fanfare();
      if (state.levelIndex + 1 >= window.TL_LEVELS.length) {
        state.phase = 'win';
      } else {
        state.phase = 'levelComplete';
      }
    }

    function nextLevel() {
      loadLevel(state.levelIndex + 1);
      state.phase = 'playing';
      audio.start();
    }

    function gameOver() {
      state.phase = 'gameOver';
      audio.buzz();
    }

    function pointToLocal(x, y) {
      if (y < CFG.panelY || y > CFG.panelY + CFG.panelHeight) return null;
      if (x >= CFG.leftPanelX && x <= CFG.leftPanelX + CFG.panelWidth) {
        return { variant: 0, lx: x - CFG.leftPanelX, ly: y - CFG.panelY };
      }
      if (x >= CFG.rightPanelX && x <= CFG.rightPanelX + CFG.panelWidth) {
        return { variant: 1, lx: x - CFG.rightPanelX, ly: y - CFG.panelY };
      }
      return null;
    }

    function findDifferenceAt(lx, ly) {
      var diffs = state.level.differences;
      for (var i = 0; i < diffs.length; i++) {
        if (state.found.indexOf(i) !== -1) continue;
        var d = diffs[i];
        var dx = lx - d.x;
        var dy = ly - d.y;
        if (dx * dx + dy * dy <= (d.r + CFG.clickSlack) * (d.r + CFG.clickSlack)) return i;
      }
      return -1;
    }

    var api = {
      state: state,
      startGame: startGame,
      togglePause: function () {
        if (state.phase === 'playing') state.phase = 'paused';
        else if (state.phase === 'paused') state.phase = 'playing';
      },
      toggleMute: function () {
        state.muted = audio.toggleMute();
      },
      restartLevel: function () {
        if (state.phase === 'playing' || state.phase === 'paused' || state.phase === 'gameOver') {
          loadLevel(state.levelIndex);
          state.phase = 'playing';
        }
      },
      useHint: function () {
        if (state.phase !== 'playing') return false;
        if (state.hintsLeft <= 0) return false;
        var remaining = [];
        for (var i = 0; i < state.level.differences.length; i++) {
          if (state.found.indexOf(i) === -1) remaining.push(i);
        }
        if (remaining.length === 0) return false;
        state.hintsLeft -= 1;
        state.hint = { index: remaining[0], startedAt: performance.now() };
        audio.shimmer();
        return true;
      },
      handleClick: function (x, y) {
        audio.unlock();
        if (state.phase === 'start') { startGame(); return; }
        if (state.phase === 'levelComplete') { nextLevel(); return; }
        if (state.phase === 'gameOver') { api.restartLevel(); return; }
        if (state.phase === 'win') { startGame(); return; }
        if (state.phase === 'paused') { state.phase = 'playing'; return; }
        if (state.phase !== 'playing') return;
        var p = pointToLocal(x, y);
        if (!p) return;
        var idx = findDifferenceAt(p.lx, p.ly);
        if (idx >= 0) {
          state.found.push(idx);
          state.combo += 1;
          var speedBonus = Math.round(CFG.speedBonusMax * (state.timeLeft / state.level.timeLimit));
          state.score += CFG.baseFindScore + (state.combo - 1) * CFG.comboBonusPerStep + speedBonus;
          audio.ding(state.combo);
          if (state.found.length === state.level.differences.length) levelComplete();
        } else {
          state.combo = 0;
          state.timeLeft = Math.max(0, state.timeLeft - CFG.wrongPenaltySeconds);
          shakeUntil = performance.now() + CFG.shakeDurationMs;
          shakeSeed = Math.random();
          audio.buzz();
          if (state.timeLeft <= 0) gameOver();
        }
      },
      // Deterministic snapshot for playtests and screenshots.
      snapshot: function () {
        return {
          phase: state.phase,
          level: state.levelIndex + 1,
          levelName: state.level.name,
          found: state.found.length,
          total: state.level.differences.length,
          score: state.score,
          combo: state.combo,
          timeLeft: Math.round(state.timeLeft * 10) / 10,
          hintsLeft: state.hintsLeft,
          muted: state.muted,
        };
      },
      // Test hooks: set up a shot mode without going through the UI.
      setupShot: function (mode) {
        if (mode === 'start') {
          state.phase = 'start';
        } else if (mode === 'level2') {
          loadLevel(1);
          state.found = [0, 3];
          state.score = 240;
          state.phase = 'playing';
        } else if (mode === 'complete') {
          loadLevel(0);
          state.found = [0, 1, 2, 3, 4];
          state.lastLevelBonus = 620;
          state.score = 1120;
          state.phase = 'levelComplete';
        } else {
          // cover: level 1 mid-hunt, three found, two still hidden.
          loadLevel(0);
          state.found = [0, 1, 3];
          state.score = 380;
          state.combo = 2;
          state.timeLeft = 64;
          state.phase = 'playing';
        }
      },
      update: function (dt) {
        if (state.phase !== 'playing') return;
        state.timeLeft -= dt;
        var whole = Math.ceil(state.timeLeft);
        if (state.timeLeft <= 10 && whole !== lastTickSecond && state.timeLeft > 0) {
          lastTickSecond = whole;
          audio.tick();
        }
        if (state.timeLeft <= 0) {
          state.timeLeft = 0;
          gameOver();
        }
        if (state.hint && performance.now() - state.hint.startedAt > CFG.hintDurationMs) {
          state.hint = null;
        }
      },
      draw: function (now) {
        ctx.save();
        ctx.clearRect(0, 0, CFG.canvasWidth, CFG.canvasHeight);
        if (performance.now() < shakeUntil) {
          var mag = CFG.shakePixels * (1 - (shakeUntil - performance.now()) / CFG.shakeDurationMs);
          ctx.translate((Math.random() - 0.5) * 2 * mag, (Math.random() - 0.5) * 2 * mag);
          shakeSeed = shakeSeed; // shake is visual only; seed kept for clarity.
        }
        ctx.fillStyle = '#17102a';
        ctx.fillRect(-20, -20, CFG.canvasWidth + 40, CFG.canvasHeight + 40);
        window.TL_RENDER.paintPanels(ctx, state.levelIndex, state.found, state.hint, now);
        window.TL_HUD.drawHud(ctx, state, now);
        window.TL_HUD.drawFooter(ctx);
        if (input.reticle.visible && state.phase === 'playing') {
          window.TL_RENDER.drawReticle(ctx, input.reticle.x, input.reticle.y, now);
        }
        if (state.phase === 'start') window.TL_HUD.drawStart(ctx);
        else if (state.phase === 'paused') window.TL_HUD.drawPaused(ctx);
        else if (state.phase === 'levelComplete') window.TL_HUD.drawLevelComplete(ctx, state);
        else if (state.phase === 'gameOver') window.TL_HUD.drawGameOver(ctx, state);
        else if (state.phase === 'win') window.TL_HUD.drawWin(ctx, state);
        ctx.restore();
      },
    };

    input = window.TL_INPUT.create(canvas, api);

    return api;
  }

  window.TL_GAME = { create: makeGame };
})();
