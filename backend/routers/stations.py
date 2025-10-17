from fastapi import APIRouter
from flask import Flask, request, jsonify
from services import metro_service
from flask_cors import CORS

router = APIRouter()
service = metro_service.MetroService()
# app = Flask(__name__)
# CORS(app)  # Allow frontend requests

stations = {
    'datta-Meghe-Institute': {'name': 'Datta Meghe Institute', 'coordinates': [20.7111655, 78.574074], 'connections': ['sawangi']},
    'sawangi': {'name': 'Sawangi', 'coordinates': [20.7214195, 78.5768308], 'connections': ['datta-Meghe-Institute','master-colony']},
    'master-colony': {'name': 'Master Colony', 'coordinates': [20.7271472,78.5850694], 'connections': ['sawangi','wardha-junction']},
    'bajaj-square': {'name': 'Bajaj Square', 'coordinates': [20.7356644,78.5985736], 'connections': ['wardha-junction','civil-lines']},
    'civil-lines': {'name': 'Civil Lines', 'coordinates': [20.7444112,78.6092445], 'connections': ['bajaj-square','MIDC','dhuniwala-math']},
    'MIDC': {'name': 'MIDC', 'coordinates': [20.7407753,78.6268908], 'connections': ['civil-lines','mahatma-gandhi-institute']},
    'mahatma-gandhi-institute': {'name':'Mahatma Gandhi Institute', 'coordinates':[20.7395282,78.6521638], 'connections':['MIDC']},
    'hindi-vishwa-vidyalaya': {'name':'Hindi Vishwa Vidyalaya', 'coordinates':[20.7644706,78.5820438], 'connections':['pratab-nagar']},
    'pratab-nagar': {'name':'Pratab Nagar', 'coordinates':[20.7551015,78.5782331], 'connections':['ram-nagar','hindi-vishwa-vidyalaya']},
    'ram-nagar': {'name':'Ram Nagar', 'coordinates':[20.7404718,78.5868584], 'connections':['pratab-nagar','wardha-junction']},
    'wardha-junction': {'name':'Wardha Junction', 'coordinates':[20.7310431,78.5923619], 'connections':['master-colony','bajaj-square','ram-nagar','borgaon']},
    'borgaon': {'name':'Borgaon', 'coordinates':[20.7240709,78.6020207], 'connections':['wardha-junction','dmart']},
    'dmart': {'name':'Dmart', 'coordinates':[20.7147015,78.605335], 'connections':['borgaon']},
    'bajaj-institute-of-technology': {'name':'Bajaj Institute of Technology','coordinates':[20.7823326,78.5915407],'connections':['hanuman-tekdi']},
    'tukdoji-maharaj-square': {'name':'Tukdoji Maharaj Square','coordinates':[20.7569655,78.6009944],'connections':['dhuniwala-math','hanuman-tekdi']},
    'dhuniwala-math': {'name':'Dhuniwala Math','coordinates':[20.7530008,78.6129591],'connections':['tukdoji-maharaj-square','civil-lines']},
    'hanuman-tekdi': {'name':'Hanuman Tekdi','coordinates':[20.768315,78.5982003],'connections':['tukdoji-maharaj-square','bajaj-institute-of-technology']}
}



@router.get("/stations")
def get_all_stations():
    return service.stations

@router.get("/stations/{station_id}")
def get_station(station_id: int):
    return {
        "id": station_id,
        "name": service.get_station_name(station_id)
    }

@app.route('/api/route', methods=['POST'])
def get_route():
    data = request.json
    start = data.get('from')
    end = data.get('to')
    if start not in stations or end not in stations:
        return jsonify({'error': 'Invalid station selected'}), 400

    path = find_shortest_path(start, end)
    # Return coordinates for Plotly
    coords = [stations[s]['coordinates'] for s in path]
    return jsonify({'route': path, 'coordinates': coords})

@app.route('/api/stations', methods=['GET'])
def get_stations():
    return jsonify({k:{'name':v['name']} for k,v in stations.items()})