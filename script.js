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
});


// Étape 2 : passer à l'accueil
document.addEventListener('DOMContentLoaded', () => {
  const enterBtn = document.getElementById('enter-btn');
  if (enterBtn) {
    enterBtn.addEventListener('click', async () => {
      document.getElementById('logo-screen').style.display = 'none';
      document.querySelector('header').style.display = 'flex';
      document.querySelector('main').style.display = 'block';
      document.querySelector('footer').style.display = 'flex';
    });
  }
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

// Modale des mentions légales - avec délégation d'événements
let modale = document.querySelector('.modale-mentions');
let btnMentions = document.getElementById('mentionsLegales');

btnMentions.addEventListener('click', () => {
  modale.classList.remove('hide');
  modale.classList.add('show');
});

document.getElementById('close-legales').addEventListener('click', () => {
  modale.classList.add('hide');
  setTimeout(() => modale.classList.remove('show', 'hide'), 500);
});

// Fermer en cliquant en dehors du contenu
window.addEventListener('click', (e) => {
  if (e.target === modale) {
    modale.classList.add('hide');
    setTimeout(() => modale.classList.remove('show', 'hide'), 500);
  }
});


document.addEventListener('DOMContentLoaded', () => {
    // GESTIONNAIRE D'ONGLETS (TABS)
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Désactiver tous les boutons et contenus
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // 2. Activer le bouton cliqué
            button.classList.add('active');

            // 3. Activer le contenu correspondant
            const targetTabId = button.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTabId);
            
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});