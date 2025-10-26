import streamlit as st
import folium
from streamlit_folium import st_folium
import pickle
import pandas as pd
from datetime import datetime

# Sample metro stations with coordinates
stations = {
    "Wardha Junction": [20.738, 78.601],
    "Indira Chowk": [20.742, 78.623],
    "Mahatma Nagar": [20.753, 78.634],
    "Wardha Bazaar": [20.756, 78.61],
    "IT Park": [20.77, 78.645]
}
station_list = list(stations.keys())

# Load ML model with caching
@st.cache_resource
def load_model():
    try:
        with open('passenger_flow_model.pkl', 'rb') as f:
            model = pickle.load(f)
        return model
    except FileNotFoundError:
        return None

# Fare calculation logic
def calculate_fare(start, end):
    distance = abs(station_list.index(start) - station_list.index(end))
    if distance == 0:
        return 0, 0, 0
    base_fare = 10
    extra_fare = 5 * (distance - 1)
    total = base_fare + extra_fare
    return total, base_fare, extra_fare

# Travel time estimation
def estimate_time(start, end):
    distance = abs(station_list.index(start) - station_list.index(end))
    return distance * 2  # assume 2 minutes per station

# ML-based crowd prediction
def predict_crowd_level(model, station_name, hour, day_of_week):
    """
    Predict crowd level using ML model
    
    Args:
        model: Trained RandomForestRegressor
        station_name: Name of the station
        hour: Hour of day (0-23)
        day_of_week: Day (0=Monday, 6=Sunday)
    
    Returns:
        tuple: (crowd_label, passenger_count)
    """
    if model is None:
        # Fallback to time-based logic if model not available
        if hour in range(7, 10) or hour in range(17, 20):  # Peak hours
            return "High 🔴", 450
        elif hour in range(10, 17):  # Moderate hours
            return "Moderate 🟡", 250
        else:  # Off-peak
            return "Low 🟢", 100
    
    try:
        # Create feature dataframe matching model training format
        # Adjust features based on your actual model training
        station_idx = station_list.index(station_name)
        
        features = pd.DataFrame({
            'hour': [hour],
            'day_of_week': [day_of_week],
            'station_id': [station_idx],
            'is_weekend': [1 if day_of_week >= 5 else 0],
            'is_peak_hour': [1 if hour in range(7, 10) or hour in range(17, 20) else 0]
        })
        
        # Predict passenger count
        passenger_count = int(model.predict(features)[0])
        
        # Convert to crowd level
        if passenger_count < 150:
            crowd_label = "Low 🟢"
        elif passenger_count < 300:
            crowd_label = "Moderate 🟡"
        else:
            crowd_label = "High 🔴"
        
        return crowd_label, passenger_count
        
    except Exception as e:
        st.error(f"Prediction error: {str(e)}")
        return "Unknown ⚪", 0

# Streamlit UI
st.set_page_config(page_title="WardhaMetroFlow - Fare Estimator", layout="wide")
st.title("💰 Wardha Metro Fare Estimator")

# Load model
model = load_model()
if model is None:
    st.warning("⚠️ ML model not found. Using time-based crowd estimation as fallback.")

# Time and day selection
st.sidebar.header("🕐 Travel Time Settings")
current_hour = datetime.now().hour
selected_hour = st.sidebar.slider("Select Hour of Day", 0, 23, current_hour, 
                                   help="Choose travel time (24-hour format)")
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
current_day = datetime.now().weekday()
selected_day = st.sidebar.selectbox("Select Day of Week", days, index=current_day)
day_of_week = days.index(selected_day)

# Display selected time
st.sidebar.info(f"📅 {selected_day}, {selected_hour}:00")

# Station selection
col1, col2 = st.columns(2)
with col1:
    start_station = st.selectbox("Select Start Station", station_list)
with col2:
    end_station = st.selectbox("Select Destination Station", station_list)

if start_station and end_station:
    total_fare, base_fare, extra_fare = calculate_fare(start_station, end_station)
    time_estimate = estimate_time(start_station, end_station)
    
    # Get crowd predictions for both stations
    start_crowd, start_passengers = predict_crowd_level(model, start_station, selected_hour, day_of_week)
    end_crowd, end_passengers = predict_crowd_level(model, end_station, selected_hour, day_of_week)
    
    # Display results
    st.success(f"**Route:** {start_station} → {end_station}")
    st.info(f"🚌 Stations covered: {abs(station_list.index(start_station) - station_list.index(end_station)) + 1}")
    st.success(f"💰 Fare: ₹{total_fare} (Base ₹{base_fare} + Extra ₹{extra_fare})")
    st.warning(f"⏱ Estimated Travel Time: {time_estimate} minutes")
    
    # Display crowd predictions with metrics
    st.markdown("### 🚦 Real-Time Crowd Predictions")
    col_crowd1, col_crowd2 = st.columns(2)
    
    with col_crowd1:
        st.metric(
            label=f"🚉 {start_station}",
            value=start_crowd,
            delta=f"{start_passengers} passengers"
        )
    
    with col_crowd2:
        st.metric(
            label=f"🚉 {end_station}",
            value=end_crowd,
            delta=f"{end_passengers} passengers"
        )
    
    # Intermediate stations
    idx_start = station_list.index(start_station)
    idx_end = station_list.index(end_station)
    if idx_start < idx_end:
        route_stations = station_list[idx_start:idx_end+1]
    else:
        route_stations = station_list[idx_end:idx_start+1][::-1]
    
    st.markdown("### 🚏 Intermediate Stations on this Route:")
    st.write(" → ".join(route_stations))
    
    # Show map
    m = folium.Map(location=[20.75, 78.62], zoom_start=13, tiles="CartoDB Positron")
    
    # Add all stations
    for station, coords in stations.items():
        color = "blue"
        if station == start_station:
            color = "green"
        elif station == end_station:
            color = "red"
        folium.Marker(coords, tooltip=station, icon=folium.Icon(color=color, icon="train")).add_to(m)
    
    # Highlight route path
    route_coords = [stations[s] for s in route_stations]
    folium.PolyLine(route_coords, color="purple", weight=5).add_to(m)
    
    st_folium(m, width=750, height=500)

# Footer with info
st.markdown("---")
st.markdown("**📊 Powered by Machine Learning** | Predictions based on historical passenger flow data")
if model:
    st.success("✅ ML Model Active: Using RandomForestRegressor for accurate crowd predictions")
else:
    st.info("ℹ️ Using time-based heuristics for crowd estimation")