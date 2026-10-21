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
| **[SupportFlow](https://github.com/Japapaz696/SupportFlow)** | Sistema de chamados full stack | API Express/TypeScript, PostgreSQL com migrations versionadas, JWT com quatro perfis de acesso, SLA por prioridade, **116 testes** e CI verde |
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
