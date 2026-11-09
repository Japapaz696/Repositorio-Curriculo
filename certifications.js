// Certifications carousel implementation
// Data for certificates (replace with real data / image paths)
const certifications = [
  {
    title: "FreeCodeCamp – Banco de Dados Relacional",
    issuer: "freeCodeCamp",
    hours: "300h",
    courses: "9 Cursos",
    description: "Projeto de modelagem, consultas SQL avançadas e otimização de índices.",
    tags: ["SQL", "PostgreSQL", "Modelagem"],
    image: "assets/certificates/fcc-db.png",
    verify: "https://www.freecodecamp.org/certification/yourusername/relational-database"
  },
  {
    title: "Computação Científica com Python",
    issuer: "freeCodeCamp",
    hours: "300h",
    courses: "9 Cursos",
    description: "Análise de dados, NumPy, Pandas, visualizações e algoritmos numéricos.",
    tags: ["Python", "NumPy", "Pandas", "Data Science"],
    image: "assets/certificates/fcc-python.png",
    verify: "https://www.freecodecamp.org/certification/yourusername/scientific-computing"
  },
  {
    title: "Design Web Responsivo",
    issuer: "freeCodeCamp",
    hours: "300h",
    courses: "9 Cursos",
    description: "Layouts flexíveis, CSS Grid, acessibilidade e performance.",
    tags: ["HTML", "CSS", "Responsive", "Acessibilidade"],
    image: "assets/certificates/fcc-web.png",
    verify: "https://www.freecodecamp.org/certification/yourusername/responsive-web-design"
  },
  {
    title: "Especialização em Banco de Dados Google",
    issuer: "Google",
    hours: "300h",
    courses: "9 Cursos",
    description: "BigQuery, Cloud SQL, modelagem de dados e pipelines ETL.",
    tags: ["Google Cloud", "BigQuery", "SQL", "ETL"],
    image: "assets/certificates/google-db.png",
    verify: "https://www.credential.net/google-database-specialization"
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
  // Fallback placeholder if image fails to load
  slideImg.onerror = function () {
    const placeholder = document.createElement('div');
    placeholder.className = 'cert-placeholder';
    placeholder.textContent = `${cert.title} – imagem indisponível`;
    slideImg.replaceWith(placeholder);
  };
  slideInfo.innerHTML = `
    <h3 class="cert-title">${cert.title}</h3>
    <p><strong>Emissor:</strong> ${cert.issuer}</p>
    <p><strong>Carga Horária:</strong> ${cert.hours} / ${cert.courses}</p>
    <p>${cert.description}</p>
    <div class="cert-tags">${cert.tags.map(t => `<span class="cert-tag">${t}</span>`).join(' ')}</div>
    <a href="${cert.verify}" target="_blank" rel="noopener" class="cert-verify">Ver Credencial</a>
  `;
  updateDots(index);
}

function prevSlide(){
  currentIndex = (currentIndex - 1 + certifications.length) % certifications.length;
  renderSlide(currentIndex);
}
function nextSlide(){
  currentIndex = (currentIndex + 1) % certifications.length;
  renderSlide(currentIndex);
}
function updateDots(activeIdx){
  const dots = dotsContainer.querySelectorAll("button");
  dots.forEach((dot,i)=>{
    dot.setAttribute("aria-selected", i===activeIdx?"true":"false");
    dot.classList.toggle("active", i===activeIdx);
  });
}
function startAutoplay(){
  autoplayTimer = setInterval(nextSlide, 5000);
}
function stopAutoplay(){
  clearInterval(autoplayTimer);
  autoplayTimer = null;
}
function initCarousel(){
  // create navigation dots
  certifications.forEach((_,i)=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.setAttribute("aria-label",`Slide ${i+1}`);
    btn.addEventListener("click",()=>{currentIndex=i;renderSlide(i);stopAutoplay();startAutoplay();});
    dotsContainer.appendChild(btn);
  });
  renderSlide(currentIndex);
  startAutoplay();
  // pause on hover / focus
  container.addEventListener("mouseenter",stopAutoplay);
  container.addEventListener("mouseleave",startAutoplay);
  container.addEventListener("focusin",stopAutoplay);
  container.addEventListener("focusout",startAutoplay);
  // swipe handling
  let startX=null;
  container.addEventListener("touchstart",e=>{startX=e.touches[0].clientX;});
  container.addEventListener("touchend",e=>{
    if(startX===null) return;
    const diff=e.changedTouches[0].clientX-startX;
    if(Math.abs(diff)>50){ diff>0?prevSlide():nextSlide(); }
    startX=null;
  });
  // navigation buttons
  const prevBtn=document.querySelector(".cert-nav.prev");
  const nextBtn=document.querySelector(".cert-nav.next");
  if(prevBtn) prevBtn.addEventListener("click",prevSlide);
  if(nextBtn) nextBtn.addEventListener("click",nextSlide);
  // Lightbox on image click
  slideImg.addEventListener("click",()=>{
    const lightbox=document.createElement("div");
    lightbox.className="cert-lightbox";
    lightbox.innerHTML=`
      <div class="lightbox-content">
        <img src="${certifications[currentIndex].image}" alt="${certifications[currentIndex].title}" />
        <button class="lightbox-close" aria-label="Fechar">✕</button>
      </div>`;
    document.body.appendChild(lightbox);
    lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.remove());
    lightbox.addEventListener('click',e=>{ if(e.target===lightbox) lightbox.remove(); });
  });
}

if(container){
  initCarousel();
}
