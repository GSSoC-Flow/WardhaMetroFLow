document.addEventListener("DOMContentLoaded", function() {
    // 1. Fetch and inject the navbar
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    
    if (navbarPlaceholder) {
        // CORRECTED PATH: Use a relative path to go up from 'scripts' then down to 'components'
        fetch('../components/navbar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                navbarPlaceholder.innerHTML = html;
                // 2. After navbar is loaded, set the active link
                setActiveNavLink();
            })
            .catch(error => {
                console.error('Error fetching the navbar:', error);
                navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Error: Could not load the navigation bar.</p>';
            });
    }

    // Function to find the current page and add the 'active' class to the corresponding link
    function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.main-nav a.nav-link');
        const currentPagePath = window.location.pathname;

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            // Match based on the filename
            const pageName = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1);
            if (link.href.includes(pageName)) {
                link.classList.add('active');
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    
    // The path starts with "/" to look from the site's root
    const footerPath = '../components/footer.html';

    fetch(footerPath)
        .then(response => response.text())
        .then(data => {
            // Find the placeholder and inject the footer HTML
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
            }document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Load Reusable Components (Navbar & Footer) ---

    // Function to fetch and inject a component
    function loadComponent(path, placeholderId) {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return; // Exit if the placeholder doesn't exist

        fetch(path)
            .then(response => {
                if (!response.ok) throw new Error(`Could not load ${path}`);
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                
                // If the navbar was just loaded, initialize its interactive features
                if (placeholderId === 'navbar-placeholder') {
                    initializeNavbar();
                }
            })
            .catch(error => {
                console.error(`Error fetching component:`, error);
                placeholder.innerHTML = `<p style="text-align:center; color:red;">Could not load content.</p>`;
            });
    }

    // Load the navbar and footer
    loadComponent('../components/navbar.html', 'navbar-placeholder');
    loadComponent('../components/footer.html', 'footer-placeholder');


    // --- 2. Initialize All Navbar-Related Functionality ---

    function initializeNavbar() {
        
        // a. Highlight the active page link
        const navLinks = document.querySelectorAll('.main-nav a.nav-link');
        const currentPagePath = window.location.pathname;

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            // Check if the link's path is part of the current URL's path
            if (currentPagePath.includes(linkPath) && linkPath.length > 1) { // length > 1 to avoid matching just "/"
                 link.classList.add('active');
            }
        });
        // Special case for the home link
        if (currentPagePath.endsWith('/') || currentPagePath.endsWith('landing.html')) {
            document.querySelector('a[href="../landing/landing.html"]').classList.add('active');
        }

        // b. Handle the mobile "hamburger" menu toggle
        const hamburger = document.querySelector('.hamburger-menu');
        const navList = document.querySelector('#main-nav-list');

        if (hamburger && navList) {
            hamburger.addEventListener('click', () => {
                navList.classList.toggle('nav-open');
                const isExpanded = navList.classList.contains('nav-open');
                hamburger.setAttribute('aria-expanded', isExpanded);
            });
        }
    }
});
        })
        .catch(error => {
            console.error('Error fetching the footer:', error);
        });
});

