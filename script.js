const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelector('[data-year]').textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
}));

const sections = document.querySelectorAll('main section[id]');
const navigationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
sections.forEach((section) => navigationObserver.observe(section));

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  const tiltCard = document.querySelector('[data-tilt-card]');
  tiltCard?.addEventListener('pointermove', (event) => {
    const bounds = tiltCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    tiltCard.style.setProperty('--tilt-x', `${x * -5}px`);
    tiltCard.style.setProperty('--tilt-y', `${y * -5}px`);
    tiltCard.style.setProperty('--tilt-r', `${x * 1.4}deg`);
  });

  tiltCard?.addEventListener('pointerleave', () => {
    tiltCard.style.removeProperty('--tilt-x');
    tiltCard.style.removeProperty('--tilt-y');
    tiltCard.style.removeProperty('--tilt-r');
  });
}

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const toast = document.querySelector('.toast');
let toastTimer;
document.querySelector('[data-whatsapp]')?.addEventListener('click', () => {
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
});

const topicButtons = [...document.querySelectorAll('[data-contact-topic]')];
const emailContact = document.querySelector('[data-email-contact]');
const whatsappContact = document.querySelector('[data-whatsapp]');
const contactStatus = document.querySelector('[data-contact-status]');

topicButtons.forEach((button) => button.addEventListener('click', () => {
  const subject = button.dataset.subject;
  const message = button.dataset.message;

  topicButtons.forEach((topic) => {
    const isSelected = topic === button;
    topic.classList.toggle('is-selected', isSelected);
    topic.setAttribute('aria-pressed', String(isSelected));
  });

  emailContact?.setAttribute('href', `mailto:adhityamr0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`);
  whatsappContact?.setAttribute('href', `https://wa.me/919940582355?text=${encodeURIComponent(message)}`);
  if (contactStatus) contactStatus.textContent = `Ready to talk about ${button.textContent.trim().toLowerCase()}.`;
}));

document.querySelector('[data-print-resume]')?.addEventListener('click', () => window.print());
