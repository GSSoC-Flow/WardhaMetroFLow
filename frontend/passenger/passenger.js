// Metro station data with coordinates and connections
const stations = {
    'datta-Meghe-Institute': { name: 'Datta Meghe Institute', coordinates: [20.7111655, 78.574074], connections: ['sawangi'], type: 'regular' },
    'sawangi': { name: 'Sawangi', coordinates: [20.7214195, 78.5768308], connections: ['datta-Meghe-Institute', 'master-colony'], type: 'regular' },
    'master-colony': { name: 'Master Colony', coordinates: [20.7271472, 78.5850694], connections: ['sawangi', 'wardha-junction'], type: 'regular' },
    'bajaj-square': { name: 'Bajaj Square', coordinates: [20.7356644, 78.5985736], connections: ['wardha-junction', 'civil-lines'], type: 'regular' },
    'civil-lines': { name: 'Civil Lines', coordinates: [20.7444112, 78.6092445], connections: ['bajaj-square', 'MIDC', 'dhuniwala-math'], type: 'regular' },
    'MIDC': { name: 'MIDC', coordinates: [20.7407753, 78.6268908], connections: ['civil-lines', 'mahatma-gandhi-institute'], type: 'regular' },
    'mahatma-gandhi-institute': { name: 'Mahatma Gandhi Institute', coordinates: [20.7395282, 78.6521638], connections: ['MIDC'], type: 'regular' },
    'hindi-vishwa-vidyalaya': { name: 'Hindi Vishwa Vidyalaya', coordinates: [20.7644706, 78.5820438], connections: ['pratab-nagar'], type: 'regular' },
    'pratab-nagar': { name: 'Pratab Nagar', coordinates: [20.7551015, 78.5782331], connections: ['ram-nagar', 'hindi-vishwa-vidyalaya'], type: 'regular' },
    'ram-nagar': { name: 'Ram Nagar', coordinates: [20.7404718, 78.5868584], connections: ['pratab-nagar', 'wardha-junction'], type: 'regular' },
    'wardha-junction': { name: 'Wardha Junction', coordinates: [20.7310431, 78.5923619], connections: ['master-colony', 'bajaj-square', 'ram-nagar', 'borgaon'], type: 'interchange' },
    'borgaon': { name: 'Borgaon', coordinates: [20.7240709, 78.6020207], connections: ['wardha-junction', 'dmart'], type: 'regular' },
    'dmart': { name: 'Dmart', coordinates: [20.7147015, 78.605335], connections: ['borgaon'], type: 'regular' },
    'bajaj-institute-of-technology': { name: 'Bajaj Institute of Technology', coordinates: [20.7823326, 78.5915407], connections: ['hanuman-tekdi'], type: 'regular' },
    'tukdoji-maharaj-square': { name: 'Tukdoji Maharaj Square', coordinates: [20.7569655, 78.6009944], connections: ['dhuniwala-math', 'hanuman-tekdi'], type: 'regular' },
    'dhuniwala-math': { name: 'Dhuniwala Math', coordinates: [20.7530008, 78.6129591], connections: ['tukdoji-maharaj-square', 'civil-lines'], type: 'regular' },
    'hanuman-tekdi': { name: 'Hanuman Tekdi', coordinates: [20.768315, 78.5982003], connections: ['tukdoji-maharaj-square', 'bajaj-institute-of-technology'], type: 'regular' }
};

// --- PAGE INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    populateStationDropdowns();

    // Set a default departure time 30 mins from now
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    document.getElementById('departure-time').value = now.toISOString().slice(0, 16);

    // Staggered animation for sections
    document.querySelectorAll('section.fade-in').forEach((section, index) => {
        section.style.animationDelay = `${index * 0.15}s`;
    });
});

/**
 * NEW: Populates the source and destination dropdowns from the stations object.
 */
function populateStationDropdowns() {
    const sourceSelect = document.getElementById('source');
    const destinationSelect = document.getElementById('destination');

    for (const stationId in stations) {
        const station = stations[stationId];
        const option = document.createElement('option');
        option.value = stationId;
        option.textContent = station.name + (station.type === 'interchange' ? ' (Interchange)' : '');
        
        sourceSelect.appendChild(option);
        destinationSelect.appendChild(option.cloneNode(true));
    }
}


