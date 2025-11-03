// Étape 1 : l'animation du rideau
document.addEventListener('DOMContentLoaded', () => {
  const left = document.getElementById('curtain-left');
  const right = document.getElementById('curtain-right');

  function openCurtain() {
    left.classList.add('open');
    right.classList.add('open');
  }

  const delay = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--delay')) || 300;
  setTimeout(openCurtain, delay);
})


// Étape 2 : passer à l'accueil
document.getElementById('enter-btn').addEventListener('click', async () => {
  document.getElementById('logo-screen').style.display = 'none';
  document.querySelector('main').style.display = 'block';
  document.querySelector('footer').style.display = 'flex';
  document.querySelector('header').style.display = 'flex';

});

// Animation de la frise chronologique
const cards = document.querySelectorAll('.card_timeline');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});
cards.forEach(card => observer.observe(card));
