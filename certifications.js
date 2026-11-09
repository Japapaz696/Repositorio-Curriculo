// Certifications tabs implementation
// Data for certificates
const certifications = [
  {
    title: "FreeCodeCamp – Banco de Dados Relacional V8",
    issuer: "freeCodeCamp",
    hours: "300 horas",
    courses: "9 Cursos",
    description: "Projeto de modelagem, consultas SQL avançadas e otimização de índices.",
    requirements: "Modelagem relacional, PostgreSQL, Bash, Git, scripts em SQL complexos e automação de banco de dados.",
    application: "Consultas avançadas para diagnóstico e verificação de inconsistências no ERP TecFood na Teknisa.",
    tags: ["SQL", "PostgreSQL", "Bash", "Modelagem"],
    image: "assets/certificates/fcc-db.png",
    verify: "https://www.freecodecamp.org/certification/yourusername/relational-database"
  },
  {
    title: "FreeCodeCamp – Computação Científica com Python",
    issuer: "freeCodeCamp",
    hours: "300 horas",
    courses: "9 Cursos",
    description: "Análise de dados, NumPy, Pandas, visualizações e algoritmos numéricos.",
    requirements: "Algoritmos estruturados, estruturas de dados avançadas, manipulação de dados e resolução de problemas numéricos.",
    application: "Automação de rotinas e suporte à programação orientada a dados.",
    tags: ["Python", "Lógica Avançada", "Algoritmos", "Estrutura de Dados"],
    image: "assets/certificates/fcc-python.png",
    verify: "https://www.freecodecamp.org/certification/yourusername/scientific-computing"
  },
  {
    title: "FreeCodeCamp – Design Web Responsivo Legado V8",
    issuer: "freeCodeCamp",
    hours: "300 horas",
    courses: "9 Cursos",
    description: "Layouts flexíveis, CSS Grid, acessibilidade e performance.",
    requirements: "HTML5 semântico, CSS3 (Flexbox/Grid), responsividade mobile-first, acessibilidade web e regras de UI/UX.",
    application: "Construção de interfaces web funcionais e otimizadas.",
    tags: ["HTML5", "CSS3", "Flexbox", "Grid", "Acessibilidade"],
    image: "assets/certificates/fcc-web.png",
    verify: "https://www.freecodecamp.org/certification/yourusername/responsive-web-design"
  },
  {
    title: "Google – Especialização em Banco de Dados",
    issuer: "Google",
    hours: "9 Cursos",
    courses: "",
    description: "BigQuery, Cloud SQL, modelagem de dados e pipelines ETL.",
    requirements: "Fundamentos de bancos de dados, SQL relacional e não-relacional, arquitetura de dados e otimização de performance.",
    application: "Diagnósticos em sistemas legados e análise de registros operacionais.",
    tags: ["Google", "SQL", "Banco de Dados", "Data Architecture"],
    image: "assets/certificates/google-db.png",
    verify: "https://www.credential.net/google-database-specialization"
  }
];

let currentIndex = 0;

const tabsContainer = document.getElementById('cert-tabs');
const img = document.getElementById('cert-img');
const info = document.getElementById('cert-specs-panel');

function fallbackImage(cert) {
  const placeholder = document.createElement('div');
  placeholder.className = 'cert-placeholder';
  placeholder.style.cssText = 'background:#121212;color:#f5f5f5;padding:2rem;border:1px solid #262626;border-radius:8px;text-align:center';
  placeholder.textContent = `${cert.title} – imagem indisponível`;
  img.replaceWith(placeholder);
}

function renderCertificate(index) {
  const cert = certifications[index];
  // Update image
  img.src = cert.image;
  img.alt = `Diploma de ${cert.title}`;
  img.onerror = () => fallbackImage(cert);
  // Build info panel
  info.innerHTML = `
    <h3 class="cert-title">${cert.title}</h3>
    <p><strong>Emissor:</strong> ${cert.issuer}</p>
    <p><strong>Carga Horária:</strong> ${cert.hours}${cert.courses ? ' / ' + cert.courses : ''}</p>
    <p>${cert.description}</p>
    <p><strong>Exigências:</strong> ${cert.requirements}</p>
    <div class="cert-tags">${cert.tags.map(t => `<span class="cert-tag">${t}</span>`).join(' ')}</div>
    <p><strong>Aplicação Prática:</strong> ${cert.application}</p>
    <a href="${cert.verify}" target="_blank" rel="noopener" class="cert-verify">Ver Credencial Oficial</a>
  `;
  // Update tabs active state
  const tabButtons = tabsContainer.querySelectorAll('button');
  tabButtons.forEach((btn, i) => {
    const selected = i === index;
    btn.setAttribute('aria-selected', selected);
    btn.classList.toggle('active', selected);
  });
}

function initTabs() {
  certifications.forEach((cert, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cert-tab';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.textContent = cert.title;
    btn.addEventListener('click', () => {
      currentIndex = i;
      renderCertificate(i);
    });
    tabsContainer.appendChild(btn);
  });
  // Render first certificate by default
  renderCertificate(currentIndex);
}

// Swipe support for mobile
let touchStartX = null;
const previewCard = document.getElementById('cert-preview-card');
if (previewCard) {
  previewCard.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  });
  previewCard.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe left -> next
        currentIndex = (currentIndex + 1) % certifications.length;
        renderCertificate(currentIndex);
      } else {
        // swipe right -> previous
        currentIndex = (currentIndex - 1 + certifications.length) % certifications.length;
        renderCertificate(currentIndex);
      }
    }
    touchStartX = null;
  });
}

if (tabsContainer && img && info) {
  initTabs();
}
