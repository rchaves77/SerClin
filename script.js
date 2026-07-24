/* ==========================================================================
   Instituto SerClin — Single Page JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion Interaction
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Fechar todos os outros itens atritos
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Alternar o atual
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // 2. Menu Mobile Toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });
  }

  // 3. Scroll Reveal Animação com IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.pillar-card, .step-card, .testimonial-card, .plan-card, .guarantee-box');
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    revealObserver.observe(el);
  });

  // Listener para classe revealed
  document.addEventListener('scroll', () => {
    document.querySelectorAll('.revealed').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
});
