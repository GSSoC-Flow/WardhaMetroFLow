import streamlit as st
import pandas as pd
import numpy as np
import networkx as nx
import folium
from streamlit_folium import st_folium
from folium.plugins import HeatMap, AntPath

st.set_page_config(page_title="WardhaMetroFlow - Passenger Route Planner", layout="wide")

# --- Sidebar Navigation ---
st.sidebar.title("📂 Navigation")
page = st.sidebar.radio("Go to:", ["About", "Passenger Route Planner"])

# =========================
# ABOUT PAGE
# =========================
if page == "About":
    st.title("ℹ️ About WardhaMetroFlow")
    st.markdown("""
    ## 🚇 Welcome to WardhaMetroFlow  

    **WardhaMetroFlow** is an AI-powered metro simulation designed for **Wardha city**, built to showcase how **smart transit systems** 
    can improve daily commuting and city transport management.  

    ### 🌟 Key Features
    1. **Passenger View**  
       - Plan metro routes between any two stations  
       - Get **real-time congestion-aware suggestions**  
       - View **estimated travel time**  
       - Explore an **interactive metro map** with congestion heatmaps and station info  
       - Watch a **live simulation** of your route 🎬  

    2. **Admin View** *(future scope)*  
       - Monitor traffic flow across the network  
       - Manage stations and track congestion  
       - Analyze predictive AI trends for future capacity planning  

    3. **Congestion Heatmap**  
       - Color-coded visualization of congestion across all stations  
       - Helps both passengers and admins make better decisions  

    ### 🧭 How to Use This App
    - Use the **sidebar navigation** to switch between sections.  
    - In **Passenger Route Planner**:
      - Select a **Start Station** and **Destination Station**  
      - See the **optimal route** and estimated travel time  
      - Check congestion levels at each station along the way  
      - Explore the **interactive metro map**  
      - Run the **live simulation** to see how your journey progresses  

    ### 🎯 Vision
    WardhaMetroFlow envisions **smarter, AI-driven public transit systems** for emerging smart cities like Wardha.  
    It's a step toward building efficient, reliable, and commuter-friendly metro systems.  

    ---
    """)

