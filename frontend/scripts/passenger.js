// Metro station data with coordinates and connections

const stations = {
  'datta-Meghe-Institute': {
    name: 'Datta Meghe Institute',
    coordinates: [20.7111655, 78.574074],
    connections: ['sawangi'],
    type: 'regular'
  },
  'sawangi': {
    name: 'Sawangi',
    coordinates: [20.7214195, 78.5768308],
    connections: ['datta-Meghe-Institute', 'master-colony'],
    type: 'regular'
  },
  'master-colony': {
    name: 'Master Colony',
    coordinates: [20.7271472, 78.5850694],
    connections: ['sawangi', 'wardha-junction'],
    type: 'regular'
  },
  'bajaj-square': {
    name: 'Bajaj Square',
    coordinates: [20.7356644, 78.5985736],
    connections: ['wardha-junction', 'civil-lines'],
    type: 'regular'
  },
  'civil-lines': {
    name: 'Civil Lines',
    coordinates: [20.7444112, 78.6092445],
    connections: ['bajaj-square', 'midc', 'dhuniwala-math'],
    type: 'regular'
  },
  'MIDC': {
    name: 'MIDC',
    coordinates: [20.7407753, 78.6268908],
    connections: ['civil-lines', 'mahatma-gandhi-institute'],
    type: 'regular'
  },
  'mahatma-gandhi-institute': {
    name: 'Mahatma Gandhi Institute',
    coordinates: [20.7395282, 78.6521638],
    connections: ['MIDC'],
    type: 'regular'
  },
  'hindi-vishwa-vidyalaya': {
    name: 'Hindi Vishwa Vidyalaya',
    coordinates: [20.7644706, 78.5820438],
    connections: ['pratab-nagar'],
    type: 'regular'
  },
  'pratab-nagar': {
    name: 'Pratab Nagar',
    coordinates: [20.7551015, 78.5782331],
    connections: ['ram-nagar', 'hindi-vishwa-vidyalaya'],
    type: 'regular'
  },
  'ram-nagar': {
    name: 'Ram Nagar',
    coordinates: [20.7404718, 78.5868584],
    connections: ['pratab-nagar', 'wardha-junction'],
    type: 'regular'
  },
  'wardha-junction': {
    name: 'Wardha Junction',
    coordinates: [20.7310431, 78.5923619],
    connections: ['master-colony', 'bajaj-square', 'ram-nagar', 'borgaon'],
    type: 'regular'
  },
  'borgaon': {
    name: 'Borgaon',
    coordinates: [20.7240709, 78.6020207],
    connections: ['wardha-junction', 'dmart'],
    type: 'regular'
  },
  'dmart': {
    name: 'Dmart',
    coordinates: [20.7147015, 78.605335],
    connections: ['borgaon'],
    type: 'regular'
  },
  'bajaj-institute-of-technology': {
    name: 'Bajaj Institute of Technology',
    coordinates: [20.7823326, 78.5915407],
    connections: ['hanuman-tekdi'],
    type: 'regular'
  },
  'tukdoji-maharaj-square': {
    name: 'Tukdoji Maharaj Square',
    coordinates: [20.7569655, 78.6009944],
    connections: ['dhuniwala-math', 'hanuman-tekdi'],
    type: 'regular'
  },
  'dhuniwala-math': {
    name: 'Dhuniwala Math',
    coordinates: [20.7530008, 78.6129591],
    connections: ['tukdoji-maharaj-square', 'civil-lines'],
    type: 'regular'
  },
  'hanuman-tekdi': {
    name: 'Hanuman Tekdi',
    coordinates: [20.768315, 78.5982003],
    connections: ['tukdoji-maharaj-square', 'bajaj-institute-of-technology'],
    type: 'regular'
  }
}
// Route finding function
function findRoute() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const departureTime = document.getElementById('departure-time').value;

    if (!source || !destination) {
        alert('Please select both source and destination stations');
        return;
    }

    if (source === destination) {
        alert('Source and destination cannot be the same');
        return;
    }
    
    // Check for past or invalid departure time
    const selectedTime = new Date(departureTime);
    const now = new Date();
    if (isNaN(selectedTime.getTime()) || selectedTime < now) {
        alert('Please select a valid future departure time.');
        return;
    }

    const findRouteBtn = document.getElementById('find-route-btn');
    const originalText = findRouteBtn.innerHTML;
    findRouteBtn.innerHTML = '<span class="loading"></span> Finding Routes...';
    findRouteBtn.disabled = true;

    setTimeout(async() => {
        const routes = await calculateRoutes(source, destination);
        displayRoutes(routes);
        updateRouteMap(source, destination, routes);
        findRouteBtn.innerHTML = originalText;
        findRouteBtn.disabled = false;

        document.getElementById('route-results').style.display = 'block';
        document.getElementById('route-results').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}

// Calculate possible routes
async function calculateRoutes(source, destination) {
    const routes = [];
    if (source === 'wardha-central' && destination === 'industrial') {
        routes.push({
            id: 1,
            title: 'Direct Route via Railway Station',
            type: 'Fastest',
            stops: 3,
            time: '18 min',
            distance: '2.8 km',
            fare: '₹25',
            eta: '8:45 AM',
            route: ['wardha-central', 'railway-station', 'hospital', 'industrial']
        });
        routes.push({
            id: 2,
            title: 'Alternative Route via Market Square',
            type: 'Scenic',
            stops: 4,
            time: '22 min',
            distance: '3.1 km',
            fare: '₹25',
            eta: '8:49 AM',
            route: ['wardha-central', 'market-square', 'college', 'industrial']
        });
    } else if (source === 'railway-station' && destination === 'college') {
        routes.push({
            id: 1,
            title: 'Direct Route via Hospital',
            type: 'Fastest',
            stops: 2,
            time: '12 min',
            distance: '1.9 km',
            fare: '₹20',
            eta: '8:39 AM',
            route: ['railway-station', 'hospital', 'college']
        });
    } else {
        // retrieve stations data from existing JSON 
         const sourceStation = stations[source];
         const destStation = stations[destination];
        routes.push({
            id: 1,
            title: `Route from ${sourceStation.name} to ${destStation.name}`,
            type: 'Standard',
            stops: Math.floor(Math.random() * 3) + 2,
            time: `${Math.floor(Math.random() * 15) + 10} min`,
            distance: `${(Math.random() * 2 + 1).toFixed(1)} km`,
            fare: `₹${Math.floor(Math.random() * 10) + 15}`,
            eta: '8:42 AM',
            route: [source, destination]
        });
    }

    return routes;
}

// Display route cards
function displayRoutes(routes) {
    const routesList = document.getElementById('routes-list');
    routesList.innerHTML = '';

    routes.forEach(route => {
        const routeCard = document.createElement('div');
        routeCard.className = 'route-card fade-in';
        routeCard.innerHTML = `
            <div class="route-header">
                <div class="route-title">${route.title}</div>
                <div class="route-badge">${route.type}</div>
            </div>
            <div class="route-details">
                <div class="detail-item"><i class="fas fa-clock"></i>
                    <div><div class="detail-label">Travel Time</div><div class="detail-value">${route.time}</div></div>
                </div>
                <div class="detail-item"><i class="fas fa-map-marker-alt"></i>
                    <div><div class="detail-label">Stops</div><div class="detail-value">${route.stops}</div></div>
                </div>
                <div class="detail-item"><i class="fas fa-route"></i>
                    <div><div class="detail-label">Distance</div><div class="detail-value">${route.distance}</div></div>
                </div>
                <div class="detail-item"><i class="fas fa-ticket-alt"></i>
                    <div><div class="detail-label">Fare</div><div class="detail-value">${route.fare}</div></div>
                </div>
                <div class="detail-item"><i class="fas fa-calendar-check"></i>
                    <div><div class="detail-label">ETA</div><div class="detail-value">${route.eta}</div></div>
                </div>
            </div>
            <div class="route-actions">
                <button class="btn btn-secondary" onclick="selectRoute(${route.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <button class="btn btn-primary" onclick="bookTicket(${route.id})">
                    <i class="fas fa-ticket-alt"></i> Book Ticket
                </button>
            </div>
        `;
        routesList.appendChild(routeCard);
    });
}

// Update map placeholder
function updateRouteMap(source, destination, routes) {
    const mapContainer = document.getElementById('route-map');
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <i class="fas fa-route"></i>
            <p>Route from ${stations[source].name}</p>
            <p>to ${stations[destination].name}</p>
            <p style="font-size: 1rem; margin-top: 1rem; color: var(--success-color);">
                ${routes.length} route(s) found
            </p>
        </div>
    `;
}

// Select route handler
function selectRoute(routeId) {
    alert(`Route ${routeId} selected. Detailed view will be implemented with backend integration.`);
}

// Ticket booking handler
function bookTicket(routeId) {
    alert(`Booking ticket for Route ${routeId}. Payment gateway will be integrated with backend.`);
}

// Feedback form logic
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', () => {
    initializeFeedbackForm();

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    document.getElementById('departure-time').value = now.toISOString().slice(0, 16);

    document.querySelectorAll('section').forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

function initializeFeedbackForm() {
    const stars = document.querySelectorAll('.rating-stars i');
    const ratingText = document.querySelector('.rating-text');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            selectedRating = rating;
            updateStarDisplay(rating);
            updateRatingText(rating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            updateStarDisplay(rating);
        });

        star.addEventListener('mouseleave', () => {
            updateStarDisplay(selectedRating);
        });
    });

    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmission);
    }
}

function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function updateRatingText(rating) {
    const descriptions = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    document.querySelector('.rating-text').textContent = descriptions[rating] || 'Click to rate';
}

function handleFeedbackSubmission(event) {
    event.preventDefault();

    const feedbackData = {
        type: document.getElementById('feedback-type').value,
        category: document.getElementById('feedback-category').value,
        station: document.getElementById('feedback-station').value,
        description: document.getElementById('feedback-description').value,
        rating: selectedRating,
        contact: document.getElementById('feedback-contact').value,
        anonymous: document.getElementById('feedback-anonymous').checked,
        timestamp: new Date().toISOString()
    };

    if (!feedbackData.type || !feedbackData.category || !feedbackData.description || selectedRating === 0) {
        showFeedbackMessage('Please fill in all required fields and provide a rating.', 'error');
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
        const existingFeedback = JSON.parse(localStorage.getItem('wardhaMetroFeedback') || '[]');
        existingFeedback.push(feedbackData);
        localStorage.setItem('wardhaMetroFeedback', JSON.stringify(existingFeedback));

        showThankYouPopup();
        resetFeedbackForm();

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function resetFeedbackForm() {
    const form = document.getElementById('feedback-form');
    form.reset();
    selectedRating = 0;
    updateStarDisplay(0);
    updateRatingText(0);
    document.querySelectorAll('.success-message, .error-message').forEach(msg => msg.remove());
}

function showFeedbackMessage(message, type) {
    document.querySelectorAll('.success-message, .error-message').forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.style.display = 'flex';
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    const form = document.getElementById('feedback-form');
    form.insertBefore(messageDiv, form.firstChild);

    if (type === 'success') {
        setTimeout(() => messageDiv.remove(), 5000);
    }
}

// Thank You Popup
function showThankYouPopup() {
    const popupHTML = `
        <div class="thank-you-popup" id="thankYouPopup">
            <div class="thank-you-content">
                <div class="thank-you-icon"><i class="fas fa-heart"></i></div>
                <h2 class="thank-you-title">Thank You!</h2>
                <p class="thank-you-message">
                    Your feedback has been submitted successfully. We appreciate your input and will use it to improve our services.
                </p>
                <button class="thank-you-btn" onclick="closeThankYouPopup()">
                    <i class="fas fa-check"></i> Got it!
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    setTimeout(() => {
        document.getElementById('thankYouPopup').classList.add('show');
    }, 100);
}

function closeThankYouPopup() {
    const popup = document.getElementById('thankYouPopup');
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
}
