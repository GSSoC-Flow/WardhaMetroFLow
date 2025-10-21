// Intersection Observer for fade-in animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in, .fade-in-delay").forEach(el => observer.observe(el));

// Enhanced Counter Animation with easing
function animateCounter(element) {
  const target = +element.getAttribute("data-target");
  const duration = 2000;
  const start = performance.now();
  
  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
  
  const update = (currentTime) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = Math.floor(easedProgress * target);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  };
  
  requestAnimationFrame(update);
}

// Trigger counters when stats section is visible
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".stat-number").forEach(el => {
        if (el.textContent === '0') {
          animateCounter(el);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector(".stats-section");
if (statsSection) statsObserver.observe(statsSection);

// Enhanced Parallax for floating icons
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      document.querySelectorAll(".floating-icons span").forEach((span, i) => {
        const speed = 0.15 + i * 0.08;
        span.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Progress bar
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
});

// Add hover sound effect simulation (visual feedback)
document.querySelectorAll('.feature-card, .team-card, .stat-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  });
});

// Cursor trail effect (optional enhancement)
let cursorTrail = [];
document.addEventListener('mousemove', (e) => {
  if (window.innerWidth > 768) {
    cursorTrail.push({x: e.clientX, y: e.clientY, time: Date.now()});
    if (cursorTrail.length > 10) cursorTrail.shift();
  }
});
