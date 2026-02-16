// Set year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Shuffle skill deck
const shuffleBtn = document.getElementById("shuffleSkillsBtn");
const skillDeck = document.querySelector(".skill-deck");

function shuffleNodes(parent) {
  const nodes = Array.from(parent.children);
  for (let i = nodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
  }
  nodes.forEach((n) => parent.appendChild(n));
}

if (shuffleBtn && skillDeck) {
  shuffleBtn.addEventListener("click", () => {
    if (shuffleBtn.disabled) return;
    shuffleBtn.disabled = true;
    shuffleBtn.textContent = "Shuffling...";

    const cards = Array.from(skillDeck.children);
    const stagger = 50;
    const animDuration = 300;
    const totalOut = animDuration + cards.length * stagger;

    cards.forEach((card, i) => {
      card.style.transition =
        "transform " + animDuration + "ms ease-in " + i * stagger + "ms, " +
        "opacity " + animDuration + "ms ease-in " + i * stagger + "ms";
      card.style.transform = "scale(0.3) rotateZ(15deg)";
      card.style.opacity = "0";
    });

    setTimeout(() => {
      shuffleNodes(skillDeck);
      const newCards = Array.from(skillDeck.children);

      newCards.forEach((card) => {
        card.style.transition = "none";
        card.style.transform = "scale(0.3) rotateZ(-15deg)";
        card.style.opacity = "0";
      });

      void skillDeck.offsetHeight;

      newCards.forEach((card, i) => {
        card.style.transition =
          "transform " + animDuration + "ms ease-out " + i * stagger + "ms, " +
          "opacity " + animDuration + "ms ease-out " + i * stagger + "ms";
        card.style.transform = "";
        card.style.opacity = "";
      });

      const totalIn = animDuration + newCards.length * stagger;
      setTimeout(() => {
        newCards.forEach((card) => {
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

// Fake contact form submission
const contactForm = document.querySelector(".contact-form");
const formStatus = document.getElementById("formStatus");
const contactSubmit = document.getElementById("contactSubmit");

if (contactForm && formStatus && contactSubmit) {
  contactForm.addEventListener("submit", () => {
    contactSubmit.disabled = true;
    contactSubmit.textContent = "Sending...";
    setTimeout(() => {
      formStatus.textContent =
        "Got it! This demo form doesn’t send emails yet, but it shows how your message would be handled.";
      contactSubmit.disabled = false;
      contactSubmit.textContent = "Send Message";
      contactForm.reset();
    }, 900);
  });
}
