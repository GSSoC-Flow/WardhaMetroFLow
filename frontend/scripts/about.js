
// for toggle menu

const toggle = document.getElementById("menu-toggle");
const navLinks= document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});



document.addEventListener('DOMContentLoaded', () => {
  const placards = document.querySelectorAll('.placard');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  placards.forEach(placard => revealObserver.observe(placard));

  const carousel = document.querySelector('.carousel');
  let scrollAmount = 0;
  setInterval(() => {
    if (carousel) {
      scrollAmount += 310;
      if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
        scrollAmount = 0;
      }
      carousel.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, 5000);
});
