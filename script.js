// Étape 1 : l'animation du rideau
document.addEventListener('DOMContentLoaded', () => {
    const left = document.getElementById('curtain-left');
    const right = document.getElementById('curtain-right');

    function openCurtain() {
      left.classList.add('open');
      right.classList.add('open');
    }

    const delay = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--delay')) || 300;
    setTimeout(openCurtain, delay);})


// Étape 2 : passer à l'accueil
document.getElementById('enter-btn').addEventListener('click', () => {
  document.getElementById('logo-screen').style.display = 'none';
  document.getElementById('home').style.display = 'flex';
});

// Étape 3 : Carrousel vidéos
const inner = document.querySelector('.carousel-inner');
const dots = document.querySelectorAll('.dot');
let index = 0;
const total = dots.length;

function updateCarousel() {
  inner.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(d => d.classList.remove('active'));
  dots[index].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    index = Number(dot.dataset.index);
    updateCarousel();
  });
});

setInterval(() => {
  index = (index + 1) % total;
  updateCarousel();
}, 10000);
