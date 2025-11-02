document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('hidden');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(c => io.observe(c));
});

