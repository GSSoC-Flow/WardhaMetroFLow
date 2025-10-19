import joblib
import numpy as np
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Create dummy data for training
np.random.seed(42)
n_samples = 1000
num_stations = 17

# Generate unique, deterministic station multipliers
# Each station gets a distinct multiplier from a normal distribution
# Multipliers range between ~0.6 and ~1.8 (mean=1.2, std=0.25)
# Using per-station seeding for determinism
station_multipliers = {}
for station_id in range(num_stations):
    # Seed RNG with global seed + station_id for deterministic, unique values
    rng = np.random.RandomState(42 + station_id)
    # Generate multiplier from normal distribution, clipped to sensible bounds
    multiplier = rng.normal(loc=1.2, scale=0.25)
    # Ensure multiplier stays within realistic bounds [0.6, 1.8]
    multiplier = np.clip(multiplier, 0.6, 1.8)
    station_multipliers[station_id] = multiplier

# Generate synthetic passenger flow data
hours = np.random.randint(0, 24, n_samples)
days_of_week = np.random.randint(0, 7, n_samples)
station_ids = np.random.randint(0, num_stations, n_samples)

# Create realistic passenger flow based on time patterns
passenger_flow = []
for hour, day, station in zip(hours, days_of_week, station_ids):
    base_flow = 50
    
    # Peak hours (7-9 AM, 5-7 PM)
    if hour in [7, 8, 9, 17, 18, 19]:
        base_flow *= 2.5
    
    # Weekend patterns
    if day in [5, 6]:  # Saturday, Sunday
        base_flow *= 0.7
    
    # Station-specific adjustments using pre-computed unique multipliers
    station_multiplier = station_multipliers[station]
    base_flow *= station_multiplier
    
    # Add some randomness
    flow = int(round(base_flow + np.random.normal(0, 20)))
    passenger_flow.append(max(0, flow))  # Ensure non-negative

# Prepare features
X = np.column_stack([hours, days_of_week, station_ids])
y = np.array(passenger_flow)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/passenger_flow_model.pkl')

print("Model trained and saved successfully!")
print(f"Training R² score: {model.score(X_train, y_train):.3f}")
print(f"Test R² score: {model.score(X_test, y_test):.3f}")
