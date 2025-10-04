// navbar-loader.js
// Dynamically loads English or Marathi navbar into the #navbar-placeholder

document.addEventListener('DOMContentLoaded', function() {
    var navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) return;

    // Determine which navbar to load based on URL or language indicator
    var path = window.location.pathname.toLowerCase();
    var isMarathiPage = path.includes('marathi.html') || path.includes('/mr/');

    var navbarFile = isMarathiPage ? '../components/navbar-marathi.html' : '../components/navbar.html';

    fetch(navbarFile)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Navbar HTML not found: ' + navbarFile);
            }
            return response.text();
        })
        .then(function(html) {
            navbarPlaceholder.innerHTML = html;
            // Optionally initialize any navbar JS events here if required
        })
        .catch(function(error) {
            console.error('Error loading navbar:', error);
            navbarPlaceholder.innerHTML = '<p>Navbar could not be loaded.</p>';
        });
});

// footer-loader.js - dynamically loads Marathi or English footer

document.addEventListener('DOMContentLoaded', function() {
    var footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    var path = window.location.pathname.toLowerCase();
    var isMarathiPage = path.includes('marathi.html') || path.includes('/mr/');

    var footerFile = isMarathiPage ? '../components/footer-marathi.html' : '../components/footer.html';

    fetch(footerFile)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Footer HTML not found: ' + footerFile);
            }
            return response.text();
        })
        .then(function(html) {
            footerPlaceholder.innerHTML = html;
        })
        .catch(function(error) {
            console.error('Error loading footer:', error);
            footerPlaceholder.innerHTML = '<p>Footer could not be loaded.</p>';
        });
});

