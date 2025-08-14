// =============== Yardımcılar ===============
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// =============== Yıl ===============
$("#year").textContent = new Date().getFullYear();

// =============== Smooth Scroll ===============
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      const el = $(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileNav();
    }
  });
});

// =============== Mobile Nav ===============
const hamburger = $(".hamburger");
const navLinks = $(".nav-links");

function closeMobileNav(){
  navLinks.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}
hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(open));
});

// =============== Typewriter ===============
const roles = [
  "Game Developer",
  "Fullstack Developer",
  "Application Developer",
  "Mobile Developer"
];
const typer = $("#typewriter");
const cursor = $(".cursor");

let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = roles[roleIndex];
  if (!deleting) {
    typer.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length + 8) deleting = true;
  } else {
    typer.textContent = current.slice(0, charIndex--);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 50 : 90);
}
typeLoop();

// =============== Scroll Reveal ===============
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => io.observe(el));

// =============== Projects Filter ===============
const filterBtns = $$(".filter-btn");
const cards = $$(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.filter;

    cards.forEach(card => {
      const ok = cat === "all" || card.dataset.category === cat;
      card.style.display = ok ? "block" : "none";
      if (ok) { // küçük bir yeniden akış için
        card.classList.remove("is-hidden");
        setTimeout(() => card.classList.add("is-hidden"), 0);
      }
    });
  });
});

// =============== Project Modal ===============
const modal = $("#projectModal");
const mTitle = $("#modalTitle");
const mDesc = $("#modalDesc");
const mTech = $("#modalTech");
const mLink = $("#modalLink");
const mClose = $(".modal-close");

cards.forEach(card => {
  card.addEventListener("click", () => {
    mTitle.textContent = card.dataset.title || "Proje";
    mDesc.textContent = card.dataset.description || "";
    mTech.textContent = card.dataset.tech || "";
    const href = card.dataset.link || "#";
    mLink.href = href;
    modal.showModal();
  });
});

mClose.addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { // backdrop click
  const rect = $(".modal-content", modal).getBoundingClientRect();
  const inDialog = (
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom
  );
  if (!inDialog) modal.close();
});

// =============== Contact Form Validation ===============
const form = $("#contactForm");
const statusEl = $("#formStatus");

function setError(input, message){
  const row = input.closest(".form-row");
  $(".error", row).textContent = message;
  input.setAttribute("aria-invalid", "true");
}
function clearError(input){
  const row = input.closest(".form-row");
  $(".error", row).textContent = "";
  input.removeAttribute("aria-invalid");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  let valid = true;

  const name = $("#name");
  const email = $("#email");
  const message = $("#message");

  if (name.value.trim().length < 3){ setError(name, "Lütfen adınızı girin."); valid = false; } else clearError(name);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  if (!emailOk){ setError(email, "Geçerli bir e-posta girin."); valid = false; } else clearError(email);

  if (message.value.trim().length < 10){ setError(message, "Mesaj en az 10 karakter olmalı."); valid = false; } else clearError(message);

  if (!valid) return;

  // Demo: gerçek gönderim yerine mesaj gösteriyoruz.
  // Gerçek kullanım: Formspree vs. endpoint'ine fetch ile POST at.
  statusEl.textContent = "Teşekkürler! Mesajın yerel olarak doğrulandı. (Form endpoint eklenmeli)";
  form.reset();
});

// =============== Header Solid on Scroll ===============
const header = $(".site-header");
let lastY = 0;
addEventListener("scroll", () => {
  const y = window.scrollY;
  const solid = y > 12;
  header.style.boxShadow = solid ? "0 6px 20px rgba(0,0,0,.25)" : "none";
  lastY = y;
});
document.addEventListener("DOMContentLoaded", () => {
    // Modal elementleri
    const modal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalTech = document.getElementById("modalTech");
    const modalLink = document.getElementById("modalLink");
    const modalClose = modal.querySelector(".modal-close");

    // Tüm proje kartlarını seç
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            // Data attribute’lardan bilgileri al
            const title = card.getAttribute("data-title");
            const desc = card.getAttribute("data-description");
            const tech = card.getAttribute("data-tech");
            const link = card.getAttribute("data-link");

            // Modal içeriğini doldur
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalTech.textContent = tech;
            modalLink.href = link;

            // Modal'ı aç
            modal.showModal();
        });
    });

    // Kapatma butonu
    modalClose.addEventListener("click", () => {
        modal.close();
    });

    // Modal dışına tıklayınca kapat
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.close();
        }
    });
});
