const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..'),base=path.resolve(__dirname,'..');
const p=JSON.parse(fs.readFileSync(path.join(base,'texts/perfil.json'),'utf8'));
const projects=JSON.parse(fs.readFileSync(path.join(base,'projects/projetos.json'),'utf8'));
const posts=fs.readFileSync(path.join(base,'posts/plano-e-posts.md'),'utf8');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectText=x=>`### ${x.name}\n\n**Categoria:** ${x.category}.\n\n**Texto pronto para LinkedIn:**\n\n${x.description}\n\n**Problema / objetivo:** ${x.objective}\n\n**O que desenvolvi:** ${x.implementation}\n\n**Tecnologias reais:** ${x.technologies}\n\n**Funcionalidades:**\n\n${x.features.map(f=>'- '+f).join('\n')}\n\n**Aprendizado / destaque:** ${x.learning}\n\n**Resultado verificado:** ${x.result}\n\n**Limites:** ${x.limitations}\n\n**Demo:** ${x.url||'Validada localmente. Usar código e capturas; operação online autenticada não comprovada.'}\n\n**GitHub:** ${x.github}\n\n**Imagem principal:** [${x.image}](${x.image}).`;
const sections=[
 ['01 — POSICIONAMENTO PROFISSIONAL',`**Estudante de ADS que desenvolve projetos web e traz experiência real em suporte de software, TecFood/ERP, SQL e atendimento a clientes; explora IA e automação como ferramentas e estudos.**

O eixo é desenvolvimento web + suporte. IA e automação ampliam essa narrativa sem competir com ela ou sugerir especialização. Dados e Customer Success permanecem caminhos possíveis de entrada, condicionados às exigências das vagas.

O perfil deve diferenciar três níveis: experiência profissional em suporte e atendimento; prática técnica em projetos próprios; conhecimentos que ainda estão em estudo. Não usar “engenheiro de IA”, “especialista”, “sênior” ou cargo de desenvolvedor em um vínculo que foi de suporte.

**Diagnóstico recuperado:** há demos web públicas, um projeto técnico reproduzido localmente e uma experiência de suporte relevante. As fragilidades são metadados vazios no GitHub, diferenças de estágio entre projetos e dados profissionais incompletos. A URL do LinkedIn foi encontrada no portfólio, mas a página pública retornou resposta 999 e cadastro: foto, banner, competências atuais, recomendações, atividade, cursos e demais seções da conta não puderam ser examinados. Não confundir “não observado” com “não existe”.

**Informações ainda necessárias:** datas dos vínculos, situação atual na Teknisa, empresa/cargo formais na logística, datas de ADS, proficiência em inglês e comprovantes dos cursos. O portfólio cita anos e período acadêmico; eles não foram transformados em mês/ano ou previsão de conclusão sem confirmação.`],
 ['02 — HEADLINE',`**Escolhida — versão equilibrada (${p.headlines.equilibrada.length} caracteres):**

${p.headlines.equilibrada}

É a melhor síntese porque apresenta desenvolvimento e uma experiência verificável com suporte/SQL/ERP, enquanto “Graduando em ADS” comunica o momento da carreira. Não exige expor toda a stack.

**Alternativa com foco em desenvolvimento:**

${p.headlines.desenvolvimento}

**Alternativa desenvolvimento + suporte + IA:**

${p.headlines.desenvolvimento_suporte_ia}

Usar uma versão por vez. IA fica contextualizada no Sobre e nos projetos; não precisa estar na headline principal para fazer parte do posicionamento.`],
 ['03 — SOBRE',`${p.about}

---

Texto pronto com ${p.about.length} caracteres. Preserva a narrativa já produzida, sem adicionar resultados, senioridade ou emprego formal de desenvolvimento.`],
 ['04 — TEKNISA',`**Empresa:** ${p.experiences[0].company}\n\n**Cargo:** ${p.experiences[0].title}\n\n${p.experiences[0].description}

**Antes de salvar:** confirmar mês/ano de início e fim, local/modelo de trabalho e se o vínculo continua ativo. Não inventar volume de chamados, SLA cumprido, redução de tempo ou indicadores de desempenho. A descrição já destaca contribuição sem criar métricas.`],
 ['05 — NEW CITY CAR',`**Empresa:** ${p.experiences[1].company}\n\n**Cargo:** ${p.experiences[1].title}\n\n${p.experiences[1].description}

**Antes de salvar:** confirmar as datas e o tipo de vínculo. A resolução de problemas aparece nas atividades de conferência e orientação; não atribuir tecnologia ou otimização mensurável à experiência sem exemplo real.`],
 ['06 — PIRELLI',`${p.experiences[2].description}

**Empresa e cargo:** cadastrar os nomes formais depois de confirmar. “Pirelli / loja de pneus” não permite concluir que o contrato era com a indústria Pirelli. Não usar “analista de logística” ou “gestor” como título presumido. Datas e vínculo também ficam pendentes.`],
 ['07 — FORMAÇÃO',`**Instituição:** ${p.education.institution}\n\n**Grau:** ${p.education.degree}\n\n**Curso:** ${p.education.field}\n\n**Situação:** em andamento.\n\n**Descrição pronta:**\n\n${p.education.description}

Confirmar início e previsão de conclusão. Não acrescentar disciplinas cursadas, carga horária, notas, projetos acadêmicos ou semestre atual sem confirmação. O estudo e a prática paralela são apresentados como tal.`],
 ['08 — IDIOMAS',`**Português:** nativo.

**Inglês:** nível ainda não confirmado. Não cadastrar “avançado” ou “fluente” por ter estudado aproximadamente dois anos na TFLA. A configuração honesta agora é aguardar confirmação de proficiência antes de escolher o nível do campo.

Para decidir: básico se consegue compreender frases e instruções simples, mas depende de ajuda para manter uma conversa; intermediário se consegue explicar um projeto e sustentar uma conversa de trabalho simples com dificuldades pontuais; avançado somente se consegue participar de reuniões e discutir problemas técnicos com autonomia. Esses critérios orientam a autoavaliação, não são um teste ou certificação.

**TFLA:** pode ser registrada como estudo de inglês, com período real, quando o nome do curso e a situação de conclusão forem confirmados. Não inserir certificado, nível CEFR ou data de emissão inexistente.`],
 ['09 — PROJETOS',`**Seleção principal:** portfólio, SupportFlow, Verônica e Anna. Lucas Dev é o quinto projeto opcional; incluir quando quiser enfatizar interfaces e configuradores. Quatro projetos sólidos bastam para a primeira versão.

${projects.map(projectText).join('\n\n')}

### Projetos analisados que ficam em segundo plano

**AI Creative Lab — estudo visual:** “Organizei um laboratório de experimentos visuais com interfaces, movimento e conteúdo produzido com apoio de IA generativa. Reuni vídeos e composições no meu portfólio para documentar explorações de prototipagem e direção visual. São estudos, sem apresentação como produto de IA em produção.” Objetivo: explorar interfaces e movimento. Evidência: imagens e vídeos reais no portfólio. Não listar stack de uma aplicação que a pasta isolada não contém. Link: ${p.contacts.portfolio}#lab. Imagem: screenshots/ai-creative-lab-desktop.png.

**Lucas AI — protótipo front-end:** “Desenvolvi um protótipo de interface para explorar cenários de atendimento, agendamento e automação com IA. A página reúne demonstrações locais de conversas e um simulador de diagnóstico em HTML, CSS e JavaScript. As experiências são simuladas; integrações reais estão no roadmap.” Há conversas pré-definidas e cálculo local, sem API de IA, CRM ou WhatsApp Business implementados. Código: https://github.com/Japapaz696/IA-Automa-es-. Demo candidata retornou 404; não publicar esse endereço. Imagem: screenshots/lucas-ai-simulacao-desktop.png.

**Task Master AI — protótipo a recuperar:** “Protótipo de gerenciamento de tarefas com interface React e build Vite. A versão disponível apresenta organização de tarefas e uma interface para sugestões; estou consolidando fontes, configuração de API e demonstração reproduzível.” O build carregou localmente e mostrou erro de conexão com a API. Não foram encontrados manifests/fontes completos nem backend funcional na cópia examinada. Não chamar de solução full-stack concluída ou IA integrada. O caminho público depende de assets que retornam 404. Não usar como Destaque até recuperar e validar. Imagem de auditoria: screenshots/taskmaster-home-desktop.png.

**Outros:** Papitos, Seu Manoel e Beauty Store sustentam os exemplos do portfólio; podem virar posts próprios sobre estados de interface. Barbearia e link-in-bio não precisam aumentar a lista principal. Nenhum projeto foi cadastrado como emprego formal.`],
 ['10 — COMPETÊNCIAS',`**Ordem exata recomendada:**\n\n${p.skills.map((s,i)=>`${i+1}. ${s}`).join('\n')}

As posições 1–11 concentram a base técnica e o foco de busca; as demais conectam prática, ferramentas complementares e comportamento profissional. Na Teknisa, associar suporte, SQL, ERP e atendimento. Nos projetos, associar desenvolvimento web e as tecnologias usadas de fato.

Não adicionar Python, Power BI, AWS, Azure ou TypeScript como domínio só porque aparecem nas vagas ou no código de um projeto. Angular, C#, VB.NET, MVC, n8n e Make podem ser adicionados depois como conhecimentos complementares explicáveis, sem ocupar o topo apenas por quantidade. Recursos de ARIA, foco e semântica encontrados em projetos sustentam prática em acessibilidade, sem alegar certificação WCAG.`],
 ['11 — DESTAQUES',`**Ordem recomendada:**

| Ordem | Título | Descrição pronta | CTA | Link | Imagem |
| --- | --- | --- | --- | --- | --- |
| 1 | Portfólio de Lucas Santana da Paz | Sites, interfaces e projetos em desenvolvimento, reunidos com minha trajetória em tecnologia. | Explore os projetos e seus links. | ${p.contacts.portfolio} | featured/portfolio.png |
| 2 | SupportFlow — sistema de chamados | Projeto próprio com React/TypeScript, Node.js/Express e PostgreSQL; validado localmente com dados fictícios. | Veja o código, a arquitetura e os limites atuais. | https://github.com/Japapaz696/SupportFlow | featured/supportflow.png |
| 3 | Site profissional de Verônica Reis Santana | Interface responsiva de apresentação profissional, com páginas e agendamento em evolução. | Conheça a interface pública. | https://site-veronica.onrender.com | featured/veronica.png |
| 4 | Portfolio Anna | Site pessoal com identidade visual, páginas e navegação responsiva. | Navegue pelo site publicado. | https://japapaz696.github.io/Portfolio-Anna/ | featured/anna.png |
| 5, opcional | GitHub — projetos e estudos | Repositórios, código e documentação dos projetos apresentados. | Consulte o código e acompanhe a evolução. | ${p.contacts.github} | Usar a prévia nativa do link |

Para uma versão enxuta, publicar somente os três primeiros. GitHub fica também nos contatos e no Sobre. Um experimento de IA entra depois, quando houver uma demonstração real ou um estudo claramente identificado; não sacrificar um projeto funcional para apenas incluir a palavra IA.

As capas criadas usam screenshots reais. Os números do dashboard do SupportFlow são dados fictícios, indicados na legenda. Nenhuma capa é mockup de funcionalidade inexistente.`],
 ['12 — CURSOS E CERTIFICAÇÕES',`**POSSO ADICIONAR AGORA:** não há curso concluído com certificado verificado nos materiais recebidos. A graduação em andamento pode constar na Formação, sem aparecer como graduação concluída. Estudos de inglês/TFLA podem ser incluídos como estudo após confirmar nome e período, sem marcar conclusão por estimativa.

**NÃO ADICIONAR COMO CERTIFICADO AINDA:** HTML/CSS/JavaScript, Node, Angular, C#, cloud, IA e automação apenas por constarem como estudos ou ferramentas. “Curso em Vídeo” é uma plataforma citada, não um certificado específico recebido. Não criar ID, carga horária, nota, validade ou data de emissão.

**RECOMENDADOS PARA O FUTURO — recursos para estudar, não conquistas atuais:**

1. Consolidar HTML, CSS, JavaScript e acessibilidade pelos [módulos do MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development), aplicando os exercícios em uma interface própria.
2. Praticar estado, componentes e fluxo de dados com a [documentação de aprendizado do React](https://react.dev/learn), usando o SupportFlow como contexto.
3. Se optar por um curso estruturado, conferir os cursos reais de HTML/CSS/JavaScript no [catálogo do Curso em Vídeo](https://www.cursoemvideo.com/cursos/). Adicionar certificado somente depois de concluir e receber o documento.
4. Aprofundar SQL com o [tutorial oficial do PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html), criando um exemplo de consulta com dados fictícios.
5. Construir uma pequena automação demonstrável depois dos [cursos do n8n](https://docs.n8n.io/courses), incluindo erro, validação e documentação. Não exigir um certificado para demonstrar prática.

Não recomendo comprar uma certificação de cloud para compensar a ausência de evidência nos projetos. Primeiro consolidar uma trilha, concluir e documentar entregas; uma certificação futura deve corresponder ao objetivo da vaga e ao aprendizado real.`],
 ['13 — OPEN TO WORK',`**Lista principal para cadastrar, nesta ordem:**\n\n${p.openToWork.map((s,i)=>`${i+1}. ${s}`).join('\n')}

Selecionar o equivalente disponibilizado no autocomplete. “Júnior”, “N1” e “estágio” devem orientar os filtros e as candidaturas, sem alterar o título formal de uma experiência passada. Equivalentes úteis para buscas em inglês: Junior Front-End Developer, Junior Web Developer, Software Development Intern, Technical Support Analyst e Implementation Analyst.

**Alertas secundários:** Suporte ERP, Suporte Técnico N1, Customer Onboarding Júnior e Customer Success Júnior. Dados e automação/IA ficam em alertas de estágio ou entrada realmente compatíveis; não precisam ampliar o Open to Work para funções muito diferentes.

**Localização:** Belo Horizonte; remoto no Brasil se for sua preferência. Híbrido/presencial, tipos de contratação, jornada e início dependem de confirmação. **Visibilidade sugerida:** recrutadores, se desejar uma busca discreta. O LinkedIn informa que essa opção não garante sigilo completo perante a empresa atual. [Ajuda oficial](https://www.linkedin.com/help/linkedin/answer/a507508). Nenhuma preferência foi alterada na conta.`],
 ['14 — BANNER',`**Arquivo final:** [linkedin-lucas-santana.png](banner/linkedin-lucas-santana.png).\n\n**Matriz editável:** [linkedin-lucas-santana.svg](banner/linkedin-lucas-santana.svg).\n\n**Especificação:** [design.md](banner/design.md).

PNG de 1584 × 396, com nome completo e “Desenvolvimento web, suporte e automação”. Azul profundo, texto claro e conexões discretas à esquerda relacionam sistemas e resolução de problemas. As capas dos projetos usam a mesma paleta e nome, conectando LinkedIn, GitHub e portfólio.

O arquivo segue as dimensões recomendadas de capa pessoal e fica abaixo do limite de 8 MB. [Fonte oficial do LinkedIn](https://www.linkedin.com/help/linkedin/answer/a568217/). Conferir a prévia real do recorte em celular e desktop antes de salvar; o arquivo não foi enviado à conta.`],
 ['15 — FOTO',`**MANTER, provisoriamente.** Não há evidência visual da fotografia atual: o LinkedIn bloqueou a visualização pública e nenhum retrato pessoal foi fornecido. Trocar a imagem sem vê-la seria uma decisão sem fundamento. Esta é uma recomendação de preservação, não uma aprovação estética.

| Critério | Diagnóstico atual | Condição para manter |
| --- | --- | --- |
| Enquadramento | Não observado | Rosto reconhecível, cabeça e ombros, sem corte no rosto |
| Fundo | Não observado | Ambiente simples, sem elementos que disputem atenção |
| Iluminação | Não observada | Rosto visível e sem sombra forte |
| Roupa | Não observada | Roupa limpa e coerente com seu contexto profissional |
| Expressão | Não observada | Expressão natural e postura receptiva |
| Profissionalismo | Não avaliável pela tela de cadastro | Foto pessoal real e recente, sem filtros que mudem sua aparência |

Se a foto falhar claramente nesses critérios, a recomendação muda para TROCAR por um retrato real simples. A avaliação final de manter/trocar por qualidade depende de conseguir vê-la. Nenhuma foto foi modificada ou gerada.`],
 ['16 — SCREENSHOTS',`**29 capturas de projetos organizadas**, incluindo algumas versões equivalentes para uso como capa. As home/desktop têm 1440 × 960; as mobile foram capturadas com viewport de 390 × 844 e escala 2. Há páginas completas adicionais. Os arquivos originais foram preservados.

| Projeto | Arquivos principais | Origem / uso |
| --- | --- | --- |
| Portfólio | portfolio-home-desktop.png, portfolio-home-mobile.png, portfolio-full-desktop.png | URL pública; capa e comparação responsiva |
| SupportFlow | supportflow-dashboard-desktop.png, supportflow-dashboard-mobile.png, supportflow-chamados-desktop.png, supportflow-chamados-mobile.png, supportflow-detalhe-desktop.png | Aplicação local real com API e PostgreSQL isolados; dados fictícios |
| SupportFlow, capa | supportflow-home-desktop.png, supportflow-home-mobile.png | Mesma vista real do dashboard, nome compatível com o gerador de capas |
| Verônica | veronica-home-desktop.png, veronica-home-mobile.png, veronica-full-desktop.png | Home pública; sem consultar dados de pacientes |
| Verônica, formulário | veronica-agendamento-desktop.png | Página local real; envio e backend não validados |
| Anna | anna-home-desktop.png, anna-home-mobile.png, anna-full-desktop.png | URL pública |
| Lucas Dev | lucas-dev-home-desktop.png, lucas-dev-home-mobile.png, lucas-dev-full-desktop.png, lucas-dev-configurador-desktop.png | Interface local real; demo pública verificada em HTTP |
| Lucas AI | lucas-ai-home-desktop.png, lucas-ai-home-mobile.png, lucas-ai-full-desktop.png, lucas-ai-simulacao-desktop.png | Protótipo local com simulações; não chatbot integrado |
| Task Master | taskmaster-home-desktop.png, taskmaster-home-mobile.png, taskmaster-full-desktop.png | Auditoria do build local; erro de API visível. Não usar em Destaques |
| Creative Lab | ai-creative-lab-desktop.png | Seção pública de estudos visuais; não produto de IA operante |

Todos estão em [screenshots/](screenshots/). Capas prontas em [featured/](featured/), imagens de posts em [posts/](posts/). O erro HTTP 503 do agendamento público foi preservado em reports/veronica-agendamento-http503.png, fora da galeria de projetos.

**Ainda dependem de evolução do projeto:** Task Master sem erro e com CRUD/API validados; administração de Verônica após corrigir autenticação/privacidade; automação de IA real quando houver integração. Não fabricar essas telas agora.`],
 ['17 — GITHUB',`**Pins sugeridos:** 1. Repositorio-Curriculo; 2. SupportFlow; 3. Site-veronica; 4. Portfolio-Anna; 5. Lucas, opcional. Deixar a sexta posição vazia até existir outro projeto reproduzível; Task Master ainda não deve ocupá-la.

**Revisão dos nove repositórios públicos:** todos estavam sem Description na consulta preservada. Somente Repositorio-Curriculo e SupportFlow tinham Website. A API não permite tratar os “Popular repositories” como pins confirmados. [Auditoria completa e fontes](reports/github-e-projetos.md).

**Melhorias executadas localmente:** README de Anna recebeu o link de demo já publicada; README de Lucas Dev recebeu a demo e uma observação que distingue domínio comercial não validado da publicação no GitHub Pages. Os textos existentes foram preservados. Preparados também README de perfil, README alternativo factual do SupportFlow e descrições/topics para os repositórios.

**Materiais:** [README do perfil GitHub](github/Japapaz696-README.md), [README preparado do SupportFlow](github/SupportFlow-README.md), [descrições de repositórios](github/descricoes-repositorios.md) e [versões de README com capturas](github/readmes/).

| Item | Ação prioritária |
| --- | --- |
| Repositorio-Curriculo | Manter README bom; acrescentar screenshot e links diretos dos demos |
| SupportFlow | Mostrar arquitetura, execução, testes, limites e screenshots com dados fictícios |
| Site-veronica | Documentar JSON e administração em evolução; corrigir sessão e isolamento de dados antes de prometer operação segura |
| Portfolio-Anna | Demo e captura; descrever interações sem alegar WCAG integral |
| Lucas | Descrever estimativa front-end, sem confundir catálogo de serviços com integrações implementadas |
| IA-Automa-es- | Manter como protótipo; publicar demo só após configurá-la e identificá-la como simulação |
| barbearia | Corrigir contatos-placeholder e promessas de sincronização entre dispositivos apoiadas só em LocalStorage |
| -Conhe-a-e-agende-sua-consulta | Manter como projeto auxiliar; não precisa ser pin |
| AGENT_CONTEXT.md | Candidato a arquivamento se não tem uso ativo; confirmar finalidade antes. Não apagar |

“Parece incompleto” não prova abandono. Sem informação sobre intenção de manutenção, arquivamento é hipótese, não ação automática. Nada foi publicado, renomeado, arquivado ou excluído no GitHub. O README de perfil requer um repositório público chamado Japapaz696, com README.md na raiz; ele não foi criado nesta execução.`],
 ['18 — SEO',`**Amostra concluída:** [20 vagas reais e requisitos](reports/vagas-e-palavras-chave.md), com links para páginas primárias. A amostra inclui anúncio encerrado e registra quando há acesso à candidatura; isso não é garantia de inscrições ativas hoje. Não houve candidatura, cálculo de pontuação ATS ou promessa de ranqueamento.

**Termos distribuídos no perfil:** Desenvolvimento Web, Front-End, JavaScript, React, Node.js, Express, SQL, PostgreSQL, SQL Server, Suporte Técnico, suporte de software, ERP, TecFood, chamados, análise de solicitações, atendimento ao cliente, indicadores, treinamentos, resolução de problemas, Git, GitHub, responsividade, APIs, IA generativa e automação.

| Local | Função das palavras-chave |
| --- | --- |
| Headline | Desenvolvimento Web, JavaScript, React, SQL, Suporte Técnico, ERP e ADS |
| Sobre | História, suporte de software, projetos próprios e aprendizado em IA/automação |
| Teknisa | TecFood/ERP, SQL, atendimento multicanal, chamados, indicadores e treinamento |
| Projetos | Stack e funcionalidades específicas, com estágio e limites |
| Competências | Base técnica e experiência transferível, na ordem definida |
| Open to Work | Cargos coerentes de desenvolvimento, suporte e implantação |

**Padrões das vagas:** desenvolvimento pede API, Git, testes e resolução de bugs; suporte pede análise, comunicação, investigação e acompanhamento de demandas; implantação aproxima treinamento e sistemas; CS adiciona carteira, CRM e retenção; dados costuma acrescentar Python/ETL/BI; automação exige integrações e processos demonstráveis.

Exemplos primários: [Node I — Saquers](https://saquerstech.gupy.io/jobs/12331287?jobBoardSource=gupy_public_page), [Suporte — 3S Checkout](https://e-deploy.gupy.io/jobs/12533296?jobBoardSource=gupy_public_page) e [Onboarding — Neogrid](https://neogridcarreiras.gupy.io/jobs/12497589). Aderência é uma interpretação do histórico, não comprovação de elegibilidade.

Python, Power BI, cloud, CRM, churn e ferramentas não informadas não foram adicionadas como competência. Termos de implantação e CS representam objetivos ou transferência de habilidades; não alteram seu cargo anterior. Evitar repetir a stack inteira em todas as frases.

**Identidade e contatos:** usar nome completo, Belo Horizonte e o e-mail do portfólio: ${p.contacts.email}. A caixa postal não foi testada por envio. GitHub: ${p.contacts.github}; portfólio: ${p.contacts.portfolio}. LinkedIn atual: ${p.contacts.linkedin}. URL personalizada desejada: lucas-santana-da-paz ou lucas-santana-paz, com disponibilidade ainda não verificada. Se mudar a URL, atualizar os links depois de salvar e testar. Não substituir pelo linkedin.com/in/lucasdpaz encontrado em um README com placeholders.`],
 ['19 — CONTEÚDO',posts.replace(/^# Conteúdo para começar\n/,'').replace(/^## /gm,'### ')],
 ['20 — ANÁLISE DE RECRUTADOR',`Avaliação crítica do material preparado, **não uma simulação do LinkedIn atual que não foi acessado**.

**Primeiros 5 segundos:** vejo estudante de ADS com foco claro em desenvolvimento web e uma experiência concreta em suporte/SQL/ERP. A headline não tenta vender especialização em IA. O banner comunica nome e direção profissional.

**Primeiros 30 segundos:** entendo a transição: atendimento/processos → software e consultas SQL → graduação → projetos. O portfólio abre, o SupportFlow tem código e capturas reais, e o site de Verônica mostra uma interface pública. Já há evidência além da lista de tecnologias.

**Perfil completo:** vejo um candidato de entrada com contexto de cliente e software, projetos de complexidades diferentes e limites explicitados. Isso é coerente para estágio e oportunidades júnior; não prova experiência profissional como desenvolvedor full-stack.

| Pergunta | Avaliação |
| --- | --- |
| O que chama atenção? | TecFood/ERP e SQL ligados a atendimento real; projeto de chamados próximo desse contexto |
| O que gera dúvida? | Datas e vínculo atual, proficiência em inglês, autonomia técnica e participação precisa em cada projeto |
| O que parece fraco? | Task Master incompleto, IA simulada, demo de agendamento instável e metadados do GitHub não aplicados |
| O que prova capacidade? | Código, demos navegáveis, capturas reais, build e 77 testes de integração do SupportFlow |
| Chamaria para entrevista? | Sim, para conversa inicial em estágio de desenvolvimento/web, suporte de software/ERP e algumas posições júnior compatíveis; depende dos requisitos concretos |
| Para quais vagas primeiro? | Estágio de desenvolvimento, suporte de software/ERP, suporte júnior e desenvolvimento web/front-end de entrada |
| E implantação/CS? | Avaliaria comunicação, treinamento e sistemas; ainda precisaria confirmar duração e responsabilidade nas atividades |
| E dados/IA? | Interesse não basta: pediria evidência de análise de dados ou uma automação real antes de priorizar essas funções |
| O que impede contratação? | Requisitos de inglês, formação/localização, lacunas técnicas específicas e ausência de explicação autônoma do código podem impedir |

**Correções realizadas no material:** reduzir dispersão de cargos; priorizar quatro projetos; separar simulação de integração; retirar Task Master dos Destaques; explicitar estágio de Verônica e SupportFlow; apresentar TypeScript como stack do projeto sem alegar senioridade; manter inglês/certificados/datas sem invenções.

**Preparação para entrevista:** explicar uma consulta SQL realmente usada sem revelar dados internos; demonstrar login e um fluxo de chamado local; justificar uma regra de acesso e um teste; apresentar uma decisão de responsividade; distinguir ajuda de IA de decisões que você compreende e consegue manter. Não presumir autonomia só porque o repositório compila.`],
 ['21 — CHECKLIST',`**Materiais concluídos:**

- [x] Posicionamento e três headlines, com uma escolhida.
- [x] Sobre, experiências e formação com textos prontos.
- [x] Projetos analisados, selecionados e descritos com limites.
- [x] Competências ordenadas, Destaques e Open to Work definidos.
- [x] Banner PNG e SVG, capturas reais, capas e imagens dos três posts.
- [x] Pesquisa de 20 vagas e palavras-chave aplicada sem inventar stack.
- [x] GitHub revisado; READMEs locais pontuais melhorados e textos preparados.
- [x] Dez pautas e três posts completos.
- [x] Revisão de recrutador e correções de apresentação.
- [x] Testes de integração e build do SupportFlow concluídos em ambiente isolado.

**Aplicação manual no LinkedIn — seguir também [o guia por controle de edição](texts/linkedin-copiar-e-colar.md):**

- [ ] Confirmar datas/vínculo das experiências e empresa/cargo formais da logística.
- [ ] Confirmar datas de ADS, situação na Teknisa e proficiência de inglês.
- [ ] Conferir documentos de cursos antes de cadastrá-los como concluídos/certificados.
- [ ] Atualizar headline, localização e contatos.
- [ ] Subir o banner e conferir o recorte; manter a foto provisoriamente até poder avaliá-la.
- [ ] Colar Sobre, experiências e formação.
- [ ] Cadastrar os projetos próprios na seção Projetos, sem transformá-los em empregos.
- [ ] Ordenar as competências e adicionar os Destaques na ordem proposta.
- [ ] Configurar Open to Work conforme disponibilidade real.
- [ ] Testar links no celular e conferir a URL personalizada antes de alterar contatos existentes.
- [ ] Publicar os posts gradualmente, revisando o tempo verbal de Teknisa.
- [ ] Revisar recomendações e atividade na conta autenticada; não inventar depoimentos.

**Aplicação manual no GitHub:** preencher descrições/Website, escolher pins e criar o README de perfil se desejar. As mudanças públicas não foram executadas.

**Limites finais:** o pacote de reformulação está preparado e revisado; o perfil online não foi alterado. A foto não pôde ser avaliada visualmente, e dados biográficos não confirmados continuam pendentes. Esses itens exigem acesso/informações adicionais; não foram declarados concluídos por suposição. Capturas não provam todo o funcionamento dos sites, e nenhum pentest externo foi realizado.`]
];
const header=`# Reformulação do LinkedIn — Lucas Santana da Paz\n\nEntrega consolidada em **05/10/2026**, preservando os textos, pesquisas e assets válidos da primeira etapa. As 21 seções seguem a ordem solicitada.\n\nOs blocos “texto pronto” podem ser copiados; observações e pendências não devem ser coladas no perfil. Nenhuma alteração pública foi realizada.\n\n`;
fs.writeFileSync(path.join(base,'reformulacao-completa.md'),header+sections.map(([title,body])=>`## ${title}\n\n${body}`).join('\n\n'));
for(const x of projects)fs.writeFileSync(path.join(base,'projects',x.id+'.md'),projectText(x).replace('### ','# '));
const readmes=path.join(base,'github/readmes');fs.mkdirSync(readmes,{recursive:true});
const entries=[['Repositorio-Curriculo','README.md','portfolio'],['Portfolio-Anna','portfolio-anna/Portfolio-Anna/README.md','anna'],['Lucas','Lucas/README.md','lucas-dev'],['Site-veronica','Site-veronica/README.md','veronica'],['IA-Automa-es-','IA-Automa-es-/README.md','lucas-ai']];
for(const [name,file,id]of entries){
 const original=fs.readFileSync(path.join(root,file),'utf8');
 const extra=`\n\n## Apresentação profissional — material preparado\n\nCaptura real: [desktop](../../screenshots/${id}-home-desktop.png) e [mobile](../../screenshots/${id}-home-mobile.png).\n\nAs imagens usam demonstração pública ou ambiente local, conforme o relatório de captura. Este arquivo é uma versão preparada dentro de linkedin-assets; antes de publicá-lo na raiz do repositório, copiar as imagens para docs/screenshots e ajustar os caminhos.\n`;
 fs.writeFileSync(path.join(readmes,name+'-README.md'),original+extra);
}
fs.copyFileSync(path.join(base,'github/SupportFlow-README.md'),path.join(readmes,'SupportFlow-README.md'));
const gallery=projects.map(x=>`<article><img src="${esc(x.image)}" alt="Captura real de ${esc(x.name)}" loading="lazy"><h3>${esc(x.name)}</h3><p>${esc(x.category)}</p><a href="projects/${x.id}.md">Descrição e evidências</a></article>`).join('');
const menu=sections.map(([title])=>`<li>${esc(title)}</li>`).join('');
const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LinkedIn — Lucas Santana da Paz</title><style>
:root{font-family:'Segoe UI',sans-serif;color:#132b43;background:#f4f7fa;font-size:17px}*{box-sizing:border-box}body{margin:0}main{max-width:1120px;margin:auto;padding:48px 24px 72px}h1{font-size:clamp(2rem,4vw,3.6rem);line-height:1.1;letter-spacing:-.04em;margin:12px 0 24px}h2{font-size:1.55rem;margin-top:48px}p{line-height:1.65;max-width:75ch}a{color:#17576d;text-underline-offset:3px}a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid #17576d;outline-offset:4px}.banner{width:100%;display:block;margin:32px 0;border-radius:4px}.links{display:flex;flex-wrap:wrap;gap:16px;padding:18px 0}.headline{font-size:1.2rem;font-weight:600;background:white;padding:24px;border-left:4px solid #70b7b4}.copy{background:white;padding:24px;white-space:pre-wrap;line-height:1.6}button{padding:12px 18px;border:0;background:#132b43;color:white;font:inherit;cursor:pointer;margin-top:12px;border-radius:4px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.grid article{background:white;padding:16px}.grid img{width:100%;aspect-ratio:3/2;object-fit:contain;background:#f4f7fa}.grid h3{margin-bottom:6px}.grid p{font-size:.9rem;margin-top:0;color:#486278}details{margin:24px 0}summary{cursor:pointer;padding:12px 0;font-weight:600}.notice{color:#486278}.toc{columns:2;line-height:1.9;padding-left:24px}@media(max-width:650px){main{padding:28px 18px}.grid{grid-template-columns:1fr}.toc{columns:1}.links{flex-direction:column}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
</style></head><body><main><p class="notice">Material preparado em 5 de outubro de 2026</p><h1>Lucas Santana da Paz</h1><p>Desenvolvimento web, suporte e automação. Textos prontos, evidências dos projetos e materiais visuais para aplicar no LinkedIn.</p><nav class="links" aria-label="Arquivos principais"><a href="reformulacao-completa.md">Entrega completa — 21 seções</a><a href="texts/linkedin-copiar-e-colar.md">Guia de aplicação</a><a href="posts/plano-e-posts.md">Publicações</a><a href="reports/vagas-e-palavras-chave.md">20 vagas pesquisadas</a><a href="reports/github-e-projetos.md">Auditoria de projetos</a></nav><img class="banner" src="banner/linkedin-lucas-santana.png" width="1584" height="396" alt="Banner: Lucas Santana da Paz. Desenvolvimento web, suporte e automação."><a href="banner/linkedin-lucas-santana.png" download>Baixar banner PNG</a><h2>Headline escolhida</h2><p class="headline" id="headline">${esc(p.headlines[p.headlineSelected])}</p><button data-copy="headline">Copiar headline</button><h2>Sobre</h2><div class="copy" id="about">${esc(p.about)}</div><button data-copy="about">Copiar Sobre</button><p role="status" id="copy-status"></p><h2>Projetos selecionados</h2><div class="grid">${gallery}</div><details><summary>Ordem da entrega completa</summary><ol class="toc">${menu}</ol></details><h2>O que falta aplicar</h2><p>Os materiais estão preparados; a conta do LinkedIn não foi alterada. Datas, vínculo atual, inglês e certificados precisam de confirmação. A fotografia não pôde ser examinada porque a página pública exibiu cadastro. O checklist completo está na seção 21.</p><p class="notice">Capturas de SupportFlow usam uma aplicação real local com banco isolado e dados fictícios. Os indicadores não representam resultados profissionais. Task Master e simulações de IA ficam fora da seleção principal.</p></main><script>document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{const target=document.getElementById(button.dataset.copy);try{await navigator.clipboard.writeText(target.innerText);document.getElementById('copy-status').innerText='Texto copiado.'}catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(target);selection.removeAllRanges();selection.addRange(range);document.getElementById('copy-status').innerText='Texto selecionado. Pressione Ctrl+C para copiar.'}}));</script></body></html>`;
fs.writeFileSync(path.join(base,'index.html'),html);
console.log(JSON.stringify({sections:sections.length,projects:projects.length,readmes:entries.length+1}));
