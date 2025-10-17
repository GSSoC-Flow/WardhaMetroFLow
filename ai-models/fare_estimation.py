import streamlit as st
import folium
from streamlit_folium import st_folium
import random

# Sample metro stations with coordinates
stations = {
    "Wardha Junction": [20.738, 78.601],
    "Indira Chowk": [20.742, 78.623],
    "Mahatma Nagar": [20.753, 78.634],
    "Wardha Bazaar": [20.756, 78.61],
    "IT Park": [20.77, 78.645]
}

station_list = list(stations.keys())

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

# Crowd level generator
def crowd_level():
    levels = ["Low 🟢", "Moderate 🟡", "High 🔴"]
    return random.choice(levels)

# Streamlit UI
st.set_page_config(page_title="WardhaMetroFlow - Fare Estimator", layout="wide")
st.title("💰 Wardha Metro Fare Estimator")

col1, col2 = st.columns(2)
with col1:
    start_station = st.selectbox("Select Start Station", station_list)
with col2:
    end_station = st.selectbox("Select Destination Station", station_list)

if start_station and end_station:
    total_fare, base_fare, extra_fare = calculate_fare(start_station, end_station)
    time_estimate = estimate_time(start_station, end_station)

    # Display results
    st.success(f"**Route:** {start_station} → {end_station}")
    st.info(f"🚌 Stations covered: {abs(station_list.index(start_station) - station_list.index(end_station)) + 1}")
    st.success(f"💰 Fare: ₹{total_fare} (Base ₹{base_fare} + Extra ₹{extra_fare})")
    st.warning(f"⏱ Estimated Travel Time: {time_estimate} minutes")
    st.error(f"🚦 Current Crowd Level: {crowd_level()}")

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
