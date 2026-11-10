/**
 * ENSINA AÍ - Instituição de Ensino
 * Lógica da Seção de Perguntas Frequentes (FAQ) (js/faq.js)
 * JavaScript Vanilla (ES6+) - Interação de Abrir e Fechar Respostas
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
});

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros itens para manter o accordion limpo (opcional e elegante)
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          otherItem.classList.remove('is-open');
        }
      });

      // Alterna o estado do item clicado
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
        item.classList.remove('is-open');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
      }
    });
  });

  // Reajusta a altura de resposta aberta caso a janela seja redimensionada ou rotacionada
  window.addEventListener('resize', () => {
    const openItem = document.querySelector('.faq-item.is-open .faq-answer');
    if (openItem) {
      openItem.style.maxHeight = openItem.scrollHeight + 32 + 'px';
    }
  });
}

