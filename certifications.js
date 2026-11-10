const certifications = [
  { id:'relational-db', title:'Banco de Dados Relacional V8', issuer:'freeCodeCamp', workload:'Aproximadamente 300 horas', completed:'2 de novembro de 2026', description:'Certificação de conclusão em banco de dados relacional.', image:'assets/certificates/fcc-db.jpg', imageAlt:'Certificado Banco de Dados Relacional V8 da freeCodeCamp, emitido para Lucas Santana da Paz', verify:'https://freecodecamp.org/certification/lucaspaz696/relational-database-v8', buttonLabel:'Ver credencial oficial' },
  { id:'python', title:'Computação Científica com Python', issuer:'freeCodeCamp', workload:'Aproximadamente 300 horas', completed:'3 de novembro de 2026', description:'Certificação de conclusão em computação científica com Python.', image:'assets/certificates/fcc-python.jpg', imageAlt:'Certificado Computação Científica com Python da freeCodeCamp, emitido para Lucas Santana da Paz', verify:'https://freecodecamp.org/certification/lucaspaz696/scientific-computing-with-python-v7', buttonLabel:'Ver credencial oficial' },
  { id:'web-design', title:'Design Web Responsivo Legado V8', issuer:'freeCodeCamp', workload:'Aproximadamente 300 horas', completed:'3 de novembro de 2026', description:'Certificação de conclusão em design web responsivo.', image:'assets/certificates/fcc-web.jpg', imageAlt:'Certificado Design Web Responsivo Legado V8 da freeCodeCamp, emitido para Lucas Santana da Paz', verify:'https://freecodecamp.org/certification/lucaspaz696/responsive-web-design', buttonLabel:'Ver credencial oficial' },
  { id:'google-db', title:'Google Cloud Database Engineer', issuer:'Google Cloud', description:'Especialização em andamento. Esta arte indica progresso e não é um certificado emitido.', image:'assets/certificates/google-db-progress.svg', imageAlt:'Ilustração de progresso: Google Cloud Database Engineer. Em andamento; certificado ainda não emitido.', status:'inprogress', verify:'https://www.coursera.org/specializations/google-cloud-database-engineer', buttonLabel:'Ver especialização na Coursera' }
];
const tabsContainer = document.getElementById('cert-tabs');
const contentPanel = document.getElementById('cert-content');
const previewCard = document.getElementById('cert-preview-card');
const infoPanel = document.getElementById('cert-specs-panel');

function addFact(list, label, value) {
  if (!value) return;
  const item = document.createElement('div');
  const term = document.createElement('dt');
  const detail = document.createElement('dd');
  term.textContent = label;
  detail.textContent = value;
  item.append(term, detail);
  list.append(item);
}

function renderCertificate(cert) {
  if (!cert || !previewCard || !infoPanel || !contentPanel) return;
  const selectedTab = tabsContainer.querySelector('[data-cert="' + cert.id + '"]');
  tabsContainer.querySelectorAll('[role="tab"]').forEach(tab => {
    const selected = tab === selectedTab;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    tab.classList.toggle('active', selected);
  });
  contentPanel.setAttribute('aria-labelledby', selectedTab ? selectedTab.id : 'cert-tab-relational-db');

  const image = document.createElement('img');
  image.className = 'cert-image';
  image.src = cert.image;
  image.alt = cert.imageAlt;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => {
    const placeholder = document.createElement('div');
    placeholder.className = 'cert-placeholder';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', cert.title + ': imagem indisponível');
    placeholder.textContent = 'Imagem do certificado indisponível';
    previewCard.replaceChildren(placeholder);
  }, { once: true });
  previewCard.replaceChildren(image);

  const headingRow = document.createElement('div');
  headingRow.className = 'cert-heading-row';
  const heading = document.createElement('h3');
  heading.className = 'cert-title';
  heading.textContent = cert.title;
  headingRow.append(heading);
  if (cert.status === 'inprogress') {
    const badge = document.createElement('span');
    badge.className = 'cert-status';
    badge.textContent = 'Em andamento';
    headingRow.append(badge);
  }
  const description = document.createElement('p');
  description.className = 'cert-description';
  description.textContent = cert.description;
  const facts = document.createElement('dl');
  facts.className = 'cert-facts';
  addFact(facts, 'Instituição', cert.issuer);
  addFact(facts, 'Carga horária', cert.workload);
  addFact(facts, 'Concluído em', cert.completed);
  const link = document.createElement('a');
  link.className = 'cert-verify';
  link.href = cert.verify;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = cert.buttonLabel;
  link.setAttribute('aria-label', cert.buttonLabel + ': ' + cert.title + ' (abre em nova aba)');
  infoPanel.replaceChildren(headingRow, description, facts, link);
}

function initTabs() {
  if (!tabsContainer || !contentPanel || !previewCard || !infoPanel) return;
  const tabs = Array.from(tabsContainer.querySelectorAll('[role="tab"][data-cert]'));
  tabs.forEach((tab, index) => {
    const cert = certifications.find(item => item.id === tab.dataset.cert);
    if (!cert) return;
    tab.addEventListener('click', () => renderCertificate(cert));
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });
  const initialTab = tabs.find(tab => certifications.some(cert => cert.id === tab.dataset.cert)) || tabs[0];
  if (initialTab) {
    initialTab.setAttribute('aria-selected', 'true');
    initialTab.tabIndex = 0;
    renderCertificate(certifications.find(cert => cert.id === initialTab.dataset.cert));
  }
}
initTabs();
