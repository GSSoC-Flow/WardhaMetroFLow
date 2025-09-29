class MetroService:
    def __init__(self):
        self.stations = {
            1: "Wardha Central",
            2: "Gandhi Nagar",
            3: "University Campus",
            4: "Industrial Park",
            5: "Residential Hub"
        }
    
    def get_station_name(self, station_id: int) -> str:
        return self.stations.get(station_id, "Unknown Station") 