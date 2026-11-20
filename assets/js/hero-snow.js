/**
 * Fine, realistic snowfall clipped to the hero only.
 * Flake size is about half the original overlay flakes.
 */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var host = document.querySelector("[data-hero-snow]");
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var canvas = document.createElement("canvas");
    canvas.className = "xmas26-snow-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var flakes = [];
    var w = 0;
    var h = 0;
    var last = 0;

    function resize() {
      var rect = host.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var count = Math.max(48, Math.min(110, Math.round((w * h) / 14000)));
      flakes = [];
      for (var i = 0; i < count; i++) flakes.push(makeFlake(true));
    }

    function makeFlake(anywhere) {
      var depth = Math.random();
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -8,
        // Original overlay flakes were ~6–12px; these are half that, with depth.
        r: 1.1 + depth * 2.6,
        vy: 12 + depth * 28,
        vx: (Math.random() - 0.5) * 10,
        sway: 0.4 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        a: 0.22 + depth * 0.45,
        spin: (Math.random() - 0.5) * 1.4
      };
    }

    function drawFlake(f) {
      var g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 1.8);
      g.addColorStop(0, "rgba(255,255,255," + f.a + ")");
      g.addColorStop(0.45, "rgba(245,248,255," + f.a * 0.55 + ")");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255," + Math.min(0.95, f.a + 0.15) + ")";
      ctx.beginPath();
      ctx.ellipse(f.x, f.y, f.r * 0.55, f.r * 0.9, f.phase, 0, Math.PI * 2);
      ctx.fill();
    }

    function tick(now) {
      if (!last) last = now;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var t = now / 1000;
      var wind = Math.sin(t * 0.18) * 18 + Math.sin(t * 0.07) * 8;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.phase += f.spin * dt;
        f.x += (f.vx + wind * (0.15 + f.r / 8) + Math.sin(t * f.sway + f.phase) * 8) * dt;
        f.y += f.vy * dt * (0.85 + Math.sin(t * 0.5 + f.phase) * 0.08);
        if (f.y > h + 10 || f.x < -20 || f.x > w + 20) flakes[i] = makeFlake(false);
        else drawFlake(f);
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(tick);
  });
})();
