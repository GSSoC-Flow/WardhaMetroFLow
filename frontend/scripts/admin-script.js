// Metro station data
const metroStations = [
    {
        id: 1,
        name: 'Wardha Central',
        type: 'Terminal',
        status: 'active',
        passengerLoad: 'High',
        lastUpdated: '2 min ago'
    },
    {
        id: 2,
        name: 'Railway Station',
        type: 'Interchange',
        status: 'active',
        passengerLoad: 'Medium',
        lastUpdated: '1 min ago'
    },
    {
        id: 3,
        name: 'Market Square',
        type: 'Regular',
        status: 'maintenance',
        passengerLoad: 'Very High',
        lastUpdated: '5 min ago'
    },
    {
        id: 4,
        name: 'Civil Hospital',
        type: 'Regular',
        status: 'active',
        passengerLoad: 'Low',
        lastUpdated: '3 min ago'
    },
    {
        id: 5,
        name: 'Wardha College',
        type: 'Regular',
        status: 'active',
        passengerLoad: 'Medium',
        lastUpdated: '1 min ago'
    },
    {
        id: 6,
        name: 'Industrial Area',
        type: 'Terminal',
        status: 'active',
        passengerLoad: 'Low',
        lastUpdated: '4 min ago'
    }
];

// Chart instances
let trafficChart, trafficAnalysisChart, stationLoadChart, predictionAccuracyChart, performanceChart;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    populateStationsTable();
    updateDashboardData();
    
    // Auto-refresh dashboard data every 30 seconds
    setInterval(updateDashboardData, 30000);
});

