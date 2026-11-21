// Twin Lanterns — the four scenes, painted twice from one function.
// Every painter takes (ctx, variant, w, h) and draws the same picture
// for variant 0 (left panel) and variant 1 (right panel), changing only
// the handful of details listed in differences.js. All art is procedural
// Canvas 2D: gradients, arcs, polygons — no images, no network, and no
// randomness, so both panels and every screenshot render identically.
(function () {
  'use strict';

  function circle(ctx, x, y, r, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function ellipse(ctx, x, y, rx, ry, fill) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function rect(ctx, x, y, w, h, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  }

  function poly(ctx, points, fill) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function star(ctx, x, y, r, fill, points) {
    points = points || 5;
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var rad = i % 2 === 0 ? r : r * 0.45;
      var a = (i * Math.PI) / points - Math.PI / 2;
      var px = x + Math.cos(a) * rad;
      var py = y + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function paperLantern(ctx, x, y, r, color, lit) {
    ellipse(ctx, x, y, r * 0.72, r, color);
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.72, r, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - r * 0.45, y - r * 0.55);
    ctx.lineTo(x + r * 0.45, y - r * 0.55);
    ctx.moveTo(x - r * 0.45, y + r * 0.55);
    ctx.lineTo(x + r * 0.45, y + r * 0.55);
    ctx.stroke();
    rect(ctx, x - 5, y - r - 6, 10, 6, '#8a6d3b');
    rect(ctx, x - 6, y + r, 12, 7, '#c0392b');
    if (lit) circle(ctx, x, y, r * 0.28, 'rgba(255,244,180,0.85)');
  }

  function stringLights(ctx, y0, sag, colors) {
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.quadraticCurveTo(300, y0 + sag, 600, y0);
    ctx.strokeStyle = '#3a2f4d';
    ctx.lineWidth = 2;
    ctx.stroke();
    for (var i = 0; i < 11; i++) {
      var t = i / 10;
      var x = t * 600;
      var y = y0 + sag * 2 * t * (1 - t) * 2 * 0.5 + sag * 0; // sag curve approx
      y = y0 + 4 * sag * 0.25 * t * (1 - t) * 2;
      var c = colors[i % colors.length];
      circle(ctx, x, y + 8, 5, c);
      circle(ctx, x, y + 8, 8, c + '44');
    }
  }

  function littleBird(ctx, x, y, color) {
    ellipse(ctx, x, y, 12, 8, color);
    circle(ctx, x + 10, y - 6, 5, color);
    poly(ctx, [[x + 14, y - 7], [x + 20, y - 4], [x + 14, y - 3]], '#f39c12');
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 2);
    ctx.quadraticCurveTo(x - 18, y - 6, x - 8, y - 8);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  function drawLanternMarket(ctx, variant, w, h) {
    var sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1b1440');
    sky.addColorStop(0.55, '#3b2060');
    sky.addColorStop(1, '#6b2d5c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    var starPos = [[40, 40], [120, 70], [200, 36], [280, 60], [360, 34], [440, 66], [560, 40], [80, 150], [580, 150], [330, 90]];
    for (var i = 0; i < starPos.length; i++) star(ctx, starPos[i][0], starPos[i][1], 3.5, '#ffe9a8');
    // Difference 1: the moon changes colour on the right panel.
    circle(ctx, 520, 70, 30, variant === 1 ? '#a8e6b0' : '#ffe9a8');
    circle(ctx, 510, 62, 7, 'rgba(0,0,0,0.12)');
    circle(ctx, 530, 78, 5, 'rgba(0,0,0,0.12)');
    stringLights(ctx, 96, 26, ['#ff5d5d', '#ffd23e', '#5dd39e', '#5db4ff']);
    stringLights(ctx, 150, 30, ['#ffd23e', '#ff5d5d', '#c58cff', '#5dd39e']);
    // Difference 5: a little bird perches on the wire, right panel only.
    if (variant === 1) littleBird(ctx, 92, 112, '#2c2438');
    // Market stalls along the bottom half.
    rect(ctx, 30, 330, 260, 14, '#7a4a21');
    rect(ctx, 42, 344, 12, 120, '#5d3517');
    rect(ctx, 266, 344, 12, 120, '#5d3517');
    rect(ctx, 60, 380, 200, 84, '#8a5a2b');
    rect(ctx, 60, 380, 200, 10, '#a06a33');
    // Jars and fruit on the counter.
    circle(ctx, 90, 368, 12, '#e67e22');
    circle(ctx, 120, 368, 12, '#e74c3c');
    circle(ctx, 150, 368, 12, '#f1c40f');
    circle(ctx, 180, 368, 12, '#27ae60');
    circle(ctx, 215, 368, 12, '#e67e22');
    circle(ctx, 240, 368, 12, '#e74c3c');
    // Awning over the stall, stripes across the top.
    poly(ctx, [[20, 300], [300, 300], [290, 336], [30, 336]], '#f5e6c8');
    for (var s = 0; s < 5; s++) {
      var sx = 30 + s * 54;
      // Difference 4: one awning stripe changes colour on the right.
      var stripe = (s === 2 && variant === 1) ? '#1abc9c' : '#d94f3d';
      poly(ctx, [[sx, 300], [sx + 27, 300], [sx + 25, 336], [sx - 2, 336]], stripe);
    }
    // Second stall, right side.
    rect(ctx, 340, 350, 220, 12, '#7a4a21');
    rect(ctx, 352, 362, 12, 102, '#5d3517');
    rect(ctx, 536, 362, 12, 102, '#5d3517');
    rect(ctx, 368, 396, 164, 68, '#8a5a2b');
    poly(ctx, [[330, 322], [570, 322], [560, 356], [340, 356]], '#f5e6c8');
    for (var t = 0; t < 4; t++) {
      var tx = 340 + t * 58;
      poly(ctx, [[tx, 322], [tx + 29, 322], [tx + 27, 356], [tx - 2, 356]], t % 2 ? '#2e86c1' : '#f5e6c8');
    }
    circle(ctx, 400, 388, 11, '#af7ac5');
    circle(ctx, 440, 388, 11, '#f39c12');
    circle(ctx, 480, 388, 11, '#58d68d');
    // Vendor behind the left stall.
    circle(ctx, 160, 300, 22, '#f2c79b');
    poly(ctx, [[128, 330], [192, 330], [200, 380], [120, 380]], '#3d6b8e');
    rect(ctx, 138, 272, 44, 10, '#d94f3d');
    circle(ctx, 146, 296, 3, '#2c2438');
    circle(ctx, 174, 296, 3, '#2c2438');
    ctx.beginPath();
    ctx.arc(160, 306, 7, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#2c2438';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Lanterns hanging between the stalls.
    paperLantern(ctx, 320, 240, 26, '#e74c3c', true);
    paperLantern(ctx, 380, 200, 20, '#f39c12', true);
    paperLantern(ctx, 250, 210, 18, '#f1c40f', true);
    // Difference 2: the big red lantern vanishes on the right panel.
    if (variant === 0) paperLantern(ctx, 150, 185, 30, '#c0392b', true);
    paperLantern(ctx, 470, 250, 22, '#e67e22', true);
    paperLantern(ctx, 540, 200, 16, '#e74c3c', true);
    // Cobblestone ground.
    rect(ctx, 0, 464, 600, 176, '#4a3560');
    for (var gx = 0; gx < 12; gx++) {
      for (var gy = 0; gy < 3; gy++) {
        ellipse(ctx, 30 + gx * 50 + (gy % 2) * 25, 490 + gy * 52, 22, 12, gy % 2 ? '#5a4270' : '#54406a');
      }
    }
    // Crates and a basket near the stalls.
    rect(ctx, 40, 520, 70, 60, '#8a5a2b');
    rect(ctx, 40, 520, 70, 8, '#a06a33');
    rect(ctx, 118, 540, 56, 40, '#7a4a21');
    ellipse(ctx, 520, 560, 44, 26, '#b07a3a');
    circle(ctx, 500, 548, 9, '#e74c3c');
    circle(ctx, 520, 544, 9, '#f1c40f');
    circle(ctx, 540, 548, 9, '#27ae60');
    // Difference 3: the cat's tail flips direction on the right panel.
    ellipse(ctx, 478, 540, 34, 22, '#2c2438');
    circle(ctx, 500, 512, 16, '#2c2438');
    poly(ctx, [[490, 500], [494, 486], [500, 500]], '#2c2438');
    poly(ctx, [[504, 500], [510, 488], [514, 502]], '#2c2438');
    ctx.beginPath();
    if (variant === 1) {
      ctx.moveTo(448, 540);
      ctx.quadraticCurveTo(420, 520, 428, 496);
    } else {
      ctx.moveTo(508, 540);
      ctx.quadraticCurveTo(536, 520, 528, 496);
    }
    ctx.strokeStyle = '#2c2438';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();
    circle(ctx, 505, 508, 2.5, '#ffd23e');
    ctx.beginPath();
    ctx.moveTo(448, 548);
    ctx.lineTo(470, 548);
    ctx.strokeStyle = '#2c2438';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawFish(ctx, x, y, size, color, flip) {
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    ellipse(ctx, 0, 0, size, size * 0.55, color);
    poly(ctx, [[-size * 0.8, 0], [-size * 1.5, -size * 0.6], [-size * 1.5, size * 0.6]], color);
    circle(ctx, size * 0.45, -size * 0.1, size * 0.12, '#1a1a2e');
    ctx.restore();
  }

  function coralBranch(ctx, x, y, len, color, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(6, -len * 0.5, 0, -len);
    ctx.quadraticCurveTo(-8, -len * 0.6, -14, -len * 0.9);
    ctx.moveTo(0, -len * 0.5);
    ctx.quadraticCurveTo(12, -len * 0.8, 18, -len * 1.1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  function drawCoralReef(ctx, variant, w, h) {
    var water = ctx.createLinearGradient(0, 0, 0, h);
    water.addColorStop(0, '#0e5f7d');
    water.addColorStop(0.6, '#12809e');
    water.addColorStop(1, '#0a4a63');
    ctx.fillStyle = water;
    ctx.fillRect(0, 0, w, h);
    // Light rays from the surface.
    ctx.fillStyle = 'rgba(255,255,220,0.08)';
    poly(ctx, [[80, 0], [150, 0], [260, 640], [150, 640]], 'rgba(255,255,220,0.08)');
    poly(ctx, [[330, 0], [380, 0], [480, 640], [400, 640]], 'rgba(255,255,220,0.08)');
    // Sandy floor.
    ellipse(ctx, 300, 660, 340, 60, '#e8d29a');
    ellipse(ctx, 80, 640, 140, 36, '#dcc489');
    ellipse(ctx, 520, 645, 150, 40, '#dcc489');
    // Seaweed: difference 6 grows taller on the right panel.
    var weedH = variant === 1 ? 150 : 100;
    ctx.strokeStyle = '#2e9e6b';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(82, 560);
    ctx.quadraticCurveTo(60, 500, 82, 560 - weedH);
    ctx.moveTo(100, 560);
    ctx.quadraticCurveTo(120, 510, 102, 470);
    ctx.stroke();
    ctx.strokeStyle = '#37b47a';
    ctx.beginPath();
    ctx.moveTo(520, 560);
    ctx.quadraticCurveTo(500, 480, 522, 430);
    ctx.moveTo(540, 560);
    ctx.quadraticCurveTo(560, 500, 544, 460);
    ctx.stroke();
    // Corals.
    coralBranch(ctx, 118, 520, 90, '#ff7f9e', -0.15);
    coralBranch(ctx, 140, 520, 70, '#ff7f9e', 0.2);
    // Difference 4: one coral branch is gone on the right panel.
    if (variant === 0) coralBranch(ctx, 118, 480, 60, '#ff9fb4', -0.5);
    coralBranch(ctx, 470, 540, 80, '#c58cff', 0.1);
    coralBranch(ctx, 490, 540, 60, '#c58cff', -0.3);
    circle(ctx, 250, 560, 26, '#ff8c69');
    circle(ctx, 268, 548, 18, '#ff8c69');
    circle(ctx, 232, 548, 16, '#ff8c69');
    // Anemone.
    ctx.strokeStyle = '#ff9f43';
    ctx.lineWidth = 4;
    for (var a = 0; a < 7; a++) {
      ctx.beginPath();
      ctx.moveTo(560, 580);
      ctx.quadraticCurveTo(548 + a * 6, 540, 540 + a * 8, 520);
      ctx.stroke();
    }
    // Turtle: difference 5 removes one shell spot on the right.
    ellipse(ctx, 300, 305, 52, 34, '#4e9b47');
    ellipse(ctx, 300, 305, 40, 26, '#6fbf5e');
    circle(ctx, 352, 300, 16, '#7bc96a');
    circle(ctx, 354, 296, 2.5, '#1a1a2e');
    circle(ctx, 286, 296, 7, '#2e6b34');
    circle(ctx, 312, 312, 7, '#2e6b34');
    if (variant === 0) circle(ctx, 300, 290, 6, '#2e6b34');
    ctx.strokeStyle = '#4e9b47';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(258, 318);
    ctx.quadraticCurveTo(240, 330, 246, 344);
    ctx.moveTo(258, 292);
    ctx.quadraticCurveTo(240, 282, 246, 268);
    ctx.stroke();
    // Fish. Difference 1: the yellow fish is gone on the right panel.
    if (variant === 0) drawFish(ctx, 205, 205, 22, '#ffd23e', false);
    drawFish(ctx, 420, 160, 18, '#ff7f50', true);
    drawFish(ctx, 120, 120, 15, '#5db4ff', false);
    drawFish(ctx, 480, 380, 20, '#ff8c69', true);
    drawFish(ctx, 180, 420, 14, '#c58cff', false);
    drawFish(ctx, 340, 120, 13, '#5dd39e', false);
    // Bubbles. Difference 3: extra bubbles rise on the right panel.
    var bubbles = [[150, 480, 6], [168, 440, 4], [330, 420, 5], [352, 380, 4], [470, 300, 6]];
    for (var b = 0; b < bubbles.length; b++) {
      circle(ctx, bubbles[b][0], bubbles[b][1], bubbles[b][2], 'rgba(255,255,255,0.35)');
    }
    if (variant === 1) {
      circle(ctx, 520, 122, 7, 'rgba(255,255,255,0.4)');
      circle(ctx, 534, 100, 5, 'rgba(255,255,255,0.4)');
      circle(ctx, 508, 96, 4, 'rgba(255,255,255,0.4)');
    }
    // Clam with a pearl: difference 7 takes the pearl away on the right.
    ellipse(ctx, 382, 500, 40, 22, '#b08bd6');
    ellipse(ctx, 382, 486, 40, 18, '#c9a7e8');
    if (variant === 0) circle(ctx, 382, 482, 10, '#fff3f3');
    // Starfish: difference 2 changes its colour on the right panel.
    star(ctx, 452, 542, 22, variant === 1 ? '#8e6fd8' : '#ff8c42', 5);
    star(ctx, 90, 580, 16, '#ffd23e', 5);
    // Small rocks and shells scattered on the sand.
    circle(ctx, 200, 600, 10, '#9b8c7a');
    circle(ctx, 430, 600, 12, '#8a7a68');
    ellipse(ctx, 250, 610, 16, 9, '#e8a0b4');
  }

  function drawGear(ctx, x, y, r, color, teeth, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (var i = 0; i < teeth; i++) {
      var a = (i * Math.PI * 2) / teeth;
      var a2 = a + Math.PI / teeth;
      var r1 = r;
      var r2 = r * 1.22;
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2);
      ctx.lineTo(Math.cos(a2) * r1, Math.sin(a2) * r1);
    }
    ctx.fill();
    circle(ctx, 0, 0, r * 0.82, color);
    circle(ctx, 0, 0, r * 0.3, '#3a2f28');
    ctx.restore();
  }

  function drawFlower(ctx, x, y, petal, center) {
    for (var i = 0; i < 6; i++) {
      var a = (i * Math.PI) / 3;
      ellipse(ctx, x + Math.cos(a) * 12, y + Math.sin(a) * 12, 9, 6, petal);
    }
    circle(ctx, x, y, 7, center);
  }

  function drawClockworkGarden(ctx, variant, w, h) {
    var sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#bfe3c0');
    sky.addColorStop(0.6, '#8ec9a3');
    sky.addColorStop(1, '#5da87f');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    // Garden wall and hedge line.
    rect(ctx, 0, 380, 600, 90, '#7a9a5b');
    rect(ctx, 0, 380, 600, 10, '#5d7f45');
    circle(ctx, 60, 385, 30, '#6b8f4e');
    circle(ctx, 160, 385, 34, '#6b8f4e');
    circle(ctx, 470, 385, 32, '#6b8f4e');
    circle(ctx, 550, 385, 28, '#6b8f4e');
    // Difference 6: an extra bush sprouts on the right panel.
    if (variant === 1) circle(ctx, 92, 560, 30, '#5d7f45');
    // Clock tower.
    rect(ctx, 250, 60, 100, 320, '#d9c9a3');
    rect(ctx, 240, 50, 120, 16, '#b8a67e');
    poly(ctx, [[240, 50], [300, 10], [360, 50]], '#a34d3d');
    circle(ctx, 300, 138, 44, '#fdf6e3');
    ctx.beginPath();
    ctx.arc(300, 138, 44, 0, Math.PI * 2);
    ctx.strokeStyle = '#8a6d3b';
    ctx.lineWidth = 4;
    ctx.stroke();
    for (var m = 0; m < 12; m++) {
      var ma = (m * Math.PI) / 6;
      circle(ctx, 300 + Math.cos(ma) * 36, 138 + Math.sin(ma) * 36, 2.5, '#3a2f28');
    }
    // Difference 1: the hour hand points elsewhere on the right panel.
    var handAngle = variant === 1 ? Math.PI * 0.75 : -Math.PI * 0.35;
    ctx.beginPath();
    ctx.moveTo(300, 138);
    ctx.lineTo(300 + Math.cos(handAngle) * 24, 138 + Math.sin(handAngle) * 24);
    ctx.strokeStyle = '#3a2f28';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(300, 138);
    ctx.lineTo(300, 138 - 32);
    ctx.strokeStyle = '#3a2f28';
    ctx.lineWidth = 3;
    ctx.stroke();
    circle(ctx, 300, 138, 5, '#a34d3d');
    rect(ctx, 282, 250, 36, 60, '#7a5a35');
    circle(ctx, 300, 280, 8, '#ffd23e');
    // Branch with a bird: difference 8 lands a bird on the right panel.
    ctx.beginPath();
    ctx.moveTo(120, 150);
    ctx.quadraticCurveTo(170, 120, 230, 130);
    ctx.strokeStyle = '#6b4a2f';
    ctx.lineWidth = 5;
    ctx.stroke();
    if (variant === 1) littleBird(ctx, 202, 118, '#2c2438');
    // Gears turning in the flowerbeds.
    drawGear(ctx, 470, 300, 34, '#c9a227', 8, 0.3);
    // Difference 2: the big gear changes metal on the right panel.
    drawGear(ctx, 518, 300, 26, variant === 1 ? '#7fa8c9' : '#b08d2e', 8, 0.9);
    drawGear(ctx, 110, 300, 28, '#c9a227', 8, 0.6);
    drawGear(ctx, 540, 430, 22, '#b08d2e', 7, 0.2);
    // Butterfly: difference 4 changes its wings on the right panel.
    var wing = variant === 1 ? '#5db4ff' : '#ff8c42';
    ellipse(ctx, 408, 212, 14, 10, wing);
    ellipse(ctx, 432, 212, 14, 10, wing);
    ellipse(ctx, 410, 232, 10, 8, wing);
    ellipse(ctx, 430, 232, 10, 8, wing);
    rect(ctx, 418, 208, 4, 26, '#3a2f28');
    // Flowerbeds. Difference 3: one flower never blooms on the right.
    ctx.strokeStyle = '#3d7a44';
    ctx.lineWidth = 4;
    var fx = [80, 152, 230, 380, 460, 530];
    for (var f = 0; f < fx.length; f++) {
      ctx.beginPath();
      ctx.moveTo(fx[f], 480);
      ctx.lineTo(fx[f], 448);
      ctx.stroke();
    }
    drawFlower(ctx, 80, 440, '#ff6b9d', '#ffd23e');
    if (variant === 0) drawFlower(ctx, 152, 440, '#c58cff', '#ffd23e');
    drawFlower(ctx, 230, 440, '#ff8c42', '#8a5a2b');
    drawFlower(ctx, 380, 440, '#5db4ff', '#ffd23e');
    drawFlower(ctx, 460, 440, '#ff6b9d', '#fff');
    drawFlower(ctx, 530, 440, '#ffd23e', '#c0392b');
    // Fountain. Difference 5: the middle jet stops on the right panel.
    ellipse(ctx, 300, 530, 70, 22, '#8ec9e8');
    ellipse(ctx, 300, 524, 52, 14, '#a8d8f0');
    ctx.strokeStyle = '#5db4e8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(272, 520);
    ctx.quadraticCurveTo(260, 480, 272, 460);
    ctx.moveTo(328, 520);
    ctx.quadraticCurveTo(340, 480, 328, 460);
    if (variant === 0) {
      ctx.moveTo(300, 520);
      ctx.quadraticCurveTo(300, 470, 300, 452);
    }
    ctx.stroke();
    // Garden lamp: difference 7 goes dark on the right panel.
    rect(ctx, 552, 96, 6, 40, '#3a2f28');
    circle(ctx, 555, 92, 12, variant === 1 ? '#5a5a5a' : '#ffe9a8');
    if (variant === 0) circle(ctx, 555, 92, 20, 'rgba(255,233,168,0.35)');
    // Stone path and grass tufts.
    ellipse(ctx, 300, 590, 60, 16, '#d9c9a3');
    ellipse(ctx, 300, 620, 70, 16, '#cfc0a0');
    ellipse(ctx, 180, 600, 40, 12, '#d9c9a3');
    ellipse(ctx, 420, 600, 40, 12, '#d9c9a3');
    ctx.strokeStyle = '#4a7a3d';
    ctx.lineWidth = 3;
    var tufts = [[40, 620], [140, 610], [500, 610], [560, 620], [220, 625]];
    for (var g = 0; g < tufts.length; g++) {
      ctx.beginPath();
      ctx.moveTo(tufts[g][0], tufts[g][1]);
      ctx.lineTo(tufts[g][0] - 6, tufts[g][1] - 14);
      ctx.moveTo(tufts[g][0], tufts[g][1]);
      ctx.lineTo(tufts[g][0] + 6, tufts[g][1] - 14);
      ctx.stroke();
    }
  }

  function bookRow(ctx, x, y, width, colors, missingIndex, recolorIndex, recolor) {
    var bw = width / colors.length;
    for (var i = 0; i < colors.length; i++) {
      if (i === missingIndex) continue;
      var c = i === recolorIndex ? recolor : colors[i];
      rect(ctx, x + i * bw + 1, y, bw - 2, 46, c);
      rect(ctx, x + i * bw + 1, y + 8, bw - 2, 3, 'rgba(255,255,255,0.35)');
    }
  }

  function drawStarlightLibrary(ctx, variant, w, h) {
    // Warm wood wall.
    var wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, '#5d3a22');
    wall.addColorStop(1, '#3d2415');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h);
    // Window with night sky. Difference 6: a new star shines, right only.
    rect(ctx, 60, 40, 150, 130, '#1b1440');
    rect(ctx, 60, 40, 150, 130, '#1b1440');
    ctx.strokeStyle = '#8a6d3b';
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 40, 150, 130);
    ctx.beginPath();
    ctx.moveTo(135, 40);
    ctx.lineTo(135, 170);
    ctx.moveTo(60, 105);
    ctx.lineTo(210, 105);
    ctx.stroke();
    circle(ctx, 180, 70, 16, '#ffe9a8');
    star(ctx, 90, 140, 5, '#fff');
    star(ctx, 160, 140, 4, '#fff');
    star(ctx, 190, 130, 4, '#ffe9a8');
    if (variant === 1) star(ctx, 122, 92, 6, '#ffe9a8');
    // Hanging lamp.
    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 46);
    ctx.strokeStyle = '#2c2438';
    ctx.lineWidth = 3;
    ctx.stroke();
    poly(ctx, [[276, 46], [324, 46], [312, 74], [288, 74]], '#c0392b');
    circle(ctx, 300, 76, 8, '#ffe9a8');
    circle(ctx, 300, 76, 18, 'rgba(255,233,168,0.25)');
    // Bookshelves: three rows.
    var shelfColors1 = ['#c0392b', '#2e86c1', '#27ae60', '#f39c12', '#8e44ad', '#16a085'];
    var shelfColors2 = ['#16a085', '#e74c3c', '#2e86c1', '#f1c40f', '#27ae60', '#d35400'];
    var shelfColors3 = ['#8e44ad', '#c0392b', '#16a085', '#2e86c1', '#f39c12', '#27ae60'];
    rect(ctx, 40, 220, 260, 8, '#8a5a2b');
    // Difference 1: a book leaves the top shelf on the right panel.
    bookRow(ctx, 50, 174, 240, shelfColors1, variant === 1 ? 1 : -1, -1, '');
    rect(ctx, 320, 220, 240, 8, '#8a5a2b');
    // Difference 8: one spine changes colour on the right panel.
    bookRow(ctx, 330, 174, 220, shelfColors2, -1, variant === 1 ? 2 : -1, '#e84393');
    rect(ctx, 40, 330, 260, 8, '#8a5a2b');
    // Difference 7: a ladder rung is gone on the right panel.
    bookRow(ctx, 50, 284, 240, shelfColors3, -1, -1, '');
    rect(ctx, 320, 330, 240, 8, '#8a5a2b');
    bookRow(ctx, 330, 284, 220, shelfColors1, -1, -1, '');
    // Ladder leaning on the left shelves.
    ctx.strokeStyle = '#a06a33';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(232, 180);
    ctx.lineTo(232, 330);
    ctx.moveTo(272, 180);
    ctx.lineTo(272, 330);
    ctx.stroke();
    ctx.lineWidth = 4;
    var rungs = [210, 240, 270, 300];
    for (var r = 0; r < rungs.length; r++) {
      if (variant === 1 && r === 1) continue;
      ctx.beginPath();
      ctx.moveTo(232, rungs[r]);
      ctx.lineTo(272, rungs[r]);
      ctx.stroke();
    }
    // Owl: difference 10 perches on the shelf, right panel only.
    if (variant === 1) {
      ellipse(ctx, 542, 152, 18, 22, '#6b4a2f');
      circle(ctx, 542, 128, 14, '#6b4a2f');
      circle(ctx, 536, 126, 4, '#ffe9a8');
      circle(ctx, 548, 126, 4, '#ffe9a8');
      poly(ctx, [[538, 138], [546, 138], [542, 144]], '#f39c12');
    }
    // Telescope: difference 5 swings it to a new angle on the right.
    ctx.save();
    ctx.translate(520, 202);
    ctx.rotate(variant === 1 ? -0.5 : 0.35);
    rect(ctx, -30, -8, 70, 16, '#b08d2e');
    poly(ctx, [[40, -10], [58, -6], [58, 6], [40, 10]], '#8a6d3b');
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(520, 210);
    ctx.lineTo(520, 260);
    ctx.strokeStyle = '#3a2f28';
    ctx.lineWidth = 5;
    ctx.stroke();
    // Reading desk.
    rect(ctx, 60, 470, 480, 16, '#7a4a21');
    rect(ctx, 80, 486, 14, 90, '#5d3517');
    rect(ctx, 506, 486, 14, 90, '#5d3517');
    // Globe: difference 2 spins it to a new sea on the right panel.
    circle(ctx, 480, 482, 28, variant === 1 ? '#2e9e6b' : '#2e86c1');
    ellipse(ctx, 472, 474, 12, 8, '#7fbf5e');
    ellipse(ctx, 490, 492, 10, 6, '#7fbf5e');
    ctx.beginPath();
    ctx.arc(480, 482, 28, 0, Math.PI * 2);
    ctx.strokeStyle = '#8a6d3b';
    ctx.lineWidth = 3;
    ctx.stroke();
    rect(ctx, 474, 510, 12, 12, '#8a6d3b');
    // Candles. Difference 3: one flame goes out on the right panel.
    rect(ctx, 292, 440, 16, 30, '#f5e6c8');
    if (variant === 0) {
      ellipse(ctx, 300, 428, 7, 12, '#ffb347');
      ellipse(ctx, 300, 430, 4, 7, '#ffe9a8');
    }
    rect(ctx, 330, 448, 14, 22, '#f5e6c8');
    ellipse(ctx, 337, 438, 6, 10, '#ffb347');
    // Open book on the desk.
    poly(ctx, [[180, 462], [230, 450], [230, 470], [180, 470]], '#fdf6e3');
    poly(ctx, [[230, 450], [280, 462], [280, 470], [230, 470]], '#f5e6c8');
    ctx.strokeStyle = '#8a8a8a';
    ctx.lineWidth = 1;
    for (var l = 0; l < 3; l++) {
      ctx.beginPath();
      ctx.moveTo(190, 456 + l * 4);
      ctx.lineTo(222, 452 + l * 4);
      ctx.moveTo(238, 452 + l * 4);
      ctx.lineTo(270, 456 + l * 4);
      ctx.stroke();
    }
    // Cat asleep on the desk: difference 4, it wanders off on the right.
    if (variant === 0) {
      ellipse(ctx, 400, 560, 30, 16, '#e67e22');
      circle(ctx, 424, 552, 12, '#e67e22');
      poly(ctx, [[416, 544], [419, 534], [424, 544]], '#e67e22');
      poly(ctx, [[428, 544], [432, 534], [435, 544]], '#e67e22');
      ctx.beginPath();
      ctx.moveTo(372, 560);
      ctx.quadraticCurveTo(356, 552, 360, 540);
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    // Rug: difference 9 loses a stripe on the right panel.
    rect(ctx, 180, 580, 240, 44, '#a34d3d');
    rect(ctx, 190, 588, 220, 28, '#c96a4a');
    rect(ctx, 200, 596, 200, 12, '#f5e6c8');
    if (variant === 0) rect(ctx, 260, 596, 14, 12, '#2e86c1');
    if (variant === 0) rect(ctx, 330, 596, 14, 12, '#2e86c1');
    // Dust motes drifting in the lamplight.
    circle(ctx, 120, 400, 2, 'rgba(255,233,168,0.5)');
    circle(ctx, 200, 360, 2, 'rgba(255,233,168,0.5)');
    circle(ctx, 420, 380, 2, 'rgba(255,233,168,0.5)');
    circle(ctx, 520, 420, 2, 'rgba(255,233,168,0.5)');
  }

  window.TL_SCENES = {
    drawLanternMarket: drawLanternMarket,
    drawCoralReef: drawCoralReef,
    drawClockworkGarden: drawClockworkGarden,
    drawStarlightLibrary: drawStarlightLibrary,
    painters: [drawLanternMarket, drawCoralReef, drawClockworkGarden, drawStarlightLibrary],
  };
})();
