// Initial blog data with sample posts
let blogs = [
  {
    id: 1,
    title: "AI-Powered Traffic Management System Launch",
    author: "Dr. Rajesh Kumar",
    date: "2025-10-15",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800",
    preview: "Wardha Metro introduces cutting-edge AI systems to optimize traffic flow and reduce commute times by 40%. The new system uses machine learning algorithms to predict and prevent congestion.",
    content: "Wardha Metro has successfully implemented an advanced AI-powered traffic management system that revolutionizes urban transportation. The system uses real-time data analytics, machine learning algorithms, and predictive modeling to optimize metro operations.\n\nEarly results show a 40% reduction in average commute times and a 60% improvement in schedule adherence. The AI system can predict peak hours, adjust train frequencies automatically, and provide real-time updates to commuters through mobile applications.\n\nThis groundbreaking technology represents a major step forward in smart city infrastructure and sets a new standard for public transportation efficiency.",
    likes: 42,
    likedBy: [],
    comments: [
      { author: "Priya Sharma", date: "2025-10-16", text: "This is amazing! My daily commute has improved significantly." },
      { author: "Amit Patel", date: "2025-10-16", text: "Great initiative. Looking forward to more tech innovations!" }
    ]
  },
  {
    id: 2,
    title: "Solar Power Integration: 100% Green Metro Achieved",
    author: "Engineer Meera Singh",
    date: "2025-10-10",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    preview: "Wardha becomes the first city in the region to run its entire metro network on renewable solar energy. This milestone reduces carbon emissions by thousands of tons annually.",
    content: "In a historic achievement, Wardha Metro has successfully transitioned to 100% solar-powered operations. The metro network now runs entirely on renewable energy, with 50,000 solar panels installed across station rooftops and depot facilities.\n\nThis green initiative eliminates approximately 15,000 tons of CO2 emissions annually and reduces operational costs by 35%. The project serves as a model for sustainable urban transportation and demonstrates our commitment to environmental responsibility.\n\nThe solar infrastructure includes battery storage systems that ensure uninterrupted operations even during cloudy days, making this a truly reliable and sustainable solution.",
    likes: 89,
    likedBy: [],
    comments: []
  },
  {
    id: 3,
    title: "New Metro Line Extension: Connecting 5 More Districts",
    author: "Planning Commissioner Vikram Desai",
    date: "2025-10-05",
    category: "Planning",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
    preview: "Major expansion announced with new metro lines reaching suburban areas. Construction begins next month with completion expected by 2027.",
    content: "The Wardha Metro Board has approved an ambitious expansion project that will extend metro connectivity to five additional districts. The new Phase 3 development includes 45 kilometers of track, 32 new stations, and is expected to serve an additional 500,000 daily commuters.\n\nThe project incorporates smart station designs with integrated shopping complexes, parking facilities, and last-mile connectivity solutions. Each new station will feature green spaces, digital information systems, and accessibility features for all users.\n\nConstruction is scheduled to begin next month with a projected completion date of December 2027. This expansion will significantly improve urban mobility and reduce traffic congestion throughout the metropolitan area.",
    likes: 67,
    likedBy: [],
    comments: [
      { author: "Sneha Reddy", date: "2025-10-06", text: "Finally! We've been waiting for this extension for years." }
    ]
  },
  {
    id: 4,
    title: "Smart Ticketing System: Contactless Payment Goes Live",
    author: "Tech Lead Arun Verma",
    date: "2025-10-01",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    preview: "Launch of contactless payment system supporting UPI, cards, and mobile wallets. Say goodbye to physical tickets and queues.",
    content: "Wardha Metro introduces a state-of-the-art smart ticketing system that eliminates the need for physical tickets. Commuters can now use UPI, credit/debit cards, mobile wallets, and NFC-enabled devices for seamless entry and exit.\n\nThe system features automatic fare calculation based on distance traveled, monthly pass integration, and loyalty rewards. Average boarding time has reduced from 45 seconds to just 8 seconds per passenger, significantly improving station throughput during peak hours.\n\nThe mobile app also provides real-time train tracking, journey planning, and digital receipts for all transactions. This modernization represents a major step toward creating a completely cashless and efficient public transportation system.",
    likes: 125,
    likedBy: [],
    comments: [
      { author: "Rahul Joshi", date: "2025-10-02", text: "Super convenient! No more fumbling for change." },
      { author: "Anjali Gupta", date: "2025-10-03", text: "The app is user-friendly and works perfectly." }
    ]
  }
];

let currentBlogId = null;
let likedPosts = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  createFloatingParticles();
  renderBlogs();
  updateStats();
  initAOS();
  setupEventListeners();
});

