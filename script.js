// ═══════════════════════════════════════════════
// PIXEL PARTICLE CANVAS — Minimalist animated background
// ═══════════════════════════════════════════════
(function initPixelBg() {
  var canvas = document.getElementById("pixelBg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var section = document.getElementById("intro");
  var particles = [];
  var PARTICLE_COUNT = 50;
  var colors = [
    "rgba(255,75,43,0.25)",
    "rgba(247,123,72,0.2)",
    "rgba(255,200,87,0.15)",
    "rgba(75,179,255,0.15)",
    "rgba(255,75,218,0.12)",
    "rgba(255,255,255,0.08)"
  ];

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function createParticle() {
    var size = Math.floor(Math.random() * 3 + 2) * 2;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: size,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.3 + 0.1),
      opacity: Math.random() * 0.6 + 0.2,
      glitchTimer: Math.random() * 300 + 100,
      glitchCounter: 0
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  var lastTime = 0;
  var FPS_INTERVAL = 1000 / 30;

  function animate(timestamp) {
    requestAnimationFrame(animate);
    var elapsed = timestamp - lastTime;
    if (elapsed < FPS_INTERVAL) return;
    lastTime = timestamp - (elapsed % FPS_INTERVAL);

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
        p.glitchTimer = Math.random() * 300 + 100;
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(
        Math.floor(p.x / p.size) * p.size,
        Math.floor(p.y / p.size) * p.size,
        p.size,
        p.size
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
  window.addEventListener("resize", function () {
    resize();
  });
})();


// ═══════════════════════════════════════════════
// NAVBAR — Scroll shrink + Active section highlighting
// ═══════════════════════════════════════════════
(function initNav() {
  var nav = document.getElementById("topNav");
  var links = document.querySelectorAll(".nav-links a[data-section]");
  var sections = [];

  links.forEach(function (link) {
    var id = link.getAttribute("data-section");
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  // Scroll shrink
  var scrolled = false;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 60 && !scrolled) {
      nav.classList.add("scrolled");
      scrolled = true;
    } else if (window.scrollY <= 60 && scrolled) {
      nav.classList.remove("scrolled");
      scrolled = false;
    }
  }, { passive: true });

  // IntersectionObserver for active link
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (match) match.link.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    sections.forEach(function (s) {
      observer.observe(s.el);
    });
  }
})();


// ═══════════════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════════════
(function initHamburger() {
  var btn = document.getElementById("navHamburger");
  var navLinks = document.getElementById("navLinks");
  if (!btn || !navLinks) return;

  btn.addEventListener("click", function () {
    btn.classList.toggle("open");
    navLinks.classList.toggle("active"); // FIXED
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      btn.classList.remove("open");
      navLinks.classList.remove("active"); // FIXED
    });
  });
})();



// ═══════════════════════════════════════════════
// SHUFFLE SKILL DECK
// ═══════════════════════════════════════════════
(function initShuffle() {
  var shuffleBtn = document.getElementById("shuffleSkillsBtn");
  var skillDeck = document.querySelector(".skill-deck");

  function shuffleNodes(parent) {
    var nodes = Array.from(parent.children);
    for (var i = nodes.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = nodes[i];
      nodes[i] = nodes[j];
      nodes[j] = temp;
    }
    nodes.forEach(function (n) { parent.appendChild(n); });
  }

  if (shuffleBtn && skillDeck) {
    shuffleBtn.addEventListener("click", function () {
      if (shuffleBtn.disabled) return;
      shuffleBtn.disabled = true;
      shuffleBtn.textContent = "Shuffling...";

      var cards = Array.from(skillDeck.children);
      var stagger = 50;
      var animDuration = 300;
      var totalOut = animDuration + cards.length * stagger;

      cards.forEach(function (card, i) {
        card.style.transition =
          "transform " + animDuration + "ms ease-in " + i * stagger + "ms, " +
          "opacity " + animDuration + "ms ease-in " + i * stagger + "ms";
        card.style.transform = "scale(0.3) rotateZ(15deg)";
        card.style.opacity = "0";
      });

      setTimeout(function () {
        shuffleNodes(skillDeck);
        var newCards = Array.from(skillDeck.children);

        newCards.forEach(function (card) {
          card.style.transition = "none";
          card.style.transform = "scale(0.3) rotateZ(-15deg)";
          card.style.opacity = "0";
        });

        void skillDeck.offsetHeight;

        newCards.forEach(function (card, i) {
          card.style.transition =
            "transform " + animDuration + "ms ease-out " + i * stagger + "ms, " +
            "opacity " + animDuration + "ms ease-out " + i * stagger + "ms";
          card.style.transform = "";
          card.style.opacity = "";
        });

        var totalIn = animDuration + newCards.length * stagger;
        setTimeout(function () {
          newCards.forEach(function (card) {
            card.style.transition = "";
            card.style.transform = "";
            card.style.opacity = "";
          });
          shuffleBtn.textContent = "Shuffle Deck";
          shuffleBtn.disabled = false;
        }, totalIn);
      }, totalOut);
    });
  }
})();


// ═══════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════
(function initContact() {
  var contactForm = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");
  var contactSubmit = document.getElementById("contactSubmit");

  if (contactForm && formStatus && contactSubmit) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactSubmit.disabled = true;
      contactSubmit.textContent = "▶ TRANSMITTING...";
      setTimeout(function () {
        formStatus.textContent =
          "> TRANSMISSION_RECEIVED. This demo form doesn't send emails yet, but your message format looks great!";
        contactSubmit.disabled = false;
        contactSubmit.textContent = "▶ TRANSMIT";
        contactForm.reset();
      }, 900);
    });
  }
})();

// Set year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple project detail popup (alert for now, can be upgraded to modal)
const projectMoreButtons = document.querySelectorAll(".project-more");

const projectDetails = {
  gateway:
    "Secure API Gateway\n\nFocus areas: JWT auth, rate limiting, connection pooling, logging, and monitoring on Linux servers. Designed to be a central entry point for multiple backend services.[file:6]",
  blogify:
    "Blogify Platform\n\nMulti-role system for admins and authors, draft publishing workflow, and extensible architecture to plug in features like search, analytics, and recommendations.[file:6]",
  transit:
    "Smart Transit Portal\n\nSupports route discovery, bookings, and real-time status updates. Architecture emphasizes component reuse, optimistic UI updates, and snappy performance.[file:6]",
  chatbot:
    "AI-Powered Chatbot\n\nChat interface wired to OpenAI APIs, with conversation history, prompt templates, and clean separation between UI and AI service layer.[file:6]"
};

projectMoreButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.project;
    if (projectDetails[key]) {
      alert(projectDetails[key]);
    }
  });
});
