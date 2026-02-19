// ═══════════════════════════════════════════════
// PIXEL PARTICLE CANVAS — Hero background
// ═══════════════════════════════════════════════
(function initPixelBg() {
  var canvas = document.getElementById("pixelBg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var section = document.getElementById("intro");
  var particles = [];
  var PARTICLE_COUNT = 60;
  var colors = [
    "rgba(217,79,43,0.2)",
    "rgba(200,70,30,0.15)",
    "rgba(255,140,60,0.12)",
    "rgba(255,200,87,0.1)",
    "rgba(255,255,255,0.06)"
  ];

  function resize() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function createParticle() {
    var size = Math.floor(Math.random() * 3 + 2) * 2;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: size,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -(Math.random() * 0.3 + 0.08),
      opacity: Math.random() * 0.6 + 0.2,
      glitchTimer: Math.random() * 280 + 100,
      glitchCounter: 0
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  var lastTime = 0, FPS_INTERVAL = 1000 / 30;

  function animate(ts) {
    requestAnimationFrame(animate);
    var elapsed = ts - lastTime;
    if (elapsed < FPS_INTERVAL) return;
    lastTime = ts - (elapsed % FPS_INTERVAL);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.glitchCounter++;

      var alpha = p.opacity;
      if (p.glitchCounter > p.glitchTimer && p.glitchCounter < p.glitchTimer + 8) {
        alpha = Math.min(1, p.opacity + 0.5);
      } else if (p.glitchCounter > p.glitchTimer + 8) {
        p.glitchCounter = 0;
        p.glitchTimer = Math.random() * 280 + 100;
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(
        Math.floor(p.x / p.size) * p.size,
        Math.floor(p.y / p.size) * p.size,
        p.size, p.size
      );

      if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
        particles[i] = createParticle();
        particles[i].y = canvas.height + 10;
      }
    }
    ctx.globalAlpha = 1;
  }

  init();
  requestAnimationFrame(animate);
  window.addEventListener("resize", resize);
})();


// ═══════════════════════════════════════════════
// NAVBAR — Active section pixel label tracking
// ═══════════════════════════════════════════════
(function initNav() {
  var items = document.querySelectorAll(".nav-pixel-item[data-section]");
  var sections = [];

  // Section labels for display
  var labels = {
    "intro": "INTRO",
    "work-experience": "EXPERIENCE",
    "skills": "SKILLS",
    "projects": "PROJECTS",
    "experience": "EDUCATION",
    "achievements": "ACHIEVEMENTS",
    "contact": "CONTACT"
  };

  items.forEach(function (item) {
    var id = item.getAttribute("data-section");
    var el = document.getElementById(id);
    if (!el) return;

    // Add a label span to every item if not exists
    if (!item.querySelector(".nav-active-label")) {
      var lbl = document.createElement("span");
      lbl.className = "nav-active-label";
      lbl.textContent = labels[id] || id.toUpperCase();
      item.appendChild(lbl);
    }

    sections.push({ id: id, el: el, item: item });
  });

  function setActive(id) {
    items.forEach(function (item) {
      var isActive = item.getAttribute("data-section") === id;
      item.classList.toggle("active", isActive);
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (match) setActive(match.id);
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    sections.forEach(function (s) { observer.observe(s.el); });
  }

  // Scroll shrink nav
  var nav = document.getElementById("topNav");
  window.addEventListener("scroll", function () {
    nav.style.background = window.scrollY > 60
      ? "rgba(8, 6, 5, 0.98)"
      : "rgba(10, 8, 7, 0.95)";
  }, { passive: true });
})();


// ═══════════════════════════════════════════════
// SCROLL REVEAL — staggered entrance
// ═══════════════════════════════════════════════
(function initReveal() {
  var targets = document.querySelectorAll(
    ".skill-card, .card, .achv-card, .connect-card, .work-item, .stat-card"
  );

  targets.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var siblings = Array.from(entry.target.parentElement.children);
      var idx = siblings.indexOf(entry.target);
      setTimeout(function () {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }, Math.min(idx * 70, 350));
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) { obs.observe(el); });
})();


// ═══════════════════════════════════════════════
// XP BAR FILL on scroll into view
// ═══════════════════════════════════════════════
(function initXP() {
  var bars = document.querySelectorAll(".xp-bar span, .work-xp-bar span");

  bars.forEach(function (bar) {
    var target = bar.style.width;
    bar.style.width = "0";
    bar.style.transition = "width 1.2s ease";

    if (!("IntersectionObserver" in window)) { bar.style.width = target; return; }

    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        setTimeout(function () { bar.style.width = target; }, 200);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(bar.parentElement);
  });
})();


// ═══════════════════════════════════════════════
// STAT COUNTERS — count up animation
// ═══════════════════════════════════════════════
(function initCounters() {
  document.querySelectorAll(".stat-value").forEach(function (el) {
    var text    = el.textContent.trim();
    var match   = text.match(/[\d.]+/);
    if (!match) return;

    var target  = parseFloat(match[0]);
    var suffix  = text.replace(match[0], "");
    var isFloat = match[0].includes(".");
    var animated = false;

    if (!("IntersectionObserver" in window)) return;

    var obs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || animated) return;
      animated = true;
      obs.disconnect();

      var start = null, dur = 1100;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        var v = target * e;
        el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, { threshold: 0.6 });

    obs.observe(el);
  });
})();


