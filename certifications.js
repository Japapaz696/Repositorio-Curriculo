// Certifications carousel implementation
// Data for certificates (replace with real data / image paths)
const certifications = [
  {
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    hours: "300h",
    courses: "9 Cursos",
    description: "Fundamentos avançados de JavaScript, algoritmos e estruturas de dados.",
    tags: ["JS", "Algoritmos", "Data Structures"],
    image: "assets/certificates/fcc-js.png",
    verify: "https://www.freecodecamp.org/certification/yourusername/javascript-algorithms-and-data-structures"
  },
  {
    title: "Google Cloud Digital Leader",
    issuer: "Google",
    hours: "40h",
    courses: "1 Curso",
    description: "Conceitos de nuvem, serviços GCP e boas práticas operacionais.",
    tags: ["GCP", "Cloud", "Infra"],
    image: "assets/certificates/google-cloud.png",
    verify: "https://www.credential.net/your-id"
  }
];

let currentIndex = 0;
let autoplayTimer = null;

const container = document.getElementById("certifications-carousel");
const slideImg = document.getElementById("cert-slide-img");
const slideInfo = document.getElementById("cert-slide-info");
const dotsContainer = document.getElementById("cert-dots");

function renderSlide(index) {
  const cert = certifications[index];
  slideImg.src = cert.image;
  slideImg.alt = `Diploma de ${cert.title}`;
  slideInfo.innerHTML = `
    <h3 class="cert-title">${cert.title}</h3>
    <p><strong>Emissor:</strong> ${cert.issuer}</p>
    <p><strong>Carga Horária:</strong> ${cert.hours} / ${cert.courses}</p>
    <p>${cert.description}</p>
    <div class="cert-tags">${cert.tags.map(t=>`<span class="cert-tag">${t}</span>`).join(" ")}</div>
    <a href="${cert.verify}" target="_blank" rel="noopener" class="cert-verify">Ver Credencial</a>
  `;
  updateDots(index);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + certifications.length) % certifications.length;
  renderSlide(currentIndex);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % certifications.length;
  renderSlide(currentIndex);
}

function updateDots(activeIdx) {
  const dots = dotsContainer.querySelectorAll("button");
  dots.forEach((dot, i) => {
    dot.setAttribute("aria-selected", i===activeIdx ? "true" : "false");
    dot.classList.toggle("active", i===activeIdx);
  });
}

function startAutoplay() {
  autoplayTimer = setInterval(nextSlide, 5000);
}
function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
}

// Initialize
function initCarousel() {
  // create dots
  certifications.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", `Slide ${i+1}`);
    btn.addEventListener("click", () => { currentIndex = i; renderSlide(i); stopAutoplay(); startAutoplay(); });
    dotsContainer.appendChild(btn);
  });
  renderSlide(currentIndex);
  startAutoplay();

  // pause on hover / focus
  container.addEventListener("mouseenter", stopAutoplay);
  container.addEventListener("mouseleave", startAutoplay);
  container.addEventListener("focusin", stopAutoplay);
  container.addEventListener("focusout", startAutoplay);

  // touch swipe
  let startX = null;
  container.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
  container.addEventListener("touchend", e => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prevSlide() : nextSlide();
    }
    startX = null;
  });

  // Lightbox on click
  slideImg.addEventListener("click", () => {
    const lightbox = document.createElement("div");
    lightbox.className = "cert-lightbox";
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img src="${certifications[currentIndex].image}" alt="${certifications[currentIndex].title}" />
        <button class="lightbox-close" aria-label="Fechar">✕</button>
      </div>`;
    document.body.appendChild(lightbox);
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.remove());
    lightbox.addEventListener('click', e => { if(e.target===lightbox) lightbox.remove(); });
  });
}

if (container) {
  initCarousel();
}
