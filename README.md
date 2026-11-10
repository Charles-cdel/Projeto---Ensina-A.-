# ENSINA AÍ - Landing Page Institucional

Landing Page institucional da escola **ENSINA AÍ**, instituição que atende crianças e jovens desde 1 ano de idade (Educação Infantil) até o 3º ano do Ensino Médio.

O projeto é **100% estático**, construído exclusivamente com **HTML5, CSS3 e JavaScript Vanilla (ES6+)**, sem frameworks de interface, sem processos de build ou compilação, pronto para hospedagem direta no **GitHub Pages**.

---

## 🛠️ Tecnologias Utilizadas
- **HTML5** Semântico (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<dialog>`).
- **CSS3** Moderno (Variáveis customizadas `:root`, Flexbox, CSS Grid, Media Queries fluidas).
- **JavaScript Vanilla (ES6+)** puro para controle do menu mobile, rolagem suave com compensação de cabeçalho, galeria modal/lightbox, acordeão de FAQ e validação demonstrativa local do formulário de matrícula.
- **Zero Dependências de Compilação**: Não requer Node.js, Vite, Webpack, Babel, React ou TypeScript para execução.

---

## 📁 Estrutura de Arquivos
```text
├── index.html                   # Página principal com marcação semântica, caminhos relativos e âncoras
├── .nojekyll                    # Arquivo que desativa o processamento Jekyll no GitHub Pages
├── css/
│   ├── style.css                # Variáveis de design (cores, fontes, espaçamentos) e estilos base
│   └── responsive.css           # Regras de responsividade para desktop, tablet e smartphones
├── js/
│   ├── script.js                # Interatividade (menu mobile, backdrop, scroll spy, cabeçalho, lightbox)
│   ├── form.js                  # Validação local do formulário de matrícula, máscara de telefone e feedback
│   └── faq.js                   # Interação de acordeão acessível (abrir/fechar com recálculo dinâmico)
├── assets/
│   ├── logo/
│   │   └── logo-ensina-ai.svg   # Logotipo oficial em vetor SVG (utilizado também como favicon)
│   ├── icons/
│   │   ├── menu.svg             # Ícone de menu hambúrguer
│   │   ├── close.svg            # Ícone de fechar menu/modal
│   │   ├── graduation-cap.svg   # Ícone de educação/graduação
│   │   ├── sparkles.svg         # Ícone de destaque/lúdico
│   │   ├── map-pin.svg          # Ícone de localização
│   │   ├── phone.svg            # Ícone de telefone
│   │   ├── mail.svg             # Ícone de correio eletrônico
│   │   ├── clock.svg            # Ícone de horários
│   │   ├── check.svg            # Ícone de confirmação/benefício
│   │   ├── arrow-right.svg      # Ícone de seta de ação
│   │   ├── heart.svg            # Ícone de afeto/acolhimento
│   │   ├── users.svg            # Ícone de parceria escola-família
│   │   ├── book-open.svg        # Ícone de aprendizagem ativa
│   │   ├── target.svg           # Ícone de formação para o futuro
│   │   ├── expand.svg           # Ícone de ampliação para modal lightbox
│   │   ├── chevron-down.svg     # Ícone de seta expansível do acordeão de FAQ
│   │   ├── whatsapp.svg         # Ícone do WhatsApp para contato direto
│   │   ├── instagram.svg        # Ícone do Instagram institucional
│   │   ├── facebook.svg         # Ícone do Facebook institucional
│   │   ├── youtube.svg          # Ícone do YouTube institucional
│   │   └── linkedin.svg         # Ícone do LinkedIn institucional
│   └── images/
│       ├── hero-education.svg          # Gráfico representativo da jornada pedagógica
│       ├── hero-students.jpg           # Imagem fotográfica contextual dos alunos
│       ├── institutional-education.jpg # Imagem fotográfica da apresentação institucional
│       ├── segment-infantil.jpg        # Imagem contextual da Educação Infantil (1 a 5 anos)
│       ├── segment-fundamental.jpg     # Imagem contextual do Ensino Fundamental (1º ao 9º ano)
│       ├── segment-medio.jpg           # Imagem contextual do Ensino Médio (1º ao 3º ano)
│       ├── infra-salas.jpg             # Imagem demonstrativa de Salas de Aula
│       ├── infra-convivencia.jpg       # Imagem demonstrativa de Espaços de Convivência
│       ├── infra-pedagogico.jpg        # Imagem demonstrativa de Ambientes Pedagógicos e Biblioteca
│       └── infra-recreacao.jpg         # Imagem demonstrativa de Áreas Recreativas e Playground
└── README.md                           # Documentação do projeto e instruções de publicação
```

---

## 🎨 Identidade Visual e Design Tokens

### Paleta de Cores
- **Azul Marinho Institucional (`#1E3A8A` / `#172554`)**: Transmite autoridade acadêmica, solidez, segurança e estabilidade.
- **Amarelo Solar / Âmbar (`#F59E0B` / `#D97706`)**: Expressa acolhimento, afeto, energia, curiosidade infantil e otimismo.
- **Verde Crescimento e Comunicação (`#10B981` / `#16A34A`)**: Simboliza desenvolvimento e canais de contato ágeis (WhatsApp).
- **Fundos Neutros (`#F8FAFC` e `#FFFFFF`)**: Proporcionam leitura limpa, confortável e alto contraste (conformidade com critérios WCAG AA/AAA).

### Tipografia
- Família Principal: `Plus Jakarta Sans`, moderna, legível e acolhedora em telas de qualquer resolução.

---

## ⚓ Seções Estruturadas por Âncoras
1. **`#inicio`**: Área Hero com proposição de valor, público atendido (1 ano ao 3º ano do Ensino Médio), chamadas de ação e indicador de ciclo completo.
2. **`#a-escola`**: Apresentação institucional com a proposta pedagógica "Educação para cada fase da vida".
3. **`#ensino`**: "Nossa jornada de aprendizagem" com cards e imagens para Educação Infantil, Fundamental e Médio.
4. **`#diferenciais`**: 6 pilares demonstrativos (desenvolvimento integral, acompanhamento pedagógico, ambiente acolhedor, aprendizagem ativa, parceria escola-família e formação para o futuro).
5. **`#infraestrutura`**: Galeria visual demonstrativa de ambientes escolares (Salas de aula, Espaços de convivência, Ambientes pedagógicos e Áreas recreativas) com modal lightbox integrado.
6. **`#faq`**: Dúvidas frequentes estruturadas em acordeão interativo acessível em JavaScript Vanilla (`js/faq.js`), esclarecendo visitas, etapas, matrículas e informações.
7. **`#contato`**: Painel "Fale Conosco" com botão para WhatsApp direto, telefone institucional, endereço e horários (com identificação clara de provisório), além do formulário de demonstração de interesse em matrícula (`js/form.js`).
8. **Footer Institucional**: Logotipo, apresentação da instituição, links de navegação rápida completos, segmentos educacionais, contatos provisórios, redes sociais (Instagram, Facebook, YouTube, LinkedIn, WhatsApp) e direitos autorais.

---

## 🌐 Publicação no GitHub Pages (Passo a Passo)

Como todos os caminhos do projeto são estritamente **relativos** (`assets/...`, `css/...`, `js/...`), o site é totalmente compatível com repositórios de usuário (`https://<usuario>.github.io/`) ou de projeto (`https://<usuario>.github.io/<nome-do-repositorio>/`).

### Passo 1: Criar o Repositório no GitHub
1. Acesse sua conta no [GitHub](https://github.com/).
2. Clique no botão **New** (ou acesse `https://github.com/new`).
3. Nomeie o repositório (ex.: `ensina-ai` ou `ensina-ai-landing-page`).
4. Selecione o repositório como **Public**.
5. Clique em **Create repository**.

### Passo 2: Enviar os Arquivos para o Repositório
No terminal do seu computador (dentro da pasta do projeto):
```bash
git init
git add .
git commit -m "feat: landing page institucional ENSINA AI para GitHub Pages"
git branch -M main
git remote add origin https://github.com/<SEU_USUARIO>/<NOME_DO_REPOSITORIO>.git
git push -u origin main
```
*(Ou, alternativamente, arraste todos os arquivos da pasta para a interface web do GitHub na opção "Upload files").*

### Passo 3: Ativar o GitHub Pages
1. No repositório no GitHub, clique na aba **Settings** (Configurações).
2. Na barra lateral esquerda, clique na seção **Pages** (em *Code and automation*).
3. Em **Build and deployment**:
   - **Source**: selecione `Deploy from a branch`.
   - **Branch**: selecione `main` (ou `master`).
   - **Folder**: selecione `/ (root)`.
4. Clique no botão **Save**.

### Passo 4: Aguardar a Publicação
- O GitHub iniciará uma ação automática de deploy (leva em média de 1 a 3 minutos).
- Uma mensagem exibirá o endereço público do site:
  `https://<SEU_USUARIO>.github.io/<NOME_DO_REPOSITORIO>/`

---

## 🧪 Como Testar a Versão Publicada

### Teste Local (Antes de Publicar)
Para testar como site estático no seu ambiente local sem nenhum bundler:
1. **Via Python**:
   ```bash
   python3 -m http.server 8000
   ```
   Abra `http://localhost:8000` no seu navegador.
2. **Via VS Code**:
   - Instale a extensão *Live Server*.
   - Clique com o botão direito em `index.html` e selecione *Open with Live Server*.
3. **Direto no Navegador**:
   - Dê um duplo clique no arquivo `index.html` para abri-lo diretamente via protocolo `file://`.

### Roteiro de Teste da Versão Online (GitHub Pages)
Após o deploy no GitHub Pages, valide os seguintes pontos:
- [ ] **Carregamento de Estilos e Fontes**: Verifique se as fontes Google Fonts e os arquivos `css/style.css` e `css/responsive.css` carregam sem erro 404 no console (F12).
- [ ] **Imagens e Ícones SVG**: Certifique-se de que a logo, as fotos de segmentos e os ícones aparecem perfeitamente.
- [ ] **Navegação e Âncoras**: Clique nos links do menu (*Início*, *A Escola*, *Ensino*, *Diferenciais*, *Infraestrutura*, *Dúvidas*, *Contato*) e confirme a rolagem suave com o cabeçalho fixo.
- [ ] **Menu Mobile**: Em celulares ou na ferramenta de inspeção do navegador (< 768px), teste a abertura e fechamento do menu pelo ícone hambúrguer, o toque no backdrop escurecido e a tecla <kbd>Esc</kbd>.
- [ ] **Modal de Infraestrutura**: Clique em qualquer foto da seção Infraestrutura para abrir o lightbox e teste o fechamento pelo botão "X", clique fora ou tecla <kbd>Esc</kbd>.
- [ ] **Acordeão de FAQ**: Clique em cada uma das 5 perguntas para conferir a abertura e fechamento fluido das respostas.
- [ ] **Formulário Demonstrativo**: Preencha os campos e envie. Confirme se a validação (nome, telefone com máscara e DDD, e-mail) exibe mensagens amigáveis e se o estado de sucesso demonstrativo local é apresentado corretamente.

---

## 📌 Observações sobre Dados Provisórios
Todos os números de contato, horários de atendimento e endereços exibidos são de caráter demonstrativo, marcados com a etiqueta `[Provisório]`. O formulário de interesse em matrícula opera em modo cliente/local de demonstração, sem persistência em banco ou backend.