// Create floating particles background effect
function createFloatingParticles() {
  const particlesBg = document.getElementById('particlesBg');
  if (!particlesBg) return;
  
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(234, 88, 12, 0.6), transparent);
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: float ${duration}s ease-in-out infinite;
      animation-delay: ${delay}s;
    `;
    particlesBg.appendChild(particle);
  }
  
  // Add floating animation styles
  if (!document.getElementById('floatAnimationStyle')) {
    const style = document.createElement('style');
    style.id = 'floatAnimationStyle';
    style.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translate(0, 0) scale(1);
          opacity: 0.3;
        }
        25% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
          opacity: 0.6;
        }
        50% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1);
          opacity: 0.4;
        }
        75% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize Animate On Scroll effects
function initAOS() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
}

// Setup all event listeners
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debouncedSearch);
  }
  
  // Category filter
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', renderBlogs);
  }
  
  // Create post form
  const createForm = document.getElementById('createPostForm');
  if (createForm) {
    createForm.addEventListener('submit', handleCreatePost);
  }
  
  // Comment input (Enter key)
  const commentInput = document.getElementById('commentInput');
  if (commentInput) {
    commentInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addComment();
      }
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  // Parallax scrolling
  window.addEventListener('scroll', handleParallaxScroll);
}

// Update header statistics
function updateStats() {
  const totalPostsEl = document.getElementById('totalPosts');
  if (totalPostsEl) {
    animateValue('totalPosts', 0, blogs.length, 1000);
  }
}

// Animate number counting
function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  if (!element) return;
  
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Render blog cards with filtering
function renderBlogs() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm) ||
      blog.preview.toLowerCase().includes(searchTerm) ||
      blog.author.toLowerCase().includes(searchTerm) ||
      blog.content.toLowerCase().includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (filteredBlogs.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>🔍 No articles found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredBlogs
    .map((blog, index) => `
      <div class="blog-card" onclick="openModal(${blog.id})" style="animation-delay: ${index * 0.1}s">
        <img src="${blog.image}" alt="${escapeHtml(blog.title)}" class="blog-image" loading="lazy">
        <div class="blog-content">
          <div class="blog-meta">
            <span>👤 ${escapeHtml(blog.author)}</span>
            <span>📅 ${formatDate(blog.date)}</span>
          </div>
          <span class="blog-category">${getCategoryIcon(blog.category)} ${blog.category}</span>
          <h3 class="blog-title">${escapeHtml(blog.title)}</h3>
          <p class="blog-preview">${escapeHtml(blog.preview)}</p>
          <div class="blog-footer">
            <div class="blog-actions">
              <button class="action-btn ${likedPosts[blog.id] ? 'liked' : ''}" 
                onclick="event.stopPropagation(); likePost(${blog.id});"
                aria-label="Like post">
                ${likedPosts[blog.id] ? '❤️' : '🤍'} ${blog.likes}
              </button>
            </div>
            <button class="read-more" onclick="event.stopPropagation(); openModal(${blog.id});">
              Read More →
            </button>
          </div>
        </div>
      </div>
    `)
    .join('');
  
  // Add fade-in animation to cards
  document.querySelectorAll('.blog-card').forEach((card, index) => {
    card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
  });
}

// Get category icon emoji
function getCategoryIcon(category) {
  const icons = {
    'Technology': '🤖',
    'Updates': '📰',
    'Infrastructure': '🏗️',
    'Sustainability': '🌱',
    'Planning': '📊'
  };
  return icons[category] || '📝';
}

// Format date to readable string
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Open blog post modal
function openModal(id) {
  const modal = document.getElementById('blogModal');
  const blog = blogs.find(b => b.id === id);
  if (!blog || !modal) return;
  
  currentBlogId = id;

  // Populate modal content
  document.getElementById('modalImage').src = blog.image;
  document.getElementById('modalTitle').textContent = blog.title;
  document.getElementById('modalAuthor').textContent = blog.author;
  document.getElementById('modalDate').textContent = formatDate(blog.date);
  document.getElementById('modalCategory').textContent = `${getCategoryIcon(blog.category)} ${blog.category}`;
  document.getElementById('modalLikes').textContent = blog.likes;
  document.getElementById('modalText').textContent = blog.content;

  renderComments(blog);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  const modal = document.getElementById('blogModal');
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  currentBlogId = null;
}

// Like/unlike post with animation
function likePost(id) {
  const blog = blogs.find(b => b.id === id);
  if (!blog) return;
  
  if (likedPosts[id]) {
    blog.likes--;
    likedPosts[id] = false;
  } else {
    blog.likes++;
    likedPosts[id] = true;
    
    // Create floating heart animation
    if (event) {
      createHeartAnimation(event);
    }
  }
  
  renderBlogs();
  if (currentBlogId === id) {
    const modalLikes = document.getElementById('modalLikes');
    if (modalLikes) {
      modalLikes.textContent = blog.likes;
    }
  }
}

// Create floating heart animation
function createHeartAnimation(e) {
  const heart = document.createElement('div');
  heart.textContent = '❤️';
  heart.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    font-size: 2rem;
    pointer-events: none;
    z-index: 9999;
    animation: heartFloat 1s ease-out forwards;
  `;
  document.body.appendChild(heart);
  
  setTimeout(() => heart.remove(), 1000);
}

