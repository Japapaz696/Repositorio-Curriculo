// Certifications tabs implementation
// Data for certificates
const certifications = [
  {
    id: "relational-db",
    title: "FreeCodeCamp – Banco de Dados Relacional V8",
    issuer: "freeCodeCamp",
    hours: "300 horas",
    description: "Projeto de modelagem, consultas SQL avançadas e otimização de índices.",
    requirements: "Modelagem relacional, PostgreSQL, Bash, Git, scripts em SQL complexos e automação de banco de dados.",
    application: "Diagnóstico e verificação de inconsistências no ERP TecFood na Teknisa.",
    tags: ["SQL", "PostgreSQL", "Bash", "Modelagem"],
    image: "assets/certificates/banco-de-dados-relacional-v8.png",
    verify: "https://freecodecamp.org/certification/lucaspaz696/relational-database-v8"
  },
  {
    id: "python",
    title: "FreeCodeCamp – Computação Científica com Python",
    issuer: "freeCodeCamp",
    hours: "300 horas",
    description: "Análise de dados, NumPy, Pandas, visualizações e algoritmos numéricos.",
    requirements: "Algoritmos estruturados, manipulação de dados avançada.",
    application: "Automação de rotinas e suporte à programação orientada a dados.",
    tags: ["Python", "NumPy", "Pandas", "Algoritmos"],
    image: "assets/certificates/fcc-python.png",
    verify: "https://freecodecamp.org/certification/lucaspaz696/scientific-computing-with-python-v7"
  },
  {
    id: "web-design",
    title: "FreeCodeCamp – Design Web Responsivo Legado V8",
    issuer: "freeCodeCamp",
    hours: "300 horas",
    description: "Layouts flexíveis, CSS Grid, acessibilidade e performance.",
    requirements: "HTML5 semântico, CSS3 (Flexbox/Grid), mobile‑first, acessibilidade.",
    application: "Construção de interfaces web funcionais e otimizadas.",
    tags: ["HTML5", "CSS3", "Flexbox", "Grid", "Acessibilidade"],
    image: "assets/certificates/fcc-web.png",
    verify: "https://freecodecamp.org/certification/lucaspaz696/responsive-web-design"
  },
  {
    id: "google-db",
    title: "Google – Cloud Database Engineer (Em andamento)",
    issuer: "Google",
    hours: "–",
    description: "Especialização em Google Cloud Database Engineer – BigQuery, Cloud SQL, modelagem de dados e pipelines ETL.",
    requirements: "Fundamentos de bancos de dados relacionais e não‑relacionais, arquitetura de dados.",
    application: "Diagnósticos em sistemas legados e análise de registros operacionais.",
    tags: ["Google", "SQL", "Data Architecture", "BigQuery"],
    image: "assets/certificates/google-db-progress.svg",
    status: "inprogress",
    verify: "https://www.coursera.org/specializations/google-cloud-database-engineer",
    buttonLabel: "Ver especialização na Coursera"
  }
];

let currentIndex = 0;

const tabsContainer = document.getElementById('cert-tabs');
const infoPanel = document.getElementById('cert-specs-panel');
const previewCard = document.getElementById('cert-preview-card');

function createImgElement(src, alt) {
  const img = document.createElement('img');
  img.id = 'cert-img';
  img.className = 'cert-image';
  img.loading = 'lazy';
  img.src = src;
  img.alt = alt;
  img.onerror = () => fallbackImage();
  return img;
}

function fallbackImage() {
  const placeholder = document.createElement('div');
  placeholder.className = 'cert-placeholder';
  placeholder.style.cssText = 'background:#121212;color:#f5f5f5;padding:2rem;border:1px solid #262626;border-radius:8px;text-align:center';
  placeholder.textContent = 'Imagem indisponível';
  previewCard.innerHTML = '';
  previewCard.appendChild(placeholder);
}

function renderCertificate(index) {
  const cert = certifications[index];
  // Update image (recreate each time to avoid stale references)
  previewCard.innerHTML = '';
  const imgEl = createImgElement(cert.image, `Diploma de ${cert.title}`);
  previewCard.appendChild(imgEl);

  const statusBadge = cert.status === 'inprogress' ? `<span class="cert-status" aria-label="Em andamento">Em andamento</span>` : '';
  const buttonLabel = cert.buttonLabel || 'Ver Credencial Oficial';

  infoPanel.innerHTML = `
    <h3 class="cert-title">${cert.title} ${statusBadge}</h3>
    <p><strong>Emissor:</strong> ${cert.issuer}</p>
    <p><strong>Carga Horária:</strong> ${cert.hours}</p>
    <p>${cert.description}</p>
    <p><strong>Exigências:</strong> ${cert.requirements}</p>
    <div class="cert-tags">${cert.tags.map(t => `<span class="cert-tag">${t}</span>`).join(' ')}</div>
    <p><strong>Aplicação Prática:</strong> ${cert.application}</p>
    <a href="${cert.verify}" target="_blank" rel="noopener" class="cert-verify">${buttonLabel}</a>
  `;

  // Update tab selected state based on data-cert attribute
  const buttons = tabsContainer.querySelectorAll('button');
  buttons.forEach(btn => {
    const isSelected = btn.getAttribute('data-cert') === cert.id;
    btn.setAttribute('aria-selected', isSelected);
    btn.classList.toggle('active', isSelected);
  });
}

function initTabs() {
  const buttons = tabsContainer.querySelectorAll('button');
  buttons.forEach(btn => {
    const certId = btn.getAttribute('data-cert');
    const idx = certifications.findIndex(c => c.id === certId);
    if (idx !== -1) {
      btn.addEventListener('click', () => {
        currentIndex = idx;
        renderCertificate(idx);
      });
    }
  });
  // Render first (default) certificate based on first button
  if (buttons.length) {
    const firstId = buttons[0].getAttribute('data-cert');
    const firstIdx = certifications.findIndex(c => c.id === firstId);
    if (firstIdx !== -1) {
      currentIndex = firstIdx;
      renderCertificate(firstIdx);
    }
  }
}

// Swipe support for mobile (keeps index logic)
let touchStartX = null;
if (previewCard) {
  previewCard.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; });
  previewCard.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      currentIndex = diff > 0 ? (currentIndex + 1) % certifications.length : (currentIndex - 1 + certifications.length) % certifications.length;
      renderCertificate(currentIndex);
    }
    touchStartX = null;
  });
}

if (tabsContainer && previewCard && infoPanel) {
  initTabs();
}
