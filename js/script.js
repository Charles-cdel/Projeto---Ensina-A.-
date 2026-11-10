/**
 * ENSINA AÍ - Instituição de Ensino
 * JavaScript Vanilla (ES6+) - Funcionalidades Essenciais de Navegação e Interatividade
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initActiveNavSpy();
  initSmoothScrollLinks();
  initGalleryLightbox();
});

/**
 * 1. Efeito visual no Header ao rolar a página
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Executa na carga inicial
}

/**
 * 2. Menu Responsivo Mobile (Abertura, Fechamento e Acessibilidade)
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link, .nav-menu-cta .btn');

  if (!toggleBtn || !navMenu) return;

  const toggleIcon = toggleBtn.querySelector('img');

  const openMenu = () => {
    navMenu.classList.add('is-open');
    if (navBackdrop) navBackdrop.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Fechar menu de navegação');
    if (toggleIcon) toggleIcon.src = 'assets/icons/close.svg';
    document.body.style.overflow = 'hidden'; // Evita scroll do fundo no mobile
  };

  const closeMenu = () => {
    navMenu.classList.remove('is-open');
    if (navBackdrop) navBackdrop.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
    if (toggleIcon) toggleIcon.src = 'assets/icons/menu.svg';
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Fecha ao clicar no backdrop escurecido
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  // Fecha o menu ao clicar em qualquer item de navegação
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  });

  // Fecha se clicar fora da gaveta de navegação
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('is-open')) {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Fecha menu se pressionar ESC e restaura o foco no botão
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Fecha menu se a tela for redimensionada para desktop (> 768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/**
 * 3. Destaque do link ativo na navegação via IntersectionObserver
 */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * 4. Tratamento suave de rolagem e compensação de offset do header
 */
function initSmoothScrollLinks() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.site-header');

  internalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Atualiza URL no navegador sem salto brusco
        history.pushState(null, '', targetId);
      }
    });
  });
}

/**
 * 5. Lightbox Modal para Galeria de Infraestrutura
 */
function initGalleryLightbox() {
  const modal = document.getElementById('gallery-lightbox');
  if (!modal) return;

  const modalImg = modal.querySelector('.gallery-modal-img');
  const modalTitle = modal.querySelector('.gallery-modal-title');
  const modalDesc = modal.querySelector('.gallery-modal-desc');
  const closeBtn = modal.querySelector('.gallery-modal-close');

  const galleryItems = document.querySelectorAll('.infra-media-container');

  const openLightbox = (imgSrc, altText, titleText, descText) => {
    if (modalImg) {
      modalImg.src = imgSrc;
      modalImg.alt = altText;
    }
    if (modalTitle) modalTitle.textContent = titleText;
    if (modalDesc) modalDesc.textContent = descText;

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((container) => {
    container.addEventListener('click', () => {
      const img = container.querySelector('img.infra-image');
      const card = container.closest('.infra-card');
      const title = card ? card.querySelector('.infra-title')?.textContent : '';
      const desc = card ? card.querySelector('.infra-desc')?.textContent : '';

      if (img) {
        openLightbox(img.src, img.alt, title, desc);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeLightbox();
    }
  });
}

