// Search functionality
const searchInput = document.getElementById('searchInput');
const jobCards = document.querySelectorAll('.job-card');
const noResults = document.getElementById('noResults');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let visibleCount = 0;

    jobCards.forEach(card => {
        const keywords = card.getAttribute('data-keywords');
        const title = card.querySelector('.job-title').textContent.toLowerCase();
        const description = card.querySelector('.job-description').textContent.toLowerCase();
        const location = card.querySelector('.job-location').textContent.toLowerCase();

        if (keywords.includes(searchTerm) || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) ||
            location.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
});

// Modal functionality
const modal = document.getElementById('applicationModal');
const modalTitle = document.getElementById('modalTitle');

function openModal(jobTitle) {
    modalTitle.textContent = `Apply for ${jobTitle}`;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openContactModal() {
    alert('Redirecting to contact page...\n\nYou can reach us at:\n📧 careers@wardhametroflow.org\n☎️ +91 98765 43210');
}

function submitApplication(e) {
    e.preventDefault();
    alert('Thank you for your application! Our HR team will review your submission and contact you soon.');
    closeModal();
    e.target.reset();
}

// Close modal on outside click
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Animate steps on scroll
const steps = document.querySelectorAll('.step');
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        }
    });
}, observerOptions);

steps.forEach(step => {
    observer.observe(step);
});