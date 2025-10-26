// Scroll Progress Bar
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('scrollProgress').style.width = scrolled + '%';
});

// Smooth Scroll for Navigation
document.querySelectorAll('.sidebar a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();

    // Remove active class from all links
    document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));

    // Add active class to clicked link
    this.classList.add('active');

    // Smooth scroll to section
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.sidebar a');

  let current = '';
  sections.forEach(section => {
    // The offsetTop should be compared to a position slightly above the viewport
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Animation on scroll for feature cards and alerts
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .stat-card, .alert').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// Observe stat cards for counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numberElement = entry.target.querySelector('.stat-number');
      const text = numberElement.textContent;
      const isPercentage = text.includes('%');
      const number = parseInt(text.replace(/[^0-9]/g, ''));

      // Reset number for animation
      numberElement.textContent = '0' + (isPercentage ? '%' : '');

      setTimeout(() => {
        let current = 0;
        const increment = number / 50; // 50 steps
        const timer = setInterval(() => {
          current += increment;
          if (current >= number) {
            numberElement.textContent = number + (isPercentage ? '%' : '');
            clearInterval(timer);
          } else {
            numberElement.textContent = Math.floor(current) + (isPercentage ? '%' : '');
          }
        }, 30); // 30ms interval
      }, 200);

      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
  statsObserver.observe(card);
});