// Initialize all charts
function initializeCharts() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    trafficChart = new Chart(trafficCtx, {
        type: 'line',
        data: {
            labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
            datasets: [{
                label: 'Passengers per Hour',
                data: [1200, 1900, 2300, 1800, 2400, 3000, 2000],
                borderColor: '#ea580c',
                backgroundColor: 'rgba(234, 88, 12, 0.2)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#1c1917' }
                }
            },
            scales: {
                x: { ticks: { color: '#1c1917' } },
                y: { ticks: { color: '#1c1917' } }
            }
        }
    });

    // Traffic Analysis Chart
    const trafficAnalysisCtx = document.getElementById('trafficAnalysisChart').getContext('2d');
    trafficAnalysisChart = new Chart(trafficAnalysisCtx, {
        type: 'bar',
        data: {
            labels: ['Wardha Central', 'Railway Station', 'Market Square', 'Civil Hospital', 'Wardha College', 'Industrial Area'],
            datasets: [{
                label: 'Current Passenger Load',
                data: [85, 65, 95, 45, 70, 30],
                backgroundColor: [
                    '#ea580c', '#f97316', '#dc2626', '#16a34a', '#22c55e', '#78716c'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#1c1917' }
                }
            },
            scales: {
                x: { ticks: { color: '#1c1917' } },
                y: { ticks: { color: '#1c1917' } }
            }
        }
    });

    // Station Load Distribution Chart
    const stationLoadCtx = document.getElementById('stationLoadChart').getContext('2d');
    stationLoadChart = new Chart(stationLoadCtx, {
        type: 'doughnut',
        data: {
            labels: ['High Load', 'Medium Load', 'Low Load'],
            datasets: [{
                data: [2, 2, 2],
                backgroundColor: ['#dc2626', '#f97316', '#16a34a']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#1c1917' }
                }
            }
        }
    });

    // Prediction Accuracy Chart
    const predictionAccuracyCtx = document.getElementById('predictionAccuracyChart').getContext('2d');
    predictionAccuracyChart = new Chart(predictionAccuracyCtx, {
        type: 'radar',
        data: {
            labels: ['Passenger Flow', 'Maintenance', 'Route Optimization', 'Peak Hours', 'Delays'],
            datasets: [{
                label: 'Current Accuracy',
                data: [94, 89, 92, 96, 91],
                borderColor: '#ea580c',
                backgroundColor: 'rgba(234, 88, 12, 0.2)',
                pointBackgroundColor: '#ea580c'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#1c1917' }
                }
            },
            scales: {
                r: {
                    ticks: { color: '#1c1917' },
                    grid: { color: '#78716c' }
                }
            }
        }
    });

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'On-time Performance (%)',
                data: [92, 94, 93, 95, 94, 96, 94],
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22, 163, 74, 0.2)',
                tension: 0.3,
                fill: true
            }, {
                label: 'Customer Satisfaction',
                data: [4.2, 4.4, 4.3, 4.5, 4.4, 4.6, 4.5],
                borderColor: '#ea580c',
                backgroundColor: 'rgba(234, 88, 12, 0.2)',
                tension: 0.3,
                fill: false,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#1c1917' }
                }
            },
            scales: {
                x: { ticks: { color: '#1c1917' } },
                y: {
                    ticks: { color: '#1c1917' },
                    position: 'left'
                },
                y1: {
                    ticks: { color: '#1c1917' },
                    position: 'right',
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// Populate stations table
function populateStationsTable() {
    const tableBody = document.getElementById('stationsTableBody');
    tableBody.innerHTML = '';

    metroStations.forEach(station => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${station.name}</td>
            <td>${station.type}</td>
            <td><span class="station-status status-${station.status}">${station.status}</span></td>
            <td>${station.passengerLoad}</td>
            <td>${station.lastUpdated}</td>
            <td class="action-buttons">
                <button class="btn btn-edit" onclick="editStation(${station.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete" onclick="deleteStation(${station.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Show different sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    document.getElementById(sectionName).style.display = 'block';

    // Update navigation active state
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Switch chart views
function switchChart(type) {
    // Update button states
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update chart data based on type
    let labels, data;
    switch(type) {
        case 'hourly':
            labels = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
            data = [1200, 1900, 2300, 1800, 2400, 3000, 2000];
            break;
        case 'daily':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = [8500, 9200, 8800, 9500, 10200, 7800, 6500];
            break;
        case 'weekly':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = [65000, 68000, 72000, 75000];
            break;
    }

    trafficChart.data.labels = labels;
    trafficChart.data.datasets[0].data = data;
    trafficChart.update();
}

// Update dashboard data
function updateDashboardData() {
    // Simulate real-time data updates
    const passengerCount = Math.floor(Math.random() * 2000) + 11000;
    const activeTrains = Math.floor(Math.random() * 5) + 15;
    const avgDelay = (Math.random() * 2 + 1.5).toFixed(1);
    const aiAccuracy = (Math.random() * 3 + 92).toFixed(1);

    // Update overview cards
    document.querySelector('.overview-card:nth-child(1) .metric').textContent = passengerCount.toLocaleString();
    document.querySelector('.overview-card:nth-child(2) .metric').textContent = activeTrains;
    document.querySelector('.overview-card:nth-child(3) .metric').textContent = avgDelay + ' min';
    document.querySelector('.overview-card:nth-child(4) .metric').textContent = aiAccuracy + '%';

    // Update last updated times for stations
    metroStations.forEach(station => {
        const minutes = Math.floor(Math.random() * 5) + 1;
        station.lastUpdated = `${minutes} min ago`;
    });
    populateStationsTable();
}

// Station management functions
function editStation(stationId) {
    const station = metroStations.find(s => s.id === stationId);
    alert(`Edit station: ${station.name}\nThis will open an edit modal in the full implementation.`);
}

function deleteStation(stationId) {
    const station = metroStations.find(s => s.id === stationId);
    if (confirm(`Are you sure you want to delete ${station.name}?`)) {
        const index = metroStations.findIndex(s => s.id === stationId);
        metroStations.splice(index, 1);
        populateStationsTable();
        alert(`${station.name} has been deleted.`);
    }
}

function showAddStationModal() {
    alert('Add Station Modal\nThis will open a form to add new stations in the full implementation.');
}

// Simulate real-time alerts
function generateRandomAlert() {
    const alerts = [
        { type: 'critical', title: 'High Congestion Alert', description: 'Market Square station experiencing 85% capacity' },
        { type: 'warning', title: 'Delay Warning', description: 'Line 2 delayed by 5 minutes due to maintenance' },
        { type: 'info', title: 'Peak Hour Approaching', description: 'Expected high traffic in next 30 minutes' },
        { type: 'warning', title: 'Equipment Alert', description: 'Escalator maintenance required at Railway Station' },
        { type: 'info', title: 'Weather Advisory', description: 'Light rain may affect outdoor station access' }
    ];

    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    // In a real implementation, this would update the alerts section dynamically
}

// Generate random alerts every 2 minutes
setInterval(generateRandomAlert, 120000);
