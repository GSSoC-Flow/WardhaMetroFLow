// Metro station data with coordinates and connections
const BACKEND_URL = "http://127.0.0.1:5000";
const metroStations = {
    'wardha-central': { name: 'Wardha Central', coordinates: [20.7453, 78.6022], connections: ['railway-station', 'market-square'], type: 'terminal' },
    'railway-station': { name: 'Railway Station', coordinates: [20.7489, 78.6028], connections: ['wardha-central', 'hospital'], type: 'interchange' },
    'market-square': { name: 'Market Square', coordinates: [20.7432, 78.6001], connections: ['wardha-central', 'college'], type: 'regular' },
    'hospital': { name: 'Civil Hospital', coordinates: [20.7501, 78.6050], connections: ['railway-station', 'industrial'], type: 'regular' },
    'college': { name: 'Wardha College', coordinates: [20.7400, 78.5980], connections: ['market-square', 'industrial'], type: 'regular' },
    'industrial': { name: 'Industrial Area', coordinates: [20.7550, 78.6100], connections: ['hospital', 'college'], type: 'terminal' }
};

// --- ROUTE FINDING LOGIC ---

function findRoute() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;

    if (!source || !destination) {
        alert('Please select both source and destination stations');
        return;
    }
    if (source === destination) {
        alert('Source and destination cannot be the same');
        return;
    }

    const findRouteBtn = document.getElementById('find-route-btn');
    const originalText = findRouteBtn.innerHTML;
    findRouteBtn.innerHTML = '<span class="loading"></span> Finding Routes...';
    findRouteBtn.disabled = true;

    // Simulate API call to a backend
    setTimeout(() => {
        const routes = calculateRoutes(source, destination);
        displayRoutes(routes);
        updateRouteMap(source, destination, routes);

        findRouteBtn.innerHTML = originalText;
        findRouteBtn.disabled = false;
        
        const resultsSection = document.getElementById('route-results');
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

function calculateRoutes(source, destination) {
    // This is a mock function. In a real application, a backend service
    // would calculate this using a pathfinding algorithm like Dijkstra's.
    const routes = [];
    if (source === 'wardha-central' && destination === 'industrial') {
        routes.push({
            id: 1, title: 'Direct Route via Railway Station', type: 'Fastest',
            stops: 3, time: '18 min', distance: '2.8 km', fare: '₹25', eta: '10:06 PM',
            route: ['wardha-central', 'railway-station', 'hospital', 'industrial']
        });
        routes.push({
            id: 2, title: 'Alternative via Market Square', type: 'Scenic',
            stops: 4, time: '22 min', distance: '3.1 km', fare: '₹25', eta: '10:10 PM',
            route: ['wardha-central', 'market-square', 'college', 'industrial']
        });
    } else {
        const sourceStation = metroStations[source];
        const destStation = metroStations[destination];
        routes.push({
            id: 1, title: `Route from ${sourceStation.name} to ${destStation.name}`, type: 'Standard',
            stops: Math.floor(Math.random() * 3) + 2,
            time: `${Math.floor(Math.random() * 15) + 10} min`,
            distance: `${(Math.random() * 2 + 1).toFixed(1)} km`,
            fare: `₹${Math.floor(Math.random() * 10) + 15}`,
            eta: '10:05 PM'
        });
    }
    return routes;
}

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
                <div class="detail-item"><i class="fas fa-clock"></i><div><div class="detail-label">Time</div><div class="detail-value">${route.time}</div></div></div>
                <div class="detail-item"><i class="fas fa-map-marker-alt"></i><div><div class="detail-label">Stops</div><div class="detail-value">${route.stops}</div></div></div>
                <div class="detail-item"><i class="fas fa-route"></i><div><div class="detail-label">Distance</div><div class="detail-value">${route.distance}</div></div></div>
                <div class="detail-item"><i class="fas fa-ticket-alt"></i><div><div class="detail-label">Fare</div><div class="detail-value">${route.fare}</div></div></div>
                <div class="detail-item"><i class="fas fa-calendar-check"></i><div><div class="detail-label">ETA</div><div class="detail-value">${route.eta}</div></div></div>
            </div>
            <div class="route-actions">
                <button class="btn btn-secondary" onclick="selectRoute(${route.id})"><i class="fas fa-info-circle"></i> Details</button>
                <button class="btn btn-primary" onclick="bookTicket(${route.id})"><i class="fas fa-ticket-alt"></i> Book Ticket</button>
            </div>`;
        routesList.appendChild(routeCard);
    });
}

function updateRouteMap(source, destination, routes) {
    const mapContainer = document.getElementById('route-map');
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <i class="fas fa-route"></i>
            <p>Route from ${metroStations[source].name} to ${metroStations[destination].name}</p>
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
        // Placeholder for real speech recognition API
        setTimeout(() => {
            if (voiceBtn.classList.contains('voice-active')) {
                simulateVoiceInput();
            }
        }, 3000);
    }
}

function simulateVoiceInput() {
    document.getElementById('source').value = 'wardha-central';
    document.getElementById('destination').value = 'industrial';
    toggleVoiceInput(); // Turn off the listening animation
    alert('Voice input detected: "From Wardha Central to Industrial Area"');
    findRoute();
}

async function findRoute() {
    const from = document.getElementById("source").value;
    const to = document.getElementById("destination").value;

    if (!from || !to) {
        alert("Please select both source and destination stations.");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/route`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to })
        });
        const data = await response.json();

    
        const routeTrace = {
            type: "scattermapbox",
            lat: data.coordinates.map(c => c[0]),
            lon: data.coordinates.map(c => c[1]),
            mode: "lines+markers",
            line: { color: "red", width: 4 },
            marker: { size: 10, color: "red" },
            text: data.route,
            hoverinfo: "text"
        };

       
        const allStationsTrace = {
            type: "scattermapbox",
            lat: Object.values(data.stations || {}).map(s => s.coordinates[0]),
            lon: Object.values(data.stations || {}).map(s => s.coordinates[1]),
            mode: "markers",
            marker: { size: 8, color: "blue" },
            text: Object.values(data.stations || {}).map(s => s.name),
            hoverinfo: "text"
        };

        Plotly.newPlot("route-map", [allStationsTrace, routeTrace], {
            mapbox: {
                style: "open-street-map",
                center: { lat: 20.73, lon: 78.59 }, // Center on Wardha
                zoom: 13
            },
            margin: { t: 0, b: 0, l: 0, r: 0 }
        });

    } catch (err) {
        console.error("Error fetching route:", err);
        alert("Failed to load route. Check console.");
    }
}