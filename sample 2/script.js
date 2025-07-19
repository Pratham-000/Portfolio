// import '@fortawesome/fontawesome-free/css/all.min.css';



// ===== Mobile Menu Toggle =====
const menuBtn = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuBtn.classList.toggle("open");
});

// ===== Sticky Navbar on Scroll =====
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

// ===== Scroll Active Link =====
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

function activateMenu() {
  let scrollY = window.pageYOffset;
  sections.forEach((sec) => {
    const sectionTop = sec.offsetTop - 80;
    const sectionHeight = sec.offsetHeight;
    const id = sec.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navItems.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}
window.addEventListener("scroll", activateMenu);

// ===== Smooth Scroll Behavior =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Dark / Light Mode Toggle =====
const root = document.documentElement;
const toggleTheme = document.createElement("button");
toggleTheme.innerText = "🌓";
toggleTheme.className = "theme-toggle";
document.body.appendChild(toggleTheme);

// Apply stored theme
if (localStorage.getItem("theme") === "dark") {
  root.classList.add("dark");
}

// Toggle theme on click
toggleTheme.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
});

// ===== Scroll Reveal (Intersection Observer) =====
const revealEls = document.querySelectorAll(".section-title, .about-text, .skill-item, .project-card, .stat-card");

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

revealEls.forEach((el) => observer.observe(el));

// ===== Typewriter Effect (Optional) =====
function typewriter(element, text, speed = 60) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Apply to subtitle
const subtitle = document.querySelector(".subtitle");
if (subtitle) {
  const txt = subtitle.textContent;
  subtitle.textContent = "";
  typewriter(subtitle, txt);
}
// ``````````````````````````````````````

// ===== Theme Toggle Button =====
const themeToggle = document.createElement("button");
themeToggle.className = "theme-toggle";
themeToggle.innerText = "💔"; // Default icon dark
document.body.appendChild(themeToggle);

// Load saved theme
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.documentElement.classList.add("dark");
  themeToggle.innerText = "❤️"; // light
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  themeToggle.innerText = isDark ? "❤️" : "💔";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// CONTACT US 

document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  try {
    const res = await fetch('http://localhost:8001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();
    alert(data.message || data.error);
  } catch (error) {
    alert('Something went wrong');
    console.error('Fetch error:', error);
  }
});