// Toggle create post form visibility
function toggleCreatePost() {
  const formSection = document.getElementById('createPostSection');
  if (!formSection) return;
  
  const isVisible = formSection.style.display !== 'none';
  formSection.style.display = isVisible ? 'none' : 'block';
  
  if (!isVisible) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Share post functionality
function sharePost() {
  const blog = blogs.find(b => b.id === currentBlogId);
  if (!blog) return;
  
  if (navigator.share) {
    navigator.share({
      title: blog.title,
      text: blog.preview,
      url: window.location.href
    }).catch(() => {
      copyToClipboard();
    });
  } else {
    copyToClipboard();
  }
}

// Copy URL to clipboard
function copyToClipboard() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showNotification('🔗 Link copied to clipboard!');
  }).catch(() => {
    showNotification('❌ Failed to copy link');
  });
}

// Show toast notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.4s ease;
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease';
    setTimeout(() => notification.remove(), 400);
  }, 3000);
}

// Add comment to current blog post
function addComment() {
  const input = document.getElementById('commentInput');
  if (!input) return;
  
  const text = input.value.trim();
  if (text === '') return;

  const blog = blogs.find(b => b.id === currentBlogId);
  if (!blog) return;
  
  blog.comments.push({
    author: 'Guest User',
    date: new Date().toISOString().split('T')[0],
    text: text
  });
  
  input.value = '';
  renderComments(blog);
  showNotification('💬 Comment added successfully!');
}

// Render comments list
function renderComments(blog) {
  const list = document.getElementById('commentsList');
  const countEl = document.getElementById('modalCommentCount');
  
  if (!list || !countEl) return;
  
  countEl.textContent = blog.comments.length;
  
  if (blog.comments.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p>💭 No comments yet. Be the first to share your thoughts!</p>
      </div>
    `;
    return;
  }
  
  list.innerHTML = blog.comments
    .map((c, index) => `
      <div class="comment" style="animation: fadeInUp 0.4s ease ${index * 0.1}s both;">
        <div class="comment-header">
          <span class="comment-author">💬 ${escapeHtml(c.author)}</span>
          <span class="comment-date">${formatDate(c.date)}</span>
        </div>
        <p class="comment-text">${escapeHtml(c.text)}</p>
      </div>
    `)
    .join('');
}

// Handle create post form submission
function handleCreatePost(e) {
  e.preventDefault();
  
  const newPost = {
    id: Date.now(),
    title: document.getElementById('postTitle').value,
    author: document.getElementById('postAuthor').value,
    date: new Date().toISOString().split('T')[0],
    category: document.getElementById('postCategory').value,
    image: document.getElementById('postImage').value,
    preview: document.getElementById('postPreview').value,
    content: document.getElementById('postContent').value,
    likes: 0,
    likedBy: [],
    comments: []
  };
  
  blogs.unshift(newPost);
  toggleCreatePost();
  renderBlogs();
  updateStats();
  
  // Reset form
  document.getElementById('createPostForm').reset();
  
  // Show success notification
  showNotification('🎉 Article published successfully!');
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
  // Close modal with ESC key
  if (e.key === 'Escape') {
    closeModal();
  }
  
  // Navigate between posts in modal
  if (!currentBlogId) return;
  
  const currentIndex = blogs.findIndex(b => b.id === currentBlogId);
  
  if (e.key === 'ArrowLeft' && currentIndex > 0) {
    e.preventDefault();
    openModal(blogs[currentIndex - 1].id);
  } else if (e.key === 'ArrowRight' && currentIndex < blogs.length - 1) {
    e.preventDefault();
    openModal(blogs[currentIndex + 1].id);
  }
}

// Handle parallax scrolling effect
function handleParallaxScroll() {
  const scrolled = window.pageYOffset;
  const header = document.querySelector('.blog-header');
  
  if (header && scrolled < 500) {
    header.style.transform = `translateY(${scrolled * 0.3}px)`;
    header.style.opacity = 1 - (scrolled / 500);
  }
}

// Debounce function for search optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced search function
const debouncedSearch = debounce(() => {
  renderBlogs();
}, 300);

// Lazy load images for performance
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Add cursor trail effect (premium enhancement)
let cursorTrailEnabled = true;
let cursorTrail = [];

document.addEventListener('mousemove', (e) => {
  if (!cursorTrailEnabled || window.innerWidth < 768) return;
  
  if (cursorTrail.length > 10) {
    const oldTrail = cursorTrail.shift();
    if (oldTrail && oldTrail.parentNode) {
      oldTrail.remove();
    }
  }
  
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, rgba(234, 88, 12, 0.4), transparent);
    border-radius: 50%;
    pointer-events: none;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    transform: translate(-50%, -50%);
    animation: trailFade 0.6s ease-out forwards;
    z-index: 9998;
  `;
  document.body.appendChild(trail);
  cursorTrail.push(trail);
  
  setTimeout(() => {
    if (trail.parentNode) {
      trail.remove();
    }
  }, 600);
});