// --- ROUTE FINDING LOGIC ---

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
    
    const selectedTime = new Date(departureTime);
    const now = new Date();
    if (departureTime && (isNaN(selectedTime.getTime()) || selectedTime < now)) {
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

        const resultsSection = document.getElementById('route-results');
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

async function calculateRoutes(source, destination) {
    const routes = [];
    const sourceStation = stations[source];
    const destStation = stations[destination];
    
    routes.push({
        id: 1,
        title: `Route from ${sourceStation.name} to ${destStation.name}`,
        type: 'Standard',
        stops: Math.floor(Math.random() * 5) + 3,
        time: `${Math.floor(Math.random() * 20) + 10} min`,
        distance: `${(Math.random() * 3 + 2).toFixed(1)} km`,
        fare: `₹${Math.floor(Math.random() * 15) + 20}`,
        eta: 'Calculated at Booking',
        route: [source, destination]
    });

    return routes;
}

// (Only the updated displayRoutes function is shown for brevity)

function displayRoutes(routes) {
    const routesList = document.getElementById('routes-list');
    routesList.innerHTML = '';

    routes.forEach(route => {
        const routeCard = document.createElement('div');
        routeCard.className = 'route-card fade-in';
        // UPDATED: Flattened the structure inside .route-body
        routeCard.innerHTML = `
            <div class="route-header">
                <div class="route-title">${route.title}</div>
                <div class="route-badge">${route.type}</div>
            </div>
            <div class="route-body">
                <div class="detail-item"><i class="fas fa-clock"></i><div><div class="detail-label">Travel Time</div><div class="detail-value">${route.time}</div></div></div>
                <div class="detail-item"><i class="fas fa-map-marker-alt"></i><div><div class="detail-label">Stops</div><div class="detail-value">${route.stops}</div></div></div>
                <div class="detail-item"><i class="fas fa-route"></i><div><div class="detail-label">Distance</div><div class="detail-value">${route.distance}</div></div></div>
                <div class="detail-item"><i class="fas fa-ticket-alt"></i><div><div class="detail-label">Fare</div><div class="detail-value">${route.fare}</div></div></div>
                <div class="detail-item"><i class="fas fa-calendar-check"></i><div><div class="detail-label">ETA</div><div class="detail-value">${route.eta}</div></div></div>
                <div class="route-actions">
                    <button class="btn btn-secondary" onclick="selectRoute(${route.id})"><i class="fas fa-info-circle"></i> Details</button>
                    <button class="btn btn-primary" onclick="bookTicket(${route.id})"><i class="fas fa-ticket-alt"></i> Book Ticket</button>
                </div>
            </div>
        `;
        routesList.appendChild(routeCard);
    });
}

// (The rest of your passenger.js file remains the same)

function updateRouteMap(source, destination, routes) {
    const mapContainer = document.getElementById('route-map');
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <i class="fas fa-route"></i>
            <p>Route from ${stations[source].name}</p>
            <p>to ${stations[destination].name}</p>
            <p style="font-size: 1rem; margin-top: 1rem; color: var(--success-color);">${routes.length} route(s) found</p>
        </div>`;
}

function selectRoute(routeId) {
    alert(`Route ${routeId} selected. Details view coming soon!`);
}

function bookTicket(routeId) {
    alert(`Booking ticket for Route ${routeId}. Payment gateway integration coming soon!`);
}

// --- VOICE INPUT LOGIC ---

function toggleVoiceInput() {
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn.classList.contains('voice-active')) {
        voiceBtn.classList.remove('voice-active');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Input';
    } else {
        voiceBtn.classList.add('voice-active');
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Listening...';
        setTimeout(() => {
            if (voiceBtn.classList.contains('voice-active')) {
                simulateVoiceInput();
            }
        }, 3000);
    }
}

function simulateVoiceInput() {
    document.getElementById('source').value = 'datta-Meghe-Institute';
    document.getElementById('destination').value = 'civil-lines';
    toggleVoiceInput();
    alert('Voice input detected: "From Datta Meghe Institute to Civil Lines"');
    findRoute();
}