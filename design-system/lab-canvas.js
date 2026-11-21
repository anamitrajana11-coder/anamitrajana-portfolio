/* Lab canvas (homepage). See lab-canvas.css.
   1. Scales the 1336 × 532 stage to fill its card (CSS zoom), centred,
      cropping the sides where the card is taller than the design (tablets
      and phones).
   2. Draws the particle sphere: Anamitra's "Pixel galaxy" Lab piece redrawn
      on a 2D canvas. 3,000 squares on and just off a sphere, #F15A24 at
      50–100% brightness and 80% opacity, slowly turning. The pointer pushes
      nearby particles away. With reduced motion it's drawn once, still. */
(function () {
  var STAGE_W = 1336, STAGE_H = 532;

  function setUp(card) {
    var stage = card.querySelector(".lab-canvas__stage");
    if (!stage) return;
    var scale = 1, offX = 0, offY = 0;

    // The stage is enlarged with CSS zoom, not a scale transform: zoom lays
    // it out at its real size, so text, icons and the menus are drawn at
    // their final size. A scale transform let browsers draw the stage small
    // and blow the picture up, which blurred text on big screens. Zoom also
    // multiplies the stage's own left/top, hence the division.
    var onResize = null;  // set by the menus below: closes an open menu
    function fit() {
      var w = card.clientWidth, h = card.clientHeight;
      if (!w || !h) return;
      scale = Math.max(w / STAGE_W, h / STAGE_H);
      offX = (w - STAGE_W * scale) / 2;
      offY = (h - STAGE_H * scale) / 2;
      stage.style.zoom = scale;
      stage.style.left = offX / scale + "px";
      stage.style.top = offY / scale + "px";
      if (onResize) onResize();
    }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(card);
    else window.addEventListener("resize", fit);

    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Menus (the Figma toolbar's slots and the Ask AI model picker). Each
    // menu lives in its owner and is placed by lab-canvas.css; opening one
    // marks the owner .is-open, lifts its piece above the others
    // (.has-open-menu) and the stage above the button (.is-menu-open). One
    // menu is open at a time; a click elsewhere, Escape or a resize closes it.
    var current = null;  // { owner, piece }
    var closeMenu = function () {
      if (!current) return;
      current.owner.classList.remove("is-open");
      current.piece.classList.remove("has-open-menu");
      card.classList.remove("is-menu-open");
      current = null;
    };
    var toggleMenu = function (owner, piece) {
      var wasOpen = current && current.owner === owner;
      closeMenu();
      if (wasOpen) return;
      owner.classList.add("is-open");
      piece.classList.add("has-open-menu");
      card.classList.add("is-menu-open");
      current = { owner: owner, piece: piece };
    };
    var tickItem = function (menu, item) {
      var items = menu.querySelectorAll(".lab-figma-item");
      for (var i = 0; i < items.length; i++) items[i].classList.toggle("is-checked", items[i] === item);
    };
    document.addEventListener("pointerdown", function (e) {
      if (current && !current.owner.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    onResize = closeMenu;

    // The Figma toolbar, as in Figma: it sits at the bottom of the canvas;
    // clicking a tool selects it; a chevron opens that slot's menu 8px
    // above the bar, its row icons in line with the tool's; picking a row
    // puts that tool in the slot, ticks it and selects it. "Image/video…"
    // (data-no-select) only highlights.
    var bar = card.querySelector(".lab-figma-bar");
    if (bar) {
      var select = function (tool) {
        var selected = bar.querySelectorAll(".lab-figma-tool.is-selected");
        for (var i = 0; i < selected.length; i++) selected[i].classList.remove("is-selected");
        tool.classList.add("is-selected");
      };
      bar.addEventListener("click", function (e) {
        var el = e.target.closest && e.target.closest(".lab-figma-tool, .lab-figma-caret, .lab-figma-item");
        if (!el) return;
        var group = el.closest(".lab-figma-group");
        if (el.classList.contains("lab-figma-caret")) { toggleMenu(group, bar); return; }
        closeMenu();
        if (el.hasAttribute("data-no-select")) return;
        if (el.classList.contains("lab-figma-tool")) { select(el); return; }
        var tool = group.querySelector(".lab-figma-tool");
        tool.innerHTML = el.querySelector(".lab-figma-item-icon").innerHTML;
        tool.setAttribute("data-tool", el.getAttribute("data-tool"));
        tickItem(group.querySelector(".lab-figma-menu"), el);
        select(tool);
      });
    }

    // The Ask AI prompt box: the model picker opens its menu 8px below,
    // the model names in line with the picker's; picking one shows it.
    var ai = card.querySelector(".lab-ai");
    var picker = ai && ai.querySelector(".lab-ai-model-wrap");
    if (picker) {
      var trigger = picker.querySelector(".lab-ai-model");
      picker.addEventListener("click", function (e) {
        var item = e.target.closest && e.target.closest(".lab-figma-item");
        if (!item) { if (e.target.closest(".lab-ai-model")) toggleMenu(picker, ai); return; }
        closeMenu();
        trigger.querySelector(".lab-ai-model-name").textContent = item.getAttribute("data-model");
        tickItem(picker.querySelector(".lab-figma-menu"), item);
      });
    }

    // The question types itself, waits, erases and types again, in a loop,
    // while the card is on screen. With reduced motion it just sits there.
    var input = ai && ai.querySelector(".lab-ai-input");
    if (input && !still) {
      var textEl = input.querySelector(".lab-ai-text");
      var full = textEl.textContent, pos = full.length, phase = "hold", timer = 0, onScreen = true;
      var step = function () {
        timer = 0;
        if (!onScreen) return;
        var delay;
        if (phase === "hold") { phase = "erase"; input.classList.add("is-typing"); delay = 40; }
        else if (phase === "erase") {
          pos -= 1; textEl.textContent = full.slice(0, pos);
          if (pos <= 0) { phase = "pause"; input.classList.remove("is-typing"); delay = 800; } else delay = 26;
        }
        else if (phase === "pause") { phase = "type"; input.classList.add("is-typing"); delay = 60; }
        else {
          pos += 1; textEl.textContent = full.slice(0, pos);
          if (pos >= full.length) { phase = "hold"; input.classList.remove("is-typing"); delay = 2600; } else delay = 50 + Math.random() * 70;
        }
        timer = setTimeout(step, delay);
      };
      timer = setTimeout(step, 2600);
      if (window.IntersectionObserver) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[entries.length - 1].isIntersecting;
          if (onScreen && !timer) timer = setTimeout(step, 400);
        }).observe(card);
      }
    }

    var canvas = card.querySelector(".lab-canvas__sphere");
    if (!canvas || !canvas.getContext) return;

    var N = 3000, R = 2, pts = [];
    for (var i = 0; i < N; i++) {
      var phi = Math.acos(2 * Math.random() - 1), th = Math.random() * Math.PI * 2, r = R * (0.94 + Math.random() * 0.14);
      pts.push([r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi), Math.floor(Math.random() * 6)]);
    }
    var levels = [0, 1, 2, 3, 4, 5].map(function (l) {
      var k = 0.5 + (l + 0.5) / 12;
      return "rgba(" + Math.round(241 * k) + "," + Math.round(90 * k) + "," + Math.round(36 * k) + ",0.8)";
    });
    var rot = 0, mouse = null, frame = 0, visible = true;

    // The canvas on the stage: 702px square, centred, its bottom 328px
    // above the stage's (its inline style).
    var SIZE = 702, homeLeft = (STAGE_W - SIZE) / 2, homeTop = STAGE_H - 328 - SIZE;

    // The pointer, in the canvas's own units, worked out from the card (which
    // isn't zoomed), so it doesn't depend on how a browser reports sizes
    // inside a zoomed element. Listened for on the whole card, since other
    // pieces sit on top of the canvas.
    card.addEventListener("pointermove", function (e) {
      var box = card.getBoundingClientRect();
      var x = e.clientX - box.left - card.clientLeft - offX, y = e.clientY - box.top - card.clientTop - offY;
      mouse = [x / scale - homeLeft, y / scale - homeTop];
      if (still) draw();
    });
    card.addEventListener("pointerleave", function () { mouse = null; if (still) draw(); });

    function draw() {
      var w = SIZE, h = SIZE;
      // Sharp on high-density screens: device pixels × the stage's scale.
      var dpr = Math.min((window.devicePixelRatio || 1) * scale, 2);
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      var ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var camZ = 10, f = 0.36 * h * camZ / R, cx = w / 2, cy = h / 2;
      var ca = Math.cos(rot), sa = Math.sin(rot);
      var hover = 0.18 * h, push = 0.12 * h;
      var buckets = [[], [], [], [], [], []];
      for (var j = 0; j < pts.length; j++) {
        var p = pts[j];
        var x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1];
        var d = camZ - z;
        var sx = cx + f * x / d, sy = cy - f * y / d;
        if (mouse) {
          var dx = sx - mouse[0], dy = sy - mouse[1], dist = Math.hypot(dx, dy);
          if (dist < hover && dist > 0.001) { var q = (1 - dist / hover) * push / dist; sx += dx * q; sy += dy * q; }
        }
        buckets[p[3]].push(sx, sy, 0.05 * f / d);
      }
      for (var l = 0; l < 6; l++) {
        var b = buckets[l];
        ctx.fillStyle = levels[l];
        for (var m = 0; m < b.length; m += 3) { var s = b[m + 2]; ctx.fillRect(b[m] - s / 2, b[m + 1] - s / 2, s, s); }
      }
    }

    function loop() {
      frame = 0;
      if (!visible) return;
      draw();
      rot += 0.003;
      frame = requestAnimationFrame(loop);
    }

    if (still) { draw(); return; }
    // Only animate while the card is on screen.
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible && !frame) frame = requestAnimationFrame(loop);
      }).observe(card);
    } else {
      frame = requestAnimationFrame(loop);
    }
  }

  function init() { document.querySelectorAll(".lab-canvas").forEach(setUp); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
