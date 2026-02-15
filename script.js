// Set year in footer
document.getElementById("year").textContent = new Date().getFullYear();

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
    shuffleNodes(skillDeck);
    shuffleBtn.textContent = "Shuffled!";
    setTimeout(() => (shuffleBtn.textContent = "Shuffle Deck"), 1200);
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
