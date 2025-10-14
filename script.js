// Étape 1 : transition bisou -> logo
window.addEventListener('load', () => {
  // attendre que l'animation du bisou soit terminée
  setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
    const logoScreen = document.getElementById('logo-screen');
    logoScreen.classList.add('show');
  }, 3200); // légèrement augmenté pour laisser l'animation finir
});

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