// Add smooth scroll behavior to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Image loading animation
function setupImageLoading() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
  });
}

// Add loading state for better UX
function showLoadingState(element) {
  if (!element) return;
  element.style.opacity = '0.5';
  element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
  if (!element) return;
  element.style.opacity = '1';
  element.style.pointerEvents = 'all';
}

// Store liked posts in memory (would be localStorage in production)
function saveLikedPosts() {
  // In a real application, you would save to localStorage here
  // For this demo, we keep it in memory only
  // localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
}

function loadLikedPosts() {
  // In a real application, you would load from localStorage here
  // likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
}

// Initialize tooltip functionality
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(el => {
    el.addEventListener('mouseenter', function(e) {
      const tooltip = document.createElement('div');
      tooltip.textContent = this.getAttribute('data-tooltip');
      tooltip.className = 'custom-tooltip';
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        pointer-events: none;
        z-index: 10000;
        white-space: nowrap;
      `;
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
      
      this._tooltip = tooltip;
    });
    
    el.addEventListener('mouseleave', function() {
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    });
  });
}

// Performance monitoring (optional)
function monitorPerformance() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['measure'] });
  }
}

// Add reading progress indicator
function initReadingProgress() {
  const modal = document.getElementById('blogModal');
  if (!modal) return;
  
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    z-index: 10001;
    transition: width 0.1s ease;
  `;
  progressBar.id = 'readingProgress';
  modal.appendChild(progressBar);
  
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.addEventListener('scroll', () => {
      const scrollTop = modalContent.scrollTop;
      const scrollHeight = modalContent.scrollHeight - modalContent.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = progress + '%';
    });
  }
}

// Add theme toggle functionality (optional enhancement)
function initThemeToggle() {
  // This would toggle between light/dark themes
  // For now, we're using dark theme only
  const theme = 'dark'; // Could be loaded from localStorage
  document.body.setAttribute('data-theme', theme);
}

// Add error handling for images
function handleImageErrors() {
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.src = 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800';
      e.target.alt = 'Fallback image';
    }
  }, true);
}

// Optimize animations for mobile
function optimizeForMobile() {
  if (window.innerWidth < 768) {
    cursorTrailEnabled = false;
    // Reduce animation complexity on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
  }
}

// Add analytics tracking (placeholder)
function trackEvent(eventName, data = {}) {
  // In production, this would send data to analytics service
  console.log('Event tracked:', eventName, data);
}

// Track user interactions
function setupAnalytics() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.blog-card')) {
      trackEvent('blog_card_clicked', { id: e.target.closest('.blog-card').dataset.id });
    }
    if (e.target.closest('.action-btn')) {
      trackEvent('like_clicked');
    }
    if (e.target.closest('.read-more')) {
      trackEvent('read_more_clicked');
    }
  });
}

// Initialize service worker for offline support (advanced feature)
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    // In production, you would register a service worker here
    // navigator.serviceWorker.register('/sw.js');
  }
}

// Add keyboard accessibility improvements
function enhanceAccessibility() {
  // Add skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#blogGrid';
  skipLink.textContent = 'Skip to content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 10000;
  `;
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
}

// Add print-friendly version
function setupPrintStyles() {
  window.addEventListener('beforeprint', () => {
    // Expand all truncated content for printing
    document.querySelectorAll('.blog-preview').forEach(el => {
      el.style.webkitLineClamp = 'unset';
    });
  });
}

// Initialize all features
function initializeApp() {
  loadLikedPosts();
  initLazyLoading();
  setupImageLoading();
  initTooltips();
  initReadingProgress();
  handleImageErrors();
  optimizeForMobile();
  enhanceAccessibility();
  setupPrintStyles();
  
  // Optional features
  if (process.env.NODE_ENV !== 'production') {
    monitorPerformance();
  }
  
  // Log initialization
  console.log('🚆 Wardha Metro Blog initialized successfully!');
}

// Call initialization
initializeApp();

// Export functions for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    openModal,
    closeModal,
    likePost,
    addComment,
    renderBlogs,
    toggleCreatePost,
    sharePost
  };
}