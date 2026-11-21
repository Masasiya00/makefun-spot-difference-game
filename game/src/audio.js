// Twin Lanterns — every sound is a WebAudio oscillator, built at run
// time. No audio files, no network: a ding for a find, a low buzz for
// a miss, a shimmer for a hint and an arpeggio for a cleared level.
(function () {
  'use strict';

  function makeAudio() {
    var ctx = null;
    var muted = false;

    function ensure() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }

    function tone(freq, dur, type, vol, when, slideTo) {
      if (muted) return;
      var ac = ensure();
      if (!ac) return;
      var t0 = ac.currentTime + (when || 0);
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    }

    return {
      unlock: ensure,
      toggleMute: function () {
        muted = !muted;
        return muted;
      },
      isMuted: function () { return muted; },
      // A bright two-note ding when a difference is found.
      ding: function (combo) {
        var lift = Math.min(combo || 0, 8) * 30;
        tone(660 + lift, 0.16, 'sine', 0.18, 0);
        tone(990 + lift, 0.28, 'sine', 0.16, 0.07);
      },
      // A low buzz when the player clicks empty space.
      buzz: function () {
        tone(140, 0.25, 'sawtooth', 0.12, 0, 90);
      },
      // A rising shimmer when a hint is spent.
      shimmer: function () {
        tone(880, 0.18, 'sine', 0.1, 0);
        tone(1174, 0.18, 'sine', 0.1, 0.08);
        tone(1568, 0.3, 'sine', 0.1, 0.16);
      },
      // A four-note arpeggio when a level is cleared.
      fanfare: function () {
        var notes = [523, 659, 784, 1047];
        for (var i = 0; i < notes.length; i++) tone(notes[i], 0.3, 'triangle', 0.16, i * 0.11);
      },
      // A soft tick when the clock is nearly out.
      tick: function () {
        tone(1200, 0.05, 'square', 0.05, 0);
      },
      // A gentle two-note chime when the game starts.
      start: function () {
        tone(523, 0.2, 'sine', 0.14, 0);
        tone(784, 0.3, 'sine', 0.14, 0.1);
      },
    };
  }

  window.TL_AUDIO = { create: makeAudio };
})();
