
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
      document.querySelector('main').style.display = 'block';
      document.querySelector('footer').style.display = 'flex';
      document.querySelector('header').style.display = 'flex';
    });
  }
});

// Modale des mentions légales - avec délégation d'événements
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', function(e) {
    // Ouvrir la modale
    if (e.target.id === 'btn-legales' || e.target.closest('#btn-legales')) {
      e.preventDefault();
      const modale = document.getElementById('modale-legales');
      if (modale) {
        modale.style.display = 'flex';
      }
    }
    
    // Fermer avec le bouton
    if (e.target.id === 'close-legales') {
      const modale = document.getElementById('modale-legales');
      if (modale) {
        modale.style.display = 'none';
      }
    }
    
    // Fermer en cliquant à l'extérieur
    if (e.target.id === 'modale-legales') {
      e.target.style.display = 'none';
    }
  });
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

    // Gestion de l'ouverture/fermeture de la modale (à conserver)
    const btnLegales = document.getElementById('btn-legales'); 
    const modaleLegales = document.getElementById('modale-legales');
    const closeLegalesBtn = document.getElementById('close-legales');

    if (btnLegales) {
        btnLegales.addEventListener('click', () => {
            modaleLegales.style.display = 'flex';
        });
    }

    if (closeLegalesBtn) {
        closeLegalesBtn.addEventListener('click', () => {
            modaleLegales.style.display = 'none';
        });
    }
});