// ═══════════════════════════════════════════════
// SKILL CARD 3D TILT on hover
// ═══════════════════════════════════════════════
(function initTilt() {
  document.querySelectorAll(".skill-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r  = card.getBoundingClientRect();
      var cx = r.width / 2, cy = r.height / 2;
      var x  = e.clientX - r.left - cx;
      var y  = e.clientY - r.top  - cy;
      card.style.transform = [
        "translateY(-8px)",
        "scale(1.03)",
        "perspective(500px)",
        "rotateX(" + (-y / cy * 7) + "deg)",
        "rotateY(" +  (x / cx * 7) + "deg)"
      ].join(" ");
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });
})();


// ═══════════════════════════════════════════════
// TYPING EFFECT — eyebrow text
// ═══════════════════════════════════════════════
(function initTyping() {
  var el = document.querySelector(".eyebrow");
  if (!el) return;
  var full = el.textContent;
  el.textContent = "";
  el.style.borderRight = "2px solid var(--accent)";
  var i = 0;
  var iv = setInterval(function () {
    el.textContent += full[i++];
    if (i >= full.length) {
      clearInterval(iv);
      setTimeout(function () { el.style.borderRight = "none"; }, 1200);
    }
  }, 65);
})();


// ═══════════════════════════════════════════════
// SHUFFLE SKILL DECK
// ═══════════════════════════════════════════════
(function initShuffle() {
  var btn   = document.getElementById("shuffleSkillsBtn");
  var deck  = document.querySelector(".skill-deck");
  if (!btn || !deck) return;

  function shuffle(parent) {
    var nodes = Array.from(parent.children);
    for (var i = nodes.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = nodes[i]; nodes[i] = nodes[j]; nodes[j] = t;
    }
    nodes.forEach(function (n) { parent.appendChild(n); });
  }

  btn.addEventListener("click", function () {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.textContent = "★ SHUFFLING...";

    var cards = Array.from(deck.children);
    var dur   = 220, stagger = 35;
    var totalOut = dur + cards.length * stagger;

    cards.forEach(function (c, i) {
      c.style.transition = "transform " + dur + "ms ease-in " + i*stagger + "ms, opacity " + dur + "ms ease-in " + i*stagger + "ms";
      c.style.transform  = "scale(0.3) rotateZ(15deg)";
      c.style.opacity    = "0";
    });

    setTimeout(function () {
      shuffle(deck);
      var nc = Array.from(deck.children);
      nc.forEach(function (c) {
        c.style.transition = "none";
        c.style.transform  = "scale(0.3) rotateZ(-15deg)";
        c.style.opacity    = "0";
      });
      void deck.offsetHeight;

      nc.forEach(function (c, i) {
        c.style.transition = "transform " + dur + "ms ease-out " + i*stagger + "ms, opacity " + dur + "ms ease-out " + i*stagger + "ms";
        c.style.transform  = "";
        c.style.opacity    = "";
      });

      setTimeout(function () {
        nc.forEach(function (c) { c.style.transition = c.style.transform = c.style.opacity = ""; });
        btn.textContent = "★ SHUFFLE DECK";
        btn.disabled    = false;
      }, dur + nc.length * stagger);
    }, totalOut);
  });
})();


// ═══════════════════════════════════════════════
// FOOTER YEAR
// ═══════════════════════════════════════════════
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();