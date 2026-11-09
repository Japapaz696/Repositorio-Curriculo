# Portfólio — Lucas Santana da Paz

Portfólio pessoal de Lucas Santana da Paz, estudante de Análise e Desenvolvimento de Sistemas. Reúne interfaces web e protótipos desenvolvidos com foco em JavaScript, experiência de uso e fundamentos da web.

**Demonstração:** [japapaz696.github.io/Repositorio-Curriculo](https://japapaz696.github.io/Repositorio-Curriculo/)

## Sobre o projeto

Uma página de apresentação profissional que conecta projetos práticos, trajetória de estudos e formas de contato. Não usa framework ou etapa de build, o que facilita a publicação no GitHub Pages.

## Objetivo

Demonstrar capacidade de criar interfaces responsivas, organizar estados no navegador e documentar decisões de produto de forma clara.

## Principais funcionalidades

- navegação por seções e layout responsivo;
- apresentação de projetos e experimentos;
- páginas demonstrativas de pedido, agendamento e catálogo;
- interações em JavaScript e persistência local onde indicada pelo próprio projeto;
- lógica das regras de agendamento do Seu Manoel coberta por **21 testes** (`node:test`), executados a cada commit pelo CI.

## Projetos apresentados

### Demos embutidas (navegáveis nesta página)

| Projeto | O que demonstra |
|---|---|
| **Papitos** | cardápio, carrinho e pedido no navegador |
| **Seu Manoel** | fluxo de agendamento em etapas, com regras de conflito de horário cobertas por testes |
| **Beauty Store** | catálogo com busca, favoritos e checkout simulado |

### Sistemas próprios (código aberto)

| Projeto | O que é | Destaques técnicos |
|---|---|---|
| **[OmniOps AI](https://github.com/Japapaz696/OmniOps-AI)** ([Live Demo](https://omniops-ai.vercel.app)) | Plataforma tática de análise contínua de código (DevSecOps) | Detecção de vulnerabilidades OWASP Top 10 em tempo real, geração de patches comparativos, síntese de voz (Web Speech API), interface HUD cibernética, **18 testes** e deploy na Vercel + Render |
| **[SupportFlow](https://github.com/Japapaz696/SupportFlow)** | Sistema de chamados full stack | API Express/TypeScript, PostgreSQL com migrations versionadas, JWT com quatro perfis de acesso, SLA por prioridade, **196 testes** e CI verde |
| **[Site-veronica](https://github.com/Japapaz696/Site-veronica)** | Agendamento de consultas | Persistência em PostgreSQL, sessão administrativa em cookie `HttpOnly`, token opaco por agendamento, **90 testes** |
| **[barbearia](https://github.com/Japapaz696/barbearia)** | Demo de barbearia com área do cliente | Senha guardada como derivador PBKDF2, PWA com cache offline, **10 testes** |

## Tecnologias

HTML5 semântico, CSS3, JavaScript, LocalStorage, Git e GitHub Pages. Nos sistemas próprios: Node.js, Express, PostgreSQL, React, TypeScript, Vite, JWT e bcrypt.

## Acessibilidade e performance

O projeto inclui link para pular ao conteúdo, textos alternativos nas imagens principais e carregamento preguiçoso nas imagens de projetos. As páginas são estáticas e não exigem instalação de dependências.

## Como executar

Abra `index.html` no navegador ou use um servidor estático:

```bash
python -m http.server 8000
```

### Rodar os testes

```bash
node --test projetos/seu-manoel/booking-rules.test.mjs
```

O CI (`.github/workflows/ci.yml`) roda os testes a cada commit.

## Estrutura do projeto

- `index.html`, `style.css` e `script.js` — portfólio principal;
- `projetos/` — demonstrações independentes;
- `assets/` — recursos visuais do portfólio;
- `tests/` — testes das regras de agendamento.

## Autor

[Lucas Santana da Paz](https://github.com/Japapaz696) · [LinkedIn](https://www.linkedin.com/in/lucas-santana-da-paz-215816247/) · [E-mail](mailto:lucaspaz696@gmail.com)

---

## Novas Seções

### Certificações & Credenciais

A nova seção interativa **#certifications** exibe um carrossel de certificados com navegação por setas, swipe mobile, indicadores (dots) e autoplay de 5 s. Cada slide inclui imagem (ou placeholder), informações detalhadas (emissor, carga horária, descrição, tags) e link "Ver Credencial" que abre a verificação em nova aba. Um lightbox permite ampliar a imagem.

#### Certificados incluídos

- **FreeCodeCamp – Banco de Dados Relacional** (300 h / 9 Cursos) – Emissor: freeCodeCamp
- **FreeCodeCamp – Computação Científica com Python** (300 h / 9 Cursos) – Emissor: freeCodeCamp
- **FreeCodeCamp – Design Web Responsivo** (300 h / 9 Cursos) – Emissor: freeCodeCamp
- **Google – Especialização em Banco de Dados** (9 Cursos) – Emissor: Google

> **Diretório de assets**: coloque as imagens PNG dos diplomas em `assets/certificates/` com nomes `fcc-db.png`, `fcc-python.png`, `fcc-web.png`, `google-db.png`.

### Currículos por Foco de Atuação

A seção **#curriculos** lista cartões para diferentes perfis profissionais, cada um com botões "Visualizar" e "Baixar PDF". Os PDFs devem estar em `assets/cv/`:

- `curriculo-geral.pdf` – Currículo completo
- `curriculo-fullstack.pdf` – Foco Full‑Stack/Web
- `curriculo-suporte-sql.pdf` – Foco Suporte ERP & Banco de Dados

> **Diretório de assets**: crie `assets/cv/` e adicione os PDFs acima. Caso algum arquivo ainda não exista, o botão exibirá um placeholder estilizado.

---

## Guia de Manutenção de Assets

- **Imagens de Certificados**: `assets/certificates/` – PNG 300 × 400 px (ou similar). Nomeie seguindo o padrão `fcc-*.png` ou `google-*.png`.
- **Currículos PDF**: `assets/cv/` – PDFs com nome conforme listado. Atualize os links em `index.html` caso altere nomes.
- **Estilos**: As cores do tema escuro permanecem (`#0a0a0a`, borda `#262626`, destaque `#ff3b00`). Qualquer alteração de design deve manter esse esquema.

---

*Documentação atualizada em 09/11/2026.*