# =========================
# PASSENGER ROUTE PLANNER
# =========================
elif page == "Passenger Route Planner":
    st.title("🚆 Passenger Route Planner")
    st.markdown("Plan your journey with **smart AI suggestions**, explore the **metro map**, and even watch a **live simulation** of your route.")

    # --- Metro Stations ---
    stations = {
        "Wardha Junction": [20.7453, 78.6022],
        "Civil Lines": [20.7458, 78.6101],
        "Ram Nagar": [20.7502, 78.6187],
        "Mahatma Nagar": [20.7408, 78.6202],
        "Industrial Area": [20.7351, 78.6155],
    }

    # --- Simulated congestion data ---
    # Fixed: Removed np.random.seed(None) as it's redundant
    if "congestion" not in st.session_state:
        st.session_state["congestion"] = {s: np.random.randint(10, 100) for s in stations.keys()}
    
    congestion_levels = st.session_state["congestion"]

    # --- Create metro network graph ---
    G = nx.Graph()
    G.add_edges_from([
        ("Wardha Junction", "Civil Lines", {"distance": 2}),
        ("Civil Lines", "Ram Nagar", {"distance": 2}),
        ("Ram Nagar", "Mahatma Nagar", {"distance": 3}),
        ("Civil Lines", "Industrial Area", {"distance": 4}),
        ("Industrial Area", "Mahatma Nagar", {"distance": 3}),
    ])

    # --- Network Connectivity Check (Optional Enhancement) ---
    # Display network status in sidebar
    is_connected = nx.is_connected(G)
    if is_connected:
        st.sidebar.success("🟢 Metro Network: Fully Connected")
    else:
        st.sidebar.warning("🟡 Metro Network: Some stations may not be reachable")

    # --- Passenger Input ---
    start = st.selectbox("🟢 Start Station", list(stations.keys()))
    end = st.selectbox("🔴 Destination Station", list(stations.keys()))

    if start and end and start != end:
        # === CRITICAL FIX: Added Error Handling ===
        try:
            # Shortest path using distance
            path = nx.shortest_path(G, source=start, target=end, weight="distance")
            distance = nx.shortest_path_length(G, source=start, target=end, weight="distance")

            # Estimate travel time
            # Formula: base_time (2 min/km) + congestion_delay (5% of congestion level)
            avg_congestion = np.mean([congestion_levels[stn] for stn in path])
            travel_time = distance * 2 + avg_congestion * 0.05  # minutes

            # Show route info
            st.success(f"📍 Best Route: {' → '.join(path)}")
            st.info(f"🕒 Estimated Travel Time: {travel_time:.1f} minutes")

            # Smart Suggestion
            if avg_congestion > 70:
                st.warning("⚠️ High congestion detected. Consider leaving 10–15 mins earlier.")
            elif avg_congestion < 40:
                st.success("✅ Smooth journey ahead! Congestion is low.")

            # Show congestion levels along the route
            route_data = pd.DataFrame({
                "Station": path,
                "Congestion (%)": [congestion_levels[stn] for stn in path]
            })
            st.subheader("📊 Congestion along your route")
            st.dataframe(route_data.style.background_gradient(cmap="RdYlGn_r"))

            # =========================
            # ENHANCED MAP VISUALIZATION
            # =========================
            st.subheader("🗺️ Interactive Route Map")

            # Focus map on midpoint of route
            route_coords = [stations[stn] for stn in path]
            mid_lat = np.mean([lat for lat, lon in route_coords])
            mid_lon = np.mean([lon for lat, lon in route_coords])
            m = folium.Map(location=[mid_lat, mid_lon], zoom_start=15, tiles="OpenStreetMap")

            # Add heatmap layer for congestion
            heat_data = [[stations[s][0], stations[s][1], congestion_levels[s]] for s in stations]
            HeatMap(heat_data, min_opacity=0.4, radius=25, blur=15).add_to(m)

            # Add stations with metro icons + popup cards
            for stn, coords in stations.items():
                level = congestion_levels[stn]
                color = "green" if level < 40 else "orange" if level < 70 else "red"

                popup_html = f"""
                <b>{stn}</b><br>
                🚦 Congestion: {level}%<br>
                📍 Lat: {coords[0]}, Lon: {coords[1]}
                """
                folium.Marker(
                    location=coords,
                    popup=popup_html,
                    icon=folium.Icon(color=color, icon="train", prefix="fa")
                ).add_to(m)

            # Add route polyline with color-coded congestion
            for i in range(len(path) - 1):
                seg = [stations[path[i]], stations[path[i+1]]]
                seg_congestion = (congestion_levels[path[i]] + congestion_levels[path[i+1]]) / 2
                seg_color = "green" if seg_congestion < 40 else "orange" if seg_congestion < 70 else "red"

                folium.PolyLine(
                    locations=seg,
                    color=seg_color,
                    weight=6,
                    opacity=0.8,
                    tooltip=f"{path[i]} → {path[i+1]} (Cong: {seg_congestion:.1f}%)"
                ).add_to(m)

            # =========================
            # LIVE SIMULATION FEATURE
            # =========================
            st.subheader("🎬 Live Simulation of Your Route")

            # AntPath creates animated moving dashes
            AntPath(
                locations=route_coords,
                color="blue",
                weight=6,
                delay=800,
                dash_array=[10, 20]
            ).add_to(m)

            st_folium(m, width=800, height=550)

        except nx.NetworkXNoPath:
            # Handle case when no path exists between stations
            st.error(f"❌ No route available between **{start}** and **{end}**.")
            st.info("💡 **Possible reasons:**")
            st.markdown("""
            - These stations are not connected in the current metro network
            - There may be maintenance or service disruptions
            - Please try selecting different stations
            """)
            
            # Optional: Show which stations are reachable from start
            try:
                reachable = list(nx.descendants(G, start))
                reachable.append(start)  # Include the start station itself
                if reachable:
                    st.info(f"🚉 **Stations reachable from {start}:** {', '.join(reachable)}")
            except:
                pass  # If this fails, just skip showing reachable stations

        except KeyError as e:
            # Handle case when station doesn't exist in the graph
            st.error(f"⚠️ Station not found in the network: {str(e)}")
            st.info("💡 Please refresh the page or contact support if this issue persists.")
        
        except Exception as e:
            # Catch any other unexpected errors
            st.error(f"⚠️ An unexpected error occurred while planning your route.")
            st.warning(f"**Error details:** {str(e)}")
            st.info("💡 Please try again or contact support if the problem continues.")

    elif start == end:
        st.warning("⚠️ Start and Destination stations must be different.")