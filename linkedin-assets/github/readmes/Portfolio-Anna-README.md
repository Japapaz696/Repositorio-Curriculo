# Portfólio — Anna Clara Ferraz Santos

Site pessoal de **Anna Clara Ferraz Santos**, estudante de Medicina, com estética minimalista em tons bege e terracota.

## Sobre o projeto

Site estático multi-páginas construído com HTML, CSS e JavaScript puro — sem frameworks, dependências ou etapa de build. O projeto explora uma interface personalizada de estética editorial e foi pensado para funcionar bem no GitHub Pages e no celular.

## UX/UI e acessibilidade

- identidade visual em tons bege e terracota;
- layout responsivo e menu para telas menores;
- hierarquia visual, animações de entrada e lightbox de imagens;
- conteúdo estruturado em páginas e alternativas textuais nas imagens relevantes.

### Páginas

- `index.html` — Página inicial com apresentação e atalhos para o portfólio
- `sobre.html` — História pessoal, vocação e galeria editorial com lightbox
- `curiosidades.html` — Família, amigas, pets e detalhes pessoais
- `formacao.html` — Pontos fortes, desafios e planos de estudo
- `academico.html` — Resumo visual da vida acadêmica

### Interações (`script.js`)

- Menu hambúrguer no mobile
- Fundo global com manchas de cor nos cantos, fixo durante a rolagem
- Nome surgindo letra por letra com efeito de blur na página inicial
- Animações de entrada ao rolar a página
- Contadores animados e barras acadêmicas
- Troca de imagens por rolagem/hover na página Sobre mim
- Lightbox para ampliar as fotos

## Como visualizar localmente

Basta abrir o `index.html` no navegador, ou servir localmente dentro da pasta do projeto:

```bash
cd portfolio-anna
python -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

## Deploy

**Demonstração publicada:** [japapaz696.github.io/Portfolio-Anna](https://japapaz696.github.io/Portfolio-Anna/).

O endereço respondeu HTTP 200 e foi aberto em Chromium em versões desktop e mobile na revisão de 5 de outubro de 2026. Isso valida a apresentação das páginas; não representa certificação de acessibilidade ou teste de todas as interações.

Para reproduzir a publicação em outro repositório:

1. Crie um repositório no GitHub.
2. Envie os arquivos desta pasta para a raiz do repositório.
3. No GitHub, abra **Settings > Pages**.
4. Em **Build and deployment**, selecione a branch `main` e a pasta `/root`.
5. Salve e aguarde o link do GitHub Pages ficar disponível.

O campo Website do repositório pode receber o endereço da demonstração acima.

---

Feito com ❤️ como presente para Anna Clara.


## Apresentação profissional — material preparado

Captura real: [desktop](../../screenshots/anna-home-desktop.png) e [mobile](../../screenshots/anna-home-mobile.png).

As imagens usam demonstração pública ou ambiente local, conforme o relatório de captura. Este arquivo é uma versão preparada dentro de linkedin-assets; antes de publicá-lo na raiz do repositório, copiar as imagens para docs/screenshots e ajustar os caminhos.
